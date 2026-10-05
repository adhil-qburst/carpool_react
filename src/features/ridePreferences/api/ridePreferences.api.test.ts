import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { ridePreferencesApi } from "./ridePreferences.api";
import type {
  CreateRidePreferenceRequest,
  RidePreferenceResponse,
  UpdateRidePreferenceRequest,
} from "../types/ridePreferences.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockRidePreferenceResponse: RidePreferenceResponse = {
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

describe("ridePreferencesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new ride preference", async () => {
    const payload: CreateRidePreferenceRequest = {
      source_location_id: "loc-src-1",
      destination_location_id: "loc-dst-1",
      preferred_departure_time: "08:30:00",
      seats_needed: 1,
      is_active: true,
      label: "Office Morning",
    };

    vi.mocked(httpClient.post).mockResolvedValueOnce({
      data: mockRidePreferenceResponse,
    });

    const result = await ridePreferencesApi.create(payload);

    expect(httpClient.post).toHaveBeenCalledWith(
      "/api/v1/ride-preferences",
      payload,
    );
    expect(result).toEqual(mockRidePreferenceResponse);
  });

  it("fetches the list of ride preferences", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: [mockRidePreferenceResponse],
    });

    const result = await ridePreferencesApi.list({ active_only: true });

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/ride-preferences", {
      params: { active_only: true },
    });
    expect(result).toEqual([mockRidePreferenceResponse]);
  });

  it("fetches matching preferences by source and destination location ids", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: [mockRidePreferenceResponse],
    });

    const result = await ridePreferencesApi.getMatches({
      source_location_id: "loc-src-1",
      destination_location_id: "loc-dst-1",
    });

    expect(httpClient.get).toHaveBeenCalledWith(
      "/api/v1/ride-preferences/matches",
      {
        params: {
          source_location_id: "loc-src-1",
          destination_location_id: "loc-dst-1",
        },
      },
    );
    expect(result).toEqual([mockRidePreferenceResponse]);
  });

  it("fetches a single ride preference by id", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: mockRidePreferenceResponse,
    });

    const result = await ridePreferencesApi.getById("pref-1");

    expect(httpClient.get).toHaveBeenCalledWith(
      "/api/v1/ride-preferences/pref-1",
    );
    expect(result).toEqual(mockRidePreferenceResponse);
  });

  it("updates an existing ride preference", async () => {
    const payload: UpdateRidePreferenceRequest = {
      seats_needed: 2,
    };
    const updatedResponse: RidePreferenceResponse = {
      ...mockRidePreferenceResponse,
      seats_needed: 2,
    };

    vi.mocked(httpClient.patch).mockResolvedValueOnce({
      data: updatedResponse,
    });

    const result = await ridePreferencesApi.update("pref-1", payload);

    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/v1/ride-preferences/pref-1",
      payload,
    );
    expect(result).toEqual(updatedResponse);
  });

  it("deletes a ride preference by id", async () => {
    vi.mocked(httpClient.delete).mockResolvedValueOnce({ data: undefined });

    const result = await ridePreferencesApi.delete("pref-1");

    expect(httpClient.delete).toHaveBeenCalledWith(
      "/api/v1/ride-preferences/pref-1",
    );
    expect(result).toBeUndefined();
  });
});
