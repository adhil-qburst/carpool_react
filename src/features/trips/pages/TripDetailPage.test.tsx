import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TripDetailPage from "./TripDetailPage";
import { tripsApi } from "../api/trips.api";
import { useCurrentUserQuery } from "@features/users/hooks/useCurrentUserQuery";
import type { TripResponse } from "../types/trips.api.types";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    create: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getRoutes: vi.fn(),
    getVehicles: vi.fn(),
    getPassengers: vi.fn(),
  },
}));

vi.mock("@features/users/hooks/useCurrentUserQuery", () => ({
  useCurrentUserQuery: vi.fn(),
}));

const mockTrip: TripResponse = {
  id: "trip-123",
  route_id: "route-1",
  driver_id: "driver-1",
  vehicle_id: "veh-1",
  departure_date: "2030-05-10",
  departure_time: "09:30:00",
  available_seats: 3,
  status: "scheduled",
  created_at: "2026-09-14T10:00:00Z",
  updated_at: "2026-09-14T10:00:00Z",
};

const mockRoutes = {
  items: [
    {
      id: "route-1",
      name: "Downtown Express",
      status: "active",
      route_stops: [
        {
          id: "stop-1",
          route_id: "route-1",
          location_id: "loc-1",
          sequence: 1,
          location: {
            id: "loc-1",
            name: "Grand Central Terminal",
            city: "Metro City",
          },
        },
        {
          id: "stop-2",
          route_id: "route-1",
          location_id: "loc-2",
          sequence: 2,
          location: {
            id: "loc-2",
            name: "Silicon Boulevard",
            city: "Tech District",
          },
        },
      ],
    },
  ],
};

const mockVehicles = [
  {
    id: "veh-1",
    make: "Tesla",
    model: "Model 3",
    license_plate: "EV999AA",
    total_seats: 5,
  },
];

