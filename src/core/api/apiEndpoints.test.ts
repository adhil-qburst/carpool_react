import { describe, expect, it } from "vitest";
import {
  apiEndpoints,
  API_ENDPOINTS,
  api_endpoints,
  API_PREFIX,
} from "./apiEndpoints";

describe("apiEndpoints", () => {
  it("defines API_PREFIX as /api/v1", () => {
    expect(API_PREFIX).toBe("/api/v1");
  });

  it("defines auth endpoints correctly", () => {
    expect(apiEndpoints.auth.register).toBe("/api/v1/auth/register");
    expect(apiEndpoints.auth.login).toBe("/api/v1/auth/login");
    expect(apiEndpoints.auth.refresh).toBe("/api/v1/auth/refresh");
  });

  it("defines users endpoints correctly", () => {
    expect(apiEndpoints.users.currentUser).toBe("/api/v1/current_user");
  });

  it("defines vehicles endpoints and path helpers correctly", () => {
    expect(apiEndpoints.vehicles.list).toBe("/api/v1/vehicles");
    expect(apiEndpoints.vehicles.create).toBe("/api/v1/vehicles");
    expect(apiEndpoints.vehicles.byId("v-123")).toBe("/api/v1/vehicles/v-123");
    expect(apiEndpoints.vehicles.update("v-123")).toBe(
      "/api/v1/vehicles/v-123",
    );
    expect(apiEndpoints.vehicles.delete("v-123")).toBe(
      "/api/v1/vehicles/v-123",
    );
  });

  it("defines locations endpoints correctly", () => {
    expect(apiEndpoints.locations.list).toBe("/api/v1/locations");
    expect(apiEndpoints.locations.create).toBe("/api/v1/locations");
  });

  it("defines routes endpoints correctly", () => {
    expect(apiEndpoints.routes.create).toBe("/api/v1/routes");
    expect(apiEndpoints.routes.byId("r-123")).toBe("/api/v1/routes/r-123");
    expect(apiEndpoints.routes.update("r-123")).toBe("/api/v1/routes/r-123");
    expect(apiEndpoints.routes.patch("r-123")).toBe("/api/v1/routes/r-123");
    expect(apiEndpoints.routes.delete("r-123")).toBe("/api/v1/routes/r-123");
  });

  it("defines trips endpoints correctly", () => {
    expect(apiEndpoints.trips.list).toBe("/api/v1/trips");
    expect(apiEndpoints.trips.search).toBe("/api/v1/trips/search");
    expect(apiEndpoints.trips.create).toBe("/api/v1/trips");
    expect(apiEndpoints.trips.byId("t-123")).toBe("/api/v1/trips/t-123");
    expect(apiEndpoints.trips.update("t-123")).toBe("/api/v1/trips/t-123");
    expect(apiEndpoints.trips.delete("t-123")).toBe("/api/v1/trips/t-123");
  });

  it("defines bookings endpoints correctly", () => {
    expect(apiEndpoints.bookings.list).toBe("/api/v1/bookings");
    expect(apiEndpoints.bookings.create).toBe("/api/v1/bookings");
    expect(apiEndpoints.bookings.byId("b-123")).toBe("/api/v1/bookings/b-123");
  });

  it("exports matching aliases", () => {
    expect(API_ENDPOINTS).toBe(apiEndpoints);
    expect(api_endpoints).toBe(apiEndpoints);
  });
});
