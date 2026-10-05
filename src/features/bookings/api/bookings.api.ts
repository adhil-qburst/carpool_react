import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  BookingResponse,
  CreateBookingRequest,
  ListBookingsQueryParams,
  PaginatedBookingsResponse,
} from "../types/bookings.api.types";

export const bookingsApi = {
  create: (payload: CreateBookingRequest): Promise<BookingResponse> =>
    httpClient
      .post<BookingResponse>(apiEndpoints.bookings.create, payload)
      .then((res) => res.data),

  list: (
    params?: ListBookingsQueryParams,
  ): Promise<PaginatedBookingsResponse> =>
    httpClient
      .get<PaginatedBookingsResponse>(apiEndpoints.bookings.list, { params })
      .then((res) => res.data),

  getById: (bookingId: string): Promise<BookingResponse> =>
    httpClient
      .get<BookingResponse>(apiEndpoints.bookings.byId(bookingId))
      .then((res) => res.data),

  delete: (bookingId: string): Promise<void> =>
    httpClient
      .delete<void>(apiEndpoints.bookings.byId(bookingId))
      .then((res) => res.data),
};
