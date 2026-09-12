import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  CreateLocationRequest,
  LocationResponse,
  PaginatedLocationsResponse,
  SearchLocationsQueryParams,
} from "../types/locations.api.types";

export const locationsApi = {
  list: (
    params?: SearchLocationsQueryParams,
  ): Promise<PaginatedLocationsResponse> =>
    httpClient
      .get<PaginatedLocationsResponse>(apiEndpoints.locations.list, {
        params,
      })
      .then((res) => res.data),

  create: (payload: CreateLocationRequest): Promise<LocationResponse> =>
    httpClient
      .post<LocationResponse>(apiEndpoints.locations.create, payload)
      .then((res) => res.data),
};
