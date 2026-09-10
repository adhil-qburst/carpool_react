import { useState } from "react";
import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";
import { toApiError } from "@core/api/apiError";
import { useVehiclesQuery } from "../hooks/useVehiclesQuery";
import { useDeleteVehicleMutation } from "../hooks/useDeleteVehicleMutation";
import DeleteVehicleModal from "../modals/DeleteVehicleModal";
import type { VehicleResponse } from "../types/vehicles.api.types";
import { route_paths } from "@core/router/route_paths";

export default function VehiclesPage() {
  const { data: vehicles, isLoading, isError, error, refetch } = useVehiclesQuery();
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleResponse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteMutation = useDeleteVehicleMutation();

  const totalSeats =
    vehicles?.reduce((sum, v) => sum + (v.total_seats || 0), 0) ?? 0;

  function handleDeleteConfirm() {
    if (!vehicleToDelete) return;

    setDeleteError(null);
    deleteMutation.mutate(vehicleToDelete.id, {
      onSuccess: () => {
        const deletedName = `${vehicleToDelete.make} ${vehicleToDelete.model}`;
        setVehicleToDelete(null);
        setFeedback(`"${deletedName}" has been removed from your garage.`);
      },
      onError: (err) => {
        const apiError = toApiError(err);
        setDeleteError(apiError.message);
      },
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <BrandMark />
            <span className="text-lg font-bold tracking-tight">Carpool</span>
          </div>

          <div className="relative my-auto max-w-sm">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100">
              MY GARAGE
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white">
              Manage your fleet and shared seats.
            </h1>
            <p className="mt-5 max-w-xs text-base leading-7 text-slate-300">
              Keep your vehicles up to date to make organizing carpool routes
              effortless for both you and your riders.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold">
                {isLoading ? "–" : vehicles?.length ?? 0}
              </p>
              <p className="mt-1 text-xs text-slate-400">Registered vehicles</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold">
                {isLoading ? "–" : totalSeats}
              </p>
              <p className="mt-1 text-xs text-slate-400">Total seat capacity</p>
            </div>
          </div>
        </aside>

        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Carpool
              </span>
            </div>
            <Link
              to={route_paths.home}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Dashboard
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-0">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                DRIVER VEHICLES
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                My Vehicles
              </h1>
              <p className="mt-1 text-[15px] leading-6 text-slate-500">
                View, register, and update your vehicles for carpool routes.
              </p>
            </div>

            <Link
              to={route_paths.vehiclesNew}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              <PlusIcon className="h-4 w-4" />
              Register vehicle
            </Link>
          </div>

          {feedback && (
            <div
              role="status"
              className="mt-6 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <span>{feedback}</span>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="ml-3 font-semibold text-emerald-700 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {deleteError && (
            <div
              role="alert"
              className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600"
            >
              {deleteError}
            </div>
          )}

          <div className="mt-8 flex-1">
            {isLoading && (
              <div
                role="status"
                className="grid place-items-center rounded-2xl border border-slate-200 bg-white p-12 text-center"
              >
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="mt-4 text-sm font-medium text-slate-600">
                  Loading vehicles...
                </p>
              </div>
            )}

            {isError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
                <p className="text-base font-semibold text-rose-700">
                  Could not load your vehicles
                </p>
                <p className="mt-1 text-sm text-rose-600">
                  {error instanceof Error ? error.message : "An error occurred."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-4 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-rose-700"
                >
                  Try again
                </button>
              </div>
            )}

            {!isLoading && !isError && vehicles && vehicles.length === 0 && (
              <div className="grid place-items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center sm:p-14">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FieldIcon type="car" className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  No vehicles registered yet
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  You haven&rsquo;t added any vehicles. Add a car to your garage to start
                  offering rides on your commute.
                </p>
                <Link
                  to={route_paths.vehiclesNew}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  Register your first vehicle
                </Link>
              </div>
            )}

            {!isLoading && !isError && vehicles && vehicles.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                            {vehicle.make}
                          </p>
                          <h2 className="text-lg font-bold text-slate-950">
                            {vehicle.model}
                          </h2>
                        </div>
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700 tracking-wider">
                          {vehicle.registration_number}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                        <FieldIcon type="users" className="h-4 w-4 text-slate-400" />
                        <span>
                          <strong className="font-semibold text-slate-900">
                            {vehicle.total_seats}
                          </strong>{" "}
                          available {vehicle.total_seats === 1 ? "seat" : "seats"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                      <Link
                        to={route_paths.getVehicleEditPath(vehicle.id)}
                        aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setVehicleToDelete(vehicle)}
                        aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {vehicleToDelete && (
        <DeleteVehicleModal
          vehicle={vehicleToDelete}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setVehicleToDelete(null)}
        />
      )}
    </main>
  );
}
