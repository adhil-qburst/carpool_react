import { useQuery } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import { tripKeys } from "./tripKeys";

export function useDriverRoutesQuery() {
  return useQuery({
    queryKey: tripKeys.driverRoutes(),
    queryFn: async () => {
      const res = await tripsApi.getRoutes();
      const items = res?.items ?? [];
      // Filter for active routes only
      return items.filter((r) => r.status.toLowerCase() === "active");
    },
  });
}

export function useDriverVehiclesQuery() {
  return useQuery({
    queryKey: tripKeys.driverVehicles(),
    queryFn: () => tripsApi.getVehicles(),
  });
}
