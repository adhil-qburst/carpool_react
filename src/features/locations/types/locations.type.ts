export type LocationStatus = "active" | "inactive";

export interface Location {
  id: string;
  name: string;
  city: string;
  lat: string | null;
  lng: string | null;
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationForm {
  name: string;
  city: string;
  lat?: number | string | null;
  lng?: number | string | null;
  status?: LocationStatus;
}

export type LocationFormErrors = Partial<
  Record<keyof CreateLocationForm, string>
>;

export interface LocationFilters {
  search?: string;
  page?: number;
  limit?: number;
  status?: LocationStatus | null;
}
