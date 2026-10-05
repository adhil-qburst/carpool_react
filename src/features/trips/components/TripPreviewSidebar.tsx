import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import { route_paths } from "@core/router/route_paths";
import type { TripRouteOption, TripVehicleOption } from "../types/trips.api.types";

export interface TripPreviewSidebarProps {
  title?: string;
  subtitle?: string;
  selectedRoute?: TripRouteOption | null;
  selectedVehicle?: TripVehicleOption | null;
  departureDate?: string;
  departureTime?: string;
  availableSeatsCount?: number | null;
}

export default function TripPreviewSidebar({
  title = "Schedule a Trip",
  subtitle = "Publish an upcoming journey along your commuter route. Set your departure timing and let coworkers book open seats.",
  selectedRoute,
  selectedVehicle,
  departureDate,
  departureTime,
  availableSeatsCount,
}: TripPreviewSidebarProps) {
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

        <div className="mt-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            Driver Portal
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-slate-400">{subtitle}</p>
        </div>
      </div>

      {/* Dynamic Live Preview Card */}
      <div className="relative my-8 rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur-md">
        <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
          Trip Preview
        </p>
        <div className="mt-3 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Route:</span>
            <span className="font-medium text-slate-100 truncate max-w-[190px]">
              {selectedRoute ? selectedRoute.name : "Not selected"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Vehicle:</span>
            <span className="font-medium text-slate-100 truncate max-w-[190px]">
              {selectedVehicle
                ? `${selectedVehicle.make} ${selectedVehicle.model}`
                : "Not selected"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Departure:</span>
            <span className="font-medium text-slate-100">
              {departureDate
                ? `${departureDate} ${departureTime ? `@ ${departureTime}` : ""}`
                : "Not set"}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-white/10">
            <span className="text-slate-400">Passenger Seats:</span>
            <span className="font-semibold text-emerald-400">
              {availableSeatsCount !== null && availableSeatsCount !== undefined
                ? `${availableSeatsCount} ${availableSeatsCount === 1 ? "seat" : "seats"}`
                : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-white/[.04] p-5">
        <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">
          Automated Seat Allocation
        </p>
        <p className="mt-1.5 text-xs leading-5 text-slate-400">
          One seat is automatically reserved for you as the driver. The
          remaining capacity is calculated and published as available seats for
          passengers.
        </p>
      </div>
    </aside>
  );
}
