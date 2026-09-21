import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { bookingsApi } from "@features/bookings/api/bookings.api";
import { bookingKeys } from "@features/bookings/hooks/bookingKeys";
import type { BookingResponse } from "@features/bookings/types/bookings.api.types";
import { tripKeys } from "../hooks/tripKeys";
import type { TripResponse } from "../types/trips.api.types";

export interface BookRideConfirmationModalProps {
  trip: TripResponse;
  sourceName?: string;
  destinationName?: string;
  seatsRequested?: number;
  onClose: () => void;
  onSuccess?: (booking: BookingResponse) => void;
}

export default function BookRideConfirmationModal({
  trip,
  sourceName,
  destinationName,
  seatsRequested = 1,
  onClose,
  onSuccess,
}: BookRideConfirmationModalProps) {
  const queryClient = useQueryClient();
  const [seats, setSeats] = useState(Math.max(1, seatsRequested));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingResponse | null>(null);

  const routeStops = useMemo(() => {
    const stops = trip.route?.route_stops ?? [];
    return [...stops].sort((a, b) => a.sequence - b.sequence);
  }, [trip]);

  const defaultPickupStop = useMemo(() => {
    if (!routeStops.length) return null;
    if (sourceName) {
      const match = routeStops.find(
        (s) =>
          s.location?.name.toLowerCase() === sourceName.toLowerCase() ||
          s.location_id === sourceName ||
          s.id === sourceName,
      );
      if (match) return match;
    }
    return routeStops[0];
  }, [routeStops, sourceName]);

  const defaultDropoffStop = useMemo(() => {
    if (!routeStops.length) return null;
    if (destinationName) {
      const match = routeStops.find(
        (s) =>
          s.location?.name.toLowerCase() === destinationName.toLowerCase() ||
          s.location_id === destinationName ||
          s.id === destinationName,
      );
      if (match) return match;
    }
    return routeStops[routeStops.length - 1];
  }, [routeStops, destinationName]);

  const [pickupStopId, setPickupStopId] = useState(
    defaultPickupStop?.id ?? (routeStops[0]?.id || ""),
  );
  const [dropoffStopId, setDropoffStopId] = useState(
    defaultDropoffStop?.id ??
      (routeStops[routeStops.length - 1]?.id || ""),
  );

  const isSoldOut = trip.available_seats <= 0;
  const isWaitlist = trip.available_seats < seats;

  const displayRoute =
    trip.route?.name ??
    (sourceName && destinationName
      ? `${sourceName} → ${destinationName}`
      : `Trip #${trip.id.slice(0, 8)}`);

  const departureTimeFormatted =
    trip.departure_time.length > 5
      ? trip.departure_time.slice(0, 5)
      : trip.departure_time;

  const bookMutation = useMutation({
    mutationFn: async () => {
      const pickupId = pickupStopId || routeStops[0]?.id || trip.id;
      const dropoffId =
        dropoffStopId ||
        routeStops[routeStops.length - 1]?.id ||
        trip.id;

      return bookingsApi.create({
        trip_id: trip.id,
        pickup_stop_id: pickupId,
        dropoff_stop_id: dropoffId,
        seats_booked: seats,
      });
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      queryClient.invalidateQueries({ queryKey: tripKeys.detail(trip.id) });
      queryClient.invalidateQueries({ queryKey: tripKeys.passengers(trip.id) });
      setConfirmedBooking(booking);
      onSuccess?.(booking);
    },
    onError: (err) => {
      setErrorMessage(toApiError(err).message);
    },
  });

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    bookMutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-ride-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {confirmedBooking ? (
          <div className="text-center">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${
                confirmedBooking.status === "confirmed"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <span className="text-3xl font-bold">
                {confirmedBooking.status === "confirmed" ? "✓" : "⏳"}
              </span>
            </div>

            <p
              className={`mt-5 text-xs font-bold tracking-widest uppercase ${
                confirmedBooking.status === "confirmed"
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {confirmedBooking.status === "confirmed"
                ? "BOOKING CONFIRMED"
                : "WAITLIST CONFIRMED"}
            </p>

            <h2
              id="book-ride-title"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
            >
              {confirmedBooking.status === "confirmed"
                ? "Ride Confirmed!"
                : "Added to Waiting List!"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {confirmedBooking.status === "confirmed"
                ? `You have successfully reserved ${confirmedBooking.seats_booked} ${
                    confirmedBooking.seats_booked === 1 ? "seat" : "seats"
                  } for "${displayRoute}".`
                : `This trip is currently full. Your booking for ${confirmedBooking.seats_booked} ${
                    confirmedBooking.seats_booked === 1 ? "seat" : "seats"
                  } is pending on the waitlist. You will be confirmed if a seat opens up.`}
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <Link
                to={route_paths.bookings}
                onClick={onClose}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none"
              >
                View My Bookings
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <div
                className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${
                  isSoldOut
                    ? "bg-amber-100 text-amber-700"
                    : "bg-indigo-100 text-indigo-600"
                }`}
              >
                <span className="text-2xl font-bold">
                  {isSoldOut ? "⏳" : "🚗"}
                </span>
              </div>

              <p
                className={`mt-4 text-xs font-bold tracking-widest uppercase ${
                  isSoldOut ? "text-amber-600" : "text-indigo-600"
                }`}
              >
                {isSoldOut ? "WAITLIST RESERVATION" : "CONFIRM RIDE BOOKING"}
              </p>

              <h2
                id="book-ride-title"
                className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950"
              >
                Book this Ride?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Please verify your journey details before confirming.
              </p>
            </div>

            {/* Journey Details Summary */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm border border-slate-100 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Route</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                  {displayRoute}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Departure</span>
                <span className="font-semibold text-slate-900">
                  {trip.departure_date} at {departureTimeFormatted}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Availability</span>
                <span
                  className={`font-semibold ${
                    trip.available_seats > 0
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  {trip.available_seats > 0
                    ? `${trip.available_seats} ${
                        trip.available_seats === 1 ? "seat" : "seats"
                      } available`
                    : "Sold out (Waitlist available)"}
                </span>
              </div>
            </div>

            {/* Route Stops Selection if available */}
            {routeStops.length >= 2 && (
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label
                    htmlFor="pickup-stop-select"
                    className="block font-semibold text-slate-700 mb-1"
                  >
                    Pickup Stop
                  </label>
                  <select
                    id="pickup-stop-select"
                    value={pickupStopId}
                    onChange={(e) => setPickupStopId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    {routeStops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.location?.name ?? `Stop #${stop.sequence + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="dropoff-stop-select"
                    className="block font-semibold text-slate-700 mb-1"
                  >
                    Drop-off Stop
                  </label>
                  <select
                    id="dropoff-stop-select"
                    value={dropoffStopId}
                    onChange={(e) => setDropoffStopId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    {routeStops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.location?.name ?? `Stop #${stop.sequence + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Seats count selector */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-3 bg-white">
              <span className="text-xs font-semibold text-slate-700">
                Number of seats
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease seats"
                  onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  disabled={seats <= 1}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-900">
                  {seats}
                </span>
                <button
                  type="button"
                  aria-label="Increase seats"
                  onClick={() => setSeats((s) => s + 1)}
                  disabled={seats >= 8}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Waitlist Callout Notice */}
            {isWaitlist && (
              <div
                role="status"
                className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900"
              >
                <span className="font-bold text-amber-700">ℹ</span>
                <p className="leading-relaxed">
                  <strong>Waitlist:</strong> This trip has fewer seats available
                  than requested. You will join the waiting list with a pending
                  reservation.
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
              >
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={bookMutation.isPending}
                className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {bookMutation.isPending
                  ? "Booking..."
                  : isWaitlist
                    ? "Confirm Booking (Join Waitlist)"
                    : "Confirm Booking"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={bookMutation.isPending}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
