import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTripCard from "./NextTripCard";
import { tripsApi } from "@features/trips/api/trips.api";
import type {
  TripResponse,
  TripRouteOption,
  TripVehicleOption,
} from "@features/trips/types/trips.api.types";

vi.mock("@features/trips/api/trips.api", () => ({
  tripsApi: {
    list: vi.fn(),
    getRoutes: vi.fn(),
    getVehicles: vi.fn(),
  },
}));

const mockRoutes: TripRouteOption[] = [
  {
    id: "route-1",
    name: "KC-TSR-EXP",
    status: "active",
    route_stops: [
      {
        id: "stop-1",
        route_id: "route-1",
        location_id: "loc-1",
        sequence: 1,
        location: { id: "loc-1", name: "Kochi (Kaloor)", city: "Kochi", lat: 9.99, lng: 76.29 },
      },
      {
        id: "stop-2",
        route_id: "route-1",
        location_id: "loc-2",
        sequence: 2,
        location: { id: "loc-2", name: "Aluva", city: "Ernakulam", lat: 10.10, lng: 76.35 },
      },
      {
        id: "stop-3",
        route_id: "route-1",
        location_id: "loc-3",
        sequence: 3,
        location: { id: "loc-3", name: "Thrissur (Town)", city: "Thrissur", lat: 10.52, lng: 76.21 },
      },
    ],
  },
];

const mockVehicles: TripVehicleOption[] = [
  {
    id: "veh-1",
    make: "Toyota",
    model: "Innova",
    license_plate: "KL 07 AB 1234",
    total_seats: 12,
  },
];

const mockTrip: TripResponse = {
  id: "trip-1",
  route_id: "route-1",
  driver_id: "driver-1",
  vehicle_id: "veh-1",
  departure_date: "2026-12-18",
  departure_time: "08:30:00",
  available_seats: 8,
  status: "scheduled",
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-01T00:00:00Z",
};

function renderNextTripCard(
  props: { trip?: TripResponse | null; isLoading?: boolean } = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <NextTripCard {...props} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("NextTripCard", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.list).mockResolvedValue({
      items: [mockTrip],
      page: 1,
      limit: 10,
      total: 1,
    });
    vi.mocked(tripsApi.getRoutes).mockResolvedValue({ items: mockRoutes });
    vi.mocked(tripsApi.getVehicles).mockResolvedValue(mockVehicles);
  });

  it("renders loading skeleton when isLoading is true", () => {
    renderNextTripCard({ isLoading: true });

    expect(screen.getByTestId("next-trip-loading")).toBeInTheDocument();
  });

  it("renders empty state when trip is null", async () => {
    renderNextTripCard({ trip: null });

    expect(
      await screen.findByText(/No Upcoming Trips Scheduled/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Create New Trip/i }),
    ).toBeInTheDocument();
  });

  it("renders next trip dynamic details with resolved route and vehicle info", async () => {
    renderNextTripCard({ trip: mockTrip });

    expect(
      await screen.findByRole("heading", { name: /Your Next Trip/i }),
    ).toBeInTheDocument();

    // Date and time
    expect(screen.getByText("DEC")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("08:30 AM")).toBeInTheDocument();

    // Vehicle info
    expect(screen.getByText("Toyota Innova")).toBeInTheDocument();
    expect(screen.getByText("KL 07 AB 1234")).toBeInTheDocument();
    expect(screen.getByText("8 / 12 Seats Available")).toBeInTheDocument();

    // Waypoints
    expect(screen.getByText("Kochi (Kaloor)")).toBeInTheDocument();
    expect(screen.getByText("Thrissur (Town)")).toBeInTheDocument();
    expect(screen.getByText("3 Stops")).toBeInTheDocument();

    // Route code
    expect(screen.getByText("KC-TSR-EXP")).toBeInTheDocument();

    // Action link
    expect(
      screen.getByRole("link", { name: /View Trip Details/i }),
    ).toBeInTheDocument();
  });

  it("autonomously fetches the earliest scheduled trip when trip prop is omitted", async () => {
    renderNextTripCard();

    expect(
      await screen.findByRole("heading", { name: /Your Next Trip/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Toyota Innova")).toBeInTheDocument();
    expect(screen.getByText("08:30 AM")).toBeInTheDocument();
    expect(screen.getByText("Kochi (Kaloor)")).toBeInTheDocument();
  });
});
