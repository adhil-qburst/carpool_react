import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import { toUpdateVehicleRequest } from "../types/vehicles.api.types";
import type {
  UpdateVehicleRequest,
  VehicleResponse,
} from "../types/vehicles.api.types";
import type { UpdateVehicleForm } from "../types/vehicles.type";
import { vehicleKeys } from "./vehicleKeys";

export interface UpdateVehicleVariables {
  vehicleId: string;
  payload: UpdateVehicleForm | UpdateVehicleRequest;
}

export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation<VehicleResponse, Error, UpdateVehicleVariables>({
    mutationFn: ({ vehicleId, payload }) => {
      const requestPayload =
        "registrationNumber" in payload || "totalSeats" in payload
          ? toUpdateVehicleRequest(payload as UpdateVehicleForm)
          : (payload as UpdateVehicleRequest);
      return vehiclesApi.update(vehicleId, requestPayload);
    },
    onSuccess: (updatedVehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: vehicleKeys.detail(updatedVehicle.id),
      });
    },
  });
}
