import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleResponse,
} from "../types/vehicles.api.types";

export const vehiclesApi = {
  list: () =>
    httpClient
      .get<VehicleResponse[]>(apiEndpoints.vehicles.list)
      .then((res) => res.data),

  getById: (vehicleId: string) =>
    httpClient
      .get<VehicleResponse>(apiEndpoints.vehicles.byId(vehicleId))
      .then((res) => res.data),

  register: (payload: CreateVehicleRequest) =>
    httpClient
      .post<VehicleResponse>(apiEndpoints.vehicles.create, payload)
      .then((res) => res.data),

  update: (vehicleId: string, payload: UpdateVehicleRequest) =>
    httpClient
      .patch<VehicleResponse>(apiEndpoints.vehicles.update(vehicleId), payload)
      .then((res) => res.data),

  delete: (vehicleId: string) =>
    httpClient
      .delete<void>(apiEndpoints.vehicles.delete(vehicleId))
      .then((res) => res.data),
};
