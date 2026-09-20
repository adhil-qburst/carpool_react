import { useMemo } from "react";
import { Link } from "react-router";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import { route_paths } from "@core/router/route_paths";
import { useTripsQuery } from "@features/trips/hooks/useTripsQuery";
import {
  useDriverRoutesQuery,
  useDriverVehiclesQuery,
} from "@features/trips/hooks/useTripOptionsQuery";
import type { TripResponse } from "@features/trips/types/trips.api.types";
import {
  formatDepartureDate,
  formatDepartureTime,
  getRouteDetails,
  getStatusBadge,
} from "./dashboardHelpers";

export type UpcomingTripsTableProps = {
  trips?: TripResponse[];
  isLoading?: boolean;
};

const UpcomingTripsTable = ({ trips, isLoading }: UpcomingTripsTableProps) => {
  const { data: routes = [], isLoading: isLoadingRoutes } =
    useDriverRoutesQuery();
  const { data: vehicles = [], isLoading: isLoadingVehicles } =
    useDriverVehiclesQuery();
  const tripsFallbackQuery = useTripsQuery(undefined, {
    enabled: trips === undefined,
  });

  const routesMap = useMemo(
    () => new Map(routes.map((r) => [r.id, r])),
    [routes],
  );
  const vehiclesMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles],
  );

  const resolvedTrips = trips ?? tripsFallbackQuery.data?.items ?? [];
  const isDataLoading =
    (isLoading ?? (trips === undefined && tripsFallbackQuery.isLoading)) ||
    isLoadingRoutes ||
    isLoadingVehicles;

  return (
    <section
      aria-label="Upcoming Trips Section"
      className="mb-6 rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-xs sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4 sm:pb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-on-surface">
            Upcoming Trips
          </h2>
          <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-semibold text-secondary">
            {resolvedTrips.length} Total
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={route_paths.trips}
            className="flex items-center gap-1 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-canvas hover:text-on-surface"
          >
            <span>View All Trips</span>
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {isDataLoading ? (
        <div className="mt-4 space-y-3 py-4" data-testid="upcoming-trips-loading">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-12 w-full animate-pulse rounded-xl bg-surface-container"
            />
          ))}
        </div>
      ) : resolvedTrips.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-10 sm:py-12 text-center"
          data-testid="upcoming-trips-empty"
        >
          <p className="text-sm font-medium text-text-muted">
            No upcoming trips scheduled.
          </p>
          <Link
            to={route_paths.tripsNew}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-primary-hover active:scale-95"
          >
            <span>Schedule a Trip</span>
            <ArrowRightIcon className="h-3 w-3 text-white" />
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
          <table className="min-w-[620px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle text-xs font-semibold text-text-muted">
                <th className="px-3 py-3 sm:px-4">Date</th>
                <th className="px-3 py-3 sm:px-4">Departure</th>
                <th className="px-3 py-3 sm:px-4">Route</th>
                <th className="px-3 py-3 sm:px-4">Vehicle</th>
                <th className="px-3 py-3 sm:px-4">Seats</th>
                <th className="px-3 py-3 sm:px-4">Status</th>
                <th className="px-3 py-3 sm:px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm text-on-surface">
              {resolvedTrips.map((trip) => {
                const route = routesMap.get(trip.route_id);
                const vehicle = vehiclesMap.get(trip.vehicle_id);
                const endpoints = getRouteDetails(route);
                const vehicleName = vehicle
                  ? `${vehicle.make} ${vehicle.model}`
                  : trip.vehicle_id
                    ? `Vehicle #${trip.vehicle_id.slice(0, 6)}`
                    : "Not assigned";
                const totalSeats = vehicle?.total_seats;
                const seatsDisplay = totalSeats
                  ? `${trip.available_seats}/${totalSeats}`
                  : `${trip.available_seats} left`;
                const statusBadge = getStatusBadge(trip.status);

                return (
                  <tr
                    key={trip.id}
                    className="transition-colors hover:bg-surface-canvas/60"
                  >
                    <td className="px-3 py-3.5 sm:px-4 sm:py-4 font-semibold text-on-surface whitespace-nowrap">
                      {formatDepartureDate(trip.departure_date)}
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 sm:py-4 text-text-muted whitespace-nowrap">
                      {formatDepartureTime(trip.departure_time)}
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 sm:py-4">
                      <div className="flex items-center gap-1.5 font-medium whitespace-nowrap">
                        <span>{endpoints.origin}</span>
                        <ArrowRightIcon className="h-3 w-3 text-text-muted" />
                        <span>{endpoints.destination}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 sm:py-4 text-text-muted whitespace-nowrap">
                      {vehicleName}
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 sm:py-4 whitespace-nowrap">
                      <span className="font-medium text-primary">
                        {seatsDisplay}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 sm:px-4 sm:py-4 text-right whitespace-nowrap">
                      <Link
                        to={route_paths.trips}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary transition-colors hover:underline"
                      >
                        <span>View Details</span>
                        <ArrowRightIcon className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UpcomingTripsTable;
