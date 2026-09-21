import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import type {
  RidePreferenceResponse,
  UpdateRidePreferenceRequest,
} from "../types/ridePreferences.api.types";
import type { UpdateRidePreferenceForm } from "../types/ridePreferences.type";
import { ridePreferenceKeys } from "./ridePreferenceKeys";
import { useUpdateRidePreferenceMutation } from "./useUpdateRidePreferenceMutation";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
    update: vi.fn(),
  },
}));

const mockUpdatedPreference: RidePreferenceResponse = {
  id: "pref-1",
  rider_id: "rider-1",
  source_location_id: "loc-src-1",
  destination_location_id: "loc-dst-1",
  preferred_departure_time: "09:00:00",
  seats_needed: 2,
  is_active: true,
  label: "Office",
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

describe("useUpdateRidePreferenceMutation", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.update).mockReset();
  });

  it("submits UpdateRidePreferenceForm, transforms it, and invalidates queries", async () => {
    vi.mocked(ridePreferencesApi.update).mockResolvedValueOnce(
      mockUpdatedPreference,
    );
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateRidePreferenceMutation(), {
      wrapper,
    });

    const form: UpdateRidePreferenceForm = {
      seatsNeeded: "2",
      preferredDepartureTime: "09:00:00",
    };

    result.current.mutate({
      preferenceId: "pref-1",
      payload: form,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ridePreferencesApi.update).toHaveBeenCalledWith("pref-1", {
      seats_needed: 2,
      preferred_departure_time: "09:00:00",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ridePreferenceKeys.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ridePreferenceKeys.detail("pref-1"),
    });
  });

  it("submits raw UpdateRidePreferenceRequest directly", async () => {
    vi.mocked(ridePreferencesApi.update).mockResolvedValueOnce(
      mockUpdatedPreference,
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useUpdateRidePreferenceMutation(), {
      wrapper,
    });

    const request: UpdateRidePreferenceRequest = {
      seats_needed: 2,
    };

    result.current.mutate({
      preferenceId: "pref-1",
      payload: request,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ridePreferencesApi.update).toHaveBeenCalledWith("pref-1", request);
  });
});
