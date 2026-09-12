import { describe, expect, it, vi, beforeEach } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { routesApi } from "./routes.api";
import type {
  CreateRouteRequest,
  RouteResponse,
} from "../types/routes.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const mockRouteResponse: RouteResponse = {
  id: "route-123",
  name: "Daily Commute",
  driver_id: "driver-456",
  route_stops: [
    {
      id: "stop-1",
      route_id: "route-123",
      location_id: "loc-src",
      sequence: 0,
    },
    {
      id: "stop-2",
      route_id: "route-123",
      location_id: "loc-dest",
      sequence: 1,
    },
  ],
};

describe("routesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new route by posting to /api/v1/routes", async () => {
    const payload: CreateRouteRequest = {
      name: "Daily Commute",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: null,
    };

    vi.mocked(httpClient.post).mockResolvedValueOnce({
      data: mockRouteResponse,
    });

    const result = await routesApi.create(payload);

    expect(httpClient.post).toHaveBeenCalledWith("/api/v1/routes", payload);
    expect(result).toEqual(mockRouteResponse);
  });
});
