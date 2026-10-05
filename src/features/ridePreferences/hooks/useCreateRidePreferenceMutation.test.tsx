import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import type {
  CreateRidePreferenceRequest,
  RidePreferenceResponse,
} from "../types/ridePreferences.api.types";
import type { CreateRidePreferenceForm } from "../types/ridePreferences.type";
import { ridePreferenceKeys } from "./ridePreferenceKeys";
import { useCreateRidePreferenceMutation } from "./useCreateRidePreferenceMutation";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
    create: vi.fn(),
  },
}));

const mockCreatedPreference: RidePreferenceResponse = {
  id: "pref-1",
  rider_id: "rider-1",
  source_location_id: "loc-src-1",
  destination_location_id: "loc-dst-1",
  preferred_departure_time: "08:30:00",
  seats_needed: 1,
  is_active: true,
  label: "Office Morning",
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

describe("useCreateRidePreferenceMutation", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.create).mockReset();
  });

  it("submits a CreateRidePreferenceForm and invalidates ride preferences queries", async () => {
    vi.mocked(ridePreferencesApi.create).mockResolvedValueOnce(
      mockCreatedPreference,
    );
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateRidePreferenceMutation(), {
      wrapper,
    });

    const form: CreateRidePreferenceForm = {
      sourceLocationId: "  loc-src-1  ",
      destinationLocationId: "  loc-dst-1  ",
      preferredDepartureTime: "  08:30:00  ",
      seatsNeeded: "1",
      isActive: true,
      label: "  Office Morning  ",
    };

    result.current.mutate(form);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ridePreferencesApi.create).toHaveBeenCalledWith({
      source_location_id: "loc-src-1",
      destination_location_id: "loc-dst-1",
      preferred_departure_time: "08:30:00",
      seats_needed: 1,
      is_active: true,
      label: "Office Morning",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ridePreferenceKeys.lists(),
    });
  });

  it("submits raw CreateRidePreferenceRequest without transformation", async () => {
    vi.mocked(ridePreferencesApi.create).mockResolvedValueOnce(
      mockCreatedPreference,
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateRidePreferenceMutation(), {
      wrapper,
    });

    const request: CreateRidePreferenceRequest = {
      source_location_id: "loc-src-1",
      destination_location_id: "loc-dst-1",
      preferred_departure_time: "08:30:00",
      seats_needed: 1,
      is_active: true,
      label: "Office Morning",
    };

    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(ridePreferencesApi.create).toHaveBeenCalledWith(request);
  });
});
