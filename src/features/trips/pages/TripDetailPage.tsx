import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { useCurrentUserQuery } from "@features/users/hooks/useCurrentUserQuery";
import { useTripQuery } from "../hooks/useTripQuery";
import {
  useDriverRoutesQuery,
  useDriverVehiclesQuery,
} from "../hooks/useTripOptionsQuery";
import { useDeleteTripMutation } from "../hooks/useDeleteTripMutation";
import RouteDetailsCard from "../components/RouteDetailsCard";
import TripDetailSidebar from "../components/TripDetailSidebar";
import TripDetailSkeleton from "../components/TripDetailSkeleton";
import TripOverviewGrid from "../components/TripOverviewGrid";
import TripPassengersSection from "../components/TripPassengersSection";
import TripAuditCard from "../components/TripAuditCard";
import DeleteTripModal from "../modals/DeleteTripModal";
import BookRideConfirmationModal from "../modals/BookRideConfirmationModal";

export default function TripDetailPage() {
  const { tripId = "" } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: trip,
    isLoading: isLoadingTrip,
    isError: isTripError,
    error: tripError,
  } = useTripQuery(tripId);

  const { data: routes = [] } = useDriverRoutesQuery();
  const { data: vehicles = [] } = useDriverVehiclesQuery();
  const { data: currentUser } = useCurrentUserQuery();
  const deleteMutation = useDeleteTripMutation();

  const selectedRoute = useMemo(
    () => trip?.route ?? routes.find((r) => r.id === trip?.route_id),
    [routes, trip],
  );

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === trip?.vehicle_id),
    [vehicles, trip],
  );

  const isDriver = useMemo(() => {
    if (!currentUser || !trip) return false;
    return currentUser.id === trip.driver_id;
  }, [currentUser, trip]);

  const routeName =
    selectedRoute?.name ?? (trip ? `Trip #${trip.id.slice(0, 8)}` : "Trip");

  function handleDeleteConfirm() {
    if (!trip) return;
    setErrorMessage(null);
    deleteMutation.mutate(trip.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        navigate(route_paths.trips);
      },
      onError: (err) => {
        setIsDeleteModalOpen(false);
        setErrorMessage(toApiError(err).message);
      },
    });
  }

  if (isLoadingTrip) {
    return <TripDetailSkeleton />;
  }

  if (isTripError || !trip) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
          <TripDetailSidebar />
          <section className="flex flex-col items-center justify-center p-6 text-center sm:p-10 lg:p-12">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Trip not found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {tripError
                  ? toApiError(tripError).message
                  : "The requested trip does not exist or has been removed."}
              </p>
              <Link
                to={route_paths.trips}
                className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
              >
                Back to Trips
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const isScheduled = trip.status === "scheduled";

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        <TripDetailSidebar
          trip={trip}
          route={selectedRoute}
          vehicle={selectedVehicle}
        />

        <section className="flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden mb-6">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight text-slate-950">
                Carpool
              </span>
            </div>
            <Link
              to={route_paths.trips}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              ← My Trips
            </Link>
          </div>

          {/* Desktop Navigation & Actions Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div>
              <Link
                to={route_paths.trips}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                ← Back to Trips
              </Link>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {routeName}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isDriver ? (
                <>
                  {isScheduled ? (
                    <Link
                      to={route_paths.getTripEditPath(trip.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed opacity-60"
                      title="Only scheduled trips can be edited"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => isScheduled && setIsDeleteModalOpen(true)}
                    disabled={!isScheduled}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/70 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-60"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  {trip.available_seats <= 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Sold Out
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(true)}
                    disabled={!isScheduled}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {trip.available_seats <= 0 ? "Join Waiting List" : "Book Ride"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sold Out Notice */}
          {!isDriver && trip.available_seats <= 0 && (
            <div
              role="status"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-amber-200 text-xs font-bold text-amber-900">
                !
              </span>
              <p className="leading-relaxed">
                <strong className="font-semibold text-amber-950">This trip is sold out.</strong> You can still book to join the waiting list. If someone cancels their booking, your trip will be confirmed.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="mt-4 flex items-center justify-between rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-800 border border-rose-200"
            >
              <p>{errorMessage}</p>
              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setErrorMessage(null)}
                className="text-rose-600 hover:text-rose-900 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Overview Grid */}
          <div className="mt-6">
            <TripOverviewGrid trip={trip} vehicle={selectedVehicle} />
          </div>

          {/* Route Waypoints & Stops */}
          <div className="mt-6">
            <RouteDetailsCard route={selectedRoute} />
          </div>

          {/* Passenger Bookings Section */}
          <div className="mt-6">
            <TripPassengersSection tripId={trip.id} />
          </div>

          {/* Additional Trip Metadata */}
          <div className="mt-6">
            <TripAuditCard trip={trip} />
          </div>
        </section>
      </div>

      {/* Delete Trip Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteTripModal
          trip={trip}
          routeName={selectedRoute?.name}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}

      {/* Book Ride Modal */}
      {isBookingModalOpen && (
        <BookRideConfirmationModal
          trip={trip}
          sourceName={selectedRoute?.name}
          destinationName={selectedRoute?.name}
          seatsRequested={1}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </main>
  );
}
