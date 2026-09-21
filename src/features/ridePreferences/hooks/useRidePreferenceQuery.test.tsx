import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import type { RidePreferenceResponse } from "../types/ridePreferences.api.types";
import { useRidePreferenceQuery } from "./useRidePreferenceQuery";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
    getById: vi.fn(),
  },
}));

const mockPreference: RidePreferenceResponse = {
  id: "pref-1",
  rider_id: "rider-1",
  source_location_id: "loc-src-1",
  destination_location_id: "loc-dst-1",
  preferred_departure_time: "08:00:00",
  seats_needed: 1,
  is_active: true,
  label: "Work",
  created_at: "2026-09-21T00:00:00Z",
  updated_at: "2026-09-21T00:00:00Z",
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

describe("useRidePreferenceQuery", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.getById).mockReset();
  });

  it("fetches a single preference by id", async () => {
    vi.mocked(ridePreferencesApi.getById).mockResolvedValueOnce(mockPreference);

    const { result } = renderHook(() => useRidePreferenceQuery("pref-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPreference);
    expect(ridePreferencesApi.getById).toHaveBeenCalledWith("pref-1");
  });

  it("is disabled when preferenceId is empty", () => {
    const { result } = renderHook(() => useRidePreferenceQuery(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(ridePreferencesApi.getById).not.toHaveBeenCalled();
  });
});
