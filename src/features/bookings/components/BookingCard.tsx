import FieldIcon from "@shared/ui/FieldIcon";
import TrashIcon from "@shared/ui/TrashIcon";
import type { BookingResponse } from "../types/bookings.api.types";
import type { BookingStatus } from "../types/bookings.type";

export type BookingCardProps = {
  booking: BookingResponse;
  onCancel?: (booking: BookingResponse) => void;
};

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; badgeClass: string }
> = {
  confirmed: {
    label: "Confirmed",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
  expired: {
    label: "Expired",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
  const statusInfo = STATUS_CONFIG[booking.status] ?? {
    label: booking.status,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const isCancellable =
    booking.status === "pending" || booking.status === "confirmed";

  const formattedDate = booking.created_at
    ? new Date(booking.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <article
      className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
      data-testid={`booking-card-${booking.id}`}
    >
      <div>
        {/* Header row: Icon, Booking ID + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FieldIcon type="tag" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-950">
                Booking #{booking.id.slice(0, 8)}
              </h3>
              <p className="truncate text-xs text-slate-500">
                Trip #{booking.trip_id.slice(0, 8)}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusInfo.badgeClass}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Booking Details Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
          <div>
            <p className="text-slate-400">Seats Reserved</p>
            <p className="mt-1 font-semibold text-slate-900">
              {booking.seats_booked}{" "}
              {booking.seats_booked === 1 ? "seat" : "seats"}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Booked On</p>
            <p className="mt-1 font-semibold text-slate-900">{formattedDate}</p>
          </div>
        </div>

        {/* Stops info */}
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-medium text-slate-700">Pickup:</span>
            <span className="truncate font-mono text-slate-500">
              {booking.pickup_stop_id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
            <span className="font-medium text-slate-700">Drop-off:</span>
            <span className="truncate font-mono text-slate-500">
              {booking.dropoff_stop_id}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isCancellable && onCancel && (
        <div className="mt-5 flex items-center justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => onCancel(booking)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200 cursor-pointer"
            aria-label={`Cancel booking ${booking.id.slice(0, 8)}`}
          >
            <TrashIcon className="h-4 w-4" />
            Cancel reservation
          </button>
        </div>
      )}
    </article>
  );
};

export default BookingCard;
