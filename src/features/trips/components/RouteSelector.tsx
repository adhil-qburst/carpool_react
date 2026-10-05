import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import { route_paths } from "@core/router/route_paths";
import RouteDetailsCard from "./RouteDetailsCard";
import type { TripRouteOption } from "../types/trips.api.types";

export interface RouteSelectorProps {
  routes: TripRouteOption[];
  selectedRouteId: string;
  onChange: (routeId: string) => void;
  selectedRoute?: TripRouteOption | null;
  error?: string;
  isLoading?: boolean;
}

export default function RouteSelector({
  routes,
  selectedRouteId,
  onChange,
  selectedRoute,
  error,
  isLoading = false,
}: RouteSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="trip-route"
          className="block text-sm font-semibold text-slate-700"
        >
          Select Route <span className="text-rose-500">*</span>
        </label>
        <Link
          to={route_paths.routesNew}
          className="text-xs font-semibold text-indigo-600 hover:underline"
        >
          + Create new route
        </Link>
      </div>

      <div className="relative text-slate-400">
        <span className="pointer-events-none absolute left-3.5 top-3.5">
          <FieldIcon type="pin" />
        </span>
        <select
          id="trip-route"
          value={selectedRouteId}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "trip-route-error" : undefined}
          className={`w-full appearance-none rounded-xl border bg-white py-3 pl-11 pr-10 text-[15px] text-slate-900 outline-none transition focus:ring-4 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
        >
          <option value="">
            {isLoading
              ? "Loading routes..."
              : "-- Select an active route --"}
          </option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-4 text-xs text-slate-400">
          ▼
        </span>
      </div>

      {error && (
        <p id="trip-route-error" className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      )}

      {routes.length === 0 && !isLoading && (
        <p className="mt-1.5 text-xs text-amber-600">
          You do not have any active routes.{" "}
          <Link to={route_paths.routesNew} className="font-semibold underline">
            Create a route
          </Link>{" "}
          first.
        </p>
      )}

      {/* Selected Route Details with Stops */}
      {selectedRoute && (
        <div className="mt-3">
          <RouteDetailsCard route={selectedRoute} />
        </div>
      )}
    </div>
  );
}
