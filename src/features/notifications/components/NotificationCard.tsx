import { Link } from "react-router";
import FieldIcon, { type FieldIconType } from "@shared/ui/FieldIcon";
import { route_paths } from "@core/router/route_paths";
import type { NotificationResponse } from "../types/notifications.api.types";
import type { NotificationType } from "../types/notifications.type";

export type NotificationCardProps = {
  notification: NotificationResponse;
  onViewDetails?: (notification: NotificationResponse) => void;
};

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: FieldIconType; badgeClass: string; iconBgClass: string; iconColorClass: string }
> = {
  booking_confirmation: {
    label: "Booking Confirmed",
    icon: "tag",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBgClass: "bg-emerald-50",
    iconColorClass: "text-emerald-600",
  },
  booking_request: {
    label: "Booking Request",
    icon: "person",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    iconBgClass: "bg-indigo-50",
    iconColorClass: "text-indigo-600",
  },
  booking_cancelled: {
    label: "Booking Cancelled",
    icon: "tag",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    iconBgClass: "bg-rose-50",
    iconColorClass: "text-rose-600",
  },
  booking_rejected: {
    label: "Booking Rejected",
    icon: "tag",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    iconBgClass: "bg-rose-50",
    iconColorClass: "text-rose-600",
  },
  trip_cancelled: {
    label: "Trip Cancelled",
    icon: "car",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    iconBgClass: "bg-rose-50",
    iconColorClass: "text-rose-600",
  },
  trip_updated: {
    label: "Trip Updated",
    icon: "calendar",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    iconBgClass: "bg-amber-50",
    iconColorClass: "text-amber-600",
  },
  system: {
    label: "System",
    icon: "bell",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    iconBgClass: "bg-slate-100",
    iconColorClass: "text-slate-600",
  },
};

const NotificationCard = ({
  notification,
  onViewDetails,
}: NotificationCardProps) => {
  const typeInfo = TYPE_CONFIG[notification.type] ?? {
    label: notification.type,
    icon: "bell" as FieldIconType,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    iconBgClass: "bg-indigo-50",
    iconColorClass: "text-indigo-600",
  };

  const isUnread = !notification.is_read;

  const formattedDate = notification.created_at
    ? new Date(notification.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently";

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
        isUnread
          ? "border-indigo-200 ring-1 ring-indigo-500/15"
          : "border-slate-200 hover:border-slate-300"
      }`}
      data-testid={`notification-card-${notification.id}`}
    >
      <div>
        {/* Header row: Icon, Title + Unread indicator, Type Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${typeInfo.iconBgClass} ${typeInfo.iconColorClass}`}
            >
              <FieldIcon type={typeInfo.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-bold text-slate-950">
                  {notification.title}
                </h3>
                {isUnread && (
                  <span
                    className="inline-flex h-2 w-2 rounded-full bg-indigo-600 shrink-0"
                    title="Unread"
                    aria-label="Unread"
                  />
                )}
              </div>
              <p className="truncate text-xs text-slate-400">{formattedDate}</p>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${typeInfo.badgeClass}`}
          >
            {typeInfo.label}
          </span>
        </div>

        {/* Message body */}
        <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-2">
          {notification.message}
        </p>
      </div>

      {/* Footer / Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold">
        <span
          className={`capitalize ${
            notification.status === "unread"
              ? "text-indigo-600 font-bold"
              : "text-slate-400"
          }`}
        >
          {notification.status}
        </span>
        <div className="flex items-center gap-3">
          {onViewDetails ? (
            <button
              type="button"
              onClick={() => onViewDetails(notification)}
              className="text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Quick view
            </button>
          ) : null}
          <Link
            to={route_paths.getNotificationDetailPath(notification.id)}
            className="text-indigo-600 hover:text-indigo-700 transition"
          >
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NotificationCard;
