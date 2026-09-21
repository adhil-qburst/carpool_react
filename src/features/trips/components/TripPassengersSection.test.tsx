import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TripPassengersSection from "./TripPassengersSection";
import { tripsApi } from "../api/trips.api";
import type { TripPassengerResponse } from "../types/trips.api.types";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    getPassengers: vi.fn(),
  },
}));

const mockPassengers: TripPassengerResponse[] = [
  {
    id: "passenger-1",
    booking_id: "booking-1",
    rider_id: "rider-1",
    rider_name: "Jane Doe",
    rider_email: "jane@example.com",
    rider: {
      id: "rider-1",
      name: "Jane Doe",
      email: "jane@example.com",
    },
    seats_booked: 2,
    status: "confirmed",
    pickup_stop: {
      id: "stop-1",
      route_id: "route-1",
      location_id: "loc-1",
      sequence: 1,
      location: {
        id: "loc-1",
        name: "Grand Central",
        city: "Metro City",
      },
    },
    dropoff_stop: {
      id: "stop-2",
      route_id: "route-1",
      location_id: "loc-2",
      sequence: 2,
      location: {
        id: "loc-2",
        name: "Tech Park",
        city: "Tech District",
      },
    },
    created_at: "2026-09-20T10:00:00Z",
    updated_at: "2026-09-20T10:00:00Z",
  },
  {
    id: "passenger-2",
    booking_id: "booking-2",
    rider_id: "rider-2",
    rider_name: "Bob Smith",
    rider_email: "bob@example.com",
    rider: {
      id: "rider-2",
      name: "Bob Smith",
      email: "bob@example.com",
    },
    seats_booked: 1,
    status: "pending",
    pickup_stop: {
      id: "stop-1",
      route_id: "route-1",
      location_id: "loc-1",
      sequence: 1,
      location: {
        id: "loc-1",
        name: "Grand Central",
        city: "Metro City",
      },
    },
    dropoff_stop: {
      id: "stop-2",
      route_id: "route-1",
      location_id: "loc-2",
      sequence: 2,
      location: {
        id: "loc-2",
        name: "Tech Park",
        city: "Tech District",
      },
    },
    created_at: "2026-09-20T11:00:00Z",
    updated_at: "2026-09-20T11:00:00Z",
  },
];

function renderSection(tripId = "trip-123") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <TripPassengersSection tripId={tripId} />
    </QueryClientProvider>,
  );
}

describe("TripPassengersSection", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.getPassengers).mockReset();
  });

  it("renders empty state when no passengers are booked", async () => {
    vi.mocked(tripsApi.getPassengers).mockResolvedValueOnce([]);

    renderSection();

    expect(
      await screen.findByText("No passengers booked yet"),
    ).toBeInTheDocument();
    expect(screen.getByText("0 passengers")).toBeInTheDocument();
  });

  it("renders passenger cards with rider details, route stops, seats and badges", async () => {
    vi.mocked(tripsApi.getPassengers).mockResolvedValueOnce(mockPassengers);

    renderSection();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();

    // Seat counts
    expect(screen.getByText("2 seats")).toBeInTheDocument();
    expect(screen.getByText("1 seat")).toBeInTheDocument();

    // Badges & stops
    expect(screen.getByText("confirmed")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getAllByText(/Grand Central/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tech Park/).length).toBeGreaterThanOrEqual(1);

    // Summary counts in header
    expect(screen.getByText("2 passengers")).toBeInTheDocument();
    expect(screen.getByText("2 seats confirmed")).toBeInTheDocument();
  });

  it("filters passengers by status when clicking filter tabs", async () => {
    const user = userEvent.setup();
    vi.mocked(tripsApi.getPassengers).mockResolvedValueOnce(mockPassengers);

    renderSection();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();

    // Click 'Confirmed' filter tab
    const confirmedTab = screen.getByRole("tab", { name: /confirmed/i });
    await user.click(confirmedTab);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();

    // Click 'Cancelled' filter tab
    const cancelledTab = screen.getByRole("tab", { name: /cancelled/i });
    await user.click(cancelledTab);

    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
    expect(screen.getByText("No cancelled passengers")).toBeInTheDocument();
  });

  it("renders error alert when api call fails", async () => {
    vi.mocked(tripsApi.getPassengers).mockRejectedValueOnce(
      new Error("Failed to fetch passengers"),
    );

    renderSection();

    expect(
      await screen.findByText("Something went wrong. Please try again."),
    ).toBeInTheDocument();
  });
});
