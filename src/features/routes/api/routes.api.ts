import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  CreateRouteRequest,
  ListRoutesQueryParams,
  PaginatedRoutesResponse,
  RouteResponse,
  UpdateRouteRequest,
} from "../types/routes.api.types";

export const routesApi = {
  list: (params?: ListRoutesQueryParams): Promise<PaginatedRoutesResponse> =>
    httpClient
      .get<PaginatedRoutesResponse>(apiEndpoints.routes.list, { params })
      .then((res) => res.data),

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
      .patch<RouteResponse>(apiEndpoints.routes.patch(routeId), payload)
      .then((res) => res.data),

  delete: (routeId: string): Promise<void> =>
    httpClient
      .delete<void>(apiEndpoints.routes.delete(routeId))
      .then((res) => res.data),
};
