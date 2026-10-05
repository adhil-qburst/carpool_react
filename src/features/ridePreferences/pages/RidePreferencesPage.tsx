import { useState } from "react";
import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";
import { route_paths } from "@core/router/route_paths";
import { useRidePreferencesQuery } from "../hooks/useRidePreferencesQuery";
import { useUpdateRidePreferenceMutation } from "../hooks/useUpdateRidePreferenceMutation";
import { useDeleteRidePreferenceMutation } from "../hooks/useDeleteRidePreferenceMutation";
import DeleteRidePreferenceModal from "../modals/DeleteRidePreferenceModal";
import type { RidePreferenceResponse } from "../types/ridePreferences.api.types";

function formatTime(timeStr?: string | null): string {
  if (!timeStr) return "Flexible time";
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    if (!Number.isNaN(hours)) {
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    }
  }
  return timeStr;
}

export default function RidePreferencesPage() {
  const [filterActive, setFilterActive] = useState(false);
  const [prefToDelete, setPrefToDelete] =
    useState<RidePreferenceResponse | null>(null);

  const preferencesQuery = useRidePreferencesQuery(
    filterActive ? { activeOnly: true } : undefined,
  );
  const updateMutation = useUpdateRidePreferenceMutation();
  const deleteMutation = useDeleteRidePreferenceMutation();

  const preferences = preferencesQuery.data ?? [];
  const activeCount = preferences.filter((p) => p.is_active).length;

  function handleToggleStatus(preference: RidePreferenceResponse) {
    updateMutation.mutate({
      preferenceId: preference.id,
      payload: {
        is_active: !preference.is_active,
      },
    });
  }

  function handleDeleteConfirm() {
    if (!prefToDelete) return;
    deleteMutation.mutate(prefToDelete.id, {
      onSuccess: () => setPrefToDelete(null),
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        {/* Left pane: Branding & metrics */}
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight">Carpool</span>
            </div>
            <Link
              to={route_paths.home}
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              ← Home
            </Link>
          </div>

          <div className="relative my-auto max-w-sm">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100 uppercase">
              Commute Preferences
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white">
              Automate your daily carpool routines.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Save favorite routes and preferred departure times to quickly find
              matching drivers or passengers without manually searching each
              time.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold">
                {preferencesQuery.isLoading ? "–" : preferences.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">Total Preferences</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold text-emerald-400">
                {preferencesQuery.isLoading ? "–" : activeCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">Active Routines</p>
            </div>
          </div>
        </aside>

        {/* Right pane: Content and actions */}
        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between lg:hidden mb-6">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight text-slate-950">
                Carpool
              </span>
            </div>
            <Link
              to={route_paths.home}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Home
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
                Rider Settings
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Ride Preferences
              </h2>
            </div>
            <Link
              to={route_paths.ridePreferencesNew}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Preference</span>
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterActive(false)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                !filterActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Preferences
            </button>
            <button
              type="button"
              onClick={() => setFilterActive(true)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filterActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Active Only
            </button>
          </div>

          {/* Body content */}
          {preferencesQuery.isLoading ? (
            <div className="my-auto flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
              <p className="mt-4 text-sm font-medium">
                Loading ride preferences...
              </p>
            </div>
          ) : preferencesQuery.isError ? (
            <div className="my-auto rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center text-rose-800">
              <p className="font-semibold">Unable to load ride preferences.</p>
              <p className="mt-1 text-sm text-rose-600">
                Please check your network connection and try again.
              </p>
            </div>
          ) : preferences.length === 0 ? (
            <div className="my-auto rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FieldIcon type="clock" className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-semibold text-slate-900">
                No ride preferences found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {filterActive
                  ? "You have no active ride preferences right now."
                  : "Add your usual commute times and locations for quick booking."}
              </p>
              <Link
                to={route_paths.ridePreferencesNew}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                <PlusIcon className="h-3.5 w-3.5" />
                <span>Add first preference</span>
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {preferences.map((pref) => {
                const sourceName = pref.source?.name ?? "Origin";
                const sourceCity = pref.source?.city ?? "";
                const destName = pref.destination?.name ?? "Destination";
                const destCity = pref.destination?.city ?? "";
                const displayLabel =
                  pref.label?.trim() || `${sourceName} → ${destName}`;

                return (
                  <div
                    key={pref.id}
                    className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            pref.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {pref.is_active ? "Active" : "Inactive"}
                        </span>
                        <h3 className="truncate text-base font-bold text-slate-900">
                          {displayLabel}
                        </h3>
                      </div>

                      <div className="flex flex-col gap-1 text-xs text-slate-600 sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex items-center gap-1">
                          <FieldIcon
                            type="pin"
                            className="h-3.5 w-3.5 text-indigo-500 shrink-0"
                          />
                          <span className="font-semibold">{sourceName}</span>
                          {sourceCity && (
                            <span className="text-slate-400">
                              ({sourceCity})
                            </span>
                          )}
                          <span className="text-slate-400">→</span>
                          <span className="font-semibold">{destName}</span>
                          {destCity && (
                            <span className="text-slate-400">({destCity})</span>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                          <FieldIcon type="clock" className="h-3 w-3" />
                          <span>{formatTime(pref.preferred_departure_time)}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                          <FieldIcon type="users" className="h-3 w-3" />
                          <span>
                            {pref.seats_needed}{" "}
                            {pref.seats_needed === 1 ? "seat" : "seats"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(pref)}
                        disabled={updateMutation.isPending}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          pref.is_active
                            ? "border border-slate-200 text-slate-600 hover:bg-slate-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                        title={
                          pref.is_active
                            ? "Deactivate preference"
                            : "Activate preference"
                        }
                      >
                        {pref.is_active ? "Deactivate" : "Activate"}
                      </button>

                      <Link
                        to={route_paths.getRidePreferenceEditPath(pref.id)}
                        className="rounded-xl p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        title="Edit preference"
                        aria-label={`Edit ${displayLabel}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setPrefToDelete(pref)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete preference"
                        aria-label={`Delete ${displayLabel}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {prefToDelete && (
        <DeleteRidePreferenceModal
          preference={prefToDelete}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setPrefToDelete(null)}
        />
      )}
    </main>
  );
}
