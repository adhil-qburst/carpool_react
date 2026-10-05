import { useQuery } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import type {
  ListTripPassengersQueryParams,
  TripPassengerResponse,
} from "../types/trips.api.types";
import { tripKeys } from "./tripKeys";

export interface UseTripPassengersQueryOptions {
  enabled?: boolean;
}

export function useTripPassengersQuery(
  tripId: string,
  params?: ListTripPassengersQueryParams,
  options?: UseTripPassengersQueryOptions,
) {
  return useQuery<TripPassengerResponse[]>({
    queryKey: tripKeys.passengers(tripId, params as Record<string, unknown>),
    queryFn: () => tripsApi.getPassengers(tripId, params),
    enabled: Boolean(tripId) && (options?.enabled ?? true),
  });
}
