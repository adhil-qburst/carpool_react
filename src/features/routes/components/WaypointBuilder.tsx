import { useState } from "react";
import { Link } from "react-router";
import RotateCcwIcon from "@shared/ui/RotateCcwIcon";
import CogIcon from "@shared/ui/CogIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import FieldIcon from "@shared/ui/FieldIcon";
import LocationCombobox from "@features/locations/components/LocationCombobox";
import type { SelectedLocation } from "@features/locations/components/LocationCombobox";
import { useLocationsQuery } from "@features/locations/hooks/useLocationsQuery";
import { useUpdateRouteMutation } from "../hooks/useUpdateRouteMutation";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import WaypointItem from "./WaypointItem";
import type { WaypointData } from "./WaypointItem";
import type { RouteResponse } from "../types/routes.api.types";

export type WaypointBuilderProps = {
  selectedRoute: RouteResponse | null;
  onSaveSuccess: (msg: string) => void;
  onSaveError: (err: string) => void;
};

const getInitialStops = (
  route: RouteResponse | null,
  locationsList: { id: string; name: string; city: string }[] = [],
): WaypointData[] => {
  if (!route) return [];
  const sorted = [...(route.route_stops ?? [])].sort(
    (a, b) => a.sequence - b.sequence,
  );
  return sorted.map((st, idx) => {
    let locName = st.location?.name;
    let locCity = st.location?.city;
    if (!locName) {
      const found = locationsList.find((l) => l.id === st.location_id);
      if (found) {
        locName = found.name;
        locCity = found.city;
      }
    }
    return {
      clientId: st.id || `stop-${st.location_id}-${idx}`,
      locationId: st.location_id,
      name: locName || st.location_id,
      city: locCity || "",
      sequence: idx,
    };
  });
};

