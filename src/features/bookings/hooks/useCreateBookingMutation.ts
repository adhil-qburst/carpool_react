import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "../api/bookings.api";
import { toCreateBookingRequest } from "../types/bookings.api.types";
import type {
  BookingResponse,
  CreateBookingRequest,
} from "../types/bookings.api.types";
import type { CreateBookingForm } from "../types/bookings.type";
import { bookingKeys } from "./bookingKeys";

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    BookingResponse,
    Error,
    CreateBookingForm | CreateBookingRequest
  >({
    mutationFn: (payload) => {
      const requestPayload =
        "tripId" in payload ? toCreateBookingRequest(payload) : payload;
      return bookingsApi.create(requestPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
