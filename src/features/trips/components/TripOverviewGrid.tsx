import FieldIcon from "@shared/ui/FieldIcon";
import type {
  TripResponse,
  TripStatus,
  TripVehicleOption,
} from "../types/trips.api.types";

export interface TripOverviewGridProps {
  trip: TripResponse;
  vehicle?: TripVehicleOption | null;
}

const STATUS_BADGES: Record<
  TripStatus,
  { label: string; badgeClass: string; desc: string }
> = {
  scheduled: {
    label: "Scheduled",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Active and open for passenger bookings",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    desc: "Journey finished",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "Cancelled by driver",
  },
  deleted: {
    label: "Deleted",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    desc: "Archived trip record",
  },
};

export default function TripOverviewGrid({
  trip,
  vehicle,
}: TripOverviewGridProps) {
  const statusInfo = STATUS_BADGES[trip.status] ?? {
    label: trip.status,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    desc: "Status recorded",
  };

  const departureTimeFormatted =
    trip.departure_time.length > 5
      ? trip.departure_time.slice(0, 5)
      : trip.departure_time;

  const vehicleLabel = vehicle
    ? `${vehicle.make} ${vehicle.model}`
    : `Vehicle #${trip.vehicle_id.slice(0, 8)}`;

  const licensePlate = vehicle?.license_plate ?? "—";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Tile 1: Departure Schedule */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <FieldIcon type="calendar" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Departure
            </p>
            <p className="text-base font-bold text-slate-900">
              {trip.departure_date}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <FieldIcon type="clock" className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-900">
            {departureTimeFormatted}
          </span>
          <span className="text-slate-400">local time</span>
        </div>
      </div>

      {/* Tile 2: Available Capacity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <FieldIcon type="users" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Available Capacity
            </p>
            <p className="text-base font-bold text-slate-900">
              {trip.available_seats}{" "}
              {trip.available_seats === 1 ? "seat" : "seats"} left
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>Driver seat reserved</span>
          <span
            className={`font-semibold ${
              trip.available_seats > 0 ? "text-emerald-700" : "text-rose-600"
            }`}
          >
            {trip.available_seats > 0 ? "Accepting bookings" : "Sold out"}
          </span>
        </div>
      </div>

      {/* Tile 3: Vehicle Specs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <FieldIcon type="car" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Assigned Vehicle
            </p>
            <p className="truncate text-base font-bold text-slate-900">
              {vehicleLabel}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
          <span>
            Plate: <span className="font-mono font-bold">{licensePlate}</span>
          </span>
          {vehicle?.total_seats && (
            <span className="text-slate-500">
              {vehicle.total_seats} total seats
            </span>
          )}
        </div>
      </div>

      {/* Tile 4: Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <FieldIcon type="tag" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Trip Status
              </p>
              <span
                className={`mt-0.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.badgeClass}`}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {statusInfo.desc}
        </div>
      </div>
    </div>
  );
}
