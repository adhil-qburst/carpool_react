import TrashIcon from "@shared/ui/TrashIcon";
import type { BookingResponse } from "../types/bookings.api.types";

export type CancelBookingModalProps = {
  booking: BookingResponse;
  isCancelling?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const CancelBookingModal = ({
  booking,
  isCancelling = false,
  onConfirm,
  onClose,
}: CancelBookingModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-booking-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-100 text-rose-600">
          <TrashIcon className="h-8 w-8" />
        </div>
        <p className="mt-5 text-xs font-bold tracking-widest text-rose-600 uppercase">
          CANCEL RESERVATION
        </p>
        <h2
          id="cancel-booking-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Cancel this booking?
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Are you sure you want to cancel your reservation for{" "}
          <span className="font-semibold text-slate-900">
            Booking #{booking.id.slice(0, 8)}
          </span>{" "}
          ({booking.seats_booked} {booking.seats_booked === 1 ? "seat" : "seats"}
          )? The driver will be notified.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isCancelling}
            className="w-full rounded-xl bg-rose-600 px-4 py-3 min-h-11 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isCancelling ? "Cancelling..." : "Yes, cancel booking"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 min-h-11 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            Keep booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
