import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "../api/locations.api";
import { toCreateLocationRequest } from "../types/locations.api.types";
import type {
  CreateLocationRequest,
  LocationResponse,
} from "../types/locations.api.types";
import type { CreateLocationForm } from "../types/locations.type";
import { locationKeys } from "./locationKeys";

export function useCreateLocationMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    LocationResponse,
    Error,
    CreateLocationForm | CreateLocationRequest
  >({
    mutationFn: (payload) => {
      const requestPayload = toCreateLocationRequest(payload);
      return locationsApi.create(requestPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
}
