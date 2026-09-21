export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "expired";

export interface Booking {
  id: string;
  riderId: string;
  tripId: string;
  pickupStopId: string;
  dropoffStopId: string;
  seatsBooked: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
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
