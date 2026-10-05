export interface CreateTripForm {
  routeId: string;
  vehicleId: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:MM
}

export type CreateTripFormErrors = Partial<Record<keyof CreateTripForm, string>>;

export interface SearchTripsForm {
  sourceLocationId: string;
  sourceLocationName?: string;
  destinationLocationId: string;
  destinationLocationName?: string;
  departureDate: string;
  seatsNeeded: number;
}

export type SearchTripsFormErrors = Partial<Record<keyof SearchTripsForm, string>>;

export type TripPassengerStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "expired";

export interface TripPassengerUser {
  id: string;
  name: string;
  email: string;
}

export interface TripPassengerStopLocation {
  id: string;
  name: string;
  city?: string | null;
  lat?: string | number | null;
  lng?: string | number | null;
}

export interface TripPassengerStop {
  id: string;
  routeId: string;
  locationId: string;
  sequence: number;
  location?: TripPassengerStopLocation | null;
}

export interface TripPassenger {
  id: string;
  bookingId: string;
  riderId: string;
  riderName: string;
  riderEmail: string;
  rider: TripPassengerUser;
  seatsBooked: number;
  status: TripPassengerStatus;
  pickupStop?: TripPassengerStop | null;
  dropoffStop?: TripPassengerStop | null;
  createdAt: string;
  updatedAt: string;
}
