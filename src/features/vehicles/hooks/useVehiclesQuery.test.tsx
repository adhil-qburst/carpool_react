import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import type { VehicleResponse } from "../types/vehicles.api.types";
import { useVehiclesQuery } from "./useVehiclesQuery";

vi.mock("../api/vehicles.api", () => ({
  vehiclesApi: {
    list: vi.fn(),
  },
}));

const mockVehicles: VehicleResponse[] = [
  {
    id: "veh-1",
    driver_id: "driver-1",
    make: "Toyota",
    model: "Prius",
    registration_number: "KL-07-CD-1234",
    total_seats: 4,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
];

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

describe("useVehiclesQuery", () => {
  beforeEach(() => {
    vi.mocked(vehiclesApi.list).mockReset();
  });

  it("fetches and returns the vehicle list", async () => {
    vi.mocked(vehiclesApi.list).mockResolvedValueOnce(mockVehicles);

    const { result } = renderHook(() => useVehiclesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockVehicles);
    expect(vehiclesApi.list).toHaveBeenCalledTimes(1);
  });

  it("handles fetch errors", async () => {
    const error = new Error("Failed to fetch vehicles");
    vi.mocked(vehiclesApi.list).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useVehiclesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