function renderTripDetailPage(tripId = "trip-123") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/trips/${tripId}`]}>
        <Routes>
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
          <Route path="/trips" element={<div>My Trips List Screen</div>} />
          <Route path="/trips/:tripId/edit" element={<div>Edit Trip Screen</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("TripDetailPage", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.getById).mockReset();
    vi.mocked(tripsApi.getRoutes).mockReset();
    vi.mocked(tripsApi.getVehicles).mockReset();
    vi.mocked(tripsApi.getPassengers).mockReset();
    vi.mocked(tripsApi.delete).mockReset();
    vi.mocked(useCurrentUserQuery).mockReset();

    vi.mocked(tripsApi.getById).mockResolvedValue(mockTrip);
    vi.mocked(tripsApi.getRoutes).mockResolvedValue(mockRoutes);
    vi.mocked(tripsApi.getVehicles).mockResolvedValue(mockVehicles);
    vi.mocked(tripsApi.getPassengers).mockResolvedValue([]);
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: {
        id: "driver-1",
        name: "Alice Driver",
        email: "alice@example.com",
        roles: ["driver"],
      },
    } as unknown as ReturnType<typeof useCurrentUserQuery>);
  });

  it("renders trip details, route waypoints, vehicle info, and overview grid", async () => {
    renderTripDetailPage();

    expect(
      await screen.findByRole("heading", { name: "Downtown Express", level: 2 }),
    ).toBeInTheDocument();

    // Verify Schedule
    expect(screen.getAllByText("2030-05-10").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("09:30")).toBeInTheDocument();

    // Verify Capacity
    expect(screen.getAllByText("3 seats left").length).toBeGreaterThanOrEqual(1);

    // Verify Vehicle specs
    expect(screen.getAllByText(/Tesla Model 3/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("EV999AA")).toBeInTheDocument();

    // Verify Route Stops
    expect(screen.getByText("Grand Central Terminal")).toBeInTheDocument();
    expect(screen.getByText("Silicon Boulevard")).toBeInTheDocument();
    expect(screen.getByText("Origin")).toBeInTheDocument();
    expect(screen.getByText("Destination")).toBeInTheDocument();
  });

  it("displays not found state when trip does not exist", async () => {
    vi.mocked(tripsApi.getById).mockRejectedValueOnce(new Error("Trip not found"));

    renderTripDetailPage("non-existent");

    expect(await screen.findByText("Trip not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to trips/i }),
    ).toBeInTheDocument();
  });

  it("shows Edit and Delete buttons for driver and handles deletion modal flow", async () => {
    const user = userEvent.setup();
    vi.mocked(tripsApi.delete).mockResolvedValueOnce();

    renderTripDetailPage();

    expect(
      await screen.findByRole("heading", { name: "Downtown Express", level: 2 }),
    ).toBeInTheDocument();

    // Driver controls
    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", "/trips/trip-123/edit");

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);

    // Modal opens
    expect(
      await screen.findByRole("heading", { name: /delete trip\?/i }),
    ).toBeInTheDocument();

    // Confirm delete in modal
    const confirmBtn = screen.getByRole("button", { name: "Delete trip" });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(tripsApi.delete).toHaveBeenCalledWith("trip-123");
    });

    // Navigates back to trips list
    expect(
      await screen.findByText("My Trips List Screen"),
    ).toBeInTheDocument();
  });

  it("shows Book Ride button for non-driver passenger and opens confirmation modal", async () => {
    const user = userEvent.setup();
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: {
        id: "passenger-42",
        name: "Charlie Rider",
        email: "charlie@example.com",
        roles: ["rider"],
      },
    } as unknown as ReturnType<typeof useCurrentUserQuery>);

    renderTripDetailPage();

    expect(
      await screen.findByRole("heading", { name: "Downtown Express", level: 2 }),
    ).toBeInTheDocument();

    // Driver controls should not be rendered
    expect(screen.queryByRole("link", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();

    // Rider book button
    const bookBtn = screen.getByRole("button", { name: /book ride/i });
    expect(bookBtn).toBeInTheDocument();
    await user.click(bookBtn);

    // Booking confirmation dialog appears
    expect(
      await screen.findByRole("heading", { name: /book this ride\?/i }),
    ).toBeInTheDocument();
  });

  it("displays Sold Out button when available_seats is 0 for non-driver", async () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: {
        id: "passenger-42",
        name: "Charlie Rider",
        email: "charlie@example.com",
        roles: ["rider"],
      },
    } as unknown as ReturnType<typeof useCurrentUserQuery>);

    vi.mocked(tripsApi.getById).mockResolvedValueOnce({
      ...mockTrip,
      available_seats: 0,
    });

    renderTripDetailPage();

    expect(
      await screen.findByRole("heading", { name: "Downtown Express", level: 2 }),
    ).toBeInTheDocument();

    const soldOutBtn = screen.getByRole("button", { name: /sold out/i });
    expect(soldOutBtn).toBeDisabled();
  });

  it("disables edit button when trip status is completed", async () => {
    vi.mocked(tripsApi.getById).mockResolvedValueOnce({
      ...mockTrip,
      status: "completed",
    });

    renderTripDetailPage();

    expect(
      await screen.findByRole("heading", { name: "Downtown Express", level: 2 }),
    ).toBeInTheDocument();

    const editBtn = screen.getByRole("button", { name: /edit/i });
    expect(editBtn).toBeDisabled();
  });

  it("renders passenger manifest in the bottom section when passengers are returned", async () => {
    vi.mocked(tripsApi.getPassengers).mockResolvedValueOnce([
      {
        id: "passenger-99",
        booking_id: "book-99",
        rider_id: "rider-99",
        rider_name: "Sarah Connor",
        rider_email: "sarah@example.com",
        rider: {
          id: "rider-99",
          name: "Sarah Connor",
          email: "sarah@example.com",
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
            name: "Grand Central Terminal",
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
            name: "Silicon Boulevard",
            city: "Tech District",
          },
        },
        created_at: "2026-09-20T10:00:00Z",
        updated_at: "2026-09-20T10:00:00Z",
      },
    ]);

    renderTripDetailPage();

    expect(
      await screen.findByRole("heading", { name: "Downtown Express", level: 2 }),
    ).toBeInTheDocument();

    expect(await screen.findByText("Booked Passengers")).toBeInTheDocument();
    expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
    expect(screen.getByText("sarah@example.com")).toBeInTheDocument();
    expect(screen.getByText("2 seats")).toBeInTheDocument();
  });
});
