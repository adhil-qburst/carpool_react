import { useState, useMemo } from "react";
import { toApiError } from "@core/api/apiError";
import { useCurrentUserQuery } from "@features/users/hooks/useCurrentUserQuery";
import DriverSidebar from "@features/home/components/dashboard/DriverSidebar";
import DriverTopBar from "@features/home/components/dashboard/DriverTopBar";
import { useRoutesQuery } from "../hooks/useRoutesQuery";
import { useDeleteRouteMutation } from "../hooks/useDeleteRouteMutation";
import { useCreateRouteMutation } from "../hooks/useCreateRouteMutation";
import DeleteRouteModal from "../modals/DeleteRouteModal";
import RouteHeader from "../components/RouteHeader";
import RouteFilterTabs, {
  type RouteFilterType,
} from "../components/RouteFilterTabs";
import RouteCard from "../components/RouteCard";
import WaypointBuilder from "../components/WaypointBuilder";
import RoutesEmptyState from "../components/RoutesEmptyState";
import RoutesPagination from "../components/RoutesPagination";
import type { RouteResponse } from "../types/routes.api.types";

const PAGE_LIMIT = 10;

const RoutesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<RouteFilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routeToDelete, setRouteToDelete] = useState<RouteResponse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: currentUser } = useCurrentUserQuery();
  const driverName = currentUser?.name || "Arun Kumar";
  const driverInitials =
    driverName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AK";

  const {
    data: routesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useRoutesQuery({ page, limit: PAGE_LIMIT });

  const deleteMutation = useDeleteRouteMutation();
  const createMutation = useCreateRouteMutation();

  const routes = useMemo(() => routesData?.items ?? [], [routesData?.items]);
  const totalRoutes = routesData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRoutes / PAGE_LIMIT));

  // Determine active route for WaypointBuilder
  const selectedRoute = useMemo(() => {
    if (selectedRouteId) {
      const found = routes.find((r) => r.id === selectedRouteId);
      if (found) return found;
    }
    return routes.length > 0 ? routes[0] : null;
  }, [routes, selectedRouteId]);

  // Filter routes based on active tab and search query
  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      if (activeTab === "inactive") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = route.name.toLowerCase().includes(q);
        const matchStops = (route.route_stops ?? []).some((s) => {
          const locName = s.location?.name?.toLowerCase() || "";
          const city = s.location?.city?.toLowerCase() || "";
          return locName.includes(q) || city.includes(q);
        });
        if (!matchName && !matchStops) return false;
      }
      return true;
    });
  }, [routes, activeTab, searchQuery]);

  const handleDeleteConfirm = () => {
    if (!routeToDelete) return;
    setActionError(null);

    deleteMutation.mutate(routeToDelete.id, {
      onSuccess: () => {
        const deletedName = routeToDelete.name;
        if (selectedRouteId === routeToDelete.id) {
          setSelectedRouteId(null);
        }
        setRouteToDelete(null);
        setFeedback(`"${deletedName}" has been successfully deleted.`);
      },
      onError: (err) => {
        const apiError = toApiError(err);
        setRouteToDelete(null);
        setActionError(apiError.message);
      },
    });
  };

  const handleDuplicateRoute = (route: RouteResponse) => {
    const stops = [...(route.route_stops ?? [])].sort(
      (a, b) => a.sequence - b.sequence,
    );
    if (stops.length < 2) {
      setActionError("Cannot duplicate a route without origin and destination.");
      return;
    }

    const sourceId = stops[0].location_id;
    const destId = stops[stops.length - 1].location_id;
    const intermediateStops = stops.slice(1, -1).map((s, idx) => ({
      stop_id: s.location_id,
      sequence: idx + 1,
    }));

    createMutation.mutate(
      {
        name: `${route.name} (Copy)`,
        source_id: sourceId,
        dest_id: destId,
        stops: intermediateStops.length > 0 ? intermediateStops : null,
      },
      {
        onSuccess: (newRoute) => {
          setSelectedRouteId(newRoute.id);
          setFeedback(`"${route.name}" duplicated successfully as "${newRoute.name}".`);
        },
        onError: (err) => {
          const apiError = toApiError(err);
          setActionError(apiError.message);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen bg-surface-canvas font-sans text-on-surface antialiased">
      {/* Sidebar Navigation */}
      <DriverSidebar
        driverName={driverName}
        driverInitials={driverInitials}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Workspace Container */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Top App Bar */}
        <DriverTopBar
          driverName={driverName}
          driverInitials={driverInitials}
          onSearch={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Main Content Area */}
        <main className="mx-auto w-full max-w-[1360px] flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header & Hero Area */}
          <RouteHeader
            onReorderClick={() => {
              if (routes.length > 0) {
                setSelectedRouteId(routes[0].id);
              }
            }}
          />

          {/* Feedback & Alert Banners */}
          {feedback && (
            <div
              role="status"
              className="flex items-center justify-between rounded-xl border border-surface-mint-border bg-surface-mint px-4 py-3 text-xs sm:text-sm font-medium text-primary shadow-xs"
            >
              <span>{feedback}</span>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="ml-3 font-semibold text-primary hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {actionError && (
            <div
              role="alert"
              className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs sm:text-sm text-rose-700 shadow-xs"
            >
              <span>{actionError}</span>
              <button
                type="button"
                onClick={() => setActionError(null)}
                className="ml-3 font-semibold text-rose-700 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div
              role="status"
              className="grid place-items-center rounded-2xl border border-border-subtle bg-surface-card p-12 text-center shadow-xs"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-xs sm:text-sm font-medium text-text-muted">
                Loading routes...
              </p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-xs">
              <p className="text-base font-semibold text-rose-700">
                Could not load your routes
              </p>
              <p className="mt-1 text-xs sm:text-sm text-rose-600">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-rose-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && routes.length === 0 && (
            <RoutesEmptyState />
          )}

          {/* Main Two-Column Layout Grid (Stitch Specification) */}
          {!isLoading && !isError && routes.length > 0 && (
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left Column: Saved Corridors List (5 cols on lg) */}
              <div className="col-span-12 lg:col-span-5 space-y-4">
                <RouteFilterTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  allCount={routes.length}
                  activeCount={routes.length}
                  inactiveCount={0}
                />

                <div className="space-y-4">
                  {filteredRoutes.map((route) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      isSelected={selectedRoute?.id === route.id}
                      onSelect={() => setSelectedRouteId(route.id)}
                      onDuplicate={handleDuplicateRoute}
                      onDelete={(r) => setRouteToDelete(r)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                <RoutesPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>

              {/* Right Column: Interactive Waypoint Builder (7 cols on lg) */}
              <div className="col-span-12 lg:col-span-7">
                <WaypointBuilder
                  key={selectedRoute?.id ?? "none"}
                  selectedRoute={selectedRoute}
                  onSaveSuccess={(msg) => setFeedback(msg)}
                  onSaveError={(err) => setActionError(err)}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Route Confirmation Dialog */}
      {routeToDelete && (
        <DeleteRouteModal
          route={routeToDelete}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setRouteToDelete(null)}
        />
      )}
    </div>
  );
};

export default RoutesPage;
