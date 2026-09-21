import { useQuery } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import { ridePreferenceKeys } from "./ridePreferenceKeys";

export function useRidePreferenceQuery(preferenceId: string) {
  return useQuery({
    queryKey: ridePreferenceKeys.detail(preferenceId),
    queryFn: () => ridePreferencesApi.getById(preferenceId),
    enabled: Boolean(preferenceId),
  });
}
