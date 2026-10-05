import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import LocationCombobox from "@features/locations/components/LocationCombobox";
import type { SelectedLocation } from "@features/locations/components/LocationCombobox";
import { route_paths } from "@core/router/route_paths";

export interface RidePreferenceFormData {
  label?: string | null;
  sourceLocationId: string;
  destinationLocationId: string;
  preferredDepartureTime?: string | null;
  seatsNeeded?: number | string;
  isActive?: boolean;
}

export type PreferenceFormErrors = Partial<
  Record<keyof RidePreferenceFormData, string>
>;

export function validatePreferenceForm(
  form: RidePreferenceFormData,
): PreferenceFormErrors {
  const errors: PreferenceFormErrors = {};

  if (!form.sourceLocationId || !form.sourceLocationId.trim()) {
    errors.sourceLocationId = "Please select an origin location.";
  }

  if (!form.destinationLocationId || !form.destinationLocationId.trim()) {
    errors.destinationLocationId = "Please select a destination location.";
  } else if (
    form.sourceLocationId &&
    form.sourceLocationId.trim() === form.destinationLocationId.trim()
  ) {
    errors.destinationLocationId =
      "Destination cannot be the same as origin location.";
  }

  const seats = Number(form.seatsNeeded);
  if (!form.seatsNeeded || Number.isNaN(seats) || seats < 1 || seats > 8) {
    errors.seatsNeeded = "Seats needed must be a whole number between 1 and 8.";
  }

  if (form.label && form.label.trim().length > 100) {
    errors.label = "Label cannot exceed 100 characters.";
  }

  return errors;
}

export function fieldClass(hasError: boolean): string {
  return hasError
    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100";
}

export interface RidePreferenceFormProps {
  initialValues?: Partial<RidePreferenceFormData>;
  initialSource?: SelectedLocation | null;
  initialDestination?: SelectedLocation | null;
  isSubmitting?: boolean;
  submitLabel: string;
  formError?: string | null;
  onSubmit: (data: RidePreferenceFormData) => void;
}

export default function RidePreferenceForm({
  initialValues,
  initialSource = null,
  initialDestination = null,
  isSubmitting = false,
  submitLabel,
  formError = null,
  onSubmit,
}: RidePreferenceFormProps) {
  const [form, setForm] = useState<RidePreferenceFormData>({
    sourceLocationId: initialValues?.sourceLocationId ?? "",
    destinationLocationId: initialValues?.destinationLocationId ?? "",
    preferredDepartureTime: initialValues?.preferredDepartureTime ?? null,
    seatsNeeded: initialValues?.seatsNeeded ?? 1,
    isActive: initialValues?.isActive ?? true,
    label: initialValues?.label ?? "",
  });

  const [selectedSource, setSelectedSource] =
    useState<SelectedLocation | null>(initialSource);
  const [selectedDestination, setSelectedDestination] =
    useState<SelectedLocation | null>(initialDestination);

  const [errors, setErrors] = useState<PreferenceFormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validatePreferenceForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...form,
      preferredDepartureTime: form.preferredDepartureTime?.trim() || null,
      label: form.label?.trim() || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
      {formError && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-800"
        >
          {formError}
        </div>
      )}

      <div>
        <label
          htmlFor="pref-label"
          className="block text-sm font-semibold text-slate-700"
        >
          Routine Label{" "}
          <span className="text-xs font-normal text-slate-400">(Optional)</span>
        </label>
        <input
          id="pref-label"
          type="text"
          value={form.label ?? ""}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, label: e.target.value }));
            if (errors.label) {
              setErrors((prev) => ({ ...prev, label: undefined }));
            }
          }}
          placeholder="e.g. Daily Office Commute"
          className={`mt-2 w-full rounded-2xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition focus:bg-white focus:outline-none focus:ring-4 ${fieldClass(
            Boolean(errors.label),
          )}`}
        />
        {errors.label && (
          <p className="mt-1.5 text-xs text-rose-600">{errors.label}</p>
        )}
      </div>

      <div>
        <LocationCombobox
          id="source-location"
          label="Origin / Pickup Stop"
          placeholder="Select pickup location..."
          required
          selectedLocation={selectedSource}
          onSelect={(loc) => {
            setSelectedSource(loc);
            setForm((prev) => ({ ...prev, sourceLocationId: loc.id }));
            if (errors.sourceLocationId) {
              setErrors((prev) => ({ ...prev, sourceLocationId: undefined }));
            }
          }}
          onClear={() => {
            setSelectedSource(null);
            setForm((prev) => ({ ...prev, sourceLocationId: "" }));
          }}
          hasError={Boolean(errors.sourceLocationId)}
          errorMessage={errors.sourceLocationId}
        />
      </div>

      <div>
        <LocationCombobox
          id="destination-location"
          label="Destination"
          placeholder="Select drop-off location..."
          required
          selectedLocation={selectedDestination}
          disabledLocationIds={selectedSource ? [selectedSource.id] : []}
          onSelect={(loc) => {
            setSelectedDestination(loc);
            setForm((prev) => ({ ...prev, destinationLocationId: loc.id }));
            if (errors.destinationLocationId) {
              setErrors((prev) => ({
                ...prev,
                destinationLocationId: undefined,
              }));
            }
          }}
          onClear={() => {
            setSelectedDestination(null);
            setForm((prev) => ({ ...prev, destinationLocationId: "" }));
          }}
          hasError={Boolean(errors.destinationLocationId)}
          errorMessage={errors.destinationLocationId}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="preferred-time"
              className="block text-sm font-semibold text-slate-700"
            >
              Departure Time{" "}
              <span className="text-xs font-normal text-slate-400">
                (Optional)
              </span>
            </label>
            {Boolean(form.preferredDepartureTime) && (
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    preferredDepartureTime: null,
                  }))
                }
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Clear time
              </button>
            )}
          </div>
          <input
            id="preferred-time"
            type="time"
            value={form.preferredDepartureTime ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                preferredDepartureTime: e.target.value || null,
              }))
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="seats-needed"
            className="block text-sm font-semibold text-slate-700"
          >
            Seats Needed <span className="text-rose-500">*</span>
          </label>
          <input
            id="seats-needed"
            type="number"
            min={1}
            max={8}
            value={form.seatsNeeded ?? 1}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, seatsNeeded: e.target.value }));
              if (errors.seatsNeeded) {
                setErrors((prev) => ({ ...prev, seatsNeeded: undefined }));
              }
            }}
            className={`mt-2 w-full rounded-2xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 transition focus:bg-white focus:outline-none focus:ring-4 ${fieldClass(
              Boolean(errors.seatsNeeded),
            )}`}
          />
          {errors.seatsNeeded && (
            <p className="mt-1.5 text-xs text-rose-600">{errors.seatsNeeded}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          id="is-active"
          type="checkbox"
          checked={form.isActive ?? true}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, isActive: e.target.checked }))
          }
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor="is-active"
          className="text-sm font-medium text-slate-700 cursor-pointer select-none"
        >
          Enable preference for automatic trip matches
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        <Link
          to={route_paths.ridePreferences}
          className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
