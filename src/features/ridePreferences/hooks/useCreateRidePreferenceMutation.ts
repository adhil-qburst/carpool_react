import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import { toCreateRidePreferenceRequest } from "../types/ridePreferences.api.types";
import type {
  CreateRidePreferenceRequest,
  RidePreferenceResponse,
} from "../types/ridePreferences.api.types";
import type { CreateRidePreferenceForm } from "../types/ridePreferences.type";
import { ridePreferenceKeys } from "./ridePreferenceKeys";

export function useCreateRidePreferenceMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    RidePreferenceResponse,
    Error,
    CreateRidePreferenceForm | CreateRidePreferenceRequest
  >({
    mutationFn: (payload) => {
      const requestPayload =
        "sourceLocationId" in payload
          ? toCreateRidePreferenceRequest(payload)
          : payload;
      return ridePreferencesApi.create(requestPayload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ridePreferenceKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: [...ridePreferenceKeys.all, "matches"],
      });
    },
  });
}
