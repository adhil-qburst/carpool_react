import { describe, expect, it, vi, beforeEach } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { routesApi } from "./routes.api";
import type {
  CreateRouteRequest,
  RouteResponse,
} from "../types/routes.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
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

const mockPaginatedRoutes = {
  items: [mockRouteResponse],
  page: 1,
  limit: 20,
  total: 1,
};

describe("routesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists routes by getting /api/v1/routes with params", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: mockPaginatedRoutes,
    });

    const result = await routesApi.list({ page: 2, limit: 10 });

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/routes", {
      params: { page: 2, limit: 10 },
    });
    expect(result).toEqual(mockPaginatedRoutes);
  });

  it("lists routes with default undefined params", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: mockPaginatedRoutes,
    });

    const result = await routesApi.list();

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/routes", {
      params: undefined,
    });
    expect(result).toEqual(mockPaginatedRoutes);
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

  it("updates a route by putting to /api/v1/routes/:route_id", async () => {
    const payload = {
      name: "Updated Commute",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: null,
    };

    vi.mocked(httpClient.put).mockResolvedValueOnce({
      data: mockRouteResponse,
    });

    const result = await routesApi.update("route-123", payload);

    expect(httpClient.put).toHaveBeenCalledWith(
      "/api/v1/routes/route-123",
      payload,
    );
    expect(result).toEqual(mockRouteResponse);
  });

  it("patches a route by patching to /api/v1/routes/:route_id", async () => {
    const payload = {
      name: "Patched Commute",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: null,
    };

    vi.mocked(httpClient.patch).mockResolvedValueOnce({
      data: mockRouteResponse,
    });

    const result = await routesApi.patch("route-123", payload);

    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/v1/routes/route-123",
      payload,
    );
    expect(result).toEqual(mockRouteResponse);
  });
});

