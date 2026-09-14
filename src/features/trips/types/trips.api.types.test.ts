import { describe, expect, it } from "vitest";
import { toCreateTripRequest } from "./trips.api.types";
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
