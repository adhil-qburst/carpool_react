import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TripDetailPage from "./TripDetailPage";
import { tripsApi } from "../api/trips.api";
import { usersApi } from "@features/users/api/users.api";
import type { TripResponse } from "../types/trips.api.types";
import type { CurrentUserResponse } from "@features/users/types/users.api.types";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    getById: vi.fn(),
    getPassengers: vi.fn(),
    getRoutes: vi.fn(),
    getVehicles: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@features/users/api/users.api", () => ({
  usersApi: {
    getCurrentUser: vi.fn(),
  },
}));

const mockTrip: TripResponse = {
  id: "trip-abc-123",
  route_id: "route-xyz-789",
  driver_id: "driver-user-999",
  vehicle_id: "vehicle-123",
  departure_date: "2026-09-30",
  departure_time: "09:00:00",
  available_seats: 2,
  status: "scheduled",
  route: {
    id: "route-xyz-789",
    name: "Express Northbound",
    status: "active",
    route_stops: [
      {
        id: "stop-1",
        route_id: "route-xyz-789",
        location_id: "loc-1",
        sequence: 0,
        location: { id: "loc-1", name: "Station Alpha" },
      },
      {
        id: "stop-2",
        route_id: "route-xyz-789",
        location_id: "loc-2",
        sequence: 1,
        location: { id: "loc-2", name: "Terminal Omega" },
      },
    ],
  },
  created_at: "2026-09-20T00:00:00Z",
  updated_at: "2026-09-20T00:00:00Z",
};

const mockCurrentUser: CurrentUserResponse = {
  id: "rider-user-888",
  email: "rider@example.com",
  name: "Rider Jane",
  roles: ["rider"],
};

function renderTripDetailPage(tripId = "trip-abc-123") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/trips/${tripId}`]}>
        <Routes>
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("TripDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tripsApi.getRoutes).mockResolvedValue({ items: [] });
    vi.mocked(tripsApi.getVehicles).mockResolvedValue([]);
    vi.mocked(tripsApi.getPassengers).mockResolvedValue([]);
    vi.mocked(usersApi.getCurrentUser).mockResolvedValue(mockCurrentUser);
  });

  it("renders loading skeleton while fetching trip", () => {
    vi.mocked(tripsApi.getById).mockReturnValue(new Promise(() => {}));

    renderTripDetailPage();

    expect(screen.getByTestId("trip-detail-skeleton")).toBeInTheDocument();
  });

  it("renders trip not found when API fails", async () => {
    vi.mocked(tripsApi.getById).mockRejectedValue(new Error("Not found"));

    renderTripDetailPage();

    expect(await screen.findByText("Trip not found")).toBeInTheDocument();
  });

  it("renders trip details and opens booking confirmation modal for riders", async () => {
    const user = userEvent.setup();
    vi.mocked(tripsApi.getById).mockResolvedValue(mockTrip);

    renderTripDetailPage();

    const routeTitles = await screen.findAllByText("Express Northbound");
    expect(routeTitles.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Station Alpha/i).length).toBeGreaterThan(0);

    const bookBtn = screen.getByRole("button", { name: /book ride/i });
    expect(bookBtn).toBeInTheDocument();

    await user.click(bookBtn);

    expect(await screen.findByText("Book this Ride?")).toBeInTheDocument();
  });

  it("displays waiting list indicator and button when trip is sold out", async () => {
    const user = userEvent.setup();
    const soldOutTrip: TripResponse = {
      ...mockTrip,
      available_seats: 0,
    };
    vi.mocked(tripsApi.getById).mockResolvedValue(soldOutTrip);

    renderTripDetailPage();

    expect(await screen.findByText(/This trip is sold out/i)).toBeInTheDocument();

    const waitlistBtn = screen.getByRole("button", {
      name: /join waiting list/i,
    });
    expect(waitlistBtn).toBeInTheDocument();

    await user.click(waitlistBtn);
    expect(await screen.findByText("Book this Ride?")).toBeInTheDocument();
  });
});
