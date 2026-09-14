import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  CreateTripRequest,
  ListTripsQueryParams,
  PaginatedTripsResponse,
  TripResponse,
  TripRouteOption,
  TripVehicleOption,
  UpdateTripRequest,
} from "../types/trips.api.types";

export const tripsApi = {
  create: (payload: CreateTripRequest): Promise<TripResponse> =>
    httpClient
      .post<TripResponse>(apiEndpoints.trips.create, payload)
      .then((res) => res.data),

  list: (params?: ListTripsQueryParams): Promise<PaginatedTripsResponse> =>
    httpClient
      .get<PaginatedTripsResponse>(apiEndpoints.trips.list, { params })
      .then((res) => res.data),

  getById: (tripId: string): Promise<TripResponse> =>
    httpClient
      .get<TripResponse>(apiEndpoints.trips.byId(tripId))
      .then((res) => res.data),

  getRoutes: (): Promise<{ items: TripRouteOption[] }> =>
    httpClient
      .get<{ items: TripRouteOption[] }>(apiEndpoints.routes.list)
      .then((res) => res.data),

  getVehicles: (): Promise<TripVehicleOption[]> =>
    httpClient
      .get<TripVehicleOption[]>(apiEndpoints.vehicles.list)
      .then((res) => res.data),

  update: (
    tripId: string,
    payload: UpdateTripRequest,
  ): Promise<TripResponse> =>
    httpClient
      .patch<TripResponse>(apiEndpoints.trips.update(tripId), payload)
      .then((res) => res.data),

  delete: (tripId: string): Promise<void> =>
    httpClient
      .delete<void>(apiEndpoints.trips.delete(tripId))
      .then((res) => res.data),
};
