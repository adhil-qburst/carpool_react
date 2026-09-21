import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import { route_paths } from "@core/router/route_paths";
import type {
  TripResponse,
  TripRouteOption,
  TripVehicleOption,
} from "../types/trips.api.types";

export interface TripDetailSidebarProps {
  trip?: TripResponse | null;
  route?: TripRouteOption | null;
  vehicle?: TripVehicleOption | null;
  isLoading?: boolean;
}

export default function TripDetailSidebar({
  trip,
  route,
  vehicle,
  isLoading = false,
}: TripDetailSidebarProps) {
  const routeName =
    route?.name ?? (trip ? `Trip #${trip.id.slice(0, 8)}` : "Trip Details");

  const departureTimeFormatted = trip
    ? trip.departure_time.slice(0, 5)
    : "";

  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950" />

      <div className="relative">
        <Link to={route_paths.home} className="inline-flex items-center gap-3">
          <BrandMark />
          <span className="text-xl font-bold tracking-tight text-white">
            Carpool
          </span>
        </Link>

        <div className="mt-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            Trip Overview
          </span>
          {isLoading ? (
            <div className="mt-4 space-y-3">
              <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
              <div className="h-4 w-64 animate-pulse rounded bg-white/10" />
            </div>
          ) : (
            <>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
                {routeName}
              </h1>
              <p className="mt-3 text-[15px] leading-6 text-slate-400">
                Review scheduled departure timing, designated route stops,
                assigned vehicle information, and available seat capacity.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Summary Card */}
      <div className="relative my-8 rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur-md">
        <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
          Journey Summary
        </p>

        {isLoading || !trip ? (
          <div className="mt-3 space-y-2.5">
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <div className="mt-3 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Route:</span>
              <span className="font-medium text-slate-100 truncate max-w-[190px]">
                {route?.name ?? `Route #${trip.route_id.slice(0, 8)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Departure:</span>
              <span className="font-medium text-slate-100">
                {trip.departure_date} @ {departureTimeFormatted}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vehicle:</span>
              <span className="font-medium text-slate-100 truncate max-w-[190px]">
                {vehicle
                  ? `${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`
                  : `Vehicle #${trip.vehicle_id.slice(0, 8)}`}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-slate-400">Open Seats:</span>
              <span
                className={`font-semibold ${
                  trip.available_seats > 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {trip.available_seats > 0
                  ? `${trip.available_seats} ${trip.available_seats === 1 ? "seat" : "seats"} left`
                  : "Sold out"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Guidelines Note */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[.04] p-5">
        <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
          Commuter Guidelines
        </p>
        <p className="mt-1.5 text-xs leading-5 text-slate-400">
          Please arrive at your pickup location 5 minutes prior to scheduled
          departure. Always verify driver identity and vehicle license plate
          before boarding.
        </p>
      </div>
    </aside>
  );
}
