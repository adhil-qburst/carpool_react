import type {
  CreateRidePreferenceForm,
  RidePreference,
  RidePreferenceLocation,
  RidePreferenceUser,
  UpdateRidePreferenceForm,
} from "./ridePreferences.type";

export interface CreateRidePreferenceRequest {
  source_location_id: string;
  destination_location_id: string;
  preferred_departure_time?: string | null;
  seats_needed?: number;
  is_active?: boolean;
  label?: string | null;
}

export interface UpdateRidePreferenceRequest {
  source_location_id?: string | null;
  destination_location_id?: string | null;
  preferred_departure_time?: string | null;
  seats_needed?: number | null;
  is_active?: boolean | null;
  label?: string | null;
}

export interface RidePreferenceLocationResponse {
  id: string;
  name: string;
  city: string;
  lat?: string | null;
  lng?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RidePreferenceUserResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface RidePreferenceResponse {
  id: string;
  rider_id: string;
  source_location_id: string;
  destination_location_id: string;
  preferred_departure_time?: string | null;
  seats_needed: number;
  is_active: boolean;
  label?: string | null;
  created_at: string;
  updated_at: string;
  source?: RidePreferenceLocationResponse | null;
  destination?: RidePreferenceLocationResponse | null;
  rider?: RidePreferenceUserResponse | null;
}

export interface ListRidePreferencesQueryParams {
  active_only?: boolean;
}

export interface MatchingRidePreferencesQueryParams {
  source_location_id: string;
  destination_location_id: string;
}

export function toCreateRidePreferenceRequest(
  form: CreateRidePreferenceForm,
): CreateRidePreferenceRequest {
  const payload: CreateRidePreferenceRequest = {
    source_location_id: form.sourceLocationId.trim(),
    destination_location_id: form.destinationLocationId.trim(),
  };

  if (form.preferredDepartureTime !== undefined) {
    payload.preferred_departure_time =
      form.preferredDepartureTime === null || form.preferredDepartureTime.trim() === ""
        ? null
        : form.preferredDepartureTime.trim();
  }

  if (form.seatsNeeded !== undefined && form.seatsNeeded !== "") {
    payload.seats_needed = Number(form.seatsNeeded);
  }

  if (form.isActive !== undefined) {
    payload.is_active = form.isActive;
  }

  if (form.label !== undefined) {
    payload.label =
      form.label === null || form.label.trim() === ""
        ? null
        : form.label.trim();
  }

  return payload;
}

export function toUpdateRidePreferenceRequest(
  form: UpdateRidePreferenceForm,
): UpdateRidePreferenceRequest {
  const payload: UpdateRidePreferenceRequest = {};

  if (form.sourceLocationId !== undefined) {
    payload.source_location_id =
      form.sourceLocationId === null ? null : form.sourceLocationId.trim();
  }

  if (form.destinationLocationId !== undefined) {
    payload.destination_location_id =
      form.destinationLocationId === null ? null : form.destinationLocationId.trim();
  }

  if (form.preferredDepartureTime !== undefined) {
    payload.preferred_departure_time =
      form.preferredDepartureTime === null || form.preferredDepartureTime.trim() === ""
        ? null
        : form.preferredDepartureTime.trim();
  }

  if (form.seatsNeeded !== undefined) {
    payload.seats_needed =
      form.seatsNeeded === null || form.seatsNeeded === ""
        ? null
        : Number(form.seatsNeeded);
  }

  if (form.isActive !== undefined) {
    payload.is_active = form.isActive;
  }

  if (form.label !== undefined) {
    payload.label =
      form.label === null || form.label.trim() === ""
        ? null
        : form.label.trim();
  }

  return payload;
}

export function toRidePreference(
  dto: RidePreferenceResponse,
): RidePreference {
  const locationMapper = (
    loc?: RidePreferenceLocationResponse | null,
  ): RidePreferenceLocation | null => {
    if (!loc) return null;
    return {
      id: loc.id,
      name: loc.name,
      city: loc.city,
      lat: loc.lat ?? null,
      lng: loc.lng ?? null,
      status: loc.status,
      createdAt: loc.created_at,
      updatedAt: loc.updated_at,
    };
  };

  const userMapper = (
    user?: RidePreferenceUserResponse | null,
  ): RidePreferenceUser | null => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: [...user.roles],
    };
  };

  return {
    id: dto.id,
    riderId: dto.rider_id,
    sourceLocationId: dto.source_location_id,
    destinationLocationId: dto.destination_location_id,
    preferredDepartureTime: dto.preferred_departure_time ?? null,
    seatsNeeded: dto.seats_needed,
    isActive: dto.is_active,
    label: dto.label ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    source: locationMapper(dto.source),
    destination: locationMapper(dto.destination),
    rider: userMapper(dto.rider),
  };
}
