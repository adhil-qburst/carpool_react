import { useState } from "react";
import FieldIcon from "@shared/ui/FieldIcon";
import type { TripResponse } from "../types/trips.api.types";

export interface BookRideConfirmationModalProps {
  trip: TripResponse;
  sourceName?: string;
  destinationName?: string;
  seatsRequested?: number;
  onClose: () => void;
}

export default function BookRideConfirmationModal({
  trip,
  sourceName,
  destinationName,
  seatsRequested = 1,
  onClose,
}: BookRideConfirmationModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const routeLabel =
    trip.route?.name ??
    (sourceName && destinationName
      ? `${sourceName} → ${destinationName}`
      : `Trip #${trip.id.slice(0, 8)}`);

  const departureTimeFormatted =
    trip.departure_time.length > 5
      ? trip.departure_time.slice(0, 5)
      : trip.departure_time;

  function handleConfirm() {
    setIsConfirmed(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-ride-modal-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        {!isConfirmed ? (
          <>
            <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FieldIcon type="car" className="h-8 w-8" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-600" />
            </div>

            <p className="mt-5 text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Confirm Ride
            </p>
            <h2
              id="book-ride-modal-title"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
            >
              Book this Ride?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please review the trip schedule and seat details before confirming
              your booking.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-sm space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Route</span>
                <span className="font-semibold text-slate-900 truncate max-w-44">
                  {routeLabel}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Departure</span>
                <span className="font-semibold text-slate-900">
                  {trip.departure_date} at {departureTimeFormatted}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Seats to Book</span>
                <span className="font-semibold text-slate-900">
                  {seatsRequested} {seatsRequested === 1 ? "seat" : "seats"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Available Seats</span>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {trip.available_seats} remaining
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-3xl text-emerald-600">
              ✓
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <p className="mt-5 text-xs font-bold tracking-widest text-emerald-600 uppercase">
              Success
            </p>
            <h2
              id="book-ride-modal-title"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
            >
              Ride Booked!
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your ride reservation has been placed successfully. You will be
              notified once your driver confirms the pickup.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-sm space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Trip</span>
                <span className="font-semibold text-slate-900 truncate max-w-44">
                  {routeLabel}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Time</span>
                <span className="font-semibold text-slate-900">
                  {trip.departure_date} • {departureTimeFormatted}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Seats Reserved</span>
                <span className="font-semibold text-indigo-600">
                  {seatsRequested} {seatsRequested === 1 ? "seat" : "seats"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
