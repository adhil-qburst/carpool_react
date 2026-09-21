import type { TripResponse } from "../types/trips.api.types";

export interface TripAuditCardProps {
  trip: TripResponse;
  className?: string;
}

export default function TripAuditCard({
  trip,
  className = "",
}: TripAuditCardProps) {
  return (
    <div
      aria-label="Trip audit details"
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Trip Details & Audit
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 text-xs text-slate-600">
        <div>
          <span className="text-slate-400">Trip Identifier:</span>{" "}
          <span className="font-mono text-slate-900">{trip.id}</span>
        </div>
        <div>
          <span className="text-slate-400">Driver ID:</span>{" "}
          <span className="font-mono text-slate-900">{trip.driver_id}</span>
        </div>
        <div>
          <span className="text-slate-400">Created At:</span>{" "}
          <span className="text-slate-900">
            {new Date(trip.created_at).toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Last Updated:</span>{" "}
          <span className="text-slate-900">
            {new Date(trip.updated_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
