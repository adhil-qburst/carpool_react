import type { BookingStatus, CreateBookingForm } from "./bookings.type";

export interface CreateBookingRequest {
  trip_id: string;
  pickup_stop_id: string;
  dropoff_stop_id: string;
  seats_booked: number;
}

export interface BookingResponse {
  id: string;
  rider_id: string;
  trip_id: string;
  pickup_stop_id: string;
  dropoff_stop_id: string;
  seats_booked: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface PaginatedBookingsResponse {
  items: BookingResponse[];
  page: number;
  limit: number;
  total: number;
}

export interface ListBookingsQueryParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  trip_id?: string;
}

/**
 * Pure mapper converting UI form state to backend API request DTO.
 */
export function toCreateBookingRequest(
  form: CreateBookingForm,
): CreateBookingRequest {
  return {
    trip_id: form.tripId.trim(),
    pickup_stop_id: form.pickupStopId.trim(),
    dropoff_stop_id: form.dropoffStopId.trim(),
    seats_booked: Number(form.seatsBooked),
  };
}
