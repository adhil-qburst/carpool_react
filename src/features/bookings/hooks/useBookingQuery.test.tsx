import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { bookingsApi } from "../api/bookings.api";
import type { BookingResponse } from "../types/bookings.api.types";
import { useBookingQuery } from "./useBookingQuery";

vi.mock("../api/bookings.api", () => ({
  bookingsApi: {
    getById: vi.fn(),
  },
}));

const mockBooking: BookingResponse = {
  id: "b-123",
  rider_id: "rider-1",
  trip_id: "trip-1",
  pickup_stop_id: "stop-1",
  dropoff_stop_id: "stop-2",
  seats_booked: 2,
  status: "confirmed",
  created_at: "2026-09-20T10:00:00Z",
  updated_at: "2026-09-20T10:00:00Z",
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

describe("useBookingQuery", () => {
  beforeEach(() => {
    vi.mocked(bookingsApi.getById).mockReset();
  });

  it("fetches booking details by bookingId", async () => {
    vi.mocked(bookingsApi.getById).mockResolvedValueOnce(mockBooking);

    const { result } = renderHook(() => useBookingQuery("b-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockBooking);
    expect(bookingsApi.getById).toHaveBeenCalledWith("b-123");
  });

  it("does not fetch when bookingId is empty", () => {
    const { result } = renderHook(() => useBookingQuery(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(bookingsApi.getById).not.toHaveBeenCalled();
  });
});
