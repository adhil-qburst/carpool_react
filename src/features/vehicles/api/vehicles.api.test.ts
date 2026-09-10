import { describe, expect, it, vi, beforeEach } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { vehiclesApi } from "./vehicles.api";
import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  VehicleResponse,
} from "../types/vehicles.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockVehicleResponse: VehicleResponse = {
  id: "veh-1",
  driver_id: "driver-1",
  make: "Toyota",
  model: "Prius",
  registration_number: "KL-07-CD-1234",
  total_seats: 4,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("vehiclesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the list of vehicles", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: [mockVehicleResponse],
    });

    const result = await vehiclesApi.list();

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/vehicles");
    expect(result).toEqual([mockVehicleResponse]);
  });

  it("fetches a single vehicle by id", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: mockVehicleResponse,
    });

    const result = await vehiclesApi.getById("veh-1");

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/vehicles/veh-1");
    expect(result).toEqual(mockVehicleResponse);
  });

  it("registers a new vehicle", async () => {
    const payload: CreateVehicleRequest = {
      make: "Toyota",
      model: "Prius",
      registration_number: "KL-07-CD-1234",
      total_seats: 4,
    };
    vi.mocked(httpClient.post).mockResolvedValueOnce({
      data: mockVehicleResponse,
    });

    const result = await vehiclesApi.register(payload);

    expect(httpClient.post).toHaveBeenCalledWith("/api/v1/vehicles", payload);
    expect(result).toEqual(mockVehicleResponse);
  });

  it("updates an existing vehicle", async () => {
    const payload: UpdateVehicleRequest = {
      total_seats: 5,
    };
    const updatedResponse: VehicleResponse = {
      ...mockVehicleResponse,
      total_seats: 5,
    };
    vi.mocked(httpClient.patch).mockResolvedValueOnce({
      data: updatedResponse,
    });

    const result = await vehiclesApi.update("veh-1", payload);

    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/v1/vehicles/veh-1",
      payload,
    );
    expect(result).toEqual(updatedResponse);
  });

  it("deletes a vehicle by id", async () => {
    vi.mocked(httpClient.delete).mockResolvedValueOnce({ data: undefined });

    const result = await vehiclesApi.delete("veh-1");

    expect(httpClient.delete).toHaveBeenCalledWith("/api/v1/vehicles/veh-1");
    expect(result).toBeUndefined();
  });
});
