import { useMutation, useQueryClient } from "@tanstack/react-query";
import { routesApi } from "../api/routes.api";
import { toCreateRouteRequest } from "../types/routes.api.types";
import type {
  CreateRouteRequest,
  RouteResponse,
} from "../types/routes.api.types";
import type { CreateRouteForm } from "../types/routes.type";
import { routeKeys } from "./routeKeys";

export function useCreateRouteMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    RouteResponse,
    Error,
    CreateRouteForm | CreateRouteRequest
  >({
    mutationFn: (payload) => {
      const requestPayload = toCreateRouteRequest(payload);
      return routesApi.create(requestPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
    },
  });
}
