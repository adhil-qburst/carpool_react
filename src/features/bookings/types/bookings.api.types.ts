import type {
  Booking,
  BookingStatus,
  BookingStop,
  CreateBookingForm,
  PaginatedBookings,
} from "./bookings.type";

export interface CreateBookingRequest {
  trip_id: string;
  pickup_stop_id: string;
  dropoff_stop_id: string;
  seats_booked: number;
}

export interface BookingLocationResponse {
  id: string;
  name: string;
  city: string;
  lat?: string | number | null;
  lng?: string | number | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RouteStopResponse {
  id: string;
  route_id: string;
  location_id: string;
  sequence: number;
  location?: BookingLocationResponse | null;
}

export type BookingRouteStopResponse = RouteStopResponse;

export interface BookingResponse {
  id: string;
  rider_id: string;
  trip_id: string;
  pickup_stop_id: string;
  dropoff_stop_id: string;
  seats_booked: number;
  status: BookingStatus;
  pickup_stop: RouteStopResponse;
  dropoff_stop: RouteStopResponse;
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

export function toBookingStop(dto: RouteStopResponse): BookingStop {
  return {
    id: dto.id,
    routeId: dto.route_id,
    locationId: dto.location_id,
    sequence: dto.sequence,
    location: dto.location
      ? {
          id: dto.location.id,
          name: dto.location.name,
          city: dto.location.city,
          lat: dto.location.lat,
          lng: dto.location.lng,
        }
      : null,
  };
}

export function toBooking(dto: BookingResponse): Booking {
  return {
    id: dto.id,
    riderId: dto.rider_id,
    tripId: dto.trip_id,
    pickupStopId: dto.pickup_stop_id,
    dropoffStopId: dto.dropoff_stop_id,
    seatsBooked: dto.seats_booked,
    status: dto.status,
    pickupStop: dto.pickup_stop ? toBookingStop(dto.pickup_stop) : undefined,
    dropoffStop: dto.dropoff_stop ? toBookingStop(dto.dropoff_stop) : undefined,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function toPaginatedBookings(
  dto: PaginatedBookingsResponse,
): PaginatedBookings {
  return {
    items: (dto.items ?? []).map(toBooking),
    page: dto.page,
    limit: dto.limit,
    total: dto.total,
  };
}
