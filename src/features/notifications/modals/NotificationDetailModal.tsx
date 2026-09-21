import { Link } from "react-router";
import FieldIcon, { type FieldIconType } from "@shared/ui/FieldIcon";
import { route_paths } from "@core/router/route_paths";
import type { NotificationResponse } from "../types/notifications.api.types";
import type { NotificationType } from "../types/notifications.type";

export type NotificationDetailModalProps = {
  notification: NotificationResponse;
  onClose: () => void;
};

const TYPE_ICONS: Record<NotificationType, FieldIconType> = {
  booking_confirmation: "tag",
  booking_request: "person",
  booking_cancelled: "tag",
  booking_rejected: "tag",
  trip_cancelled: "car",
  trip_updated: "calendar",
  system: "bell",
};

const NotificationDetailModal = ({
  notification,
  onClose,
}: NotificationDetailModalProps) => {
  const iconType = TYPE_ICONS[notification.type] ?? "bell";
  const formattedDate = notification.created_at
    ? new Date(notification.created_at).toLocaleString()
    : "Recently";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
          <FieldIcon type={iconType} className="h-7 w-7" />
        </div>

        <p className="mt-4 text-center text-xs font-bold tracking-widest text-indigo-600 uppercase">
          {notification.type.replace(/_/g, " ")}
        </p>

        <h2
          id="notification-modal-title"
          className="mt-2 text-center text-xl font-bold tracking-tight text-slate-950"
        >
          {notification.title}
        </h2>

        <p className="mt-1 text-center text-xs text-slate-400">
          {formattedDate}
        </p>

        <div className="mt-4 max-h-60 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {notification.message}
        </div>

        {notification.data && Object.keys(notification.data).length > 0 && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-3 text-xs">
            <p className="font-semibold text-slate-700">Metadata:</p>
            <div className="mt-1 space-y-1 font-mono text-slate-500">
              {Object.entries(notification.data).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-400">{key}:</span>
                  <span className="truncate max-w-[200px]">
                    {typeof val === "object" ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            to={route_paths.getNotificationDetailPath(notification.id)}
            onClick={onClose}
            className="flex-1 rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            Full Details Page
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
