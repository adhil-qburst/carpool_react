import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import LocationCombobox from "@features/locations/components/LocationCombobox";
import type { SelectedLocation } from "@features/locations/components/LocationCombobox";
import RouteStopsEditor from "../components/RouteStopsEditor";
import type { RouteStopDraft } from "../components/RouteStopsEditor";
import RouteSuccessModal from "../modals/RouteSuccessModal";
import { useCreateRouteMutation } from "../hooks/useCreateRouteMutation";
import type { RouteResponse } from "../types/routes.api.types";

interface FormErrors {
  name?: string;
  sourceId?: string;
  destId?: string;
  stops?: Record<string, string>;
}

export default function CreateRoutePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [source, setSource] = useState<SelectedLocation | null>(null);
  const [destination, setDestination] = useState<SelectedLocation | null>(null);
  const [stops, setStops] = useState<RouteStopDraft[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [createdRoute, setCreatedRoute] = useState<RouteResponse | null>(null);

  const createRouteMutation = useCreateRouteMutation();

  // All currently chosen location IDs to prevent duplicate picks
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

    if (!source || !destination) return;

    // Sequence for stops starts at 1, 2, ...
    const formattedStops =
      stops.length > 0
        ? stops.map((stop, index) => ({
          stopId: stop.locationId,
          sequence: index + 1,
        }))
        : null;

    createRouteMutation.mutate(
      {
        name: name.trim(),
        sourceId: source.id,
        destId: destination.id,
        stops: formattedStops,
      },
      {
        onSuccess: (data) => {
          setCreatedRoute(data);
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
    setCreatedRoute(null);
    navigate(route_paths.home);
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
              Create your daily travel route.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Set up your start point, pickup stops, and destination to share
              rides effortlessly with fellow commuters.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-600/40 text-indigo-300 text-xs font-bold">
                  ✓
                </span>
                <span>Select verified locations across your city</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-600/40 text-indigo-300 text-xs font-bold">
                  ✓
                </span>
                <span>Add intermediate pickup or drop-off stops</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-600/40 text-indigo-300 text-xs font-bold">
                  ✓
                </span>
                <span>Re-use route for multiple rides & schedules</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/[.07] p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
              Flexible Waypoints
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              Passengers can book seats from any intermediate stop along your
              route, optimizing your carpool occupancy.
            </p>
          </div>
        </aside>

        {/* Right Form Pane */}
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-lg">
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <BrandMark />
                <span className="text-lg font-bold tracking-tight text-slate-950">
                  Carpool
                </span>
              </div>
              <Link
                to={route_paths.home}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Back to home
              </Link>
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="hidden lg:block">
                <Link
                  to={route_paths.home}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  ← Back to home
                </Link>
              </div>

              <p className="mt-4 text-sm font-semibold text-indigo-600 uppercase">
                New Route
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Create a route
              </h2>
              <p className="mt-2 text-[15px] leading-6 text-slate-500">
                Define the journey details and locations for your commute.
              </p>

              {formError && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                {/* Route Name Field */}
                <div>
                  <label
                    htmlFor="route-name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Route Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative text-slate-400">
                    <span className="pointer-events-none absolute left-3.5 top-3.5">
                      <FieldIcon type="tag" />
                    </span>
                    <input
                      id="route-name"
                      type="text"
                      placeholder="e.g. Home to Tech Park Daily"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? "route-name-error" : undefined
                      }
                      className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors.name
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                        }`}
                    />
                  </div>
                  {errors.name && (
                    <p
                      id="route-name-error"
                      className="mt-1.5 text-sm text-rose-600"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Journey Section: Source -> Stops -> Destination */}
                <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50/50 p-5">
                  {/* Source Location */}
                  <LocationCombobox
                    id="route-source"
                    label="Source (Origin)"
                    placeholder="Search start location..."
                    value={source?.id}
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
                    required
                  />

                  {/* Intermediate Stops */}
                  <div className="pt-1 border-t border-slate-200">
                    <RouteStopsEditor
                      stops={stops}
                      onChange={(newStops) => {
                        setStops(newStops);
                        if (errors.stops) {
                          setErrors((prev) => ({ ...prev, stops: undefined }));
                        }
                      }}
                      disabledLocationIds={selectedLocationIds}
                      stopErrors={errors.stops}
                    />
                  </div>

                  {/* Destination Location */}
                  <div className="pt-1 border-t border-slate-200">
                    <LocationCombobox
                      id="route-destination"
                      label="Destination"
                      placeholder="Search destination location..."
                      value={destination?.id}
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
                      required
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={createRouteMutation.isPending}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createRouteMutation.isPending
                    ? "Creating route..."
                    : "Create Route"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {createdRoute && (
        <RouteSuccessModal
          title="Route created!"
          routeName={createdRoute.name}
          stopsCount={createdRoute.route_stops?.length ?? (stops.length + 2)}
          message="Your new route has been created and is ready for scheduled rides."
          onClose={handleSuccessModalClose}
        />
      )}
    </main>
  );
}
