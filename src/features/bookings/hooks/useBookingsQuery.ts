import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "../api/bookings.api";
import type { ListBookingsQueryParams } from "../types/bookings.api.types";
import { bookingKeys } from "./bookingKeys";

export function useBookingsQuery(
  params?: ListBookingsQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: bookingKeys.list(params as Record<string, unknown>),
    queryFn: () => bookingsApi.list(params),
    enabled: options?.enabled,
  });
}
