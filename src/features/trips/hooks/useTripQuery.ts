import { useQuery } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import { tripKeys } from "./tripKeys";

export function useTripQuery(tripId: string) {
  return useQuery({
    queryKey: tripKeys.detail(tripId),
    queryFn: () => tripsApi.getById(tripId),
    enabled: Boolean(tripId),
  });
}
