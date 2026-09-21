import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import type { RidePreferenceResponse } from "../types/ridePreferences.api.types";
import { useMatchingRidePreferencesQuery } from "./useMatchingRidePreferencesQuery";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
    getMatches: vi.fn(),
  },
}));

const mockMatches: RidePreferenceResponse[] = [
  {
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

describe("useMatchingRidePreferencesQuery", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.getMatches).mockReset();
  });

  it("fetches matching preferences when both source and destination are present", async () => {
    vi.mocked(ridePreferencesApi.getMatches).mockResolvedValueOnce(mockMatches);

    const { result } = renderHook(
      () =>
        useMatchingRidePreferencesQuery({
          sourceLocationId: "loc-src-1",
          destinationLocationId: "loc-dst-1",
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMatches);
    expect(ridePreferencesApi.getMatches).toHaveBeenCalledWith({
      source_location_id: "loc-src-1",
      destination_location_id: "loc-dst-1",
    });
  });

  it("remains idle if sourceLocationId or destinationLocationId is missing", () => {
    const { result } = renderHook(
      () =>
        useMatchingRidePreferencesQuery({
          sourceLocationId: "loc-src-1",
          destinationLocationId: "",
        }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(ridePreferencesApi.getMatches).not.toHaveBeenCalled();
  });
});
