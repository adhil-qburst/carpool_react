export interface CreateTripForm {
  routeId: string;
  vehicleId: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:MM
}

export type CreateTripFormErrors = Partial<Record<keyof CreateTripForm, string>>;
