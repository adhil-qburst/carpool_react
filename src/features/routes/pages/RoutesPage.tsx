import { useState } from "react";
import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import TrashIcon from "@shared/ui/TrashIcon";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { useRoutesQuery } from "../hooks/useRoutesQuery";
import { useDeleteRouteMutation } from "../hooks/useDeleteRouteMutation";
import DeleteRouteModal from "../modals/DeleteRouteModal";
import type { RouteResponse } from "../types/routes.api.types";

const PAGE_LIMIT = 10;

export default function RoutesPage() {
  const [page, setPage] = useState(1);
  const [routeToDelete, setRouteToDelete] = useState<RouteResponse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: routesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useRoutesQuery({ page, limit: PAGE_LIMIT });

  const deleteMutation = useDeleteRouteMutation();

  const routes = routesData?.items ?? [];
  const totalRoutes = routesData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRoutes / PAGE_LIMIT));

  const totalStopsOnPage = routes.reduce(
    (sum, r) => sum + (r.route_stops?.length || 0),
    0,
  );

  function handleDeleteConfirm() {
    if (!routeToDelete) return;

    setDeleteError(null);
    deleteMutation.mutate(routeToDelete.id, {
      onSuccess: () => {
        const deletedName = routeToDelete.name;
        setRouteToDelete(null);
        setFeedback(`"${deletedName}" has been successfully deleted.`);
      },
      onError: (err) => {
        const apiError = toApiError(err);
        setRouteToDelete(null);
        setDeleteError(apiError.message);
      },
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        {/* Left Branding & Highlights Pane */}
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <BrandMark />
            <span className="text-lg font-bold tracking-tight">Carpool</span>
          </div>

          <div className="relative my-auto max-w-sm">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100 uppercase">
              MY ROUTES
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white">
              Manage your daily carpool routes.
            </h1>
            <p className="mt-5 max-w-xs text-base leading-7 text-slate-300">
              Review your routes, pickup locations, and stops to organize smooth
              rides for your passengers.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold">
                {isLoading ? "–" : totalRoutes}
              </p>
              <p className="mt-1 text-xs text-slate-400">Total routes</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold">
                {isLoading ? "–" : totalStopsOnPage}
              </p>
              <p className="mt-1 text-xs text-slate-400">Stops configured</p>
            </div>
          </div>
        </aside>

        {/* Right Content Pane */}
        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
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
              Dashboard
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-0">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase">
                DRIVER ROUTES
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                My Routes
              </h1>
              <p className="mt-1 text-[15px] leading-6 text-slate-500">
                View, create, and manage your defined carpool routes.
              </p>
            </div>

            <Link
              to={route_paths.routesNew}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              <PlusIcon className="h-4 w-4" />
              Create route
            </Link>
          </div>

          {feedback && (
            <div
              role="status"
              className="mt-6 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 border border-emerald-100"
            >
              <span>{feedback}</span>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="ml-3 font-semibold text-emerald-700 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {deleteError && (
            <div
              role="alert"
              className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 border border-rose-100"
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
                  Loading routes...
                </p>
              </div>
            )}

            {isError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
                <p className="text-base font-semibold text-rose-700">
                  Could not load your routes
                </p>
                <p className="mt-1 text-sm text-rose-600">
                  {error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."}
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

            {!isLoading && !isError && routes.length === 0 && (
              <div className="grid place-items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 text-center sm:p-14">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FieldIcon type="pin" className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  No routes created yet
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  You haven&rsquo;t configured any travel routes yet. Create a route
                  with ordered pickup and dropoff points to start sharing rides.
                </p>
                <Link
                  to={route_paths.routesNew}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create your first route
                </Link>
              </div>
            )}

            {!isLoading && !isError && routes.length > 0 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {routes.map((route) => {
                    const sortedStops = [...(route.route_stops ?? [])].sort(
                      (a, b) => a.sequence - b.sequence,
                    );
                    const stopCount = sortedStops.length;

                    return (
                      <div
                        key={route.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <h2 className="text-lg font-bold text-slate-950">
                              {route.name}
                            </h2>
                            <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                              {stopCount} {stopCount === 1 ? "stop" : "stops"}
                            </span>
                          </div>

                          <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Stop Sequence
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              {sortedStops.map((stop, index) => {
                                const isStart = index === 0;
                                const isEnd = index === sortedStops.length - 1;
                                const label = isStart
                                  ? "Start"
                                  : isEnd
                                    ? "End"
                                    : `Stop ${index + 1}`;

                                return (
                                  <span
                                    key={stop.id}
                                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                                      isStart
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : isEnd
                                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                                          : "bg-slate-100 text-slate-700"
                                    }`}
                                  >
                                    {label}
                                    {index < sortedStops.length - 1 && (
                                      <span className="ml-1 text-slate-300">
                                        →
                                      </span>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                          <Link
                            to={route_paths.getRouteEditPath(route.id)}
                            state={{ route }}
                            aria-label={`Edit ${route.name}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => setRouteToDelete(route)}
                            aria-label={`Delete ${route.name}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200 cursor-pointer"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600">
                      Page <span className="font-semibold">{page}</span> of{" "}
                      <span className="font-semibold">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {routeToDelete && (
        <DeleteRouteModal
          route={routeToDelete}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setRouteToDelete(null)}
        />
      )}
    </main>
  );
}
