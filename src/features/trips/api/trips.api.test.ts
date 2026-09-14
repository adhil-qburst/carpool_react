import { describe, expect, it, vi, beforeEach } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { apiEndpoints } from "@core/api/apiEndpoints";
import { tripsApi } from "./trips.api";
import type { CreateTripRequest, TripResponse } from "../types/trips.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("tripsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create calls POST on trips endpoint and unwraps res.data", async () => {
    const payload: CreateTripRequest = {
      route_id: "route-1",
      vehicle_id: "veh-1",
      departure_date: "2026-09-20",
      departure_time: "08:00:00",
    };
    const mockResponse: TripResponse = {
      id: "trip-1",
      route_id: "route-1",
      driver_id: "driver-1",
      vehicle_id: "veh-1",
      departure_date: "2026-09-20",
      departure_time: "08:00:00",
      available_seats: 3,
      status: "scheduled",
      created_at: "2026-09-14T10:00:00Z",
      updated_at: "2026-09-14T10:00:00Z",
    };

    vi.mocked(httpClient.post).mockResolvedValueOnce({ data: mockResponse });

    const result = await tripsApi.create(payload);

    expect(httpClient.post).toHaveBeenCalledWith(
      apiEndpoints.trips.create,
      payload,
    );
    expect(result).toEqual(mockResponse);
  });

  it("list calls GET with query parameters and unwraps res.data", async () => {
    const mockResponse = {
      items: [],
      page: 1,
      limit: 10,
      total: 0,
    };
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockResponse });

    const result = await tripsApi.list({ page: 1, limit: 10 });

    expect(httpClient.get).toHaveBeenCalledWith(apiEndpoints.trips.list, {
      params: { page: 1, limit: 10 },
    });
    expect(result).toEqual(mockResponse);
  });

  it("getById calls GET on parameterized trip endpoint", async () => {
    const mockTrip: TripResponse = {
      id: "trip-99",
      route_id: "route-1",
      driver_id: "driver-1",
      vehicle_id: "veh-1",
      departure_date: "2026-09-21",
      departure_time: "09:00:00",
      available_seats: 4,
      status: "scheduled",
      created_at: "2026-09-14T10:00:00Z",
      updated_at: "2026-09-14T10:00:00Z",
    };
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockTrip });

    const result = await tripsApi.getById("trip-99");

    expect(httpClient.get).toHaveBeenCalledWith(apiEndpoints.trips.byId("trip-99"));
    expect(result).toEqual(mockTrip);
  });

  it("getRoutes calls GET on routes.list endpoint", async () => {
    const mockRoutes = {
      items: [{ id: "r1", name: "Home to Work", status: "active" }],
    };
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockRoutes });

    const result = await tripsApi.getRoutes();

    expect(httpClient.get).toHaveBeenCalledWith(apiEndpoints.routes.list);
    expect(result).toEqual(mockRoutes);
  });

  it("getVehicles calls GET on vehicles.list endpoint", async () => {
    const mockVehicles = [
      {
        id: "v1",
        make: "Toyota",
        model: "Prius",
        license_plate: "KA01AB1234",
        total_seats: 4,
      },
    ];
    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockVehicles });

    const result = await tripsApi.getVehicles();

    expect(httpClient.get).toHaveBeenCalledWith(apiEndpoints.vehicles.list);
    expect(result).toEqual(mockVehicles);
  });

  it("update calls PATCH on parameterized trip endpoint and unwraps res.data", async () => {
    const updatePayload = { departure_date: "2026-09-25" };
    const mockTrip: TripResponse = {
      id: "trip-1",
      route_id: "route-1",
      driver_id: "driver-1",
      vehicle_id: "veh-1",
      departure_date: "2026-09-25",
      departure_time: "08:00:00",
      available_seats: 3,
      status: "scheduled",
      created_at: "2026-09-14T10:00:00Z",
      updated_at: "2026-09-14T11:00:00Z",
    };
    vi.mocked(httpClient.patch).mockResolvedValueOnce({ data: mockTrip });

    const result = await tripsApi.update("trip-1", updatePayload);

    expect(httpClient.patch).toHaveBeenCalledWith(
      apiEndpoints.trips.update("trip-1"),
      updatePayload,
    );
    expect(result).toEqual(mockTrip);
  });

  it("delete calls DELETE on parameterized trip endpoint", async () => {
    vi.mocked(httpClient.delete).mockResolvedValueOnce({ data: undefined });

    await tripsApi.delete("trip-1");

    expect(httpClient.delete).toHaveBeenCalledWith(
      apiEndpoints.trips.delete("trip-1"),
    );
  });
});
