import { useState } from "react";
import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import PlusIcon from "@shared/ui/PlusIcon";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { useBookingsQuery } from "../hooks/useBookingsQuery";
import { useDeleteBookingMutation } from "../hooks/useDeleteBookingMutation";
import BookingCard from "../components/BookingCard";
import BookingStatsSidebar from "../components/BookingStatsSidebar";
import CancelBookingModal from "../modals/CancelBookingModal";
import type { BookingResponse } from "../types/bookings.api.types";
import type { BookingStatus } from "../types/bookings.type";

const PAGE_LIMIT = 8;
type StatusFilter = "all" | BookingStatus;

const BookingsPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const queryParams = {
    page,
    limit: PAGE_LIMIT,
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
  };

  const {
    data: bookingsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useBookingsQuery(queryParams);

  const cancelMutation = useDeleteBookingMutation();

  const bookings = bookingsData?.items ?? [];
  const totalBookings = bookingsData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalBookings / PAGE_LIMIT));

  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const handleCancelConfirm = () => {
    if (!bookingToCancel) return;

    setCancelError(null);
    cancelMutation.mutate(bookingToCancel.id, {
      onSuccess: () => {
        const idLabel = bookingToCancel.id.slice(0, 8);
        setBookingToCancel(null);
        setFeedback(`Booking #${idLabel} has been successfully cancelled.`);
      },
      onError: (err) => {
        const apiError = toApiError(err);
        setBookingToCancel(null);
        setCancelError(apiError.message);
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        <BookingStatsSidebar
          totalBookings={totalBookings}
          confirmedBookings={confirmedCount}
          pendingBookings={pendingCount}
          isLoading={isLoading}
        />

        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          {/* Mobile Header */}
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

          {/* Top Bar with Title & CTA */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
                RIDER PORTAL
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                My Bookings
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={route_paths.home}
                className="hidden lg:inline-flex items-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                ← Home
              </Link>
              <Link
                to={route_paths.tripsBook}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4" />
                Book a Ride
              </Link>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
            {(["all", "confirmed", "pending", "cancelled"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setStatusFilter(tab);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition cursor-pointer min-h-9 ${
                  statusFilter === tab
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Alerts / Feedback */}
          {feedback && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800"
            >
              {feedback}
            </div>
          )}

          {cancelError && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800"
            >
              {cancelError}
            </div>
          )}

          {/* Main List Area */}
          <div className="mt-6 flex-1">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-48 animate-pulse rounded-3xl border border-slate-100 bg-slate-50"
                  />
                ))}
              </div>
            ) : isError ? (
              <div
                role="alert"
                className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center"
              >
                <p className="text-sm font-semibold text-rose-800">
                  Failed to load bookings
                </p>
                <p className="mt-1 text-xs text-rose-600">
                  {toApiError(error).message}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                >
                  Retry
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <BrandMark />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  No bookings found
                </h3>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  {statusFilter === "all"
                    ? "You haven't reserved any rides yet. Find an upcoming commute and book your seat!"
                    : `No ${statusFilter} bookings found.`}
                </p>
                <Link
                  to={route_paths.tripsBook}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  Find a Ride
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={(b) => setBookingToCancel(b)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {bookingToCancel && (
        <CancelBookingModal
          booking={bookingToCancel}
          isCancelling={cancelMutation.isPending}
          onConfirm={handleCancelConfirm}
          onClose={() => setBookingToCancel(null)}
        />
      )}
    </main>
  );
};

export default BookingsPage;
