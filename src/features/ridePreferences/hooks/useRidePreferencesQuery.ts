import { useQuery } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import type { ListRidePreferencesFilter } from "../types/ridePreferences.type";
import { ridePreferenceKeys } from "./ridePreferenceKeys";

export function useRidePreferencesQuery(filters?: ListRidePreferencesFilter) {
  return useQuery({
    queryKey: ridePreferenceKeys.list(
      filters ? { activeOnly: filters.activeOnly } : undefined,
    ),
    queryFn: () =>
      ridePreferencesApi.list(
        filters?.activeOnly !== undefined
          ? { active_only: filters.activeOnly }
          : undefined,
      ),
  });
}
