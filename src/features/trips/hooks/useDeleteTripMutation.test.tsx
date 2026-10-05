import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import { tripKeys } from "./tripKeys";
import { useDeleteTripMutation } from "./useDeleteTripMutation";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
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

describe("useDeleteTripMutation", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.delete).mockReset();
  });

  it("deletes a trip, invalidating lists and removing detail cache", async () => {
    vi.mocked(tripsApi.delete).mockResolvedValueOnce(undefined);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(() => useDeleteTripMutation(), {
      wrapper,
    });

    result.current.mutate("trip-123");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(tripsApi.delete).toHaveBeenCalledWith("trip-123");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: tripKeys.lists(),
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: tripKeys.detail("trip-123"),
    });
  });

  it("handles delete errors correctly", async () => {
    const error = new Error("Delete failed");
    vi.mocked(tripsApi.delete).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteTripMutation(), {
      wrapper,
    });

    result.current.mutate("trip-123");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
