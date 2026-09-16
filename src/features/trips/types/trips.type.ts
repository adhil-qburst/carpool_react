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
