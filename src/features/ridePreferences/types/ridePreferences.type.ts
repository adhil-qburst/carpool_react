export interface RidePreferenceLocation {
  id: string;
  name: string;
  city: string;
  lat?: string | null;
  lng?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RidePreferenceUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface RidePreference {
  id: string;
  riderId: string;
  sourceLocationId: string;
  destinationLocationId: string;
  preferredDepartureTime?: string | null;
  seatsNeeded: number;
  isActive: boolean;
  label?: string | null;
  createdAt: string;
  updatedAt: string;
  source?: RidePreferenceLocation | null;
  destination?: RidePreferenceLocation | null;
  rider?: RidePreferenceUser | null;
}

export interface CreateRidePreferenceForm {
  sourceLocationId: string;
  destinationLocationId: string;
  preferredDepartureTime?: string | null;
  seatsNeeded?: number | string;
  isActive?: boolean;
  label?: string | null;
}

export interface UpdateRidePreferenceForm {
  sourceLocationId?: string | null;
  destinationLocationId?: string | null;
  preferredDepartureTime?: string | null;
  seatsNeeded?: number | string | null;
  isActive?: boolean | null;
  label?: string | null;
}

export type RidePreferenceFormErrors = Partial<
  Record<keyof CreateRidePreferenceForm, string>
>;

export interface ListRidePreferencesFilter {
  activeOnly?: boolean;
}

export interface MatchingRidePreferencesFilter {
  sourceLocationId: string;
  destinationLocationId: string;
}
