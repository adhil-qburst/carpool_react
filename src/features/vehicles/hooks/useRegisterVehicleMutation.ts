import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import { toCreateVehicleRequest } from "../types/vehicles.api.types";
import type {
  CreateVehicleRequest,
  VehicleResponse,
} from "../types/vehicles.api.types";
import type { CreateVehicleForm } from "../types/vehicles.type";
import { vehicleKeys } from "./vehicleKeys";

export function useRegisterVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    VehicleResponse,
    Error,
    CreateVehicleForm | CreateVehicleRequest
  >({
    mutationFn: (payload) => {
      const requestPayload =
        "registrationNumber" in payload
          ? toCreateVehicleRequest(payload)
          : payload;
      return vehiclesApi.register(requestPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    },
  });
}
