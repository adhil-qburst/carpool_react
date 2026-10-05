import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookRideConfirmationModal from "./BookRideConfirmationModal";
import { bookingsApi } from "@features/bookings/api/bookings.api";
import type { TripResponse } from "../types/trips.api.types";
import type { BookingResponse } from "@features/bookings/types/bookings.api.types";

vi.mock("@features/bookings/api/bookings.api", () => ({
  bookingsApi: {
    create: vi.fn(),
  },
}));

const mockTrip: TripResponse = {
  id: "trip-test-1",
  route_id: "route-test-1",
  driver_id: "driver-test-1",
  vehicle_id: "veh-test-1",
  departure_date: "2026-09-25",
  departure_time: "08:30:00",
  available_seats: 3,
  status: "scheduled",
  route: {
    id: "route-test-1",
    name: "Central → North",
    status: "active",
    route_stops: [
      {
        id: "stop-1",
        route_id: "route-test-1",
        location_id: "loc-1",
        sequence: 0,
        location: { id: "loc-1", name: "Central Station" },
      },
      {
        id: "stop-2",
        route_id: "route-test-1",
        location_id: "loc-2",
        sequence: 1,
        location: { id: "loc-2", name: "North Terminal" },
      },
    ],
  },
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
};

const mockConfirmedBooking: BookingResponse = {
  id: "booking-1",
  rider_id: "user-1",
  trip_id: "trip-test-1",
  pickup_stop_id: "stop-1",
  dropoff_stop_id: "stop-2",
  seats_booked: 1,
  status: "confirmed",
  pickup_stop: {
    id: "stop-1",
    route_id: "route-test-1",
    location_id: "loc-1",
    sequence: 0,
  },
  dropoff_stop: {
    id: "stop-2",
    route_id: "route-test-1",
    location_id: "loc-2",
    sequence: 1,
  },
  created_at: "2026-09-21T00:00:00Z",
  updated_at: "2026-09-21T00:00:00Z",
};

function renderModal(props: Partial<React.ComponentProps<typeof BookRideConfirmationModal>> = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <BookRideConfirmationModal
          trip={mockTrip}
          sourceName="Central Station"
          destinationName="North Terminal"
          seatsRequested={1}
          onClose={vi.fn()}
          {...props}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("BookRideConfirmationModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with ride details and confirm button", () => {
    renderModal();

    expect(screen.getByText("Book this Ride?")).toBeInTheDocument();
    expect(screen.getByText("Central → North")).toBeInTheDocument();
    expect(screen.getByText(/3 seats available/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm booking/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("adjusts seat count and triggers waitlist notice when seats exceed capacity", async () => {
    const user = userEvent.setup();
    const fullTrip: TripResponse = {
      ...mockTrip,
      available_seats: 1,
    };

    renderModal({ trip: fullTrip });

    const increaseBtn = screen.getByRole("button", { name: /increase seats/i });
    await user.click(increaseBtn);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/waitlist/i);
    expect(
      screen.getByRole("button", { name: /confirm booking \(join waitlist\)/i }),
    ).toBeInTheDocument();
  });

  it("submits booking and displays confirmation screen", async () => {
    const user = userEvent.setup();
    vi.mocked(bookingsApi.create).mockResolvedValue(mockConfirmedBooking);

    renderModal();

    const confirmBtn = screen.getByRole("button", { name: /confirm booking/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(bookingsApi.create).toHaveBeenCalledWith({
        trip_id: "trip-test-1",
        pickup_stop_id: "stop-1",
        dropoff_stop_id: "stop-2",
        seats_booked: 1,
      });
    });

    expect(await screen.findByText("Ride Confirmed!")).toBeInTheDocument();
    expect(screen.getByText("View My Bookings")).toBeInTheDocument();
  });

  it("displays error message on booking failure", async () => {
    const { AxiosError } = await import("axios");
    const user = userEvent.setup();
    const axiosError = new AxiosError(
      "No seats remaining",
      "400",
      undefined,
      undefined,
      {
        data: { detail: "No seats remaining" },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as any,
      },
    );
    vi.mocked(bookingsApi.create).mockRejectedValue(axiosError);

    renderModal();

    const confirmBtn = screen.getByRole("button", { name: /confirm booking/i });
    await user.click(confirmBtn);

    expect(await screen.findByRole("alert")).toHaveTextContent("No seats remaining");
  });

  it("calls onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderModal({ onClose: handleClose });

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
