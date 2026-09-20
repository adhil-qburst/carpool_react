import GripVerticalIcon from "@shared/ui/GripVerticalIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";

export type WaypointData = {
  clientId: string;
  locationId: string;
  name: string;
  city: string;
  sequence: number;
};

export type WaypointItemProps = {
  stop: WaypointData;
  index: number;
  totalCount: number;
  isOrigin: boolean;
  isTerminal: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onRemove: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
};

const WaypointItem = ({
  stop,
  index,
  totalCount,
  isOrigin,
  isTerminal,
  onMoveUp,
  onMoveDown,
  onEdit,
  onRemove,
  draggable = true,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging = false,
}: WaypointItemProps) => {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`relative z-10 flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-card p-3 shadow-2xs transition-all hover:bg-surface-canvas ${
        isDragging ? "opacity-50 ring-2 ring-primary" : ""
      }`}
    >
      {/* Drag & Reorder Handle */}
      <div
        className="cursor-grab text-text-muted hover:text-on-surface px-0.5 active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVerticalIcon className="h-5 w-5" />
      </div>

      {/* Node Sequence Indicator */}
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-xs shrink-0 ${
          isOrigin || isTerminal
            ? "bg-primary text-white"
            : "border-2 border-primary bg-surface-card text-primary"
        }`}
      >
        {index + 1}
      </div>

      {/* Location Details & Type Tag */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-on-surface truncate">
            {stop.name || stop.locationId || `Stop ${index + 1}`}
          </span>

          {isOrigin && (
            <span className="rounded-full border border-surface-mint-border bg-surface-mint px-2 py-0.5 text-[11px] font-semibold text-primary">
              Origin
            </span>
          )}

          {!isOrigin && !isTerminal && (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
              Waypoint
            </span>
          )}

          {isTerminal && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              Terminal Stop
            </span>
          )}
        </div>

        <div className="text-[11px] text-text-muted truncate mt-0.5">
          {stop.city ? `${stop.city}, Kerala` : "Kerala"}
        </div>
      </div>

      {/* Reorder Buttons (Mobile/Accessible) & Row Actions */}
      <div className="flex items-center gap-1">
        {!isOrigin && (
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index <= 0}
            title="Move waypoint up"
            aria-label={`Move ${stop.name || `stop ${index + 1}`} up`}
            className="rounded p-1 text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:opacity-30 cursor-pointer"
          >
            <span className="text-xs font-bold">↑</span>
          </button>
        )}

        {!isTerminal && (
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index >= totalCount - 1}
            title="Move waypoint down"
            aria-label={`Move ${stop.name || `stop ${index + 1}`} down`}
            className="rounded p-1 text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:opacity-30 cursor-pointer"
          >
            <span className="text-xs font-bold">↓</span>
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          title="Edit waypoint"
          aria-label={`Edit ${stop.name || `stop ${index + 1}`}`}
          className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface cursor-pointer"
        >
          <PencilIcon className="h-3.5 w-3.5" />
        </button>

        {!isOrigin && !isTerminal && (
          <button
            type="button"
            onClick={onRemove}
            title="Remove stop"
            aria-label={`Remove ${stop.name || `stop ${index + 1}`}`}
            className="rounded p-1.5 text-text-muted transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default WaypointItem;
