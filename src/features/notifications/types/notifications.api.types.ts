import type {
  Notification,
  NotificationFilters,
  NotificationStatus,
  NotificationType,
  NotificationUnreadCount,
  PaginatedNotifications,
} from "./notifications.type";

export interface NotificationResponse {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  is_read: boolean;
  read_at: string | null;
  data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationUnreadCountResponse {
  unread_count: number;
}

export interface PaginatedNotificationsResponse {
  items: NotificationResponse[];
  page: number;
  limit: number;
  total: number;
  unread_count: number;
}

export interface ListNotificationsQueryParams {
  page?: number;
  limit?: number;
  is_read?: boolean;
  status?: NotificationStatus;
  type?: NotificationType;
}

export function toNotification(dto: NotificationResponse): Notification {
  return {
    id: dto.id,
    userId: dto.user_id,
    title: dto.title,
    message: dto.message,
    type: dto.type,
    status: dto.status,
    isRead: dto.is_read,
    readAt: dto.read_at ?? null,
    data: dto.data ? { ...dto.data } : null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function toPaginatedNotifications(
  dto: PaginatedNotificationsResponse,
): PaginatedNotifications {
  return {
    items: dto.items.map(toNotification),
    page: dto.page,
    limit: dto.limit,
    total: dto.total,
    unreadCount: dto.unread_count,
  };
}

export function toNotificationUnreadCount(
  dto: NotificationUnreadCountResponse,
): NotificationUnreadCount {
  return {
    unreadCount: dto.unread_count,
  };
}

export function toListNotificationsQueryParams(
  filters?: NotificationFilters,
): ListNotificationsQueryParams {
  if (!filters) {
    return {};
  }

  const params: ListNotificationsQueryParams = {};

  if (filters.page !== undefined) {
    params.page = filters.page;
  }
  if (filters.limit !== undefined) {
    params.limit = filters.limit;
  }
  if (filters.isRead !== undefined) {
    params.is_read = filters.isRead;
  }
  if (filters.status !== undefined) {
    params.status = filters.status;
  }
  if (filters.type !== undefined) {
    params.type = filters.type;
  }

  return params;
}
