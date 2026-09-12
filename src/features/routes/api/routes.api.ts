import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  CreateRouteRequest,
  RouteResponse,
  UpdateRouteRequest,
} from "../types/routes.api.types";

export const routesApi = {
  create: (payload: CreateRouteRequest): Promise<RouteResponse> =>
    httpClient
      .post<RouteResponse>(apiEndpoints.routes.create, payload)
      .then((res) => res.data),

  update: (
    routeId: string,
    payload: UpdateRouteRequest,
  ): Promise<RouteResponse> =>
    httpClient
      .put<RouteResponse>(apiEndpoints.routes.update(routeId), payload)
      .then((res) => res.data),

  patch: (
    routeId: string,
    payload: UpdateRouteRequest,
  ): Promise<RouteResponse> =>
    httpClient
      .patch<RouteResponse>(apiEndpoints.routes.update(routeId), payload)
      .then((res) => res.data),
};
