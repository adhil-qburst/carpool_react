import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import { vehicleKeys } from "./vehicleKeys";
import { useUpdateVehicleMutation } from "./useUpdateVehicleMutation";
import type {
  UpdateVehicleRequest,
  VehicleResponse,
} from "../types/vehicles.api.types";
import type { UpdateVehicleForm } from "../types/vehicles.type";

vi.mock("../api/vehicles.api", () => ({
  vehiclesApi: {
    update: vi.fn(),
  },
}));

const mockUpdatedVehicle: VehicleResponse = {
  id: "veh-1",
  driver_id: "driver-1",
  make: "Toyota",
  model: "Corolla",
  registration_number: "KL-07-CD-5678",
  total_seats: 5,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return {
    queryClient,
    wrapper: function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  };
}

describe("useUpdateVehicleMutation", () => {
  beforeEach(() => {
    vi.mocked(vehiclesApi.update).mockReset();
  });

  it("updates vehicle with UpdateVehicleForm, invalidating list and detail queries", async () => {
    vi.mocked(vehiclesApi.update).mockResolvedValueOnce(mockUpdatedVehicle);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateVehicleMutation(), {
      wrapper,
    });

    const form: UpdateVehicleForm = {
      registrationNumber: "  kl-07-cd-5678 ",
      totalSeats: "5",
    };

    result.current.mutate({ vehicleId: "veh-1", payload: form });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(vehiclesApi.update).toHaveBeenCalledWith("veh-1", {
      registration_number: "KL-07-CD-5678",
      total_seats: 5,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: vehicleKeys.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: vehicleKeys.detail("veh-1"),
    });
  });

  it("updates vehicle with raw UpdateVehicleRequest", async () => {
    vi.mocked(vehiclesApi.update).mockResolvedValueOnce(mockUpdatedVehicle);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useUpdateVehicleMutation(), {
      wrapper,
    });

    const request: UpdateVehicleRequest = {
      make: "Toyota",
    };

    result.current.mutate({ vehicleId: "veh-1", payload: request });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(vehiclesApi.update).toHaveBeenCalledWith("veh-1", request);
  });

  it("handles update errors", async () => {
    const error = new Error("Update failed");
    vi.mocked(vehiclesApi.update).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useUpdateVehicleMutation(), {
      wrapper,
    });

    result.current.mutate({
      vehicleId: "veh-1",
      payload: { make: "Toyota" },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
