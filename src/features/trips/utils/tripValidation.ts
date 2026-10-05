import type { CreateTripForm, CreateTripFormErrors } from "../types/trips.type";

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isPastDateTime(dateStr: string, timeStr: string): boolean {
  if (!dateStr || !timeStr) return false;
  const target = new Date(
    `${dateStr}T${timeStr.length === 5 ? `${timeStr}:00` : timeStr}`,
  );
  return target.getTime() < Date.now();
}

export function validateCreateTripForm(
  form: CreateTripForm,
  todayString: string,
): CreateTripFormErrors {
  const nextErrors: CreateTripFormErrors = {};

  if (!form.routeId) {
    nextErrors.routeId = "Please select a route for this trip.";
  }

  if (!form.vehicleId) {
    nextErrors.vehicleId = "Please select a vehicle for this trip.";
  }

  if (!form.departureDate) {
    nextErrors.departureDate = "Please choose a departure date.";
  } else if (form.departureDate < todayString) {
    nextErrors.departureDate = "Departure date cannot be in the past.";
  }

  if (!form.departureTime) {
    nextErrors.departureTime = "Please enter a departure time.";
  } else if (
    form.departureDate &&
    isPastDateTime(form.departureDate, form.departureTime)
  ) {
    nextErrors.departureTime = "Departure time cannot be in the past.";
  }

  return nextErrors;
}
