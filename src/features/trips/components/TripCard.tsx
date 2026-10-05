import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";
import { route_paths } from "@core/router/route_paths";
import type {
  TripResponse,
  TripRouteOption,
  TripStatus,
  TripVehicleOption,
} from "../types/trips.api.types";

export type TripCardProps = {
  trip: TripResponse;
  route?: TripRouteOption;
  vehicle?: TripVehicleOption;
  onDelete: (trip: TripResponse) => void;
};

const STATUS_CONFIG: Record<
  TripStatus,
  { label: string; badgeClass: string }
> = {
  scheduled: {
    label: "Scheduled",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  deleted: {
    label: "Deleted",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default function TripCard({
  trip,
  route,
  vehicle,
  onDelete,
}: TripCardProps) {
  const statusInfo = STATUS_CONFIG[trip.status] ?? {
    label: trip.status,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const routeName = route?.name ?? `Route #${trip.route_id.slice(0, 8)}`;
  const vehicleLabel = vehicle
    ? `${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`
    : `Vehicle #${trip.vehicle_id.slice(0, 8)}`;

  const timeDisplay = trip.departure_time.slice(0, 5);
  const isScheduled = trip.status === "scheduled";

  return (
    <article
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
      data-testid={`trip-card-${trip.id}`}
    >
      <div>
        {/* Header row: Route Name + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FieldIcon type="pin" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <Link
                to={route_paths.getTripDetailPath(trip.id)}
                className="block truncate text-base font-bold text-slate-950 hover:text-indigo-600 transition"
              >
                {routeName}
              </Link>
              <p className="truncate text-xs text-slate-500">{vehicleLabel}</p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.badgeClass}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Departure Details */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3.5 text-xs border border-slate-100">
          <div className="flex items-center gap-2 text-slate-700">
            <FieldIcon type="calendar" className="h-4 w-4 text-slate-400" />
            <span className="font-medium">{trip.departure_date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FieldIcon type="clock" className="h-4 w-4 text-slate-400" />
            <span className="font-medium">{timeDisplay}</span>
          </div>
          <div className="col-span-2 flex items-center justify-between border-t border-slate-200/60 pt-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <FieldIcon type="users" className="h-4 w-4 text-slate-400" />
              <span>Available Capacity</span>
            </div>
            <span className="font-semibold text-emerald-700">
              {trip.available_seats}{" "}
              {trip.available_seats === 1 ? "seat" : "seats"} left
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Link
          to={route_paths.getTripDetailPath(trip.id)}
          aria-label={`View details for trip ${routeName}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span>Details</span>
        </Link>
        {isScheduled ? (
          <Link
            to={route_paths.getTripEditPath(trip.id)}
            aria-label={`Edit trip ${routeName}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-label={`Edit trip ${routeName} (disabled)`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed opacity-60"
            title="Only scheduled trips can be edited"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => isScheduled && onDelete(trip)}
          disabled={!isScheduled}
          aria-label={`Delete trip ${routeName}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/50 px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-60"
          title={!isScheduled ? "Only scheduled trips can be deleted" : undefined}
        >
          <TrashIcon className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}
