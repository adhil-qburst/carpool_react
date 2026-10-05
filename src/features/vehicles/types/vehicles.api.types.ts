import type { CreateVehicleForm, UpdateVehicleForm } from "./vehicles.type";

export interface CreateVehicleRequest {
  make: string;
  model: string;
  registration_number: string;
  total_seats: number;
}

export interface UpdateVehicleRequest {
  make?: string | null;
  model?: string | null;
  registration_number?: string | null;
  total_seats?: number | null;
}

export interface VehicleResponse {
  id: string;
  driver_id: string;
  make: string;
  model: string;
  registration_number: string;
  total_seats: number;
  created_at: string;
  updated_at: string;
}

export function toCreateVehicleRequest(
  form: CreateVehicleForm,
): CreateVehicleRequest {
  return {
    make: form.make.trim(),
    model: form.model.trim(),
    registration_number: form.registrationNumber.trim().toUpperCase(),
    total_seats: Number(form.totalSeats),
  };
}

export function toUpdateVehicleRequest(
  form: UpdateVehicleForm,
): UpdateVehicleRequest {
  const payload: UpdateVehicleRequest = {};

  if (form.make !== undefined) {
    payload.make = form.make === null ? null : form.make.trim();
  }
  if (form.model !== undefined) {
    payload.model = form.model === null ? null : form.model.trim();
  }
  if (form.registrationNumber !== undefined) {
    payload.registration_number =
      form.registrationNumber === null
        ? null
        : form.registrationNumber.trim().toUpperCase();
  }
  if (form.totalSeats !== undefined) {
    payload.total_seats =
      form.totalSeats === null ? null : Number(form.totalSeats);
  }

  return payload;
}
