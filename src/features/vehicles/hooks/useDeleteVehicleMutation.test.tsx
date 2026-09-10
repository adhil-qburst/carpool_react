import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vehiclesApi } from "../api/vehicles.api";
import { vehicleKeys } from "./vehicleKeys";
import { useDeleteVehicleMutation } from "./useDeleteVehicleMutation";

vi.mock("../api/vehicles.api", () => ({
  vehiclesApi: {
    delete: vi.fn(),
  },
}));

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

describe("useDeleteVehicleMutation", () => {
  beforeEach(() => {
    vi.mocked(vehiclesApi.delete).mockReset();
  });

  it("deletes a vehicle, invalidating lists and removing detail cache", async () => {
    vi.mocked(vehiclesApi.delete).mockResolvedValueOnce(undefined);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(() => useDeleteVehicleMutation(), {
      wrapper,
    });

    result.current.mutate("veh-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(vehiclesApi.delete).toHaveBeenCalledWith("veh-1");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: vehicleKeys.lists(),
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: vehicleKeys.detail("veh-1"),
    });
  });

  it("handles delete errors", async () => {
    const error = new Error("Delete failed");
    vi.mocked(vehiclesApi.delete).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteVehicleMutation(), {
      wrapper,
    });

    result.current.mutate("veh-1");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
