import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "../api/bookings.api";
import { bookingKeys } from "./bookingKeys";

export function useBookingQuery(bookingId: string) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => bookingsApi.getById(bookingId),
    enabled: Boolean(bookingId),
  });
}
