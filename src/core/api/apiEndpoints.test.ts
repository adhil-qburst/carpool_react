import { describe, expect, it } from "vitest";
import { apiEndpoints, API_ENDPOINTS, api_endpoints } from "./apiEndpoints";

describe("apiEndpoints", () => {
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

  it("exports matching aliases", () => {
    expect(API_ENDPOINTS).toBe(apiEndpoints);
    expect(api_endpoints).toBe(apiEndpoints);
  });
});
