import { useMemo } from "react";
import { Link } from "react-router";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import RouteIcon from "@shared/ui/RouteIcon";
import { route_paths } from "@core/router/route_paths";
import { useTripsQuery } from "@features/trips/hooks/useTripsQuery";
import {
  useDriverRoutesQuery,
  useDriverVehiclesQuery,
} from "@features/trips/hooks/useTripOptionsQuery";
import type { TripResponse } from "@features/trips/types/trips.api.types";
import {
  parseDateParts,
  formatDepartureTime,
  getRouteDetails,
} from "./dashboardHelpers";

export type NextTripCardProps = {
  trip?: TripResponse | null;
  isLoading?: boolean;
};

const NextTripCard = ({ trip, isLoading }: NextTripCardProps) => {
  const { data: routes = [], isLoading: isLoadingRoutes } =
    useDriverRoutesQuery();
  const { data: vehicles = [], isLoading: isLoadingVehicles } =
    useDriverVehiclesQuery();
  const tripsFallbackQuery = useTripsQuery(undefined, {
    enabled: trip === undefined,
  });

  const routesMap = useMemo(
    () => new Map(routes.map((r) => [r.id, r])),
    [routes],
  );
  const vehiclesMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles],
  );

  const resolvedTrip =
    trip !== undefined
      ? trip
      : (tripsFallbackQuery.data?.items?.find((t) => t.status === "scheduled") ??
        tripsFallbackQuery.data?.items?.[0] ??
        null);

  const isDataLoading =
    (isLoading ?? (trip === undefined && tripsFallbackQuery.isLoading)) ||
    isLoadingRoutes ||
    isLoadingVehicles;

  if (isDataLoading) {
    return (
      <div
        data-testid="next-trip-loading"
        className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-xs sm:p-7 lg:col-span-7"
      >
        <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-36 rounded-md bg-surface-container" />
          <div className="h-20 w-full rounded-xl bg-surface-container" />
          <div className="h-16 w-full rounded-xl bg-surface-container" />
          <div className="h-12 w-full rounded-xl bg-surface-container" />
        </div>
      </div>
    );
  }

  if (!resolvedTrip) {
    return (
      <div
        data-testid="next-trip-empty"
        className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-xs sm:p-7 lg:col-span-7"
      >
        <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-4 sm:pb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-on-surface">
                Your Next Trip
              </h2>
              <span className="flex items-center gap-1 rounded-full border border-border-subtle bg-surface-container px-2.5 py-0.5 text-xs font-semibold text-text-muted">
                <span>None Scheduled</span>
              </span>
            </div>
            <Link
              to={route_paths.trips}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary transition-colors hover:underline"
            >
              <span>View All Trips</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-mint text-primary">
              <RouteIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm sm:text-base font-semibold text-on-surface">
              No Upcoming Trips Scheduled
            </h3>
            <p className="mt-1 max-w-sm text-xs text-text-muted">
              You do not have any upcoming trips on your schedule. Create a new trip
              to start offering rides to passengers.
            </p>
            <Link
              to={route_paths.tripsNew}
              className="mt-5 sm:mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary-hover active:scale-95"
            >
              <span>Create New Trip</span>
              <ArrowRightIcon className="h-4 w-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { month, day } = parseDateParts(resolvedTrip.departure_date);
  const time = formatDepartureTime(resolvedTrip.departure_time);
  const vehicle = vehiclesMap.get(resolvedTrip.vehicle_id);
  const route = routesMap.get(resolvedTrip.route_id);
  const routeDetails = getRouteDetails(route);

  const vehicleName = vehicle
    ? `${vehicle.make} ${vehicle.model}`
    : resolvedTrip.vehicle_id
      ? `Vehicle #${resolvedTrip.vehicle_id.slice(0, 6)}`
      : "Not assigned";
  const vehiclePlate = vehicle?.license_plate ?? "Not assigned";
  const totalSeats = vehicle?.total_seats ?? resolvedTrip.available_seats;

  return (
    <div
      data-testid="next-trip-card"
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-xs sm:p-7 lg:col-span-7"
    >
      <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />

      <div>
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-4 sm:pb-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-on-surface">
              Your Next Trip
            </h2>
            <span className="flex items-center gap-1 rounded-full border border-surface-mint-border bg-surface-mint px-2.5 py-0.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="capitalize">{resolvedTrip.status}</span>
            </span>
          </div>
          <Link
            to={route_paths.trips}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary transition-colors hover:underline"
          >
            <span>View All Trips</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Trip Date, Time & Quick Summary Banner */}
        <div className="mt-5 sm:mt-6 flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-canvas p-3.5 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border-subtle bg-surface-card text-center">
              <span className="text-[10px] font-bold leading-none text-text-muted uppercase">
                {month}
              </span>
              <span className="mt-0.5 text-sm sm:text-base font-bold leading-none text-primary">
                {day}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-on-surface">
                {time}
              </span>
              <span className="text-xs text-text-muted">Departure Time</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:justify-end sm:gap-4">
            <div className="flex flex-col sm:text-right">
              <span className="text-xs sm:text-sm font-semibold text-on-surface">
                {vehicleName}
              </span>
              <span className="text-[11px] sm:text-xs text-text-muted">
                {vehiclePlate}
              </span>
            </div>
            <div className="whitespace-nowrap rounded-xl border border-surface-mint-border bg-surface-mint px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-primary">
              {resolvedTrip.available_seats} / {totalSeats} Seats Available
            </div>
          </div>
        </div>

        {/* Route Timeline Visual */}
        <div className="mt-5 sm:mt-6 px-1 py-2 sm:px-2">
          <div className="relative flex items-center justify-between gap-1 sm:gap-2">
            <div className="absolute top-1/2 right-4 left-4 z-0 h-0.5 -translate-y-1/2 bg-border-subtle" />

            {/* Origin Waypoint */}
            <div className="relative z-10 flex min-w-0 max-w-[38%] flex-col items-start bg-surface-card pr-1 sm:pr-2">
              <div className="flex max-w-full items-center gap-1.5 sm:gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full border-2 border-surface-card bg-primary ring-2 ring-surface-mint-border sm:h-3.5 sm:w-3.5" />
                <span className="truncate text-xs font-semibold text-on-surface sm:text-sm md:text-base">
                  {routeDetails.origin}
                </span>
              </div>
              <span className="mt-0.5 pl-4 text-[10px] text-text-muted sm:pl-5 sm:text-xs">
                Pickup Point
              </span>
            </div>

            {/* Mid Stop Indicator */}
            <div className="relative z-10 flex shrink-0 items-center gap-1 rounded-full border border-border-subtle bg-surface-canvas px-2 py-0.5 text-[10px] font-medium text-text-muted sm:px-3 sm:py-1 sm:text-xs">
              <RouteIcon className="h-3 w-3" />
              <span>{routeDetails.stopsCount} Stops</span>
            </div>

            {/* Destination Waypoint */}
            <div className="relative z-10 flex min-w-0 max-w-[38%] flex-col items-end bg-surface-card pl-1 text-right sm:pl-2">
              <div className="flex max-w-full items-center justify-end gap-1.5 sm:gap-2">
                <span className="truncate text-xs font-semibold text-on-surface sm:text-sm md:text-base">
                  {routeDetails.destination}
                </span>
                <span className="h-3 w-3 shrink-0 rounded-full border-2 border-surface-card bg-primary ring-2 ring-surface-mint-border sm:h-3.5 sm:w-3.5" />
              </div>
              <span className="mt-0.5 pr-4 text-[10px] text-text-muted sm:pr-5 sm:text-xs">
                Final Drop
              </span>
            </div>
          </div>
        </div>

        {/* Metric Badges Row */}
        <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3 border-t border-border-subtle pt-4 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-text-muted">
              Estimated Duration
            </span>
            <span className="mt-0.5 text-xs sm:text-sm font-semibold text-on-surface">
              {routeDetails.duration}
            </span>
          </div>
          <div className="flex flex-col border-x border-border-subtle px-1">
            <span className="text-[10px] sm:text-xs text-text-muted">Route Code</span>
            <span className="mt-0.5 text-xs sm:text-sm font-semibold text-on-surface truncate">
              {routeDetails.routeCode}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-text-muted">Total Distance</span>
            <span className="mt-0.5 text-xs sm:text-sm font-semibold text-on-surface">
              {routeDetails.distance}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="mt-5 sm:mt-6 pt-3 sm:pt-4">
        <Link
          to={route_paths.trips}
          className="flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-primary-hover active:scale-95"
        >
          <span className="font-semibold text-white">View Trip Details</span>
          <ArrowRightIcon className="h-4 w-4 text-white" />
        </Link>
      </div>
    </div>
  );
};

export default NextTripCard;
