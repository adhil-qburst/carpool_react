import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookingsPage from "./BookingsPage";
import { bookingsApi } from "../api/bookings.api";
import type { PaginatedBookingsResponse } from "../types/bookings.api.types";

vi.mock("../api/bookings.api", () => ({
  bookingsApi: {
    list: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockStop1 = {
  id: "stop-pickup-1",
  route_id: "route-1",
  location_id: "loc-1",
  sequence: 1,
  location: null,
};

const mockStop2 = {
  id: "stop-dropoff-1",
  route_id: "route-1",
  location_id: "loc-2",
  sequence: 2,
  location: null,
};

const mockStop3 = {
  id: "stop-pickup-2",
  route_id: "route-2",
  location_id: "loc-3",
  sequence: 1,
  location: null,
};

const mockStop4 = {
  id: "stop-dropoff-2",
  route_id: "route-2",
  location_id: "loc-4",
  sequence: 2,
  location: null,
};

const mockBookingsData: PaginatedBookingsResponse = {
  items: [
    {
      id: "booking-12345678",
      rider_id: "user-1",
      trip_id: "trip-98765432",
      pickup_stop_id: "stop-pickup-1",
      dropoff_stop_id: "stop-dropoff-1",
      seats_booked: 2,
      status: "confirmed",
      pickup_stop: mockStop1,
      dropoff_stop: mockStop2,
      created_at: "2026-09-20T10:00:00Z",
      updated_at: "2026-09-20T10:00:00Z",
    },
    {
      id: "booking-87654321",
      rider_id: "user-1",
      trip_id: "trip-12345678",
      pickup_stop_id: "stop-pickup-2",
      dropoff_stop_id: "stop-dropoff-2",
      seats_booked: 1,
      status: "pending",
      pickup_stop: mockStop3,
      dropoff_stop: mockStop4,
      created_at: "2026-09-21T08:30:00Z",
      updated_at: "2026-09-21T08:30:00Z",
    },
  ],
  page: 1,
  limit: 8,
  total: 2,
};

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <BookingsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("BookingsPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.mocked(bookingsApi.list).mockReset();
    vi.mocked(bookingsApi.delete).mockReset();
  });

  it("renders page title and empty state when no bookings exist", async () => {
    vi.mocked(bookingsApi.list).mockResolvedValueOnce({
      items: [],
      page: 1,
      limit: 8,
      total: 0,
    });

    renderWithProviders();

    expect(
      screen.getByRole("heading", { name: "My Bookings" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No bookings found")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("link", { name: /find a ride/i }),
    ).toBeInTheDocument();
  });

  it("renders list of bookings with status and details", async () => {
    vi.mocked(bookingsApi.list).mockResolvedValueOnce(mockBookingsData);

    renderWithProviders();

    await waitFor(() => {
      expect(
        screen.getByText("Booking #booking-"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("2 seats")).toBeInTheDocument();
    expect(screen.getByText("1 seat")).toBeInTheDocument();
  });

  it("opens cancel modal and successfully cancels a reservation", async () => {
    vi.mocked(bookingsApi.list).mockResolvedValue(mockBookingsData);
    vi.mocked(bookingsApi.delete).mockResolvedValueOnce();

    renderWithProviders();

    await waitFor(() => {
      expect(
        screen.getByText("Booking #booking-"),
      ).toBeInTheDocument();
    });

    const cancelButtons = screen.getAllByRole("button", {
      name: /cancel reservation|cancel booking/i,
    });
    await user.click(cancelButtons[0]);

    expect(
      screen.getByRole("heading", { name: "Cancel this booking?" }),
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", {
      name: /yes, cancel booking/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(bookingsApi.delete).toHaveBeenCalledWith("booking-12345678");
    });
  });
});
