import { useState, useMemo } from "react";
import { toApiError } from "@core/api/apiError";
import { useCurrentUserQuery } from "@features/users/hooks/useCurrentUserQuery";
import DriverSidebar from "@features/home/components/dashboard/DriverSidebar";
import DriverTopBar from "@features/home/components/dashboard/DriverTopBar";
import { useTripsQuery } from "../hooks/useTripsQuery";
import {
  useDriverRoutesQuery,
  useDriverVehiclesQuery,
} from "../hooks/useTripOptionsQuery";
import { useDeleteTripMutation } from "../hooks/useDeleteTripMutation";
import MyTripsHeader from "../components/MyTripsHeader";
import MyTripsFilterBar, {
  type TripStatusFilter,
} from "../components/MyTripsFilterBar";
import FeaturedNextTripCard from "../components/FeaturedNextTripCard";
import TripCard from "../components/TripCard";
import TripsQuickInsights from "../components/TripsQuickInsights";
import TripsEmptyState from "../components/TripsEmptyState";
import TripsPagination from "../components/TripsPagination";
import DeleteTripModal from "../modals/DeleteTripModal";
import type { TripResponse } from "../types/trips.api.types";

const PAGE_LIMIT = 8;

const TripsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [activeStatus, setActiveStatus] = useState<TripStatusFilter>("all");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tripToDelete, setTripToDelete] = useState<TripResponse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    data: tripsData,
    isLoading: isLoadingTrips,
    isError: isTripsError,
    error: tripsError,
  } = useTripsQuery({ page, limit: PAGE_LIMIT });

  const { data: routes = [] } = useDriverRoutesQuery();
  const { data: vehicles = [] } = useDriverVehiclesQuery();
  const deleteMutation = useDeleteTripMutation();

  const routesMap = useMemo(
    () => new Map(routes.map((r) => [r.id, r])),
    [routes],
  );
  const vehiclesMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles],
  );

  const trips = useMemo(() => tripsData?.items ?? [], [tripsData?.items]);
  const totalTrips = tripsData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalTrips / PAGE_LIMIT));

  const statusCounts = useMemo(() => {
    return {
      scheduled: trips.filter((t) => t.status === "scheduled").length,
      completed: trips.filter((t) => t.status === "completed").length,
      cancelled: trips.filter((t) => t.status === "cancelled").length,
      total: trips.length,
    };
  }, [trips]);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      if (activeStatus !== "all" && trip.status !== activeStatus) {
        return false;
      }
      if (selectedVehicleId && trip.vehicle_id !== selectedVehicleId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const route = routesMap.get(trip.route_id);
        const vehicle = vehiclesMap.get(trip.vehicle_id);
        const matchRoute = route?.name.toLowerCase().includes(q);
        const matchVehicle =
          vehicle &&
          `${vehicle.make} ${vehicle.model} ${vehicle.license_plate}`
            .toLowerCase()
            .includes(q);
        const matchDate = trip.departure_date.includes(q);
        if (!matchRoute && !matchVehicle && !matchDate) {
          return false;
        }
      }
      return true;
    });
  }, [trips, activeStatus, selectedVehicleId, searchQuery, routesMap, vehiclesMap]);

  const nextUpcomingTrip = useMemo(() => {
    return trips.find((t) => t.status === "scheduled") ?? null;
  }, [trips]);

  const handleDeleteConfirm = () => {
    if (!tripToDelete || tripToDelete.status !== "scheduled") return;

    setDeleteError(null);
    deleteMutation.mutate(tripToDelete.id, {
      onSuccess: () => {
        const route = routesMap.get(tripToDelete.route_id);
        const routeLabel = route ? route.name : `Trip #${tripToDelete.id.slice(0, 8)}`;
        setTripToDelete(null);
        setFeedback(
          `Trip for "${routeLabel}" on ${tripToDelete.departure_date} has been deleted.`,
        );
      },
      onError: (err) => {
        const apiError = toApiError(err);
        setTripToDelete(null);
        setDeleteError(apiError.message);
      },
    });
  };

  const handleSelectTripToDelete = (trip: TripResponse) => {
    if (trip.status !== "scheduled") return;
    setTripToDelete(trip);
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
          onSearch={(q) => setSearchQuery(q)}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable Content Canvas */}
        <main className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb & Page Header */}
          <MyTripsHeader />

          {/* Filter Controls & Segmented Tabs Bar */}
          <MyTripsFilterBar
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            statusCounts={statusCounts}
            selectedVehicleId={selectedVehicleId}
            onVehicleChange={setSelectedVehicleId}
            vehicles={vehicles}
          />

          {/* Feedback & Error Alerts */}
          {feedback && (
            <div className="flex items-center justify-between rounded-2xl border border-surface-mint-border bg-surface-mint p-4 text-sm font-medium text-emerald-800">
              <p>{feedback}</p>
              <button
                type="button"
                aria-label="Dismiss feedback"
                onClick={() => setFeedback(null)}
                className="cursor-pointer font-bold text-emerald-700 hover:text-emerald-950"
              >
                ✕
              </button>
            </div>
          )}

          {deleteError && (
            <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
              <p>{deleteError}</p>
              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setDeleteError(null)}
                className="cursor-pointer font-bold text-rose-700 hover:text-rose-950"
              >
                ✕
              </button>
            </div>
          )}

          {isTripsError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
              {toApiError(tripsError).message || "Failed to load trips."}
            </div>
          )}

          {/* Featured Next Upcoming Trip Hero Section */}
          {nextUpcomingTrip && (activeStatus === "scheduled" || activeStatus === "all") && (
            <FeaturedNextTripCard
              trip={nextUpcomingTrip}
              route={routesMap.get(nextUpcomingTrip.route_id)}
              vehicle={vehiclesMap.get(nextUpcomingTrip.vehicle_id)}
              onDelete={handleSelectTripToDelete}
            />
          )}

          {/* All Upcoming Trips Section Header */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-on-surface sm:text-xl">
                  {activeStatus === "scheduled"
                    ? "All Upcoming Trips"
                    : activeStatus === "completed"
                      ? "Completed Trips"
                      : activeStatus === "cancelled"
                        ? "Cancelled Trips"
                        : "All Trips"}
                </h2>
                <span className="rounded-full border border-border-subtle bg-surface-card px-2.5 py-0.5 text-xs font-semibold text-text-muted">
                  {filteredTrips.length} total
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span>Sorted by Departure Date</span>
              </div>
            </div>

            {/* Content Area */}
            <div>
              {isLoadingTrips ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 animate-pulse rounded-2xl border border-border-subtle bg-surface-card"
                    />
                  ))}
                </div>
              ) : trips.length === 0 ? (
                <TripsEmptyState />
              ) : filteredTrips.length === 0 ? (
                <TripsEmptyState
                  isFiltered
                  onResetFilters={() => {
                    setActiveStatus("all");
                    setSelectedVehicleId("");
                    setSearchQuery("");
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      route={routesMap.get(trip.route_id)}
                      vehicle={vehiclesMap.get(trip.vehicle_id)}
                      onDelete={handleSelectTripToDelete}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <TripsPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </section>

          {/* Quick Operational Insights Footer Section */}
          <TripsQuickInsights
            trips={trips}
            routesMap={routesMap}
            vehiclesMap={vehiclesMap}
          />
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <DeleteTripModal
          trip={tripToDelete}
          routeName={routesMap.get(tripToDelete.route_id)?.name}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setTripToDelete(null)}
        />
      )}
    </div>
  );
};

export default TripsPage;
