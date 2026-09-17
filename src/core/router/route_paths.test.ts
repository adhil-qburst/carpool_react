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
    expect(route_paths.driverDashboard).toBe("/driver-dashboard");
    expect(route_paths.vehicles).toBe("/vehicles");
    expect(route_paths.vehiclesNew).toBe("/vehicles/new");
    expect(route_paths.vehiclesEdit).toBe("/vehicles/:vehicleId/edit");
  });

  it("exports uppercase and camelCase aliases consistently", () => {
    expect(ROUTE_PATHS).toBe(route_paths);
    expect(routePaths).toBe(route_paths);
    expect(route_paths.LOGIN).toBe(route_paths.login);
    expect(route_paths.REGISTER).toBe(route_paths.register);
    expect(route_paths.VEHICLES).toBe(route_paths.vehicles);
    expect(route_paths.DRIVER_DASHBOARD).toBe(route_paths.driverDashboard);
  });

  it("generates dynamic vehicle edit path with getVehicleEditPath", () => {
    expect(route_paths.getVehicleEditPath("123")).toBe("/vehicles/123/edit");
    expect(route_paths.getVehicleEditPath(456)).toBe("/vehicles/456/edit");
  });
});
