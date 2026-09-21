import TrashIcon from "@shared/ui/TrashIcon";
import type { RidePreferenceResponse } from "../types/ridePreferences.api.types";

export type DeleteRidePreferenceModalProps = {
  preference: RidePreferenceResponse;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteRidePreferenceModal({
  preference,
  isDeleting = false,
  onConfirm,
  onClose,
}: DeleteRidePreferenceModalProps) {
  const sourceName = preference.source?.name ?? "Origin";
  const destName = preference.destination?.name ?? "Destination";
  const label = preference.label?.trim() || `${sourceName} → ${destName}`;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-preference-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-100 text-rose-600">
          <TrashIcon className="h-8 w-8" />
        </div>
        <p className="mt-5 text-xs font-bold tracking-widest text-rose-600 uppercase">
          Confirm Removal
        </p>
        <h2
          id="delete-preference-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Delete preference?
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-slate-900">{label}</span>? This
          action cannot be undone and matches will no longer be generated for
          this preference.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete preference"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
