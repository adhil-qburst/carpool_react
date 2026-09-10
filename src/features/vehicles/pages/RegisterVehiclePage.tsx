import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import { toApiError } from "@core/api/apiError";
import VehicleSuccessModal from "../modals/VehicleSuccessModal";
import { useRegisterVehicleMutation } from "../hooks/useRegisterVehicleMutation";
import type {
  CreateVehicleForm,
  VehicleFormErrors,
} from "../types/vehicles.type";
import type { VehicleResponse } from "../types/vehicles.api.types";
import { route_paths } from "@core/router/route_paths";

const initialForm: CreateVehicleForm = {
  make: "",
  model: "",
  registrationNumber: "",
  totalSeats: "",
};

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

export default function RegisterVehiclePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateVehicleForm>(initialForm);
  const [errors, setErrors] = useState<VehicleFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [registeredVehicle, setRegisteredVehicle] =
    useState<VehicleResponse | null>(null);

  const registerMutation = useRegisterVehicleMutation();

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
    setFormError(null);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    registerMutation.mutate(form, {
      onSuccess: (data) => {
        setRegisteredVehicle(data);
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
            apiError.fieldErrors.total_seats ?? apiError.fieldErrors.totalSeats;
        }

        const hasFieldErrors = Object.keys(fieldErrors).length > 0;
        setErrors((previous) => ({ ...previous, ...fieldErrors }));
        setFormError(hasFieldErrors ? null : apiError.message);
      },
    });
  }

  function handleSuccessModalClose() {
    setRegisteredVehicle(null);
    navigate(route_paths.vehicles);
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
              DRIVER DASHBOARD
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white">
              Add your vehicle and start offering rides.
            </h1>
            <p className="mt-5 max-w-xs text-base leading-7 text-slate-300">
              Register your car to unlock driver perks, share empty seats, and
              lower your daily travel expenses.
            </p>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/[.07] p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-wider text-indigo-300">
              DID YOU KNOW?
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              Drivers on Carpool offset up to 70% of fuel costs by filling 2 or
              more seats on regular daily commutes.
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
                to={route_paths.vehicles}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Back to vehicles
              </Link>
            </div>

            <div className="mt-8 lg:mt-0">
              <div className="hidden lg:block">
                <Link
                  to={route_paths.vehicles}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  ← Back to vehicles
                </Link>
              </div>

              <p className="mt-4 text-sm font-semibold text-indigo-600">
                VEHICLE REGISTRATION
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Register a vehicle
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-slate-500">
                Provide your vehicle details to make it available for rides.
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
                      placeholder="e.g. Toyota, Honda, Ford"
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
                    <p id="vehicle-make-error" className="mt-1.5 text-sm text-rose-600">
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
                      placeholder="e.g. Camry, Civic, Focus"
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
                      className={fieldClass(Boolean(errors.registrationNumber))}
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
                      onChange={(e) => updateField("totalSeats", e.target.value)}
                      aria-invalid={Boolean(errors.totalSeats)}
                      aria-describedby={
                        errors.totalSeats ? "vehicle-seats-error" : undefined
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
                  disabled={registerMutation.isPending}
                  className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {registerMutation.isPending
                    ? "Registering vehicle..."
                    : "Register vehicle"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {registeredVehicle && (
        <VehicleSuccessModal
          eyebrow="VEHICLE REGISTERED"
          title="Vehicle registered!"
          message={`Your ${registeredVehicle.make} ${registeredVehicle.model} (${registeredVehicle.registration_number}) has been added to your garage.`}
          actionText="View all vehicles"
          onClose={handleSuccessModalClose}
        />
      )}
    </main>
  );
}
