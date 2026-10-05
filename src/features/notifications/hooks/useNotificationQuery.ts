import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications.api";
import { notificationKeys } from "./notificationKeys";

export function useNotificationQuery(
  notificationId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: notificationKeys.detail(notificationId),
    queryFn: () => notificationsApi.getById(notificationId),
    enabled: Boolean(notificationId) && (options?.enabled ?? true),
  });
}
