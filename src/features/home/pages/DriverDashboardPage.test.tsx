import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DriverDashboardPage from "./DriverDashboardPage";
import { usersApi } from "@features/users/api/users.api";
import { tripsApi } from "@features/trips/api/trips.api";
import { vehiclesApi } from "@features/vehicles/api/vehicles.api";

vi.mock("@features/users/api/users.api", () => ({
  usersApi: { getCurrentUser: vi.fn() },
}));

vi.mock("@features/trips/api/trips.api", () => ({
  tripsApi: {
    list: vi.fn(),
    getRoutes: vi.fn(),
    getVehicles: vi.fn(),
  },
}));

vi.mock("@features/vehicles/api/vehicles.api", () => ({
  vehiclesApi: { list: vi.fn() },
}));

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DriverDashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("DriverDashboardPage", () => {
  beforeEach(() => {
    vi.mocked(usersApi.getCurrentUser).mockResolvedValue({
      id: "u-1",
      name: "Arun Kumar",
      email: "arun@example.com",
      roles: ["driver"],
    });
    vi.mocked(tripsApi.list).mockResolvedValue({
      items: [
        {
          id: "trip-1",
          route_id: "route-1",
          driver_id: "u-1",
          vehicle_id: "veh-1",
          departure_date: "2026-12-18",
          departure_time: "08:30:00",
          available_seats: 8,
          status: "scheduled",
          created_at: "2026-09-01T00:00:00Z",
          updated_at: "2026-09-01T00:00:00Z",
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    });
    vi.mocked(tripsApi.getRoutes).mockResolvedValue({
      items: [
        {
          id: "route-1",
          name: "KC-TSR-01",
          status: "active",
          route_stops: [
            {
              id: "s-1",
              route_id: "route-1",
              location_id: "loc-1",
              sequence: 1,
              location: { id: "loc-1", name: "Kochi (Kaloor)", city: "Kochi" },
            },
            {
              id: "s-2",
              route_id: "route-1",
              location_id: "loc-2",
              sequence: 2,
              location: { id: "loc-2", name: "Aluva", city: "Ernakulam" },
            },
            {
              id: "s-3",
              route_id: "route-1",
              location_id: "loc-3",
              sequence: 3,
              location: { id: "loc-3", name: "Angamaly", city: "Ernakulam" },
            },
            {
              id: "s-4",
              route_id: "route-1",
              location_id: "loc-4",
              sequence: 4,
              location: { id: "loc-4", name: "Thrissur (Town)", city: "Thrissur" },
            },
          ],
        },
      ],
    });
    vi.mocked(tripsApi.getVehicles).mockResolvedValue([
      {
        id: "veh-1",
        make: "Toyota",
        model: "Innova",
        license_plate: "KL 07 AB 1234",
        total_seats: 12,
      },
    ]);
    vi.mocked(vehiclesApi.list).mockResolvedValue([]);
  });

  it("renders sidebar navigation and brand identity", () => {
    renderDashboard();

    expect(screen.getByRole("link", { name: /CarPool Home/i })).toBeInTheDocument();
    expect(screen.getByText("Driver Workspace")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /My Trips/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Routes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Vehicles$/i })).toBeInTheDocument();
  });

  it("renders top bar with global search", () => {
    renderDashboard();

    expect(
      screen.getByPlaceholderText(/Search trips, routes, vehicles/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
  });

  it("renders welcoming hero banner with dynamic greeting and Create Trip button", async () => {
    renderDashboard();

    expect(await screen.findByText(/Good day, Arun/i)).toBeInTheDocument();
    expect(screen.getByText("Driver Steward")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create New Trip/i })).toBeInTheDocument();
  });

  it("renders Your Next Trip operational hero card with route timeline", async () => {
    renderDashboard();

    const nextTripCard = await screen.findByTestId("next-trip-card");
    expect(nextTripCard).toBeInTheDocument();
    expect(
      within(nextTripCard).getByRole("heading", { name: /Your Next Trip/i }),
    ).toBeInTheDocument();
    expect(
      within(nextTripCard).getByText("Kochi (Kaloor)"),
    ).toBeInTheDocument();
    expect(
      within(nextTripCard).getByText("Thrissur (Town)"),
    ).toBeInTheDocument();
    expect(within(nextTripCard).getByText("4 Stops")).toBeInTheDocument();
    expect(within(nextTripCard).getByText(/KC-TSR-01/i)).toBeInTheDocument();
    expect(
      within(nextTripCard).getByRole("link", { name: /View Trip Details/i }),
    ).toBeInTheDocument();
  });

  it("renders My Vehicles fleet card and register vehicle button", () => {
    renderDashboard();

    expect(screen.getByRole("heading", { name: /My Vehicles/i })).toBeInTheDocument();
    expect(screen.getAllByText("Toyota Innova").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Swift Dzire")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Register New Vehicle/i })).toBeInTheDocument();
  });

  it("renders Upcoming Trips structured data table", async () => {
    renderDashboard();

    expect(
      await screen.findByRole("heading", { name: /Upcoming Trips/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Departure")).toBeInTheDocument();
    expect(screen.getByText("Route")).toBeInTheDocument();
    expect(screen.getByText("Vehicle")).toBeInTheDocument();
    expect(screen.getByText("Seats")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getAllByText(/View Details/i).length).toBeGreaterThanOrEqual(1);
  });

  it("toggles the mobile sidebar navigation drawer", () => {
    renderDashboard();

    const openButton = screen.getByRole("button", { name: /Open sidebar/i });
    expect(openButton).toBeInTheDocument();

    const sidebar = screen.getByRole("complementary", { name: /Driver Sidebar/i });
    expect(sidebar).toHaveClass("-translate-x-full");

    fireEvent.click(openButton);
    expect(sidebar).toHaveClass("translate-x-0");

    const closeButton = screen.getByRole("button", { name: /Close navigation/i });
    fireEvent.click(closeButton);
    expect(sidebar).toHaveClass("-translate-x-full");
  });
});
