import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import { toApiError } from "@core/api/apiError";
import VehicleSuccessModal from "../modals/VehicleSuccessModal";
import { useVehicleQuery } from "../hooks/useVehicleQuery";
import { useUpdateVehicleMutation } from "../hooks/useUpdateVehicleMutation";
import type {
  CreateVehicleForm,
  VehicleFormErrors,
} from "../types/vehicles.type";
import type { VehicleResponse } from "../types/vehicles.api.types";

function validate(form: CreateVehicleForm): VehicleFormErrors {
  const errors: VehicleFormErrors = {};
  if (!form.make.trim()) {
    errors.make = "Enter the vehicle make.";
  } else if (form.make.trim().length > 100) {
    errors.make = "Make cannot exceed 100 characters.";
  }

  if (!form.model.trim()) {
    errors.model = "Enter the vehicle model.";
  } else if (form.model.trim().length > 100) {
    errors.model = "Model cannot exceed 100 characters.";
  }

  if (!form.registrationNumber.trim()) {
    errors.registrationNumber = "Enter the registration number.";
  } else if (form.registrationNumber.trim().length > 50) {
    errors.registrationNumber = "Registration number cannot exceed 50 characters.";
  }

  const seats = Number(form.totalSeats);
  if (
    form.totalSeats === "" ||
    form.totalSeats === null ||
    form.totalSeats === undefined ||
    Number.isNaN(seats)
  ) {
    errors.totalSeats = "Enter total available seats.";
  } else if (!Number.isInteger(seats) || seats < 1 || seats > 50) {
    errors.totalSeats = "Seats must be a whole number between 1 and 50.";
  }

  return errors;
}

