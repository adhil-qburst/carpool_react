import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  ListNotificationsQueryParams,
  NotificationResponse,
  NotificationUnreadCountResponse,
  PaginatedNotificationsResponse,
} from "../types/notifications.api.types";

export const notificationsApi = {
  list: (
    params?: ListNotificationsQueryParams,
  ): Promise<PaginatedNotificationsResponse> =>
    httpClient
      .get<PaginatedNotificationsResponse>(apiEndpoints.notifications.list, {
        params,
      })
      .then((res) => res.data),

  getUnreadCount: (): Promise<NotificationUnreadCountResponse> =>
    httpClient
      .get<NotificationUnreadCountResponse>(
        apiEndpoints.notifications.unreadCount,
      )
      .then((res) => res.data),

  getById: (notificationId: string): Promise<NotificationResponse> =>
    httpClient
      .get<NotificationResponse>(
        apiEndpoints.notifications.byId(notificationId),
      )
      .then((res) => res.data),
};
