import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import type { PaginatedTripsResponse } from "../types/trips.api.types";
import { useTripsQuery } from "./useTripsQuery";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    list: vi.fn(),
  },
}));

const mockPaginatedTrips: PaginatedTripsResponse = {
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
  limit: 10,
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

describe("useTripsQuery", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.list).mockReset();
  });

  it("fetches and returns the paginated trips list", async () => {
    vi.mocked(tripsApi.list).mockResolvedValueOnce(mockPaginatedTrips);

    const { result } = renderHook(() => useTripsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPaginatedTrips);
    expect(tripsApi.list).toHaveBeenCalledWith(undefined);
  });

  it("passes pagination params to the API call", async () => {
    vi.mocked(tripsApi.list).mockResolvedValueOnce(mockPaginatedTrips);

    const params = { page: 2, limit: 10 };
    const { result } = renderHook(() => useTripsQuery(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(tripsApi.list).toHaveBeenCalledWith(params);
  });

  it("handles fetch errors", async () => {
    const error = new Error("Failed to load trips");
    vi.mocked(tripsApi.list).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useTripsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
