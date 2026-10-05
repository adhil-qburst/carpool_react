import { useState, useMemo } from "react";
import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import PlusIcon from "@shared/ui/PlusIcon";
import FieldIcon from "@shared/ui/FieldIcon";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { useTripsQuery } from "../hooks/useTripsQuery";
import {
  useDriverRoutesQuery,
  useDriverVehiclesQuery,
} from "../hooks/useTripOptionsQuery";
import { useDeleteTripMutation } from "../hooks/useDeleteTripMutation";
import TripStatsSidebar from "../components/TripStatsSidebar";
import TripCard from "../components/TripCard";
import DeleteTripModal from "../modals/DeleteTripModal";
import type { TripResponse } from "../types/trips.api.types";

const PAGE_LIMIT = 8;

export default function TripsPage() {
  const [page, setPage] = useState(1);
  const [tripToDelete, setTripToDelete] = useState<TripResponse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: tripsData,
    isLoading: isLoadingTrips,
    isError: isTripsError,
    error: tripsError,
  } = useTripsQuery({ page, limit: PAGE_LIMIT });

  const { data: routes = [] } = useDriverRoutesQuery();
  const { data: vehicles = [] } = useDriverVehiclesQuery();
  const deleteMutation = useDeleteTripMutation();

  const routesMap = useMemo(
    () => new Map(routes.map((r) => [r.id, r])),
    [routes],
  );
  const vehiclesMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles],
  );

  const trips = tripsData?.items ?? [];
  const totalTrips = tripsData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalTrips / PAGE_LIMIT));

  const scheduledTripsCount = trips.filter(
    (t) => t.status === "scheduled",
  ).length;

  const totalSeatsOnPage = trips.reduce(
    (sum, t) => sum + (t.available_seats || 0),
    0,
  );

  function handleDeleteConfirm() {
    if (!tripToDelete || tripToDelete.status !== "scheduled") return;

    setDeleteError(null);
    deleteMutation.mutate(tripToDelete.id, {
      onSuccess: () => {
        const route = routesMap.get(tripToDelete.route_id);
        const routeLabel = route ? route.name : `Trip #${tripToDelete.id.slice(0, 8)}`;
        setTripToDelete(null);
        setFeedback(`Trip for "${routeLabel}" on ${tripToDelete.departure_date} has been deleted.`);
      },
      onError: (err) => {
        const apiError = toApiError(err);
        setTripToDelete(null);
        setDeleteError(apiError.message);
      },
    });
  }

  function handleSelectTripToDelete(trip: TripResponse) {
    if (trip.status !== "scheduled") return;
    setTripToDelete(trip);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        <TripStatsSidebar
          totalTrips={totalTrips}
          scheduledTrips={scheduledTripsCount}
          availableSeatsCount={totalSeatsOnPage}
          isLoading={isLoadingTrips}
        />

        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          {/* Mobile Header */}
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
              Dashboard
            </Link>
          </div>

          {/* Desktop / Tablet Header */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 lg:mt-0">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                My Trips
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your scheduled rides and departure times.
              </p>
            </div>
            <Link
              to={route_paths.tripsNew}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Schedule Trip</span>
            </Link>
          </div>

          {/* Feedback & Error Alerts */}
          {feedback && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800 border border-emerald-200">
              <p>{feedback}</p>
              <button
                type="button"
                aria-label="Dismiss feedback"
                onClick={() => setFeedback(null)}
                className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {deleteError && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-800 border border-rose-200">
              <p>{deleteError}</p>
              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setDeleteError(null)}
                className="text-rose-600 hover:text-rose-900 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {isTripsError && (
            <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-800 border border-rose-200">
              {toApiError(tripsError).message || "Failed to load trips."}
            </div>
          )}

          {/* Content Area */}
          <div className="mt-6 flex-1">
            {isLoadingTrips ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-48 animate-pulse rounded-3xl border border-slate-100 bg-slate-50"
                  />
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="grid h-full place-items-center py-16 text-center">
                <div className="max-w-xs">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <FieldIcon type="calendar" className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-950">
                    No trips scheduled yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Create your first trip to offer shared rides to your passengers.
                  </p>
                  <Link
                    to={route_paths.tripsNew}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Schedule your first trip</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    route={routesMap.get(trip.route_id)}
                    vehicle={vehiclesMap.get(trip.vehicle_id)}
                    onDelete={handleSelectTripToDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
                <span className="font-semibold text-slate-900">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {tripToDelete && (
        <DeleteTripModal
          trip={tripToDelete}
          routeName={routesMap.get(tripToDelete.route_id)?.name}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setTripToDelete(null)}
        />
      )}
    </main>
  );
}
