import FieldIcon from "@shared/ui/FieldIcon";
import type { TripResponse } from "../types/trips.api.types";

export interface AvailableTripCardProps {
  trip: TripResponse;
  sourceName?: string;
  destinationName?: string;
  seatsNeeded?: number;
  onBook: (trip: TripResponse) => void;
}

export default function AvailableTripCard({
  trip,
  sourceName,
  destinationName,
  seatsNeeded = 1,
  onBook,
}: AvailableTripCardProps) {
  const routeName =
    trip.route?.name ??
    (sourceName && destinationName
      ? `${sourceName} → ${destinationName}`
      : `Trip #${trip.id.slice(0, 8)}`);

  const departureTimeFormatted =
    trip.departure_time.length > 5
      ? trip.departure_time.slice(0, 5)
      : trip.departure_time;

  const isScheduled = trip.status === "scheduled";

  return (
    <article
      className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
      data-testid={`available-trip-card-${trip.id}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FieldIcon type="pin" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-950">
                {routeName}
              </h3>
              <p className="text-xs text-slate-500">
                Trip ID: <span className="font-mono">{trip.id.slice(0, 8)}</span>
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              trip.available_seats > 0
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {trip.available_seats > 0
              ? `${trip.available_seats} ${trip.available_seats === 1 ? "seat" : "seats"} left`
              : "Sold out"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-100">
          <div className="flex items-center gap-2">
            <FieldIcon type="calendar" className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="truncate font-medium text-slate-900">{trip.departure_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FieldIcon type="clock" className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="truncate font-medium text-slate-900">{departureTimeFormatted}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Status: <span className="font-semibold text-slate-800 capitalize">{trip.status}</span>
        </div>

        <button
          type="button"
          onClick={() => onBook(trip)}
          disabled={!isScheduled}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {trip.available_seats <= 0 ? "Join Waiting List" : "Book Ride"}
        </button>
      </div>
    </article>
  );
}
