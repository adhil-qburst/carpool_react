import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { bookingsApi } from "../api/bookings.api";
import type { PaginatedBookingsResponse } from "../types/bookings.api.types";
import { useBookingsQuery } from "./useBookingsQuery";

vi.mock("../api/bookings.api", () => ({
  bookingsApi: {
    list: vi.fn(),
  },
}));

const mockPaginatedBookings: PaginatedBookingsResponse = {
  items: [
    {
      id: "b-1",
      rider_id: "rider-1",
      trip_id: "trip-1",
      pickup_stop_id: "stop-1",
      dropoff_stop_id: "stop-2",
      seats_booked: 1,
      status: "pending",
      created_at: "2026-09-20T10:00:00Z",
      updated_at: "2026-09-20T10:00:00Z",
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

describe("useBookingsQuery", () => {
  beforeEach(() => {
    vi.mocked(bookingsApi.list).mockReset();
  });

  it("fetches list of bookings with given params", async () => {
    vi.mocked(bookingsApi.list).mockResolvedValueOnce(mockPaginatedBookings);

    const { result } = renderHook(
      () => useBookingsQuery({ page: 1, limit: 10 }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPaginatedBookings);
    expect(bookingsApi.list).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it("respects enabled option", () => {
    const { result } = renderHook(
      () => useBookingsQuery(undefined, { enabled: false }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(bookingsApi.list).not.toHaveBeenCalled();
  });
});
