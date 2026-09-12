import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  CreateRouteRequest,
  RouteResponse,
} from "../types/routes.api.types";

export const routesApi = {
  create: (payload: CreateRouteRequest): Promise<RouteResponse> =>
    httpClient
      .post<RouteResponse>(apiEndpoints.routes.create, payload)
      .then((res) => res.data),
};
