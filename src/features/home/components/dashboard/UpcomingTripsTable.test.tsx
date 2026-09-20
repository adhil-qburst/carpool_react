import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UpcomingTripsTable from "./UpcomingTripsTable";
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
    name: "Kochi to Thrissur Express",
    status: "active",
    route_stops: [
      {
        id: "stop-1",
        route_id: "route-1",
        location_id: "loc-1",
        sequence: 1,
        location: { id: "loc-1", name: "Kaloor", city: "Kochi" },
      },
      {
        id: "stop-2",
        route_id: "route-1",
        location_id: "loc-2",
        sequence: 2,
        location: { id: "loc-2", name: "Aluva", city: "Ernakulam" },
      },
      {
        id: "stop-3",
        route_id: "route-1",
        location_id: "loc-3",
        sequence: 3,
        location: { id: "loc-3", name: "Round South", city: "Thrissur" },
      },
    ],
  },
  {
    id: "route-2",
    name: "Calicut - Wayanad",
    status: "active",
    route_stops: [],
  },
];

const mockVehicles: TripVehicleOption[] = [
  {
    id: "veh-1",
    make: "Toyota",
    model: "Innova Crysta",
    license_plate: "KL-07-AB-1234",
    total_seats: 7,
  },
  {
    id: "veh-2",
    make: "Maruti",
    model: "Ertiga",
    license_plate: "KL-08-CD-5678",
    total_seats: 6,
  },
];

const mockTrips: TripResponse[] = [
  {
    id: "trip-1",
    route_id: "route-1",
    driver_id: "driver-1",
    vehicle_id: "veh-1",
    departure_date: "2026-10-15",
    departure_time: "08:30:00",
    available_seats: 4,
    status: "scheduled",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "trip-2",
    route_id: "route-2",
    driver_id: "driver-1",
    vehicle_id: "veh-2",
    departure_date: "2026-10-18",
    departure_time: "14:15:00",
    available_seats: 2,
    status: "completed",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
];

function renderUpcomingTripsTable(
  props: { trips?: TripResponse[]; isLoading?: boolean } = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <UpcomingTripsTable {...props} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("UpcomingTripsTable", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.list).mockResolvedValue({
      items: mockTrips,
      page: 1,
      limit: 10,
      total: mockTrips.length,
    });
    vi.mocked(tripsApi.getRoutes).mockResolvedValue({ items: mockRoutes });
    vi.mocked(tripsApi.getVehicles).mockResolvedValue(mockVehicles);
  });

  it("renders loading skeleton when isLoading is true", () => {
    renderUpcomingTripsTable({ isLoading: true });

    expect(screen.getByTestId("upcoming-trips-loading")).toBeInTheDocument();
  });

  it("renders empty state when no trips exist", async () => {
    renderUpcomingTripsTable({ trips: [] });

    expect(
      await screen.findByText(/No upcoming trips scheduled/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Schedule a Trip/i }),
    ).toBeInTheDocument();
  });

  it("renders trip rows with dynamically resolved route and vehicle information", async () => {
    renderUpcomingTripsTable({ trips: mockTrips });

    // Table header and count badge
    expect(
      await screen.findByRole("heading", { name: /Upcoming Trips/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 Total")).toBeInTheDocument();

    // Headers
    expect(await screen.findByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Departure")).toBeInTheDocument();
    expect(screen.getByText("Route")).toBeInTheDocument();
    expect(screen.getByText("Vehicle")).toBeInTheDocument();
    expect(screen.getByText("Seats")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Trip 1 details (route-1 with stops Kaloor -> Round South, veh-1 Toyota Innova Crysta, 4/7 seats)
    expect(screen.getByText("08:30 AM")).toBeInTheDocument();
    expect(screen.getByText("Kaloor")).toBeInTheDocument();
    expect(screen.getByText("Round South")).toBeInTheDocument();
    expect(screen.getByText("Toyota Innova Crysta")).toBeInTheDocument();
    expect(screen.getByText("4/7")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();

    // Trip 2 details (route-2 Calicut - Wayanad, veh-2 Maruti Ertiga, 2/6 seats, Completed)
    expect(screen.getByText("02:15 PM")).toBeInTheDocument();
    expect(screen.getByText("Calicut")).toBeInTheDocument();
    expect(screen.getByText("Wayanad")).toBeInTheDocument();
    expect(screen.getByText("Maruti Ertiga")).toBeInTheDocument();
    expect(screen.getByText("2/6")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();

    // View Details links
    expect(screen.getAllByText(/View Details/i)).toHaveLength(2);
  });

  it("fetches trips autonomously using useTripsQuery when trips prop is omitted", async () => {
    renderUpcomingTripsTable();

    // Should fetch mockTrips via tripsApi.list
    expect(await screen.findByText("08:30 AM")).toBeInTheDocument();
    expect(screen.getByText("Kaloor")).toBeInTheDocument();
    expect(screen.getByText("Toyota Innova Crysta")).toBeInTheDocument();
  });
});
