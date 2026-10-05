import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import type { RidePreferenceResponse } from "../types/ridePreferences.api.types";
import { useRidePreferencesQuery } from "./useRidePreferencesQuery";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
    list: vi.fn(),
  },
}));

const mockPreferences: RidePreferenceResponse[] = [
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

describe("useRidePreferencesQuery", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.list).mockReset();
  });

  it("fetches and returns preferences without filters", async () => {
    vi.mocked(ridePreferencesApi.list).mockResolvedValueOnce(mockPreferences);

    const { result } = renderHook(() => useRidePreferencesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPreferences);
    expect(ridePreferencesApi.list).toHaveBeenCalledWith(undefined);
  });

  it("passes active_only filter to api when provided", async () => {
    vi.mocked(ridePreferencesApi.list).mockResolvedValueOnce(mockPreferences);

    const { result } = renderHook(
      () => useRidePreferencesQuery({ activeOnly: true }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ridePreferencesApi.list).toHaveBeenCalledWith({
      active_only: true,
    });
  });

  it("handles error state", async () => {
    const error = new Error("Failed to load preferences");
    vi.mocked(ridePreferencesApi.list).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useRidePreferencesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
