export interface Vehicle {
  id: string;
  driverId: string;
  make: string;
  model: string;
  registrationNumber: string;
  totalSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleForm {
  make: string;
  model: string;
  registrationNumber: string;
  totalSeats: number | string;
}

export interface UpdateVehicleForm {
  make?: string | null;
  model?: string | null;
  registrationNumber?: string | null;
  totalSeats?: number | string | null;
}

export type VehicleFormErrors = Partial<
  Record<keyof CreateVehicleForm, string>
>;
