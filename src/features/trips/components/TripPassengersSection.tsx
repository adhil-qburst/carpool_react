import { useState, useMemo } from "react";
import FieldIcon from "@shared/ui/FieldIcon";
import { toApiError } from "@core/api/apiError";
import { useTripPassengersQuery } from "../hooks/useTripPassengersQuery";
import type { TripPassengerStatus } from "../types/trips.api.types";

export interface TripPassengersSectionProps {
  tripId: string;
  className?: string;
}

type FilterStatus = "all" | TripPassengerStatus;

const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

function getStatusBadgeClass(status: TripPassengerStatus): string {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "expired":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "PA";
}

function formatBookedAt(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function TripPassengersSection({
  tripId,
  className = "",
}: TripPassengersSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("all");

  const {
    data: passengers = [],
    isLoading,
    isError,
    error,
  } = useTripPassengersQuery(tripId);

  const confirmedSeats = useMemo(() => {
    return passengers
      .filter((p) => p.status === "confirmed")
      .reduce((sum, p) => sum + p.seats_booked, 0);
  }, [passengers]);

  const filteredPassengers = useMemo(() => {
    if (selectedFilter === "all") return passengers;
    return passengers.filter((p) => p.status === selectedFilter);
  }, [passengers, selectedFilter]);

  return (
    <div
      aria-label="Trip passengers"
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
            Passenger Manifest
          </span>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            Booked Passengers
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <FieldIcon type="users" className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {passengers.length}{" "}
              {passengers.length === 1 ? "passenger" : "passengers"}
            </span>
          </span>

          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {confirmedSeats} {confirmedSeats === 1 ? "seat" : "seats"} confirmed
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      {!isLoading && passengers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter passengers by status">
          {FILTER_OPTIONS.map((opt) => {
            const isSelected = selectedFilter === opt.value;
            const count =
              opt.value === "all"
                ? passengers.length
                : passengers.filter((p) => p.status === opt.value).length;

            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedFilter(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Content states */}
      {isLoading && (
        <div className="mt-4 space-y-3" aria-busy="true" aria-label="Loading passengers">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="h-24 animate-pulse rounded-xl bg-slate-50 border border-slate-100"
            />
          ))}
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800"
        >
          {toApiError(error).message || "Unable to load passenger list for this trip."}
        </div>
      )}

      {!isLoading && !isError && filteredPassengers.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-400">
            <FieldIcon type="users" className="h-5 w-5" />
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {selectedFilter === "all"
              ? "No passengers booked yet"
              : `No ${selectedFilter} passengers`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {selectedFilter === "all"
              ? "When riders reserve seats on this trip, they will appear in this manifest."
              : `There are currently no passengers with "${selectedFilter}" status.`}
          </p>
        </div>
      )}

      {!isLoading && !isError && filteredPassengers.length > 0 && (
        <div className="mt-4 space-y-3">
          {filteredPassengers.map((passenger) => {
            const riderName =
              passenger.rider_name || passenger.rider?.name || "Rider";
            const riderEmail =
              passenger.rider_email || passenger.rider?.email || "";
            const pickupName =
              passenger.pickup_stop?.location?.name ||
              `Stop #${passenger.pickup_stop?.sequence ?? 1}`;
            const dropoffName =
              passenger.dropoff_stop?.location?.name ||
              `Stop #${passenger.dropoff_stop?.sequence ?? 2}`;

            return (
              <div
                key={passenger.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50"
              >
                {/* Rider info */}
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-100 font-bold text-xs text-indigo-700"
                    aria-hidden="true"
                  >
                    {getInitials(riderName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {riderName}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${getStatusBadgeClass(
                          passenger.status,
                        )}`}
                      >
                        {passenger.status}
                      </span>
                    </div>
                    {riderEmail && (
                      <p className="text-xs text-slate-500">{riderEmail}</p>
                    )}
                  </div>
                </div>

                {/* Waypoints & Booking specs */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 sm:text-right">
                  <div>
                    <span className="text-slate-400">Route Segment:</span>
                    <p className="font-semibold text-slate-800">
                      {pickupName} <span className="text-indigo-600">→</span>{" "}
                      {dropoffName}
                    </p>
                  </div>

                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-slate-400">Seats:</span>
                    <p className="font-semibold text-slate-900">
                      {passenger.seats_booked}{" "}
                      {passenger.seats_booked === 1 ? "seat" : "seats"}
                    </p>
                  </div>

                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-slate-400">Booked:</span>
                    <p className="font-semibold text-slate-900">
                      {formatBookedAt(passenger.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
