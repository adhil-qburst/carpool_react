import { Link } from "react-router";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import FieldIcon from "@shared/ui/FieldIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";
import RouteIcon from "@shared/ui/RouteIcon";
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
    badgeClass: "bg-surface-mint text-primary border-surface-mint-border",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-surface-container text-text-muted border-border-subtle",
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

const TripCard = ({ trip, route, vehicle, onDelete }: TripCardProps) => {
  const statusInfo = STATUS_CONFIG[trip.status] ?? {
    label: trip.status,
    badgeClass: "bg-surface-container text-text-muted border-border-subtle",
  };

  const routeName = route?.name ?? `Route #${trip.route_id.slice(0, 8)}`;
  const vehicleLabel = vehicle
    ? `${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`
    : `Vehicle #${trip.vehicle_id.slice(0, 8)}`;

  const timeDisplay = trip.departure_time.slice(0, 5);
  const isScheduled = trip.status === "scheduled";
  const { month, day, weekday } = getCalendarParts(trip.departure_date);

  const totalSeats = vehicle?.total_seats ?? (trip.available_seats || 4);
  const availableSeats = trip.available_seats;
  const bookedSeats = Math.max(0, totalSeats - availableSeats);
  const occupancyPercent =
    totalSeats > 0 ? Math.min(100, Math.round((bookedSeats / totalSeats) * 100)) : 0;

  const stops = route?.route_stops ?? [];
  const pickupLocation = stops[0]?.location?.name || stops[0]?.location?.city;
  const intermediateStopsCount = Math.max(0, stops.length - 2);

  return (
    <article
      data-testid={`trip-card-${trip.id}`}
      className="group flex flex-col justify-between gap-5 rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-xs transition-all duration-150 hover:border-slate-300 hover:shadow-sm lg:flex-row lg:items-center"
    >
      {/* Left: Date badge & Route metadata */}
      <div className="flex items-start gap-4">
        {/* Visual Calendar Badge */}
        <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-surface-mint-border bg-surface-mint">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {month}
          </span>
          <span className="text-[20px] font-bold leading-none text-primary">
            {day}
          </span>
          <span className="mt-0.5 text-[10px] text-text-muted">
            {weekday}
          </span>
        </div>

        {/* Route Details */}
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold text-on-surface">
              {routeName}
            </h3>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${statusInfo.badgeClass}`}
            >
              {statusInfo.label}
            </span>
            <span className="rounded-md border border-border-subtle bg-surface-container px-1.5 py-0.5 font-mono text-[11px] text-text-muted">
              #TRP-{trip.id.slice(0, 4).toUpperCase()}
            </span>
          </div>

          {/* Time & Departure details */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted sm:text-sm">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <FieldIcon type="clock" className="h-4 w-4 text-primary" />
              <span>{timeDisplay}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FieldIcon type="calendar" className="h-4 w-4 text-slate-400" />
              <span>{trip.departure_date}</span>
            </span>
            {pickupLocation && (
              <>
                <span>•</span>
                <span className="truncate">Pickup: {pickupLocation}</span>
              </>
            )}
          </div>

          {/* Stop points summary & vehicle text */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-text-muted">
            <span className="truncate">{vehicleLabel}</span>
            {intermediateStopsCount > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RouteIcon className="h-3.5 w-3.5 text-primary" />
                  <span>{intermediateStopsCount} passenger stop points on route</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center: Vehicle & Occupancy bar */}
      <div className="flex flex-wrap items-center gap-6 border-border-subtle py-2 lg:border-r lg:border-l lg:px-6 lg:py-0">
        <div className="w-36 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">
              {availableSeats} available
            </span>
            <span className="text-text-muted">of {totalSeats} seats</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-text-muted">
            <span className="font-medium text-emerald-700">
              {trip.available_seats}{" "}
              {trip.available_seats === 1 ? "seat" : "seats"} left
            </span>
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 justify-end">
        {isScheduled ? (
          <Link
            to={route_paths.getTripEditPath(trip.id)}
            aria-label={`Edit trip ${routeName}`}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border-subtle bg-surface-card px-3.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-surface-canvas hover:text-primary active:scale-95"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-label={`Edit trip ${routeName} (disabled)`}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border-subtle bg-surface-container px-3.5 text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed"
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
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/50 px-3.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          title={!isScheduled ? "Only scheduled trips can be deleted" : undefined}
        >
          <TrashIcon className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>

        <Link
          to={route_paths.getTripEditPath(trip.id)}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-hover active:scale-95"
        >
          <span>View Trip</span>
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
};

export default TripCard;
