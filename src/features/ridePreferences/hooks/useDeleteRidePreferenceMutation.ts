import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import { ridePreferenceKeys } from "./ridePreferenceKeys";

export function useDeleteRidePreferenceMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (preferenceId: string) =>
      ridePreferencesApi.delete(preferenceId),
    onSuccess: (_, preferenceId) => {
      void queryClient.invalidateQueries({
        queryKey: ridePreferenceKeys.lists(),
      });
      void queryClient.removeQueries({
        queryKey: ridePreferenceKeys.detail(preferenceId),
      });
      void queryClient.invalidateQueries({
        queryKey: [...ridePreferenceKeys.all, "matches"],
      });
    },
  });
}
