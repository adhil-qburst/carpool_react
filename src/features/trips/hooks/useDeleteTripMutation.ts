import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import { tripKeys } from "./tripKeys";

export function useDeleteTripMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (tripId: string) => tripsApi.delete(tripId),
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() });
      queryClient.removeQueries({ queryKey: tripKeys.detail(tripId) });
    },
  });
}
