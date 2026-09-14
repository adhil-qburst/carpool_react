import { useState, useEffect, useMemo } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import {
  useDriverRoutesQuery,
  useDriverVehiclesQuery,
} from "../hooks/useTripOptionsQuery";
import { useTripQuery } from "../hooks/useTripQuery";
import { useUpdateTripMutation } from "../hooks/useUpdateTripMutation";
import RouteDetailsCard from "../components/RouteDetailsCard";
import VehicleSelector from "../components/VehicleSelector";
import DepartureScheduleFields from "../components/DepartureScheduleFields";
import TripPreviewSidebar from "../components/TripPreviewSidebar";
import { getTodayDateString } from "../utils/tripValidation";
import type { TripStatus } from "../types/trips.api.types";

export default function EditTripPage() {
  const { tripId = "" } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const todayString = useMemo(() => getTodayDateString(), []);

  const { data: trip, isLoading: isLoadingTrip, isError: isTripError } = useTripQuery(tripId);
  const { data: routes = [], isLoading: isLoadingRoutes } = useDriverRoutesQuery();
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useDriverVehiclesQuery();
  const updateTripMutation = useUpdateTripMutation();

  const [vehicleId, setVehicleId] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [status, setStatus] = useState<TripStatus>("scheduled");

  const [errors, setErrors] = useState<{
    vehicleId?: string;
    departureDate?: string;
    departureTime?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Prepopulate form when trip loads
  useEffect(() => {
    if (trip) {
      setVehicleId(trip.vehicle_id);
      setDepartureDate(trip.departure_date);
      setDepartureTime(trip.departure_time.slice(0, 5));
      setStatus(trip.status);
    }
  }, [trip]);

  const selectedRoute = useMemo(
    () => (trip ? routes.find((r) => r.id === trip.route_id) : null),
    [routes, trip],
  );

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === vehicleId),
    [vehicles, vehicleId],
  );

  const availableSeatsCount = useMemo(() => {
    if (!selectedVehicle) return null;
    return Math.max(0, selectedVehicle.total_seats - 1);
  }, [selectedVehicle]);

  function validate() {
    const nextErrors: typeof errors = {};

    if (!vehicleId) {
      nextErrors.vehicleId = "Please select a vehicle.";
    }
    if (!departureDate) {
      nextErrors.departureDate = "Please choose a departure date.";
    }
    if (!departureTime) {
      nextErrors.departureTime = "Please enter a departure time.";
    }

    return nextErrors;
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formattedTime =
      departureTime.trim().length === 5
        ? `${departureTime.trim()}:00`
        : departureTime.trim();

    try {
      await updateTripMutation.mutateAsync({
        tripId,
        payload: {
          vehicle_id: vehicleId,
          departure_date: departureDate,
          departure_time: formattedTime,
          status,
        },
      });
      setSuccessMessage("Trip updated successfully!");
      setTimeout(() => {
        navigate(route_paths.home);
      }, 1500);
    } catch (err) {
      const apiErr = toApiError(err);
      setFormError(apiErr.message);
    }
  }

  if (isLoadingTrip || isLoadingRoutes || isLoadingVehicles) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-3 text-sm font-medium text-slate-600">Loading trip details...</p>
        </div>
      </main>
    );
  }

  if (isTripError || !trip) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
          <p className="text-base font-semibold text-rose-600">Trip not found</p>
          <p className="mt-2 text-sm text-slate-500">
            The requested trip could not be found or you may not have permission to view it.
          </p>
          <Link
            to={route_paths.home}
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[420px_1fr]">
        <TripPreviewSidebar
          title="Update Trip"
          subtitle="Modify your departure timing, assign a different vehicle, or change trip status."
          selectedRoute={selectedRoute}
          selectedVehicle={selectedVehicle}
          departureDate={departureDate}
          departureTime={departureTime}
          availableSeatsCount={availableSeatsCount}
        />

        <section className="flex flex-col justify-center bg-white p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-lg">
            <Link
              to={route_paths.home}
              className="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              ← Back to home
            </Link>

            <p className="mt-4 text-sm font-semibold text-indigo-600 uppercase">
              Edit Schedule
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Update Trip
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-slate-500">
              Update your carpool trip settings, vehicle capacity, or status.
            </p>

            {successMessage && (
              <div
                role="status"
                className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                {successMessage}
              </div>
            )}

            {formError && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
              {/* Route Details with Stops */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Assigned Route
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-800">
                  {selectedRoute ? selectedRoute.name : "Route ID: " + trip.route_id}
                </div>

                {selectedRoute && (
                  <div className="mt-3">
                    <RouteDetailsCard route={selectedRoute} />
                  </div>
                )}
              </div>

              {/* Vehicle Selector */}
              <VehicleSelector
                vehicles={vehicles}
                selectedVehicleId={vehicleId}
                onChange={setVehicleId}
                selectedVehicle={selectedVehicle}
                availableSeatsCount={availableSeatsCount}
                error={errors.vehicleId}
                isLoading={isLoadingVehicles}
              />

              {/* Departure Schedule */}
              <DepartureScheduleFields
                departureDate={departureDate}
                departureTime={departureTime}
                todayString={todayString}
                onChangeDate={setDepartureDate}
                onChangeTime={setDepartureTime}
                dateError={errors.departureDate}
                timeError={errors.departureTime}
              />

              {/* Status Selector */}
              <div>
                <label
                  htmlFor="edit-trip-status"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Trip Status
                </label>
                <select
                  id="edit-trip-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TripStatus)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-[15px] text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updateTripMutation.isPending}
                  className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateTripMutation.isPending ? "Saving changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
