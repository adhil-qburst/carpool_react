import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import type { TripPassengerResponse } from "../types/trips.api.types";
import { useTripPassengersQuery } from "./useTripPassengersQuery";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    getPassengers: vi.fn(),
  },
}));

const mockPassengers: TripPassengerResponse[] = [
  {
    id: "passenger-1",
    booking_id: "booking-101",
    rider_id: "rider-1",
    rider_name: "Jane Doe",
    rider_email: "jane@example.com",
    rider: {
      id: "rider-1",
      name: "Jane Doe",
      email: "jane@example.com",
    },
    seats_booked: 1,
    status: "confirmed",
    pickup_stop: {
      id: "stop-1",
      route_id: "route-1",
      location_id: "loc-1",
      sequence: 1,
    },
    dropoff_stop: {
      id: "stop-2",
      route_id: "route-1",
      location_id: "loc-2",
      sequence: 2,
    },
    created_at: "2026-09-20T10:00:00Z",
    updated_at: "2026-09-20T10:00:00Z",
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

describe("useTripPassengersQuery", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.getPassengers).mockReset();
  });

  it("does not execute query when tripId is empty", () => {
    const { result } = renderHook(() => useTripPassengersQuery(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(tripsApi.getPassengers).not.toHaveBeenCalled();
  });

  it("fetches and returns passengers for a valid tripId", async () => {
    vi.mocked(tripsApi.getPassengers).mockResolvedValueOnce(mockPassengers);

    const { result } = renderHook(() => useTripPassengersQuery("trip-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPassengers);
    expect(tripsApi.getPassengers).toHaveBeenCalledWith("trip-123", undefined);
  });

  it("passes status filter parameter when provided", async () => {
    vi.mocked(tripsApi.getPassengers).mockResolvedValueOnce(mockPassengers);

    const { result } = renderHook(
      () => useTripPassengersQuery("trip-123", { status: "confirmed" }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(tripsApi.getPassengers).toHaveBeenCalledWith("trip-123", {
      status: "confirmed",
    });
  });

  it("respects enabled option override", () => {
    const { result } = renderHook(
      () =>
        useTripPassengersQuery("trip-123", undefined, {
          enabled: false,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(tripsApi.getPassengers).not.toHaveBeenCalled();
  });

  it("handles fetch errors gracefully", async () => {
    const error = new Error("Failed to load passengers");
    vi.mocked(tripsApi.getPassengers).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useTripPassengersQuery("trip-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
