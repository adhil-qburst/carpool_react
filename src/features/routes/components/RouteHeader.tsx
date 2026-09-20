import { Link } from "react-router";
import PlusIcon from "@shared/ui/PlusIcon";
import RouteIcon from "@shared/ui/RouteIcon";
import ChevronRightIcon from "@shared/ui/ChevronRightIcon";
import { route_paths } from "@core/router/route_paths";

export type RouteHeaderProps = {
  onReorderClick?: () => void;
};

const RouteHeader = ({ onReorderClick }: RouteHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Breadcrumbs & Title */}
      <div className="space-y-1">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-medium text-text-muted"
        >
          <Link
            to={route_paths.home}
            className="transition-colors hover:text-on-surface"
          >
            Workspace
          </Link>
          <ChevronRightIcon className="h-3 w-3 text-text-muted" />
          <span className="font-semibold text-primary">Routes</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          Routes &amp; Waypoint Builder
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Manage reusable travel corridors and ordered pickup waypoints across Kerala.
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReorderClick}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-on-surface shadow-xs transition-all hover:bg-surface-container-low active:scale-95 cursor-pointer"
        >
          <RouteIcon className="h-4 w-4 text-text-muted" />
          <span>Reorder Waypoints</span>
        </button>

        <Link
          to={route_paths.routesNew}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary-hover active:scale-95"
        >
          <PlusIcon className="h-4 w-4 text-white" />
          <span>+ Create New Route</span>
        </Link>
      </div>
    </div>
  );
};

export default RouteHeader;
