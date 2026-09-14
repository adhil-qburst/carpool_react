import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import { route_paths } from "@core/router/route_paths";
import type { TripVehicleOption } from "../types/trips.api.types";

export interface VehicleSelectorProps {
  vehicles: TripVehicleOption[];
  selectedVehicleId: string;
  onChange: (vehicleId: string) => void;
  selectedVehicle?: TripVehicleOption | null;
  availableSeatsCount?: number | null;
  error?: string;
  isLoading?: boolean;
}

export default function VehicleSelector({
  vehicles,
  selectedVehicleId,
  onChange,
  selectedVehicle,
  availableSeatsCount,
  error,
  isLoading = false,
}: VehicleSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="trip-vehicle"
          className="block text-sm font-semibold text-slate-700"
        >
          Select Vehicle <span className="text-rose-500">*</span>
        </label>
        <Link
          to={route_paths.vehiclesNew}
          className="text-xs font-semibold text-indigo-600 hover:underline"
        >
          + Register vehicle
        </Link>
      </div>

      <div className="relative text-slate-400">
        <span className="pointer-events-none absolute left-3.5 top-3.5">
          <FieldIcon type="car" />
        </span>
        <select
          id="trip-vehicle"
          value={selectedVehicleId}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "trip-vehicle-error" : undefined}
          className={`w-full appearance-none rounded-xl border bg-white py-3 pl-11 pr-10 text-[15px] text-slate-900 outline-none transition focus:ring-4 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
          }`}
        >
          <option value="">
            {isLoading
              ? "Loading vehicles..."
              : "-- Select your vehicle --"}
          </option>
          {vehicles.map((veh) => (
            <option key={veh.id} value={veh.id}>
              {veh.make} {veh.model} ({veh.license_plate}) — {veh.total_seats}{" "}
              total seats
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-4 text-xs text-slate-400">
          ▼
        </span>
      </div>

      {error && (
        <p id="trip-vehicle-error" className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      )}

      {vehicles.length === 0 && !isLoading && (
        <p className="mt-1.5 text-xs text-amber-600">
          No vehicles found.{" "}
          <Link
            to={route_paths.vehiclesNew}
            className="font-semibold underline"
          >
            Register a vehicle
          </Link>{" "}
          to post trips.
        </p>
      )}

      {/* Dynamic Available Seats Info */}
      {selectedVehicle && (
        <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-indigo-50/80 px-3.5 py-2.5 text-xs text-indigo-900 border border-indigo-100">
          <span className="font-semibold">Capacity:</span>
          <span>
            {selectedVehicle.total_seats} total seats →{" "}
            <strong className="text-emerald-700">
              {availableSeatsCount} open passenger{" "}
              {availableSeatsCount === 1 ? "seat" : "seats"}
            </strong>{" "}
            (1 driver)
          </span>
        </div>
      )}
    </div>
  );
}
