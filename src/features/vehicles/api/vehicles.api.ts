import { httpClient } from "@core/api/httpClient";
import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleResponse,
} from "../types/vehicles.api.types";

export const vehiclesApi = {
  list: () =>
    httpClient
      .get<VehicleResponse[]>("/api/v1/vehicles")
      .then((res) => res.data),

  getById: (vehicleId: string) =>
    httpClient
      .get<VehicleResponse>(`/api/v1/vehicles/${vehicleId}`)
      .then((res) => res.data),

  register: (payload: CreateVehicleRequest) =>
    httpClient
      .post<VehicleResponse>("/api/v1/vehicles", payload)
      .then((res) => res.data),

  update: (vehicleId: string, payload: UpdateVehicleRequest) =>
    httpClient
      .patch<VehicleResponse>(`/api/v1/vehicles/${vehicleId}`, payload)
      .then((res) => res.data),

  delete: (vehicleId: string) =>
    httpClient
      .delete<void>(`/api/v1/vehicles/${vehicleId}`)
      .then((res) => res.data),
};
