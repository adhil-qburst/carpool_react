import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import { vehicleKeys } from "./vehicleKeys";

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (vehicleId: string) => vehiclesApi.delete(vehicleId),
    onSuccess: (_, vehicleId) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      queryClient.removeQueries({ queryKey: vehicleKeys.detail(vehicleId) });
    },
  });
}
