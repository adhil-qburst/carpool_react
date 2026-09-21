import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications.api";
import { notificationKeys } from "./notificationKeys";

export function useNotificationUnreadCountQuery(options?: {
  enabled?: boolean;
  refetchInterval?: number;
}) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: options?.enabled,
    refetchInterval: options?.refetchInterval,
  });
}
