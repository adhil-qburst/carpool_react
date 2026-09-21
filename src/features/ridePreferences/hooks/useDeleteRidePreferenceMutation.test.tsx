import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import { ridePreferenceKeys } from "./ridePreferenceKeys";
import { useDeleteRidePreferenceMutation } from "./useDeleteRidePreferenceMutation";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
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

describe("useDeleteRidePreferenceMutation", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.delete).mockReset();
  });

  it("calls delete api and invalidates/removes queries", async () => {
    vi.mocked(ridePreferencesApi.delete).mockResolvedValueOnce(undefined);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeSpy = vi.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(() => useDeleteRidePreferenceMutation(), {
      wrapper,
    });

    result.current.mutate("pref-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ridePreferencesApi.delete).toHaveBeenCalledWith("pref-1");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ridePreferenceKeys.lists(),
    });
    expect(removeSpy).toHaveBeenCalledWith({
      queryKey: ridePreferenceKeys.detail("pref-1"),
    });
  });
});
