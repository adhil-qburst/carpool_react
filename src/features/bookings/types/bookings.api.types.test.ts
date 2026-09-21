import { describe, expect, it } from "vitest";
import { toCreateBookingRequest } from "./bookings.api.types";
import type { CreateBookingForm } from "./bookings.type";

describe("toCreateBookingRequest", () => {
  it("converts form state into wire DTO with trimmed strings and parsed number of seats", () => {
    const form: CreateBookingForm = {
      tripId: "  trip-123  ",
      pickupStopId: "  stop-pickup-456  ",
      dropoffStopId: "  stop-dropoff-789  ",
      seatsBooked: "2",
    };

    const result = toCreateBookingRequest(form);

    expect(result).toEqual({
      trip_id: "trip-123",
      pickup_stop_id: "stop-pickup-456",
      dropoff_stop_id: "stop-dropoff-789",
      seats_booked: 2,
    });
  });

  it("handles numeric seatsBooked directly", () => {
    const form: CreateBookingForm = {
      tripId: "trip-999",
      pickupStopId: "stop-1",
      dropoffStopId: "stop-2",
      seatsBooked: 3,
    };

    const result = toCreateBookingRequest(form);

    expect(result).toEqual({
      trip_id: "trip-999",
      pickup_stop_id: "stop-1",
      dropoff_stop_id: "stop-2",
      seats_booked: 3,
    });
  });
});
