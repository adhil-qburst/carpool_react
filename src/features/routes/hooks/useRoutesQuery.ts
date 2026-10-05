import { useQuery } from "@tanstack/react-query";
import { routesApi } from "../api/routes.api";
import type { ListRoutesQueryParams } from "../types/routes.api.types";
import { routeKeys } from "./routeKeys";

export function useRoutesQuery(
  params?: ListRoutesQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: routeKeys.list(params as Record<string, unknown>),
    queryFn: () => routesApi.list(params),
    enabled: options?.enabled,
  });
}
