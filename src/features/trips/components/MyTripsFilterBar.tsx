import FieldIcon from "@shared/ui/FieldIcon";
import type { TripVehicleOption } from "../types/trips.api.types";

export type TripStatusFilter = "scheduled" | "completed" | "cancelled" | "all";

export type MyTripsFilterBarProps = {
  activeStatus: TripStatusFilter;
  onStatusChange: (status: TripStatusFilter) => void;
  statusCounts: {
    scheduled: number;
    completed: number;
    cancelled: number;
    total: number;
  };
  selectedVehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
  vehicles: TripVehicleOption[];
};

const MyTripsFilterBar = ({
  activeStatus,
  onStatusChange,
  statusCounts,
  selectedVehicleId,
  onVehicleChange,
  vehicles,
}: MyTripsFilterBarProps) => {
  return (
    <section className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-border-subtle bg-surface-card p-3 shadow-xs md:flex-row md:items-center">
      {/* Segmented Status Tabs */}
      <div className="flex w-full items-center overflow-x-auto rounded-xl border border-border-subtle bg-surface-canvas p-1 md:w-auto">
        <button
          type="button"
          onClick={() => onStatusChange("scheduled")}
          className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all md:flex-none cursor-pointer ${
            activeStatus === "scheduled"
              ? "bg-surface-card text-primary shadow-xs"
              : "text-text-muted hover:bg-surface-card/60 hover:text-on-surface"
          }`}
        >
          <span>Scheduled (Upcoming)</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
              activeStatus === "scheduled"
                ? "border border-surface-mint-border bg-surface-mint text-primary"
                : "bg-surface-container text-text-muted"
            }`}
          >
            {statusCounts.scheduled}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("completed")}
          className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all md:flex-none cursor-pointer ${
            activeStatus === "completed"
              ? "bg-surface-card text-primary shadow-xs"
              : "text-text-muted hover:bg-surface-card/60 hover:text-on-surface"
          }`}
        >
          <span>Completed Trips</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
              activeStatus === "completed"
                ? "border border-surface-mint-border bg-surface-mint text-primary"
                : "bg-surface-container text-text-muted"
            }`}
          >
            {statusCounts.completed}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("cancelled")}
          className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all md:flex-none cursor-pointer ${
            activeStatus === "cancelled"
              ? "bg-surface-card text-primary shadow-xs"
              : "text-text-muted hover:bg-surface-card/60 hover:text-on-surface"
          }`}
        >
          <span>Cancelled</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
              activeStatus === "cancelled"
                ? "border border-surface-mint-border bg-surface-mint text-primary"
                : "bg-surface-container text-text-muted"
            }`}
          >
            {statusCounts.cancelled}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onStatusChange("all")}
          className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all md:flex-none cursor-pointer ${
            activeStatus === "all"
              ? "bg-surface-card text-primary shadow-xs"
              : "text-text-muted hover:bg-surface-card/60 hover:text-on-surface"
          }`}
        >
          <span>All</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
              activeStatus === "all"
                ? "border border-surface-mint-border bg-surface-mint text-primary"
                : "bg-surface-container text-text-muted"
            }`}
          >
            {statusCounts.total}
          </span>
        </button>
      </div>

      {/* Secondary Filters: Vehicle Selector & Date Display */}
      <div className="flex w-full flex-wrap items-center gap-2.5 justify-end md:w-auto">
        {/* Vehicle Filter */}
        <div className="relative flex-1 md:w-56">
          <select
            value={selectedVehicleId}
            onChange={(e) => onVehicleChange(e.target.value)}
            aria-label="Filter by vehicle"
            className="h-9.5 w-full cursor-pointer appearance-none rounded-xl border border-border-subtle bg-surface-canvas pl-3 pr-8 text-xs font-medium text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Vehicles ({vehicles.length})</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} · {v.license_plate}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-muted">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Date Range Badge / Indicator */}
        <div className="flex h-9.5 items-center gap-2 rounded-xl border border-border-subtle bg-surface-canvas px-3 text-xs font-medium text-text-muted">
          <FieldIcon type="calendar" className="h-4 w-4 text-primary" />
          <span>Active Period</span>
        </div>
      </div>
    </section>
  );
};

export default MyTripsFilterBar;
