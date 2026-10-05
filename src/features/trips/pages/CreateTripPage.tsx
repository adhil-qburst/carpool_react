import { useState, useMemo } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import {
  useDriverRoutesQuery,
  useDriverVehiclesQuery,
} from "../hooks/useTripOptionsQuery";
import { useCreateTripMutation } from "../hooks/useCreateTripMutation";
import RouteSelector from "../components/RouteSelector";
import VehicleSelector from "../components/VehicleSelector";
import DepartureScheduleFields from "../components/DepartureScheduleFields";
import TripPreviewSidebar from "../components/TripPreviewSidebar";
import TripSuccessModal from "../modals/TripSuccessModal";
import {
  getTodayDateString,
  validateCreateTripForm,
} from "../utils/tripValidation";
import type { CreateTripForm, CreateTripFormErrors } from "../types/trips.type";
import type { TripResponse } from "../types/trips.api.types";

export default function CreateTripPage() {
  const navigate = useNavigate();
  const todayString = useMemo(() => getTodayDateString(), []);

  const [form, setForm] = useState<CreateTripForm>({
    routeId: "",
    vehicleId: "",
    departureDate: "",
    departureTime: "",
  });

  const [errors, setErrors] = useState<CreateTripFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [createdTrip, setCreatedTrip] = useState<TripResponse | null>(null);

  const {
    data: routes = [],
    isLoading: isLoadingRoutes,
  } = useDriverRoutesQuery();

  const {
    data: vehicles = [],
    isLoading: isLoadingVehicles,
  } = useDriverVehiclesQuery();

  const createTripMutation = useCreateTripMutation();

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === form.vehicleId),
    [vehicles, form.vehicleId],
  );

  const selectedRoute = useMemo(
    () => routes.find((r) => r.id === form.routeId),
    [routes, form.routeId],
  );

  const availableSeatsCount = useMemo(() => {
    if (!selectedVehicle) return null;
    return Math.max(0, selectedVehicle.total_seats - 1);
  }, [selectedVehicle]);

  function handleChange<K extends keyof CreateTripForm>(
    field: K,
    value: CreateTripForm[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationErrors = validateCreateTripForm(form, todayString);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await createTripMutation.mutateAsync(form);
      setCreatedTrip(response);
    } catch (err) {
      const apiErr = toApiError(err);
      setFormError(apiErr.message);
      if (apiErr.fieldErrors) {
        setErrors((prev) => ({
          ...prev,
          routeId: apiErr.fieldErrors?.route_id ?? prev.routeId,
          vehicleId: apiErr.fieldErrors?.vehicle_id ?? prev.vehicleId,
          departureDate:
            apiErr.fieldErrors?.departure_date ?? prev.departureDate,
          departureTime:
            apiErr.fieldErrors?.departure_time ?? prev.departureTime,
        }));
      }
    }
  }

  function handleReset() {
    setForm({
      routeId: "",
      vehicleId: "",
      departureDate: "",
      departureTime: "",
    });
    setErrors({});
    setFormError(null);
    setCreatedTrip(null);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[420px_1fr]">
        {/* Left Pane - Sidebar with live preview */}
        <TripPreviewSidebar
          selectedRoute={selectedRoute}
          selectedVehicle={selectedVehicle}
          departureDate={form.departureDate}
          departureTime={form.departureTime}
          availableSeatsCount={availableSeatsCount}
        />

        {/* Right Pane - Form */}
        <section className="flex flex-col justify-center bg-white p-6 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-lg">
            {/* Mobile Header */}
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <BrandMark />
                <span className="text-lg font-bold tracking-tight text-slate-950">
                  Carpool
                </span>
              </div>
              <Link
                to={route_paths.home}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Back to home
              </Link>
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="hidden lg:block">
                <Link
                  to={route_paths.home}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  ← Back to home
                </Link>
              </div>

              <p className="mt-4 text-sm font-semibold text-indigo-600 uppercase">
                New Trip
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                Create a Trip
              </h2>
              <p className="mt-2 text-[15px] leading-6 text-slate-500">
                Configure your ride details below to schedule your upcoming
                carpool journey.
              </p>

              {formError && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                {/* Route Selector with Stops Timeline */}
                <RouteSelector
                  routes={routes}
                  selectedRouteId={form.routeId}
                  onChange={(val) => handleChange("routeId", val)}
                  selectedRoute={selectedRoute}
                  error={errors.routeId}
                  isLoading={isLoadingRoutes}
                />

                {/* Vehicle Selector with Capacity Info */}
                <VehicleSelector
                  vehicles={vehicles}
                  selectedVehicleId={form.vehicleId}
                  onChange={(val) => handleChange("vehicleId", val)}
                  selectedVehicle={selectedVehicle}
                  availableSeatsCount={availableSeatsCount}
                  error={errors.vehicleId}
                  isLoading={isLoadingVehicles}
                />

                {/* Departure Date & Time Grid */}
                <DepartureScheduleFields
                  departureDate={form.departureDate}
                  departureTime={form.departureTime}
                  todayString={todayString}
                  onChangeDate={(val) => handleChange("departureDate", val)}
                  onChangeTime={(val) => handleChange("departureTime", val)}
                  dateError={errors.departureDate}
                  timeError={errors.departureTime}
                />

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={createTripMutation.isPending}
                    className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {createTripMutation.isPending ? "Scheduling trip..." : "Schedule Trip"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      {createdTrip && (
        <TripSuccessModal
          trip={createdTrip}
          routeName={selectedRoute?.name ?? "Selected Route"}
          vehicleLabel={
            selectedVehicle
              ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.license_plate})`
              : "Vehicle"
          }
          onClose={() => navigate(route_paths.home)}
          onCreateAnother={handleReset}
        />
      )}
    </main>
  );
}
