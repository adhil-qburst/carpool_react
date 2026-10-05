import { describe, expect, it } from "vitest";
import {
  toBooking,
  toBookingStop,
  toCreateBookingRequest,
  toPaginatedBookings,
} from "./bookings.api.types";
import type { BookingResponse, RouteStopResponse } from "./bookings.api.types";
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

describe("toBookingStop", () => {
  it("maps RouteStopResponse to BookingStop domain model with location", () => {
    const stopDto: RouteStopResponse = {
      id: "stop-1",
      route_id: "route-1",
      location_id: "loc-1",
      sequence: 1,
      location: {
        id: "loc-1",
        name: "Downtown",
        city: "Calicut",
        lat: 11.25,
        lng: 75.78,
      },
    };

    const result = toBookingStop(stopDto);

    expect(result).toEqual({
      id: "stop-1",
      routeId: "route-1",
      locationId: "loc-1",
      sequence: 1,
      location: {
        id: "loc-1",
        name: "Downtown",
        city: "Calicut",
        lat: 11.25,
        lng: 75.78,
      },
    });
  });

  it("handles RouteStopResponse with null location", () => {
    const stopDto: RouteStopResponse = {
      id: "stop-2",
      route_id: "route-1",
      location_id: "loc-2",
      sequence: 2,
      location: null,
    };

    const result = toBookingStop(stopDto);

    expect(result).toEqual({
      id: "stop-2",
      routeId: "route-1",
      locationId: "loc-2",
      sequence: 2,
      location: null,
    });
  });
});

describe("toBooking and toPaginatedBookings", () => {
  const mockBookingResponse: BookingResponse = {
    id: "b-1",
    rider_id: "rider-1",
    trip_id: "trip-1",
    pickup_stop_id: "stop-1",
    dropoff_stop_id: "stop-2",
    seats_booked: 2,
    status: "confirmed",
    pickup_stop: {
      id: "stop-1",
      route_id: "route-1",
      location_id: "loc-1",
      sequence: 1,
      location: {
        id: "loc-1",
        name: "Stop A",
        city: "City A",
      },
    },
    dropoff_stop: {
      id: "stop-2",
      route_id: "route-1",
      location_id: "loc-2",
      sequence: 3,
      location: {
        id: "loc-2",
        name: "Stop B",
        city: "City B",
      },
    },
    created_at: "2026-09-20T10:00:00Z",
    updated_at: "2026-09-20T10:00:00Z",
  };

  it("maps BookingResponse to Booking domain entity", () => {
    const booking = toBooking(mockBookingResponse);

    expect(booking).toEqual({
      id: "b-1",
      riderId: "rider-1",
      tripId: "trip-1",
      pickupStopId: "stop-1",
      dropoffStopId: "stop-2",
      seatsBooked: 2,
      status: "confirmed",
      pickupStop: {
        id: "stop-1",
        routeId: "route-1",
        locationId: "loc-1",
        sequence: 1,
        location: {
          id: "loc-1",
          name: "Stop A",
          city: "City A",
          lat: undefined,
          lng: undefined,
        },
      },
      dropoffStop: {
        id: "stop-2",
        routeId: "route-1",
        locationId: "loc-2",
        sequence: 3,
        location: {
          id: "loc-2",
          name: "Stop B",
          city: "City B",
          lat: undefined,
          lng: undefined,
        },
      },
      createdAt: "2026-09-20T10:00:00Z",
      updatedAt: "2026-09-20T10:00:00Z",
    });
  });

  it("maps PaginatedBookingsResponse to PaginatedBookings", () => {
    const paginated = toPaginatedBookings({
      items: [mockBookingResponse],
      page: 1,
      limit: 10,
      total: 1,
    });

    expect(paginated.page).toBe(1);
    expect(paginated.limit).toBe(10);
    expect(paginated.total).toBe(1);
    expect(paginated.items).toHaveLength(1);
    expect(paginated.items[0].id).toBe("b-1");
  });
});
