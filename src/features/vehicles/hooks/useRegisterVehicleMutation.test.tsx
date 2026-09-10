import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import { vehicleKeys } from "./vehicleKeys";
import { useRegisterVehicleMutation } from "./useRegisterVehicleMutation";
import type {
  CreateVehicleRequest,
  VehicleResponse,
} from "../types/vehicles.api.types";
import type { CreateVehicleForm } from "../types/vehicles.type";

vi.mock("../api/vehicles.api", () => ({
  vehiclesApi: {
    register: vi.fn(),
  },
}));

const mockCreatedVehicle: VehicleResponse = {
  id: "veh-1",
  driver_id: "driver-1",
  make: "Toyota",
  model: "Prius",
  registration_number: "KL-07-CD-1234",
  total_seats: 4,
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

describe("useRegisterVehicleMutation", () => {
  beforeEach(() => {
    vi.mocked(vehiclesApi.register).mockReset();
  });

  it("submits a CreateVehicleForm, transforming fields and invalidating vehicles lists query", async () => {
    vi.mocked(vehiclesApi.register).mockResolvedValueOnce(mockCreatedVehicle);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useRegisterVehicleMutation(), {
      wrapper,
    });

    const form: CreateVehicleForm = {
      make: "  Toyota  ",
      model: "  Prius  ",
      registrationNumber: "  kl-07-cd-1234 ",
      totalSeats: "4",
    };

    result.current.mutate(form);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(vehiclesApi.register).toHaveBeenCalledWith({
      make: "Toyota",
      model: "Prius",
      registration_number: "KL-07-CD-1234",
      total_seats: 4,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: vehicleKeys.lists(),
    });
  });

  it("submits raw CreateVehicleRequest directly without transformation", async () => {
    vi.mocked(vehiclesApi.register).mockResolvedValueOnce(mockCreatedVehicle);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useRegisterVehicleMutation(), {
      wrapper,
    });

    const request: CreateVehicleRequest = {
      make: "Toyota",
      model: "Prius",
      registration_number: "KL-07-CD-1234",
      total_seats: 4,
    };

    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(vehiclesApi.register).toHaveBeenCalledWith(request);
  });

  it("handles registration errors", async () => {
    const error = new Error("Registration failed");
    vi.mocked(vehiclesApi.register).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useRegisterVehicleMutation(), {
      wrapper,
    });

    result.current.mutate({
      make: "Toyota",
      model: "Prius",
      registration_number: "KL-07-CD-1234",
      total_seats: 4,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
