export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "expired";

export interface BookingStopLocation {
  id: string;
  name: string;
  city: string;
  lat?: string | number | null;
  lng?: string | number | null;
}

export interface BookingStop {
  id: string;
  routeId: string;
  locationId: string;
  sequence: number;
  location?: BookingStopLocation | null;
}

export interface Booking {
  id: string;
  riderId: string;
  tripId: string;
  pickupStopId: string;
  dropoffStopId: string;
  seatsBooked: number;
  status: BookingStatus;
  pickupStop?: BookingStop;
  dropoffStop?: BookingStop;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBookings {
  items: Booking[];
  page: number;
  limit: number;
  total: number;
}

export interface CreateBookingForm {
  tripId: string;
  pickupStopId: string;
  dropoffStopId: string;
  seatsBooked: number | string;
}

export interface BookingsFilter {
  status?: BookingStatus;
  tripId?: string;
  page?: number;
  limit?: number;
}
