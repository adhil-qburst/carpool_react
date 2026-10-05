import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { useRidePreferenceQuery } from "../hooks/useRidePreferenceQuery";
import { useUpdateRidePreferenceMutation } from "../hooks/useUpdateRidePreferenceMutation";
import RidePreferenceForm from "../components/RidePreferenceForm";
import type { RidePreferenceFormData } from "../components/RidePreferenceForm";

export default function EditRidePreferencePage() {
  const { preferenceId = "" } = useParams<{ preferenceId: string }>();
  const navigate = useNavigate();

  const preferenceQuery = useRidePreferenceQuery(preferenceId);
  const updateMutation = useUpdateRidePreferenceMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const pref = preferenceQuery.data;

  function handleSubmit(data: RidePreferenceFormData) {
    setFormError(null);
    updateMutation.mutate(
      {
        preferenceId,
        payload: {
          sourceLocationId: data.sourceLocationId,
          destinationLocationId: data.destinationLocationId,
          preferredDepartureTime: data.preferredDepartureTime,
          seatsNeeded: data.seatsNeeded,
          isActive: data.isActive,
          label: data.label,
        },
      },
      {
        onSuccess: () => {
          navigate(route_paths.ridePreferences);
        },
        onError: (err) => {
          const parsed = toApiError(err);
          setFormError(parsed.message || "Failed to update ride preference.");
        },
      },
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        {/* Left pane */}
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
              Update Routine
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white">
              Edit your commute preference.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Adjust your timing, pickup/drop-off points, or needed seats to
              keep your ride-matching recommendations accurate.
            </p>
          </div>
        </aside>

        {/* Right pane */}
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
                Edit Ride Preference
              </h2>
            </div>

            {preferenceQuery.isLoading ? (
              <div className="py-20 text-center text-slate-400">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                <p className="mt-4 text-sm font-medium">
                  Loading preference details...
                </p>
              </div>
            ) : preferenceQuery.isError || !pref ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center text-rose-800">
                <p className="font-semibold">Preference not found.</p>
                <Link
                  to={route_paths.ridePreferences}
                  className="mt-4 inline-block text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Return to Ride Preferences
                </Link>
              </div>
            ) : (
              <RidePreferenceForm
                key={pref.id}
                initialValues={{
                  sourceLocationId: pref.source_location_id,
                  destinationLocationId: pref.destination_location_id,
                  preferredDepartureTime: pref.preferred_departure_time
                    ? pref.preferred_departure_time.slice(0, 5)
                    : null,
                  seatsNeeded: pref.seats_needed,
                  isActive: pref.is_active,
                  label: pref.label ?? "",
                }}
                initialSource={
                  pref.source
                    ? {
                        id: pref.source.id,
                        name: pref.source.name,
                        city: pref.source.city,
                      }
                    : null
                }
                initialDestination={
                  pref.destination
                    ? {
                        id: pref.destination.id,
                        name: pref.destination.name,
                        city: pref.destination.city,
                      }
                    : null
                }
                isSubmitting={updateMutation.isPending}
                submitLabel="Save Changes"
                formError={formError}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
