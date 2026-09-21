export type NotificationType =
  | "booking_confirmation"
  | "booking_request"
  | "booking_cancelled"
  | "booking_rejected"
  | "trip_cancelled"
  | "trip_updated"
  | "system";

export type NotificationStatus = "unread" | "read" | "archived";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  isRead: boolean;
  readAt: string | null;
  data: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  status?: NotificationStatus;
  type?: NotificationType;
}

export interface PaginatedNotifications {
  items: Notification[];
  page: number;
  limit: number;
  total: number;
  unreadCount: number;
}

export interface NotificationUnreadCount {
  unreadCount: number;
}
