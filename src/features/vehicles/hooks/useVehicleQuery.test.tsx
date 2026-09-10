import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import type { VehicleResponse } from "../types/vehicles.api.types";
import { useVehicleQuery } from "./useVehicleQuery";

vi.mock("../api/vehicles.api", () => ({
  vehiclesApi: {
    getById: vi.fn(),
  },
}));

const mockVehicle: VehicleResponse = {
  id: "veh-1",
  driver_id: "driver-1",
  make: "Honda",
  model: "Civic",
  registration_number: "KL-01-AB-1234",
  total_seats: 5,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useVehicleQuery", () => {
  beforeEach(() => {
    vi.mocked(vehiclesApi.getById).mockReset();
  });

  it("fetches vehicle details when vehicleId is provided", async () => {
    vi.mocked(vehiclesApi.getById).mockResolvedValueOnce(mockVehicle);

    const { result } = renderHook(() => useVehicleQuery("veh-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockVehicle);
    expect(vehiclesApi.getById).toHaveBeenCalledWith("veh-1");
  });

  it("does not fetch when vehicleId is empty", () => {
    const { result } = renderHook(() => useVehicleQuery(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(vehiclesApi.getById).not.toHaveBeenCalled();
  });

  it("handles fetch errors", async () => {
    const error = new Error("Vehicle not found");
    vi.mocked(vehiclesApi.getById).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useVehicleQuery("veh-missing"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
