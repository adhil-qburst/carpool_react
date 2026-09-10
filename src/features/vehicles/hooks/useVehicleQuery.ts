import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import { vehicleKeys } from "./vehicleKeys";

export function useVehicleQuery(vehicleId: string) {
  return useQuery({
    queryKey: vehicleKeys.detail(vehicleId),
    queryFn: () => vehiclesApi.getById(vehicleId),
    enabled: Boolean(vehicleId),
  });
}
