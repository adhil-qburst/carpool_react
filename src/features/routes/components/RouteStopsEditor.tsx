import { useState } from "react";
import type { DragEvent } from "react";
import LocationCombobox from "@features/locations/components/LocationCombobox";
import type { SelectedLocation } from "@features/locations/components/LocationCombobox";
import GripVerticalIcon from "@shared/ui/GripVerticalIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import TrashIcon from "@shared/ui/TrashIcon";

export interface RouteStopDraft {
  clientId: string;
  locationId: string;
  name: string;
  city: string;
}

export interface RouteStopsEditorProps {
  stops: RouteStopDraft[];
  onChange: (stops: RouteStopDraft[]) => void;
  disabledLocationIds?: string[];
  stopErrors?: Record<string, string>;
}

export default function RouteStopsEditor({
  stops,
  onChange,
  disabledLocationIds = [],
  stopErrors = {},
}: RouteStopsEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function handleAddStop() {
    const newStop: RouteStopDraft = {
      clientId: `stop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      locationId: "",
      name: "",
      city: "",
    };
    onChange([...stops, newStop]);
  }

  function handleRemoveStop(clientId: string) {
    onChange(stops.filter((s) => s.clientId !== clientId));
  }

  function handleLocationSelect(clientId: string, loc: SelectedLocation) {
    onChange(
      stops.map((s) =>
        s.clientId === clientId
          ? {
              ...s,
              locationId: loc.id,
              name: loc.name,
              city: loc.city,
            }
          : s,
      ),
    );
  }

  function handleLocationClear(clientId: string) {
    onChange(
      stops.map((s) =>
        s.clientId === clientId
          ? {
              ...s,
              locationId: "",
              name: "",
              city: "",
            }
          : s,
      ),
    );
  }

  function handleMoveStop(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    const nextStops = [...stops];
    const temp = nextStops[index];
    nextStops[index] = nextStops[targetIndex];
    nextStops[targetIndex] = temp;
    onChange(nextStops);
  }

  // --- Drag and Drop Handlers ---
  function handleDragStart(index: number, event: DragEvent<HTMLDivElement>) {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", index.toString());
  }

  function handleDragOver(index: number, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDragLeave(index: number) {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  }

  function handleDrop(dropIndex: number, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const nextStops = [...stops];
    const [moved] = nextStops.splice(draggedIndex, 1);
    nextStops.splice(dropIndex, 0, moved);
    onChange(nextStops);

    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Intermediate Stops
          </h3>
          <p className="text-xs text-slate-500">
            Add, remove, or drag to reorder stops along your route.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddStop}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          <span>Add Stop</span>
        </button>
      </div>

      {stops.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
          <p className="text-xs font-medium text-slate-500">
            No stops added yet. Your route will go directly from source to
            destination.
          </p>
          <button
            type="button"
            onClick={handleAddStop}
            className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            + Add intermediate stop
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {stops.map((stop, index) => {
            const sequenceNumber = index + 1;
            const errorMsg = stopErrors[stop.clientId];
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index && !isDragging;

            // Other locations that cannot be selected by this stop
            const stopDisabledIds = disabledLocationIds.filter(
              (id) => id !== stop.locationId,
            );

            return (
              <div
                key={stop.clientId}
                draggable
                onDragStart={(e) => handleDragStart(index, e)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDragLeave={() => handleDragLeave(index)}
                onDrop={(e) => handleDrop(index, e)}
                onDragEnd={handleDragEnd}
                className={`group relative rounded-2xl border bg-slate-50/40 p-4 transition-all duration-150 ${
                  isDragging
                    ? "opacity-40 border-dashed border-indigo-400 scale-[0.99]"
                    : isDragOver
                      ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/30 shadow-md"
                      : "border-slate-200 hover:border-slate-300 focus-within:border-indigo-300"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Drag Grip Handle */}
                    <span
                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 transition"
                      title="Drag to reorder stop"
                      aria-label={`Drag stop ${sequenceNumber}`}
                    >
                      <GripVerticalIcon className="h-4 w-4" />
                    </span>

                    <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
                      {sequenceNumber}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
                      Stop {sequenceNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveStop(index, "up")}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
                        title="Move up"
                        aria-label={`Move stop ${sequenceNumber} up`}
                      >
                        ▲
                      </button>
                    )}
                    {index < stops.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveStop(index, "down")}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
                        title="Move down"
                        aria-label={`Move stop ${sequenceNumber} down`}
                      >
                        ▼
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(stop.clientId)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      title="Remove stop"
                      aria-label={`Remove stop ${sequenceNumber}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <LocationCombobox
                  id={`stop-${stop.clientId}`}
                  label={`Location for stop ${sequenceNumber}`}
                  placeholder="Search stop location..."
                  value={stop.locationId}
                  selectedLocation={
                    stop.locationId
                      ? {
                          id: stop.locationId,
                          name: stop.name,
                          city: stop.city,
                        }
                      : null
                  }
                  onSelect={(loc) => handleLocationSelect(stop.clientId, loc)}
                  onClear={() => handleLocationClear(stop.clientId)}
                  disabledLocationIds={stopDisabledIds}
                  hasError={Boolean(errorMsg)}
                  errorMessage={errorMsg}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