export default function EditVehiclePage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const {
    data: vehicle,
    isLoading,
    isError,
    error: loadError,
  } = useVehicleQuery(vehicleId ?? "");

  const [form, setForm] = useState<CreateVehicleForm>({
    make: "",
    model: "",
    registrationNumber: "",
    totalSeats: "",
  });
  const [errors, setErrors] = useState<VehicleFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [updatedVehicle, setUpdatedVehicle] = useState<VehicleResponse | null>(
    null,
  );

  useEffect(() => {
    if (vehicle) {
      setForm({
        make: vehicle.make,
        model: vehicle.model,
        registrationNumber: vehicle.registration_number,
        totalSeats: vehicle.total_seats,
      });
    }
  }, [vehicle]);

  const updateMutation = useUpdateVehicleMutation();

  function updateField<K extends keyof CreateVehicleForm>(
    field: K,
    value: CreateVehicleForm[K],
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!vehicleId) return;

    setFormError(null);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateMutation.mutate(
      {
        vehicleId,
        payload: {
          make: form.make,
          model: form.model,
          registrationNumber: form.registrationNumber,
          totalSeats: form.totalSeats,
        },
      },
      {
        onSuccess: (data) => {
          setUpdatedVehicle(data);
        },
        onError: (error) => {
          const apiError = toApiError(error);
          const fieldErrors: VehicleFormErrors = {};
          if (apiError.fieldErrors.make) {
            fieldErrors.make = apiError.fieldErrors.make;
          }
          if (apiError.fieldErrors.model) {
            fieldErrors.model = apiError.fieldErrors.model;
          }
          if (
            apiError.fieldErrors.registration_number ||
            apiError.fieldErrors.registrationNumber
          ) {
            fieldErrors.registrationNumber =
              apiError.fieldErrors.registration_number ??
              apiError.fieldErrors.registrationNumber;
          }
          if (
            apiError.fieldErrors.total_seats ||
            apiError.fieldErrors.totalSeats
          ) {
            fieldErrors.totalSeats =
              apiError.fieldErrors.total_seats ??
              apiError.fieldErrors.totalSeats;
          }

          const hasFieldErrors = Object.keys(fieldErrors).length > 0;
          setErrors((previous) => ({ ...previous, ...fieldErrors }));
          setFormError(hasFieldErrors ? null : apiError.message);
        },
      },
    );
  }

  function handleSuccessModalClose() {
    setUpdatedVehicle(null);
    navigate("/vehicles");
  }

  const fieldClass = (hasError?: boolean) =>
    `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.93fr_1.07fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <BrandMark />
            <span className="text-lg font-bold tracking-tight">Carpool</span>
          </div>

          <div className="relative my-auto max-w-sm">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100">
              VEHICLE MANAGEMENT
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white">
              Keep your vehicle info up to date.
            </h1>
            <p className="mt-5 max-w-xs text-base leading-7 text-slate-300">
              Ensure accurate seat counts and registration for smooth passenger
              pickups and verified rides.
            </p>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/[.07] p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-wider text-indigo-300">
              VEHICLE TIPS
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              Only count seats available for passengers (excluding driver seat)
              if you prefer keeping extra space.
            </p>
          </div>
        </aside>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <BrandMark />
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Carpool
                </span>
              </div>
              <Link
                to="/vehicles"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Back to vehicles
              </Link>
            </div>

            <div className="mt-8 lg:mt-0">
              <div className="hidden lg:block">
                <Link
                  to="/vehicles"
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  ← Back to vehicles
                </Link>
              </div>

              <p className="mt-4 text-sm font-semibold text-indigo-600">
                EDIT VEHICLE
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Update vehicle details
              </h1>

              {isLoading && (
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                  <p className="mt-4 text-sm font-medium text-slate-600">
                    Loading vehicle details...
                  </p>
                </div>
              )}

              {isError && (
                <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
                  <p className="text-sm font-semibold text-rose-700">
                    Failed to load vehicle
                  </p>
                  <p className="mt-1 text-sm text-rose-600">
                    {loadError instanceof Error
                      ? loadError.message
                      : "Vehicle could not be retrieved."}
                  </p>
                  <Link
                    to="/vehicles"
                    className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                  >
                    Return to vehicles
                  </Link>
                </div>
              )}

              {!isLoading && !isError && (
                <>
                  <p className="mt-2 text-[15px] leading-6 text-slate-500">
                    Modify the information for this vehicle below.
                  </p>

                  {formError && (
                    <div
                      role="alert"
                      className="mt-6 rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600"
                    >
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                      <label
                        htmlFor="vehicle-make"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Vehicle Make
                      </label>
                      <div className="relative text-slate-400">
                        <span className="pointer-events-none absolute left-3.5 top-3.5">
                          <FieldIcon type="car" />
                        </span>
                        <input
                          id="vehicle-make"
                          type="text"
                          placeholder="e.g. Toyota"
                          value={form.make}
                          onChange={(e) => updateField("make", e.target.value)}
                          aria-invalid={Boolean(errors.make)}
                          aria-describedby={
                            errors.make ? "vehicle-make-error" : undefined
                          }
                          className={fieldClass(Boolean(errors.make))}
                        />
                      </div>
                      {errors.make && (
                        <p
                          id="vehicle-make-error"
                          className="mt-1.5 text-sm text-rose-600"
                        >
                          {errors.make}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="vehicle-model"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Vehicle Model
                      </label>
                      <div className="relative text-slate-400">
                        <span className="pointer-events-none absolute left-3.5 top-3.5">
                          <FieldIcon type="car" />
                        </span>
                        <input
                          id="vehicle-model"
                          type="text"
                          placeholder="e.g. Camry"
                          value={form.model}
                          onChange={(e) => updateField("model", e.target.value)}
                          aria-invalid={Boolean(errors.model)}
                          aria-describedby={
                            errors.model ? "vehicle-model-error" : undefined
                          }
                          className={fieldClass(Boolean(errors.model))}
                        />
                      </div>
                      {errors.model && (
                        <p
                          id="vehicle-model-error"
                          className="mt-1.5 text-sm text-rose-600"
                        >
                          {errors.model}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="vehicle-registration"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Registration / License Plate Number
                      </label>
                      <div className="relative text-slate-400">
                        <span className="pointer-events-none absolute left-3.5 top-3.5">
                          <FieldIcon type="tag" />
                        </span>
                        <input
                          id="vehicle-registration"
                          type="text"
                          placeholder="e.g. KA-01-AB-1234"
                          value={form.registrationNumber}
                          onChange={(e) =>
                            updateField("registrationNumber", e.target.value)
                          }
                          aria-invalid={Boolean(errors.registrationNumber)}
                          aria-describedby={
                            errors.registrationNumber
                              ? "vehicle-registration-error"
                              : undefined
                          }
                          className={fieldClass(
                            Boolean(errors.registrationNumber),
                          )}
                        />
                      </div>
                      {errors.registrationNumber && (
                        <p
                          id="vehicle-registration-error"
                          className="mt-1.5 text-sm text-rose-600"
                        >
                          {errors.registrationNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="vehicle-seats"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Total Available Seats
                      </label>
                      <div className="relative text-slate-400">
                        <span className="pointer-events-none absolute left-3.5 top-3.5">
                          <FieldIcon type="users" />
                        </span>
                        <input
                          id="vehicle-seats"
                          type="number"
                          min="1"
                          max="50"
                          placeholder="e.g. 4"
                          value={form.totalSeats}
                          onChange={(e) =>
                            updateField("totalSeats", e.target.value)
                          }
                          aria-invalid={Boolean(errors.totalSeats)}
                          aria-describedby={
                            errors.totalSeats
                              ? "vehicle-seats-error"
                              : undefined
                          }
                          className={fieldClass(Boolean(errors.totalSeats))}
                        />
                      </div>
                      {errors.totalSeats && (
                        <p
                          id="vehicle-seats-error"
                          className="mt-1.5 text-sm text-rose-600"
                        >
                          {errors.totalSeats}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updateMutation.isPending
                        ? "Saving changes..."
                        : "Save changes"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {updatedVehicle && (
        <VehicleSuccessModal
          eyebrow="CHANGES SAVED"
          title="Vehicle updated!"
          message={`Your ${updatedVehicle.make} ${updatedVehicle.model} (${updatedVehicle.registration_number}) has been updated.`}
          actionText="Back to vehicles"
          onClose={handleSuccessModalClose}
        />
      )}
    </main>
  );
}
