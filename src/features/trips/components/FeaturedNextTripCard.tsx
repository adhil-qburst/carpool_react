import { Link } from "react-router";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import FieldIcon from "@shared/ui/FieldIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";
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

export type FeaturedNextTripCardProps = {
  trip: TripResponse;
  route?: TripRouteOption;
  vehicle?: TripVehicleOption;
  onDelete: (trip: TripResponse) => void;
};

const FeaturedNextTripCard = ({
  trip,
  route,
  vehicle,
  onDelete,
}: FeaturedNextTripCardProps) => {
  const routeDetails = getRouteDetails(route);
  const formattedDate = formatDepartureDate(trip.departure_date);
  const formattedTime = formatDepartureTime(trip.departure_time);

  const vehicleName = vehicle
    ? `${vehicle.make} ${vehicle.model}`
    : `Vehicle #${trip.vehicle_id.slice(0, 6)}`;
  const licensePlate = vehicle?.license_plate ?? "KL-07-XX-0000";
  const totalSeats = vehicle?.total_seats ?? (trip.available_seats || 4);
  const availableSeats = trip.available_seats;
  const bookedSeats = Math.max(0, totalSeats - availableSeats);
  const occupancyPercent =
    totalSeats > 0
      ? Math.min(100, Math.round((bookedSeats / totalSeats) * 100))
      : 0;

  const stops =
    route?.route_stops && route.route_stops.length > 0
      ? [...route.route_stops].sort((a, b) => a.sequence - b.sequence)
      : [];

  const intermediateStopsLabel =
    stops.length > 2
      ? `Via ${stops
          .slice(1, -1)
          .map((s) => s.location?.name || s.location?.city)
          .filter(Boolean)
          .join(", ")}`
      : null;

  const tripCode = `TRP-${trip.id.slice(0, 4).toUpperCase()}`;
  const routeCode = routeDetails.routeCode.startsWith("RT-")
    ? routeDetails.routeCode
    : `RT-${route?.id.slice(0, 3).toUpperCase() ?? "001"}`;

  const hasDistinctEndpoints =
    stops.length >= 2 ||
    (routeDetails.destination && routeDetails.destination !== "-");

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border-subtle border-t-[3px] border-t-primary bg-surface-card p-5 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left Column: Route and Schedule */}
        <div className="max-w-2xl space-y-4">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-mint-border bg-surface-mint px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Next Upcoming Journey</span>
            </span>
            <span className="inline-flex items-center rounded-full border border-surface-mint-border bg-surface-mint px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
              Status: {trip.status}
            </span>
            <span className="inline-flex items-center rounded-md border border-border-subtle bg-surface-container px-2 py-0.5 font-mono text-[11px] text-text-muted">
              TRIP #{tripCode} · ROUTE #{routeCode}
            </span>
          </div>

          {/* Major Route Heading */}
          <div>
            {hasDistinctEndpoints ? (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-xl font-bold tracking-tight text-on-surface sm:text-2xl">
                  {routeDetails.origin}
                </h2>
                <ArrowRightIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight text-on-surface sm:text-2xl">
                  {routeDetails.destination}
                </h2>
                {intermediateStopsLabel && (
                  <span className="rounded-md bg-surface-container px-2 py-0.5 text-xs text-text-muted">
                    {intermediateStopsLabel}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-xl font-bold tracking-tight text-on-surface sm:text-2xl">
                  Next Scheduled Departure
                </h2>
                <span className="rounded-md bg-surface-container px-2.5 py-0.5 text-xs font-medium text-text-muted">
                  {routeCode}
                </span>
              </div>
            )}

            <p className="mt-1.5 flex items-center gap-2 text-xs text-text-muted sm:text-sm">
              <FieldIcon type="clock" className="h-4 w-4 text-primary" />
              <strong className="font-semibold text-on-surface">
                {formattedDate} · {formattedTime}
              </strong>
              <span>• Scheduled</span>
            </p>
          </div>

          {/* Serene Transit Stop Timeline */}
          {stops.length > 0 && (
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                {stops.map((stop, idx) => {
                  const isEnd = idx === 0 || idx === stops.length - 1;
                  const stopName =
                    stop.location?.name ||
                    stop.location?.city ||
                    `Stop ${idx + 1}`;
                  return (
                    <div key={stop.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full ${
                            isEnd
                              ? "h-2.5 w-2.5 bg-primary"
                              : "h-2 w-2 border border-slate-400 bg-white"
                          }`}
                        />
                        <span
                          className={isEnd ? "font-semibold text-on-surface" : ""}
                        >
                          {stopName}
                        </span>
                      </div>
                      {idx < stops.length - 1 && (
                        <div className="h-0.5 w-6 bg-slate-300 sm:w-8" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Vehicle Occupancy & Actions */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-4 sm:flex-row sm:items-center lg:flex-col lg:items-end lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          <div className="space-y-1 text-left lg:text-right">
            <div className="flex items-center gap-2 lg:justify-end">
              <FieldIcon type="car" className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-on-surface">
                {vehicleName}
              </span>
            </div>
            <p className="text-xs text-text-muted">
              {licensePlate} · {totalSeats} total seats
            </p>

            {/* Occupancy bar */}
            <div className="flex flex-col items-start gap-1 pt-2 lg:items-end">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-primary">
                  {availableSeats} available of {totalSeats} seats
                </span>
                <span className="text-text-muted">({bookedSeats} booked)</span>
              </div>
              <div className="h-2 w-36 overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {trip.status === "scheduled" && (
              <Link
                to={route_paths.getTripEditPath(trip.id)}
                aria-label="Edit featured trip"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border-subtle bg-surface-card px-3.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-canvas active:scale-95"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                <span>Edit Trip</span>
              </Link>
            )}

            <Link
              to={route_paths.getTripEditPath(trip.id)}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:bg-primary-hover active:scale-95 whitespace-nowrap"
            >
              <span>View Trip</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => onDelete(trip)}
              disabled={trip.status !== "scheduled"}
              aria-label="Delete featured trip"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border-subtle text-text-muted transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
              title="Delete Trip"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNextTripCard;
