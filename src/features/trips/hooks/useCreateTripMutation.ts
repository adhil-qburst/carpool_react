import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import { toCreateTripRequest } from "../types/trips.api.types";
import type {
  CreateTripRequest,
  TripResponse,
} from "../types/trips.api.types";
import type { CreateTripForm } from "../types/trips.type";
import { tripKeys } from "./tripKeys";

export function useCreateTripMutation() {
  const queryClient = useQueryClient();

  return useMutation<TripResponse, Error, CreateTripForm | CreateTripRequest>({
    mutationFn: (payload) => {
      const requestPayload =
        "routeId" in payload ? toCreateTripRequest(payload) : payload;
      return tripsApi.create(requestPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.all });
    },
  });
}
