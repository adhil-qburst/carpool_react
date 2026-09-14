import type { TripResponse } from "../types/trips.api.types";

export type TripSuccessModalProps = {
  trip: TripResponse;
  routeName: string;
  vehicleLabel: string;
  onClose: () => void;
  onCreateAnother?: () => void;
};

export default function TripSuccessModal({
  trip,
  routeName,
  vehicleLabel,
  onClose,
  onCreateAnother,
}: TripSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-success-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-3xl text-emerald-600">
          ✓
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-500" />
        </div>
        <p className="mt-5 text-xs font-bold tracking-widest text-emerald-600 uppercase">
          Trip Published
        </p>
        <h2
          id="trip-success-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Trip Scheduled!
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your carpool ride has been successfully published and is ready for
          passengers.
        </p>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-left text-sm space-y-2 border border-slate-100">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Route</span>
            <span className="font-semibold text-slate-900 truncate max-w-[160px]">
              {routeName}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Vehicle</span>
            <span className="font-semibold text-slate-900 truncate max-w-[160px]">
              {vehicleLabel}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Departure</span>
            <span className="font-semibold text-slate-900">
              {trip.departure_date} at {trip.departure_time.slice(0, 5)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Available Seats</span>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {trip.available_seats} passenger {trip.available_seats === 1 ? "seat" : "seats"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            Back to Home
          </button>
          {onCreateAnother && (
            <button
              type="button"
              onClick={onCreateAnother}
              className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none"
            >
              Schedule Another Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
