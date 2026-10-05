import { useMutation, useQueryClient } from "@tanstack/react-query";
import { routesApi } from "../api/routes.api";
import { toUpdateRouteRequest } from "../types/routes.api.types";
import type {
  RouteResponse,
  UpdateRouteRequest,
} from "../types/routes.api.types";
import type { UpdateRouteForm } from "../types/routes.type";
import { routeKeys } from "./routeKeys";

export type RouteUpdateMethod = "patch" | "put";

export interface UpdateRouteVariables {
  routeId: string;
  payload: UpdateRouteForm | UpdateRouteRequest;
  method?: RouteUpdateMethod;
}

export function useUpdateRouteMutation() {
  const queryClient = useQueryClient();

  return useMutation<RouteResponse, Error, UpdateRouteVariables>({
    mutationFn: ({ routeId, payload, method = "patch" }) => {
      const requestPayload = toUpdateRouteRequest(payload);
      return method === "put"
        ? routesApi.update(routeId, requestPayload)
        : routesApi.patch(routeId, requestPayload);
    },
    onSuccess: (updatedRoute) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: routeKeys.detail(updatedRoute.id),
      });
    },
  });
}

export const usePatchRouteMutation = useUpdateRouteMutation;
