import type {
  CreateTripForm,
  TripPassenger,
  TripPassengerStatus,
} from "./trips.type";

export type { TripPassengerStatus };

export type TripStatus = "scheduled" | "cancelled" | "completed" | "deleted";

export interface CreateTripRequest {
  route_id: string;
  vehicle_id: string;
  departure_date: string; // YYYY-MM-DD
  departure_time: string; // HH:MM:SS
}

export interface TripResponse {
  id: string;
  route_id: string;
  driver_id: string;
  vehicle_id: string;
  departure_date: string;
  departure_time: string;
  available_seats: number;
  status: TripStatus;
  route?: TripRouteOption | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedTripsResponse {
  items: TripResponse[];
  page: number;
  limit: number;
  total: number;
}

export interface SearchTripsQueryParams {
  source_location_id: string;
  destination_location_id: string;
  departure_date?: string | null;
  seats_needed?: number | null;
  page?: number;
  limit?: number;
}

export interface SearchTripsResponse {
  items: TripResponse[];
  page?: number;
  limit?: number;
  total?: number;
}

export interface ListTripsQueryParams {
  page?: number;
  limit?: number;
}

export interface TripRouteStopLocation {
  id: string;
  name: string;
  city?: string | null;
  lat?: string | number | null;
  lng?: string | number | null;
}

export interface TripRouteStop {
  id: string;
  route_id: string;
  location_id: string;
  sequence: number;
  location?: TripRouteStopLocation | null;
}

export interface TripRouteOption {
  id: string;
  name: string;
  status: string;
  route_stops?: TripRouteStop[];
}

export interface TripVehicleOption {
  id: string;
  make: string;
  model: string;
  license_plate: string;
  total_seats: number;
  color?: string | null;
}

export interface UpdateTripRequest {
  vehicle_id?: string | null;
  departure_date?: string | null;
  departure_time?: string | null;
  status?: TripStatus | null;
}

/**
 * Pure mapper converting UI form state to backend API request DTO.
 * Normalizes departure_time to HH:MM:SS format expected by FastAPI.
 */
export function toCreateTripRequest(form: CreateTripForm): CreateTripRequest {
  const trimmedTime = form.departureTime.trim();
  const formattedTime =
    trimmedTime.length === 5 ? `${trimmedTime}:00` : trimmedTime;

  return {
    route_id: form.routeId.trim(),
    vehicle_id: form.vehicleId.trim(),
    departure_date: form.departureDate.trim(),
    departure_time: formattedTime,
  };
}

export interface TripPassengerUserResponse {
  id: string;
  name: string;
  email: string;
}

export interface TripPassengerResponse {
  id: string;
  booking_id: string;
  rider_id: string;
  rider_name: string;
  rider_email: string;
  rider: TripPassengerUserResponse;
  seats_booked: number;
  status: TripPassengerStatus;
  pickup_stop: TripRouteStop;
  dropoff_stop: TripRouteStop;
  created_at: string;
  updated_at: string;
}

export interface ListTripPassengersQueryParams {
  status?: TripPassengerStatus | null;
}

/**
 * Pure mapper converting backend TripPassengerResponse DTO to domain TripPassenger model.
 */
export function toTripPassenger(dto: TripPassengerResponse): TripPassenger {
  return {
    id: dto.id,
    bookingId: dto.booking_id,
    riderId: dto.rider_id,
    riderName: dto.rider_name,
    riderEmail: dto.rider_email,
    rider: {
      id: dto.rider.id,
      name: dto.rider.name,
      email: dto.rider.email,
    },
    seatsBooked: dto.seats_booked,
    status: dto.status,
    pickupStop: dto.pickup_stop
      ? {
          id: dto.pickup_stop.id,
          routeId: dto.pickup_stop.route_id,
          locationId: dto.pickup_stop.location_id,
          sequence: dto.pickup_stop.sequence,
          location: dto.pickup_stop.location
            ? {
                id: dto.pickup_stop.location.id,
                name: dto.pickup_stop.location.name,
                city: dto.pickup_stop.location.city,
                lat: dto.pickup_stop.location.lat,
                lng: dto.pickup_stop.location.lng,
              }
            : null,
        }
      : null,
    dropoffStop: dto.dropoff_stop
      ? {
          id: dto.dropoff_stop.id,
          routeId: dto.dropoff_stop.route_id,
          locationId: dto.dropoff_stop.location_id,
          sequence: dto.dropoff_stop.sequence,
          location: dto.dropoff_stop.location
            ? {
                id: dto.dropoff_stop.location.id,
                name: dto.dropoff_stop.location.name,
                city: dto.dropoff_stop.location.city,
                lat: dto.dropoff_stop.location.lat,
                lng: dto.dropoff_stop.location.lng,
              }
            : null,
        }
      : null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

