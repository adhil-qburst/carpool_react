import { useQuery } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import type { ListTripsQueryParams } from "../types/trips.api.types";
import { tripKeys } from "./tripKeys";

export function useTripsQuery(
  params?: ListTripsQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tripKeys.list(params as Record<string, unknown>),
    queryFn: () => tripsApi.list(params),
    enabled: options?.enabled,
  });
}
