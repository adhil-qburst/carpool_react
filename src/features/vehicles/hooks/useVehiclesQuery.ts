import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import { vehicleKeys } from "./vehicleKeys";

export function useVehiclesQuery() {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: () => vehiclesApi.list(),
  });
}
