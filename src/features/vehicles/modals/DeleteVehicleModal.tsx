import TrashIcon from "@shared/ui/TrashIcon";
import type { VehicleResponse } from "../types/vehicles.api.types";

export type DeleteVehicleModalProps = {
  vehicle: VehicleResponse;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteVehicleModal({
  vehicle,
  isDeleting = false,
  onConfirm,
  onClose,
}: DeleteVehicleModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-vehicle-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-100 text-rose-600">
          <TrashIcon className="h-8 w-8" />
        </div>
        <p className="mt-5 text-xs font-bold tracking-widest text-rose-600">
          CONFIRM REMOVAL
        </p>
        <h2
          id="delete-vehicle-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Delete vehicle?
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Are you sure you want to delete your{" "}
          <span className="font-semibold text-slate-900">
            {vehicle.make} {vehicle.model}
          </span>{" "}
          (
          <span className="font-mono font-medium text-slate-700">
            {vehicle.registration_number}
          </span>
          )? This action cannot be undone.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete vehicle"}
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