const WaypointBuilder = ({
  selectedRoute,
  onSaveSuccess,
  onSaveError,
}: WaypointBuilderProps) => {
  const { data: locationsData } = useLocationsQuery({
    limit: 100,
    status: "active",
  });
  const updateMutation = useUpdateRouteMutation();

  const [stops, setStops] = useState<WaypointData[]>(() =>
    getInitialStops(selectedRoute, locationsData?.items),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [addingStop, setAddingStop] = useState(false);
  const [selectedNewLocation, setSelectedNewLocation] =
    useState<SelectedLocation | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (!selectedRoute) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-border-subtle bg-surface-card p-12 text-center shadow-xs">
        <FieldIcon type="pin" className="h-10 w-10 text-text-muted" />
        <h3 className="mt-4 text-base font-semibold text-on-surface">
          Select a Route to Edit
        </h3>
        <p className="mt-1 max-w-sm text-xs text-text-muted">
          Click any corridor on the left to reorder stops or configure waypoints.
        </p>
      </div>
    );
  }

  const handleReset = () => {
    if (!selectedRoute) return;
    const sorted = [...(selectedRoute.route_stops ?? [])].sort(
      (a, b) => a.sequence - b.sequence,
    );
    const initialStops: WaypointData[] = sorted.map((st, idx) => ({
      clientId: st.id || `stop-${st.location_id}-${idx}`,
      locationId: st.location_id,
      name: st.location?.name || st.location_id,
      city: st.location?.city || "",
      sequence: idx,
    }));
    setStops(initialStops);
    setIsDirty(false);
    setAddingStop(false);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const nextStops = [...stops];
    const temp = nextStops[index];
    nextStops[index] = nextStops[targetIndex];
    nextStops[targetIndex] = temp;
    setStops(nextStops);
    setIsDirty(true);
  };

  const handleRemove = (index: number) => {
    setStops(stops.filter((_, idx) => idx !== index));
    setIsDirty(true);
  };

  const handleAddStopSubmit = () => {
    if (!selectedNewLocation) return;
    const newStop: WaypointData = {
      clientId: `stop-new-${Date.now()}`,
      locationId: selectedNewLocation.id,
      name: selectedNewLocation.name,
      city: selectedNewLocation.city,
      sequence: stops.length,
    };

    // Insert before terminal stop if at least 2 stops exist, otherwise append
    if (stops.length >= 2) {
      const next = [...stops];
      next.splice(next.length - 1, 0, newStop);
      setStops(next);
    } else {
      setStops([...stops, newStop]);
    }

    setSelectedNewLocation(null);
    setAddingStop(false);
    setIsDirty(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return;
    const next = [...stops];
    const draggedItem = next[draggedIndex];
    next.splice(draggedIndex, 1);
    next.splice(idx, 0, draggedItem);
    setDraggedIndex(idx);
    setStops(next);
    setIsDirty(true);
  };

  const handleSaveChanges = () => {
    if (stops.length < 2) {
      onSaveError("A route requires at least an origin and a destination stop.");
      return;
    }

    const sourceId = stops[0].locationId;
    const destId = stops[stops.length - 1].locationId;
    const intermediate = stops.slice(1, -1);
    const stopsPayload =
      intermediate.length > 0
        ? intermediate.map((s, idx) => ({
            stop_id: s.locationId,
            sequence: idx + 1,
          }))
        : null;

    updateMutation.mutate(
      {
        routeId: selectedRoute.id,
        payload: {
          name: selectedRoute.name,
          source_id: sourceId,
          dest_id: destId,
          stops: stopsPayload,
        },
        method: "patch",
      },
      {
        onSuccess: () => {
          setIsDirty(false);
          onSaveSuccess(`"${selectedRoute.name}" stops updated successfully.`);
        },
        onError: (err) => {
          const apiErr = toApiError(err);
          onSaveError(apiErr.message);
        },
      },
    );
  };

  const disabledLocIds = stops.map((s) => s.locationId);

  return (
    <div className="rounded-[18px] border border-border-subtle bg-surface-card p-4 sm:p-6 shadow-xs">
      {/* Top Header of Waypoint Builder */}
      <div className="flex flex-col gap-3 pb-5 border-b border-border-subtle sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="rounded bg-surface-mint px-2 py-0.5 text-xs font-bold text-primary">
            EDITING CORRIDOR
          </span>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-on-surface sm:text-xl">
            {selectedRoute.name} Corridors
          </h2>
          <p className="text-xs text-text-muted">
            Reorder sequence numbers to recalculate optimal rider pickup intervals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty}
            title="Reset order"
            aria-label="Reset waypoint order"
            className="rounded-xl border border-border-subtle p-2 text-text-muted transition-colors hover:bg-surface-canvas hover:text-on-surface disabled:opacity-40 cursor-pointer"
          >
            <RotateCcwIcon className="h-4 w-4" />
          </button>
          <Link
            to={route_paths.getRouteEditPath(selectedRoute.id)}
            state={{ route: selectedRoute }}
            title="Route settings"
            aria-label="Route settings"
            className="rounded-xl border border-border-subtle p-2 text-text-muted transition-colors hover:bg-surface-canvas hover:text-on-surface"
          >
            <CogIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Timeline Waypoints List with Vertical Connector */}
      <div className="relative py-5 space-y-3">
        {stops.length > 1 && (
          <div className="absolute left-[38px] top-9 bottom-9 w-0.5 bg-slate-200 z-0 pointer-events-none" />
        )}

        {stops.map((stop, idx) => (
          <WaypointItem
            key={stop.clientId}
            stop={stop}
            index={idx}
            totalCount={stops.length}
            isOrigin={idx === 0}
            isTerminal={idx === stops.length - 1}
            onMoveUp={() => handleMove(idx, "up")}
            onMoveDown={() => handleMove(idx, "down")}
            onEdit={() => setAddingStop(true)}
            onRemove={() => handleRemove(idx)}
            onDragStart={() => setDraggedIndex(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={() => setDraggedIndex(null)}
            isDragging={draggedIndex === idx}
          />
        ))}

        {/* Add Waypoint Inline Picker */}
        {addingStop ? (
          <div className="rounded-xl border border-primary/30 bg-surface-canvas p-4 space-y-3">
            <LocationCombobox
              id="add-waypoint-combobox"
              label="Select Waypoint Location"
              placeholder="Search Kerala stations, hubs..."
              selectedLocation={selectedNewLocation}
              onSelect={setSelectedNewLocation}
              onClear={() => setSelectedNewLocation(null)}
              disabledLocationIds={disabledLocIds}
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAddingStop(false);
                  setSelectedNewLocation(null);
                }}
                className="rounded-lg border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-on-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddStopSubmit}
                disabled={!selectedNewLocation}
                className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
              >
                Add Waypoint
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingStop(true)}
            className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle py-3 text-xs sm:text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-surface-mint/40 cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            <span>+ Add Waypoint Stop</span>
          </button>
        )}
      </div>

      {/* Bottom Save & Cancel Controls */}
      <div className="mt-4 flex flex-col gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span
            className={`h-2 w-2 rounded-full ${isDirty ? "bg-amber-500 animate-pulse" : "bg-primary"}`}
          />
          <span>
            {isDirty
              ? "Unsaved sequence adjustments exist"
              : "All sequence adjustments saved"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty}
            aria-label="Discard adjustments"
            className="rounded-xl border border-border-subtle px-4 py-2 text-xs sm:text-sm font-semibold text-on-surface transition-colors hover:bg-surface-canvas disabled:opacity-40 cursor-pointer min-h-[40px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={!isDirty || updateMutation.isPending}
            className="rounded-xl bg-primary px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary-hover disabled:opacity-50 cursor-pointer min-h-[40px]"
          >
            {updateMutation.isPending ? "Saving..." : "Save Route Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaypointBuilder;
