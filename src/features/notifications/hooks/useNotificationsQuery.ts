import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications.api";
import type { ListNotificationsQueryParams } from "../types/notifications.api.types";
import { notificationKeys } from "./notificationKeys";

export function useNotificationsQuery(
  params?: ListNotificationsQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: notificationKeys.list(params as Record<string, unknown>),
    queryFn: () => notificationsApi.list(params),
    enabled: options?.enabled,
  });
}
