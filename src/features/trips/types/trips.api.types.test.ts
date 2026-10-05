import { describe, expect, it } from "vitest";
import {
  toCreateTripRequest,
  toTripPassenger,
} from "./trips.api.types";
import type { TripPassengerResponse } from "./trips.api.types";
import type { CreateTripForm } from "./trips.type";

describe("toCreateTripRequest", () => {
  it("maps form values to snake_case wire request DTO", () => {
    const form: CreateTripForm = {
      routeId: "route-123",
      vehicleId: "vehicle-456",
      departureDate: "2026-09-20",
      departureTime: "08:30:00",
    };

    const result = toCreateTripRequest(form);

    expect(result).toEqual({
      route_id: "route-123",
      vehicle_id: "vehicle-456",
      departure_date: "2026-09-20",
      departure_time: "08:30:00",
    });
  });

  it("appends seconds when departureTime is in HH:MM format", () => {
    const form: CreateTripForm = {
      routeId: "route-789",
      vehicleId: "vehicle-101",
      departureDate: "2026-09-25",
      departureTime: "14:15",
    };

    const result = toCreateTripRequest(form);

    expect(result.departure_time).toBe("14:15:00");
  });

  it("trims whitespace from inputs", () => {
    const form: CreateTripForm = {
      routeId: "  route-999  ",
      vehicleId: "  vehicle-888  ",
      departureDate: "  2026-10-01  ",
      departureTime: " 09:00 ",
    };

    const result = toCreateTripRequest(form);

    expect(result).toEqual({
      route_id: "route-999",
      vehicle_id: "vehicle-888",
      departure_date: "2026-10-01",
      departure_time: "09:00:00",
    });
  });
});

describe("toTripPassenger", () => {
  it("maps TripPassengerResponse DTO to domain TripPassenger model", () => {
    const dto: TripPassengerResponse = {
      id: "passenger-1",
      booking_id: "booking-101",
      rider_id: "rider-50",
      rider_name: "Alice Smith",
      rider_email: "alice@example.com",
      rider: {
        id: "rider-50",
        name: "Alice Smith",
        email: "alice@example.com",
      },
      seats_booked: 2,
      status: "confirmed",
      pickup_stop: {
        id: "stop-1",
        route_id: "route-1",
        location_id: "loc-1",
        sequence: 1,
        location: {
          id: "loc-1",
          name: "Downtown",
          city: "Metropolis",
          lat: 12.34,
          lng: 56.78,
        },
      },
      dropoff_stop: {
        id: "stop-2",
        route_id: "route-1",
        location_id: "loc-2",
        sequence: 2,
        location: {
          id: "loc-2",
          name: "Uptown",
          city: "Metropolis",
          lat: 12.56,
          lng: 56.9,
        },
      },
      created_at: "2026-09-20T10:00:00Z",
      updated_at: "2026-09-20T10:30:00Z",
    };

    const result = toTripPassenger(dto);

    expect(result).toEqual({
      id: "passenger-1",
      bookingId: "booking-101",
      riderId: "rider-50",
      riderName: "Alice Smith",
      riderEmail: "alice@example.com",
      rider: {
        id: "rider-50",
        name: "Alice Smith",
        email: "alice@example.com",
      },
      seatsBooked: 2,
      status: "confirmed",
      pickupStop: {
        id: "stop-1",
        routeId: "route-1",
        locationId: "loc-1",
        sequence: 1,
        location: {
          id: "loc-1",
          name: "Downtown",
          city: "Metropolis",
          lat: 12.34,
          lng: 56.78,
        },
      },
      dropoffStop: {
        id: "stop-2",
        routeId: "route-1",
        locationId: "loc-2",
        sequence: 2,
        location: {
          id: "loc-2",
          name: "Uptown",
          city: "Metropolis",
          lat: 12.56,
          lng: 56.9,
        },
      },
      createdAt: "2026-09-20T10:00:00Z",
      updatedAt: "2026-09-20T10:30:00Z",
    });
  });
});

