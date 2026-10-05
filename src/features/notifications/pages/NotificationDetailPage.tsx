import { Link, useParams } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { useNotificationQuery } from "../hooks/useNotificationQuery";

export default function NotificationDetailPage() {
  const { notificationId = "" } = useParams<{ notificationId: string }>();

  const {
    data: notification,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotificationQuery(notificationId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-5xl animate-pulse rounded-4xl bg-white p-10 shadow-2xl">
          <div className="h-8 w-48 rounded-xl bg-slate-200" />
          <div className="mt-6 h-64 rounded-3xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (isError || !notification) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md flex-col items-center justify-center rounded-4xl bg-white p-8 text-center shadow-xl">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <FieldIcon type="bell" className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Notification not found
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            {error
              ? toApiError(error).message
              : "The requested notification could not be found or has been removed."}
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Retry
            </button>
            <Link
              to={route_paths.notifications}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
            >
              Back to Notifications
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const formattedCreated = notification.created_at
    ? new Date(notification.created_at).toLocaleString()
    : "Recently";

  const formattedRead = notification.read_at
    ? new Date(notification.read_at).toLocaleString()
    : null;

  // Extract contextual IDs if present in metadata
  const metadata = notification.data ?? {};
  const tripId =
    (metadata.trip_id as string | undefined) ??
    (metadata.tripId as string | undefined);
  const bookingId =
    (metadata.booking_id as string | undefined) ??
    (metadata.bookingId as string | undefined);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl rounded-4xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10 lg:p-12">
        {/* Header navigation */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <BrandMark />
            <Link
              to={route_paths.notifications}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              ← Back to Notifications
            </Link>
          </div>
          <Link
            to={route_paths.home}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            Home
          </Link>
        </div>

        {/* Title and badges */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              {notification.type.replace(/_/g, " ")}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {notification.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                notification.is_read
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }`}
            >
              {notification.status}
            </span>
          </div>
        </div>

        {/* Timestamp details */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
          <div>
            <span className="font-medium text-slate-600">Received:</span>{" "}
            {formattedCreated}
          </div>
          {formattedRead && (
            <div>
              <span className="font-medium text-slate-600">Read:</span>{" "}
              {formattedRead}
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-slate-900">Message</h2>
          <p className="mt-3 text-base leading-7 text-slate-700 whitespace-pre-line">
            {notification.message}
          </p>
        </div>

        {/* Metadata section */}
        {Object.keys(metadata).length > 0 && (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-bold text-slate-900">
              Notification Details
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              {Object.entries(metadata).map(([key, val]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <dt className="font-medium text-slate-500 uppercase">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="mt-1 font-mono font-semibold text-slate-900 truncate">
                    {typeof val === "object" ? JSON.stringify(val) : String(val)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Contextual Action Links */}
        {(tripId || bookingId) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {tripId && (
              <Link
                to={route_paths.getTripDetailPath(tripId)}
                className="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                View Trip Details →
              </Link>
            )}
            {bookingId && (
              <Link
                to={route_paths.bookings}
                className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View My Bookings →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
