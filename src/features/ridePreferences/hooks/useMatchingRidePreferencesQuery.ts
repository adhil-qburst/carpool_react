import { useQuery } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import type { MatchingRidePreferencesFilter } from "../types/ridePreferences.type";
import { ridePreferenceKeys } from "./ridePreferenceKeys";

export function useMatchingRidePreferencesQuery(
  filters: MatchingRidePreferencesFilter,
) {
  const isEnabled = Boolean(
    filters.sourceLocationId && filters.destinationLocationId,
  );

  return useQuery({
    queryKey: ridePreferenceKeys.matches({
      sourceLocationId: filters.sourceLocationId,
      destinationLocationId: filters.destinationLocationId,
    }),
    queryFn: () =>
      ridePreferencesApi.getMatches({
        source_location_id: filters.sourceLocationId,
        destination_location_id: filters.destinationLocationId,
      }),
    enabled: isEnabled,
  });
}
