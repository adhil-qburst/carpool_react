import { describe, expect, it } from "vitest";
import route_paths, { ROUTE_PATHS, routePaths } from "./route_paths";

describe("route_paths", () => {
  it("defines expected application route paths", () => {
    expect(route_paths.root).toBe("/");
    expect(route_paths.register).toBe("/register");
    expect(route_paths.login).toBe("/login");
    expect(route_paths.emailVerificationSuccess).toBe(
      "/email-verification-success",
    );
    expect(route_paths.home).toBe("/home");
    expect(route_paths.vehicles).toBe("/vehicles");
    expect(route_paths.vehiclesNew).toBe("/vehicles/new");
    expect(route_paths.vehiclesEdit).toBe("/vehicles/:vehicleId/edit");
    expect(route_paths.tripsBook).toBe("/trips/book");
    expect(route_paths.tripsSearch).toBe("/trips/search");
    expect(route_paths.tripsDetail).toBe("/trips/:tripId");
    expect(route_paths.bookings).toBe("/bookings");
  });

  it("exports uppercase and camelCase aliases consistently", () => {
    expect(ROUTE_PATHS).toBe(route_paths);
    expect(routePaths).toBe(route_paths);
    expect(route_paths.LOGIN).toBe(route_paths.login);
    expect(route_paths.REGISTER).toBe(route_paths.register);
    expect(route_paths.VEHICLES).toBe(route_paths.vehicles);
    expect(route_paths.TRIPS_DETAIL).toBe(route_paths.tripsDetail);
    expect(route_paths.BOOKINGS).toBe(route_paths.bookings);
  });

  it("generates dynamic vehicle edit path with getVehicleEditPath", () => {
    expect(route_paths.getVehicleEditPath("123")).toBe("/vehicles/123/edit");
    expect(route_paths.getVehicleEditPath(456)).toBe("/vehicles/456/edit");
  });

  it("generates dynamic trip detail path with getTripDetailPath", () => {
    expect(route_paths.getTripDetailPath("trip-123")).toBe("/trips/trip-123");
    expect(route_paths.getTripDetailPath(456)).toBe("/trips/456");
  });
});
