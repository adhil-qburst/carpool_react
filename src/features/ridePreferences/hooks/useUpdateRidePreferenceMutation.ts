import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import { toUpdateRidePreferenceRequest } from "../types/ridePreferences.api.types";
import type {
  RidePreferenceResponse,
  UpdateRidePreferenceRequest,
} from "../types/ridePreferences.api.types";
import type { UpdateRidePreferenceForm } from "../types/ridePreferences.type";
import { ridePreferenceKeys } from "./ridePreferenceKeys";

export interface UpdateRidePreferenceVariables {
  preferenceId: string;
  payload: UpdateRidePreferenceForm | UpdateRidePreferenceRequest;
}

function isUpdateRidePreferenceForm(
  payload: UpdateRidePreferenceForm | UpdateRidePreferenceRequest,
): payload is UpdateRidePreferenceForm {
  return (
    "sourceLocationId" in payload ||
    "destinationLocationId" in payload ||
    "preferredDepartureTime" in payload ||
    "seatsNeeded" in payload ||
    "isActive" in payload
  );
}

export function useUpdateRidePreferenceMutation() {
  const queryClient = useQueryClient();

  return useMutation<RidePreferenceResponse, Error, UpdateRidePreferenceVariables>({
    mutationFn: ({ preferenceId, payload }) => {
      const requestPayload = isUpdateRidePreferenceForm(payload)
        ? toUpdateRidePreferenceRequest(payload)
        : (payload as UpdateRidePreferenceRequest);
      return ridePreferencesApi.update(preferenceId, requestPayload);
    },
    onSuccess: (updatedPreference) => {
      void queryClient.invalidateQueries({
        queryKey: ridePreferenceKeys.lists(),
      });
      void queryClient.invalidateQueries({
        queryKey: ridePreferenceKeys.detail(updatedPreference.id),
      });
      void queryClient.invalidateQueries({
        queryKey: [...ridePreferenceKeys.all, "matches"],
      });
    },
  });
}
