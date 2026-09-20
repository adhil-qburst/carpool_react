import { useState } from "react";
import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";
import CopyIcon from "@shared/ui/CopyIcon";
import CheckCircleIcon from "@shared/ui/CheckCircleIcon";
import MoreVerticalIcon from "@shared/ui/MoreVerticalIcon";
import { route_paths } from "@core/router/route_paths";
import type { RouteResponse } from "../types/routes.api.types";

export type RouteCardProps = {
  route: RouteResponse;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: (route: RouteResponse) => void;
  onDelete: (route: RouteResponse) => void;
};

const RouteCard = ({
  route,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
}: RouteCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const sortedStops = [...(route.route_stops ?? [])].sort(
    (a, b) => a.sequence - b.sequence,
  );
  const stopCount = sortedStops.length;

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-[18px] bg-surface-card p-5 transition-all ${
        isSelected
          ? "border-2 border-primary shadow-[0_10px_25px_-5px_rgba(14,118,110,0.12)]"
          : "border border-border-subtle shadow-xs hover:border-primary/40 hover:shadow-sm"
      }`}
    >
      {/* Top Header: Active Tag & More Actions Menu */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-mint-border bg-surface-mint px-2.5 py-0.5 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            active
          </span>
        </div>

        {/* Quick Action Icons & 3-dots Menu */}
        <div
          className="flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Link
            to={route_paths.getRouteEditPath(route.id)}
            state={{ route }}
            aria-label={`Edit ${route.name}`}
            title="Edit route settings"
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-container-low hover:text-primary"
          >
            <PencilIcon className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(route)}
            aria-label={`Delete ${route.name}`}
            title="Delete route"
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label="Route menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface cursor-pointer"
            >
              <MoreVerticalIcon className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-border-subtle bg-surface-card p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(route);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low cursor-pointer"
                >
                  <CopyIcon className="h-3.5 w-3.5 text-text-muted" />
                  <span>Duplicate Route</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Route Name & Verification */}
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-base font-bold text-on-surface sm:text-lg truncate">
            {route.name}
          </h3>
          {isSelected && (
            <CheckCircleIcon className="h-5 w-5 text-primary shrink-0" />
          )}
        </div>
        <span className="inline-flex items-center rounded-lg bg-surface-mint px-2 py-0.5 text-xs font-semibold text-primary shrink-0">
          {stopCount} {stopCount === 1 ? "stop" : "stops"}
        </span>
      </div>

      <p className="mb-3 text-xs text-text-muted">
        Assigned to active commute corridor
      </p>

      {/* Ordered Waypoint summary list */}
      {sortedStops.length > 0 ? (
        <div className="mb-4 rounded-xl border border-border-subtle bg-surface-canvas p-3 space-y-2">
          {sortedStops.map((stop, index) => {
            const isStart = index === 0;
            const isEnd = index === sortedStops.length - 1;
            const label = isStart
              ? "Start"
              : isEnd
                ? "End"
                : `Stop ${index + 1}`;
            const locationDisplay = stop.location
              ? `${stop.location.name}${stop.location.city ? `, ${stop.location.city}` : ""}`
              : stop.location_id;

            return (
              <div
                key={stop.id}
                className="flex items-center gap-2 text-xs text-on-surface"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    isStart || isEnd
                      ? "bg-primary text-white"
                      : "bg-border-subtle text-text-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="font-semibold text-on-surface">{label}</span>
                <span className="text-text-muted truncate">
                  ({locationDisplay})
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-4 text-xs text-text-muted italic">
          No stops configured yet
        </div>
      )}

      {/* Card Action Bar */}
      <div
        className="flex items-center justify-between border-t border-border-subtle pt-3 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex items-center gap-1 font-medium text-text-muted">
          <FieldIcon type="pin" className="h-3.5 w-3.5 text-primary" />
          {stopCount} {stopCount === 1 ? "stop" : "stops"} total
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDuplicate(route)}
            className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface cursor-pointer"
          >
            <CopyIcon className="h-3.5 w-3.5" />
            <span>Duplicate</span>
          </button>

          {isSelected ? (
            <button
              type="button"
              className="inline-flex min-h-[36px] items-center rounded-lg border border-surface-mint-border bg-surface-mint px-3 py-1 text-xs font-semibold text-primary hover:bg-[#D1FAE5] transition-colors cursor-pointer"
            >
              Editing stops
            </button>
          ) : (
            <button
              type="button"
              onClick={onSelect}
              className="inline-flex min-h-[36px] items-center rounded-lg border border-border-subtle bg-surface-canvas px-3 py-1 text-xs font-medium text-on-surface transition-colors hover:border-primary hover:bg-surface-mint hover:text-primary cursor-pointer"
            >
              Edit Stops
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
