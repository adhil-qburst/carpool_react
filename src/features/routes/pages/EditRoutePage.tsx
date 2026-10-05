import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import LocationCombobox from "@features/locations/components/LocationCombobox";
import type { SelectedLocation } from "@features/locations/components/LocationCombobox";
import { useLocationsQuery } from "@features/locations/hooks/useLocationsQuery";
import RouteStopsEditor from "../components/RouteStopsEditor";
import type { RouteStopDraft } from "../components/RouteStopsEditor";
import RouteSuccessModal from "../modals/RouteSuccessModal";
import { useRoutesQuery } from "../hooks/useRoutesQuery";
import { useUpdateRouteMutation } from "../hooks/useUpdateRouteMutation";
import type { RouteResponse, RouteStopResponse } from "../types/routes.api.types";

interface FormErrors {
  name?: string;
  sourceId?: string;
  destId?: string;
  stops?: Record<string, string>;
}

export default function EditRoutePage() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const stateRoute = (location.state as { route?: RouteResponse } | undefined)
    ?.route;

  const { data: routesData, isLoading: isRoutesLoading } = useRoutesQuery(
    { page: 1, limit: 100 },
    { enabled: !stateRoute && Boolean(routeId) },
  );

  const { data: locationsData } = useLocationsQuery({
    limit: 100,
    status: "active",
  });

  const route =
    stateRoute?.id === routeId
      ? stateRoute
      : routesData?.items?.find((r) => r.id === routeId);

  const [name, setName] = useState("");
  const [source, setSource] = useState<SelectedLocation | null>(null);
  const [destination, setDestination] = useState<SelectedLocation | null>(null);
  const [stops, setStops] = useState<RouteStopDraft[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [updatedRoute, setUpdatedRoute] = useState<RouteResponse | null>(null);

  const updateRouteMutation = useUpdateRouteMutation();

  // Populate form from route data and locations
  useEffect(() => {
    if (!route) return;

    if (!isInitialized) {
      setName(route.name);
      setIsInitialized(true);
    }

    const sortedStops = [...(route.route_stops ?? [])].sort(
      (a, b) => a.sequence - b.sequence,
    );

    const locationsList = locationsData?.items ?? [];
    const resolveLoc = (stop: RouteStopResponse): SelectedLocation => {
      if (stop.location) {
        return {
          id: stop.location.id || stop.location_id,
          name: stop.location.name,
          city: stop.location.city,
        };
      }
      const found = locationsList.find((l) => l.id === stop.location_id);
      return {
        id: stop.location_id,
        name: found ? found.name : stop.location_id,
        city: found ? found.city : "",
      };
    };

    if (sortedStops.length >= 2) {
      const srcStop = sortedStops[0];
      const dstStop = sortedStops[sortedStops.length - 1];
      setSource((prev) => (prev && prev.name !== prev.id ? prev : resolveLoc(srcStop)));
      setDestination((prev) => (prev && prev.name !== prev.id ? prev : resolveLoc(dstStop)));

      const intermediate = sortedStops.slice(1, -1);
      setStops((prev) =>
        prev.length > 0 && prev.some((s) => s.name !== s.locationId)
          ? prev
          : intermediate.map((stop) => {
              const loc = resolveLoc(stop);
              return {
                clientId: stop.id,
                locationId: stop.location_id,
                name: loc.name,
                city: loc.city,
              };
            }),
      );
    } else if (sortedStops.length === 1) {
      setSource((prev) => (prev && prev.name !== prev.id ? prev : resolveLoc(sortedStops[0])));
    }
  }, [route, locationsData, isInitialized]);

  const selectedLocationIds = [
    source?.id,
    destination?.id,
    ...stops.map((s) => s.locationId),
  ].filter(Boolean) as string[];

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Enter a name for this route.";
    } else if (name.trim().length > 100) {
      nextErrors.name = "Route name cannot exceed 100 characters.";
    }

    if (!source) {
      nextErrors.sourceId = "Select a source location.";
    }

    if (!destination) {
      nextErrors.destId = "Select a destination location.";
    }

    if (source && destination && source.id === destination.id) {
      nextErrors.destId = "Source and destination cannot be the same location.";
    }

    const stopErrors: Record<string, string> = {};
    const seenStopLocIds = new Set<string>();

    stops.forEach((stop, index) => {
      if (!stop.locationId) {
        stopErrors[stop.clientId] = `Select a location for stop ${index + 1}.`;
      } else if (source && stop.locationId === source.id) {
        stopErrors[stop.clientId] =
          "Stop location cannot be the same as source.";
      } else if (destination && stop.locationId === destination.id) {
        stopErrors[stop.clientId] =
          "Stop location cannot be the same as destination.";
      } else if (seenStopLocIds.has(stop.locationId)) {
        stopErrors[stop.clientId] = "Duplicate stop location in this route.";
      } else {
        seenStopLocIds.add(stop.locationId);
      }
    });

    if (Object.keys(stopErrors).length > 0) {
      nextErrors.stops = stopErrors;
    }

    return nextErrors;
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!routeId || !source || !destination) return;

    const formattedStops =
      stops.length > 0
        ? stops.map((stop, index) => ({
            stopId: stop.locationId,
            sequence: index + 1,
          }))
        : null;

    updateRouteMutation.mutate(
      {
        routeId,
        payload: {
          name: name.trim(),
          sourceId: source.id,
          destId: destination.id,
          stops: formattedStops,
        },
        method: "patch",
      },
      {
        onSuccess: (data) => {
          setUpdatedRoute(data);
        },
        onError: (error) => {
          const apiError = toApiError(error);
          const nextErrors: FormErrors = {};

          if (apiError.fieldErrors.name) {
            nextErrors.name = apiError.fieldErrors.name;
          }
          if (
            apiError.fieldErrors.source_id ||
            apiError.fieldErrors.sourceId
          ) {
            nextErrors.sourceId =
              apiError.fieldErrors.source_id ?? apiError.fieldErrors.sourceId;
          }
          if (
            apiError.fieldErrors.dest_id ||
            apiError.fieldErrors.destId
          ) {
            nextErrors.destId =
              apiError.fieldErrors.dest_id ?? apiError.fieldErrors.destId;
          }

          const hasFieldErrors = Object.keys(nextErrors).length > 0;
          setErrors((prev) => ({ ...prev, ...nextErrors }));
          setFormError(hasFieldErrors ? null : apiError.message);
        },
      },
    );
  }

  function handleSuccessModalClose() {
    setUpdatedRoute(null);
    navigate(route_paths.routes);
  }

  if (isRoutesLoading && !route) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center rounded-4xl bg-white p-12 shadow-2xl shadow-slate-900/10">
          <p className="text-slate-500 font-medium">Loading route details...</p>
        </div>
      </main>
    );
  }

  if (!route && !isRoutesLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center rounded-4xl bg-white p-12 shadow-2xl shadow-slate-900/10">
          <h2 className="text-2xl font-bold text-slate-950">Route not found</h2>
          <p className="mt-2 text-slate-500">
            The route you are trying to edit could not be found.
          </p>
          <Link
            to={route_paths.routes}
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to routes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        {/* Left Branding & Highlights Pane */}
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <BrandMark />
            <span className="text-lg font-bold tracking-tight">Carpool</span>
          </div>

          <div className="relative my-auto max-w-sm">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100 uppercase">
              Route Planner
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white">
              Update your travel route.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Adjust your start point, pickup stops, and destination to keep
              your rides synchronized.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                  1
                </span>
                <span>Configure name and primary endpoints</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                  2
                </span>
                <span>Add or reorder intermediate pickup stops</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                  3
                </span>
                <span>Save changes to publish updated route</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/[.07] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Editing Route
            </p>
            <p className="mt-1 text-lg font-bold text-white">
              {route?.name ?? "Route"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {stops.length} intermediate{" "}
              {stops.length === 1 ? "stop" : "stops"} configured
            </p>
          </div>
        </aside>

        {/* Right Content / Form Pane */}
        <section className="flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto">
          <div className="flex items-center justify-between">
            <Link
              to={route_paths.routes}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              ← Back to routes
            </Link>
            <div className="lg:hidden flex items-center gap-2">
              <BrandMark />
              <span className="text-sm font-bold tracking-tight text-slate-950">
                Carpool
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-indigo-600 uppercase">
              Route Details
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Edit route
            </h2>
            <p className="mt-1 text-[15px] leading-6 text-slate-500">
              Update the route name, departure point, destination, and
              intermediate stops.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
            {formError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-medium"
              >
                {formError}
              </div>
            )}

            {/* Route Name Input */}
            <div>
              <label
                htmlFor="route-name"
                className="block text-sm font-semibold text-slate-900"
              >
                Route Name
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <FieldIcon type="tag" className="h-5 w-5" />
                </div>
                <input
                  id="route-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Downtown Morning Express"
                  maxLength={100}
                  className={`block w-full rounded-xl border bg-white py-3 pr-4 pl-11 text-sm text-slate-900 transition focus:outline-none focus:ring-4 ${
                    errors.name
                      ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Source & Destination Inputs */}
            <div className="grid gap-6 sm:grid-cols-2">
              <LocationCombobox
                id="source-location"
                label="Source Location"
                placeholder="Search departure point..."
                selectedLocation={source}
                onSelect={(loc) => {
                  setSource(loc);
                  if (errors.sourceId) {
                    setErrors((prev) => ({ ...prev, sourceId: undefined }));
                  }
                }}
                onClear={() => setSource(null)}
                disabledLocationIds={selectedLocationIds.filter(
                  (id) => id !== source?.id,
                )}
                hasError={Boolean(errors.sourceId)}
                errorMessage={errors.sourceId}
              />

              <LocationCombobox
                id="destination-location"
                label="Destination Location"
                placeholder="Search arrival point..."
                selectedLocation={destination}
                onSelect={(loc) => {
                  setDestination(loc);
                  if (errors.destId) {
                    setErrors((prev) => ({ ...prev, destId: undefined }));
                  }
                }}
                onClear={() => setDestination(null)}
                disabledLocationIds={selectedLocationIds.filter(
                  (id) => id !== destination?.id,
                )}
                hasError={Boolean(errors.destId)}
                errorMessage={errors.destId}
              />
            </div>

            {/* Intermediate Stops */}
            <div className="border-t border-slate-100 pt-6">
              <RouteStopsEditor
                stops={stops}
                onChange={(nextStops) => {
                  setStops(nextStops);
                  if (errors.stops) {
                    setErrors((prev) => ({ ...prev, stops: undefined }));
                  }
                }}
                disabledLocationIds={[source?.id, destination?.id].filter(
                  Boolean,
                ) as string[]}
                stopErrors={errors.stops}
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
              <Link
                to={route_paths.routes}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updateRouteMutation.isPending}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-60 cursor-pointer"
              >
                {updateRouteMutation.isPending ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {updatedRoute && (
        <RouteSuccessModal
          title="Route Updated"
          eyebrow="ROUTE UPDATED"
          message={`Your route "${updatedRoute.name}" has been successfully updated.`}
          routeName={updatedRoute.name}
          stopsCount={updatedRoute.route_stops?.length ?? 0}
          onClose={handleSuccessModalClose}
        />
      )}
    </main>
  );
}
