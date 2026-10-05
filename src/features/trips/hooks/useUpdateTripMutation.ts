import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import type { TripResponse, UpdateTripRequest } from "../types/trips.api.types";
import { tripKeys } from "./tripKeys";

export interface UpdateTripMutationArgs {
  tripId: string;
  payload: UpdateTripRequest;
}

export function useUpdateTripMutation() {
  const queryClient = useQueryClient();

  return useMutation<TripResponse, Error, UpdateTripMutationArgs>({
    mutationFn: ({ tripId, payload }) => tripsApi.update(tripId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
      queryClient.setQueryData(tripKeys.detail(data.id), data);
    },
  });
}
