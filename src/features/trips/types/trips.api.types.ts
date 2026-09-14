import type { CreateTripForm } from "./trips.type";

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
  created_at: string;
  updated_at: string;
}

export interface PaginatedTripsResponse {
  items: TripResponse[];
  page: number;
  limit: number;
  total: number;
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
