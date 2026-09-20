import { Link } from "react-router";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import FieldIcon from "@shared/ui/FieldIcon";
import { route_paths } from "@core/router/route_paths";
import type {
  TripResponse,
  TripRouteOption,
  TripVehicleOption,
} from "../types/trips.api.types";
import {
  formatDepartureDate,
  formatDepartureTime,
  getRouteDetails,
} from "@features/home/components/dashboard/dashboardHelpers";

export type TripsQuickInsightsProps = {
  trips: TripResponse[];
  routesMap: Map<string, TripRouteOption>;
  vehiclesMap: Map<string, TripVehicleOption>;
};

function getCalendarParts(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return { month: "DATE", day: "--", weekday: "---" };
  const dt = new Date(y, m - 1, d);
  return {
    month: dt.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(d),
    weekday: dt.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

const TripsQuickInsights = ({
  trips,
  routesMap,
  vehiclesMap,
}: TripsQuickInsightsProps) => {
  // Only display the quick operational cards banner if there are multiple upcoming trips
  const scheduledTrips = trips.filter((t) => t.status === "scheduled");

  if (scheduledTrips.length < 2) {
    return null;
  }

  const previewTrips = scheduledTrips.slice(0, 3);

  return (
    <section className="grid grid-cols-1 gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4 shadow-xs md:grid-cols-3">
      {previewTrips.map((trip) => {
        const route = routesMap.get(trip.route_id);
        const vehicle = vehiclesMap.get(trip.vehicle_id);
        const routeDetails = getRouteDetails(route);
        const { month, day, weekday } = getCalendarParts(trip.departure_date);
        const vehicleName = vehicle
          ? `${vehicle.make} ${vehicle.model}`
          : "Assigned Vehicle";
        const totalSeats = vehicle?.total_seats ?? (trip.available_seats || 4);
        const availableSeats = trip.available_seats;
        const bookedSeats = Math.max(0, totalSeats - availableSeats);
        const occupancyPercent =
          totalSeats > 0
            ? Math.min(100, Math.round((bookedSeats / totalSeats) * 100))
            : 0;

        const pickupLocation =
          route?.route_stops?.[0]?.location?.name ||
          route?.route_stops?.[0]?.location?.city ||
          "Hub";

        const routeDisplay =
          routeDetails.destination !== "-"
            ? `${routeDetails.origin} → ${routeDetails.destination}`
            : routeDetails.origin;

        return (
          <div
            key={`preview-${trip.id}`}
            className="flex flex-col justify-between gap-4 rounded-xl border border-border-subtle bg-surface-card p-4 shadow-xs transition-colors hover:border-slate-300"
          >
            {/* Top Row: Date badge + details */}
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-surface-mint-border bg-surface-mint">
                <span className="text-[10px] font-bold uppercase text-primary">
                  {month}
                </span>
                <span className="text-base font-bold leading-none text-primary">
                  {day}
                </span>
                <span className="text-[9px] text-text-muted">{weekday}</span>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h4 className="truncate text-sm font-bold text-on-surface">
                    {routeDisplay}
                  </h4>
                  <span className="rounded-full bg-surface-mint px-1.5 py-0.2 text-[10px] font-semibold text-primary uppercase">
                    {trip.status}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-text-muted">
                  <FieldIcon type="clock" className="h-3.5 w-3.5 text-primary" />
                  <span>
                    {formatDepartureTime(trip.departure_time)} · #TRP-
                    {trip.id.slice(0, 4).toUpperCase()}
                  </span>
                </p>
                <p className="truncate text-xs text-text-muted">
                  Pickup: {pickupLocation}
                </p>
              </div>
            </div>

            {/* Bottom Row: Vehicle occupancy & View action */}
            <div className="space-y-2 border-t border-border-subtle pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate font-medium text-on-surface">
                  {vehicleName}
                </span>
                <span className="font-semibold text-primary">
                  {availableSeats} of {totalSeats} seats
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  to={route_paths.getTripEditPath(trip.id)}
                  aria-label="View trip preview"
                  className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-hover active:scale-95"
                >
                  <span>View Trip</span>
                  <ArrowRightIcon className="h-3 w-3" />
                </Link>
                <span className="text-[11px] text-text-muted">
                  {formatDepartureDate(trip.departure_date)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default TripsQuickInsights;
