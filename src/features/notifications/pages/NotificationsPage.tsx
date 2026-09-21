import { useState, useMemo } from "react";
import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";
import { useNotificationsQuery } from "../hooks/useNotificationsQuery";
import { useNotificationUnreadCountQuery } from "../hooks/useNotificationUnreadCountQuery";
import NotificationStatsSidebar from "../components/NotificationStatsSidebar";
import NotificationCard from "../components/NotificationCard";
import NotificationDetailModal from "../modals/NotificationDetailModal";
import type { NotificationResponse } from "../types/notifications.api.types";
import type { NotificationStatus } from "../types/notifications.type";

const PAGE_LIMIT = 8;
type StatusFilter = "all" | NotificationStatus;

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationResponse | null>(null);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    }),
    [page, statusFilter],
  );

  const {
    data: notificationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotificationsQuery(queryParams);

  const { data: unreadData } = useNotificationUnreadCountQuery();

  const notifications = notificationsData?.items ?? [];
  const totalNotifications = notificationsData?.total ?? 0;
  const unreadCount =
    unreadData?.unread_count ?? notificationsData?.unread_count ?? 0;
  const readCount = Math.max(0, totalNotifications - unreadCount);
  const totalPages = Math.max(1, Math.ceil(totalNotifications / PAGE_LIMIT));

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        <NotificationStatsSidebar
          totalNotifications={totalNotifications}
          unreadCount={unreadCount}
          readCount={readCount}
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

          {/* Header Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
                NOTIFICATION INBOX
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Notifications
              </h1>
            </div>

            <Link
              to={route_paths.home}
              className="hidden lg:inline-flex items-center rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              ← Home
            </Link>
          </div>

          {/* Status Filter Tabs */}
          <div className="mt-5 flex flex-wrap gap-2">
            {(["all", "unread", "read", "archived"] as const).map((tab) => (
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

          {/* Main Content Area */}
          <div className="mt-6 flex-1">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-40 animate-pulse rounded-3xl border border-slate-100 bg-slate-50"
                  />
                ))}
              </div>
            ) : isError ? (
              <div
                role="alert"
                className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center"
              >
                <p className="text-sm font-semibold text-rose-800">
                  Failed to load notifications
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
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FieldIcon type="bell" className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  No notifications
                </h3>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  {statusFilter === "all"
                    ? "You are completely caught up! We will alert you here when new trip or booking updates occur."
                    : `No ${statusFilter} notifications found.`}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {notifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    notification={item}
                    onViewDetails={(n) => setSelectedNotification(n)}
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
                className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
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
                className="rounded-lg px-3 py-1.5 transition hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </main>
  );
};

export default NotificationsPage;
