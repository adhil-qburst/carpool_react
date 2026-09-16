import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import type { SearchTripsQueryParams, SearchTripsResponse } from "../types/trips.api.types";
import { useSearchTripsQuery } from "./useSearchTripsQuery";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    search: vi.fn(),
  },
}));

const mockSearchResponse: SearchTripsResponse = {
  items: [
    {
      id: "trip-1",
      route_id: "route-1",
      driver_id: "driver-1",
      vehicle_id: "veh-1",
      departure_date: "2026-09-20",
      departure_time: "08:30:00",
      available_seats: 3,
      status: "scheduled",
      created_at: "2026-09-14T10:00:00Z",
      updated_at: "2026-09-14T10:00:00Z",
    },
  ],
  page: 1,
  limit: 20,
  total: 1,
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

describe("useSearchTripsQuery", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.search).mockReset();
  });

  it("does not fetch if source or destination location id is missing and no override enabled", () => {
    const { result } = renderHook(
      () => useSearchTripsQuery(null),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(tripsApi.search).not.toHaveBeenCalled();
  });

  it("fetches when source and destination location ids are provided", async () => {
    vi.mocked(tripsApi.search).mockResolvedValueOnce(mockSearchResponse);

    const params: SearchTripsQueryParams = {
      source_location_id: "loc-src-1",
      destination_location_id: "loc-dst-2",
      departure_date: "2026-09-20",
      seats_needed: 2,
    };

    const { result } = renderHook(() => useSearchTripsQuery(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockSearchResponse);
    expect(tripsApi.search).toHaveBeenCalledWith(params);
  });

  it("handles search errors", async () => {
    vi.mocked(tripsApi.search).mockRejectedValueOnce(new Error("Network error"));

    const params: SearchTripsQueryParams = {
      source_location_id: "loc-src-1",
      destination_location_id: "loc-dst-2",
    };

    const { result } = renderHook(() => useSearchTripsQuery(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Network error");
  });
});
