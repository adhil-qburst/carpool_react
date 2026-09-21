import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "../api/bookings.api";
import { bookingKeys } from "./bookingKeys";

export function useDeleteBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingsApi.delete(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}
