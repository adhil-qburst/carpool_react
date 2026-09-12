import type {
  CreateLocationForm,
  Location,
  LocationStatus,
} from "./locations.type";

export type { LocationStatus };

export interface CreateLocationRequest {
  name: string;
  city: string;
  lat?: number | string | null;
  lng?: number | string | null;
  status?: LocationStatus;
}

export interface LocationResponse {
  id: string;
  name: string;
  city: string;
  lat: string | null;
  lng: string | null;
  status: LocationStatus;
  created_at: string;
  updated_at: string;
}

export interface PaginatedLocationsResponse {
  items: LocationResponse[];
  page: number;
  limit: number;
  total: number;
}

export interface SearchLocationsQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: LocationStatus | null;
}

export function toCreateLocationRequest(
  form: CreateLocationForm,
): CreateLocationRequest {
  const normalizeCoordinate = (
    value?: number | string | null,
  ): number | string | null => {
    if (value === undefined || value === null) {
      return null;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    }
    return value;
  };

  return {
    name: form.name.trim(),
    city: form.city.trim(),
    lat: normalizeCoordinate(form.lat),
    lng: normalizeCoordinate(form.lng),
    status: form.status ?? "active",
  };
}

export function toLocation(dto: LocationResponse): Location {
  return {
    id: dto.id,
    name: dto.name,
    city: dto.city,
    lat: dto.lat,
    lng: dto.lng,
    status: dto.status,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
