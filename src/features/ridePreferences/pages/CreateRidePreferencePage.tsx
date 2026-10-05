import { useState } from "react";
import { Link, useNavigate } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { useCreateRidePreferenceMutation } from "../hooks/useCreateRidePreferenceMutation";
import RidePreferenceForm from "../components/RidePreferenceForm";
import type { RidePreferenceFormData } from "../components/RidePreferenceForm";

export {
  validatePreferenceForm,
  fieldClass,
} from "../components/RidePreferenceForm";
export type { PreferenceFormErrors } from "../components/RidePreferenceForm";

export default function CreateRidePreferencePage() {
  const navigate = useNavigate();
  const createMutation = useCreateRidePreferenceMutation();
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(data: RidePreferenceFormData) {
    setFormError(null);
    createMutation.mutate(
      {
        sourceLocationId: data.sourceLocationId,
        destinationLocationId: data.destinationLocationId,
        preferredDepartureTime: data.preferredDepartureTime,
        seatsNeeded: data.seatsNeeded,
        isActive: data.isActive,
        label: data.label,
      },
      {
        onSuccess: () => {
          navigate(route_paths.ridePreferences);
        },
        onError: (err) => {
          const parsed = toApiError(err);
          setFormError(parsed.message || "Failed to create ride preference.");
        },
      },
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        {/* Left pane: Branding & Context */}
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight">Carpool</span>
            </div>
            <Link
              to={route_paths.ridePreferences}
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              ← Back
            </Link>
          </div>

          <div className="relative my-auto max-w-sm">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100 uppercase">
              New Routine
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white">
              Define your regular commute routine.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Specify your usual start point, work or campus destination, and
              preferred departure time. Departure time is optional if you have
              flexible hours.
            </p>
          </div>
        </aside>

        {/* Right pane: Form area */}
        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between lg:hidden mb-6">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight text-slate-950">
                Carpool
              </span>
            </div>
            <Link
              to={route_paths.ridePreferences}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Back
            </Link>
          </div>

          <div className="mx-auto w-full max-w-lg my-auto">
            <div className="border-b border-slate-100 pb-5">
              <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
                Preferences
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Create Ride Preference
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Save a recurring commute pattern to find matching rides quickly.
              </p>
            </div>

            <RidePreferenceForm
              isSubmitting={createMutation.isPending}
              submitLabel="Save Ride Preference"
              formError={formError}
              onSubmit={handleSubmit}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
