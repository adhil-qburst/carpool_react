import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateTripPage from "./CreateTripPage";
import { tripsApi } from "../api/trips.api";
import type { TripResponse } from "../types/trips.api.types";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    create: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    getRoutes: vi.fn(),
    getVehicles: vi.fn(),
  },
}));

const mockRoutes = {
  items: [
    {
      id: "route-1",
      name: "Downtown Commute",
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
    { id: "route-2", name: "Airport Express", status: "inactive" },
  ],
};

const mockVehicles = [
  {
    id: "veh-1",
    make: "Toyota",
    model: "Camry",
    license_plate: "DL01AB1234",
    total_seats: 5,
  },
];

const mockCreatedTrip: TripResponse = {
  id: "trip-1",
  route_id: "route-1",
  driver_id: "driver-1",
  vehicle_id: "veh-1",
  departure_date: "2030-01-01",
  departure_time: "10:00:00",
  available_seats: 4,
  status: "scheduled",
  created_at: "2026-09-14T10:00:00Z",
  updated_at: "2026-09-14T10:00:00Z",
};

function renderCreateTripPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/trips/new"]}>
        <CreateTripPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("CreateTripPage", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.getRoutes).mockReset();
    vi.mocked(tripsApi.getVehicles).mockReset();
    vi.mocked(tripsApi.create).mockReset();

    vi.mocked(tripsApi.getRoutes).mockResolvedValue(mockRoutes);
    vi.mocked(tripsApi.getVehicles).mockResolvedValue(mockVehicles);
  });

  it("renders page and shows validation errors on empty submission", async () => {
    const user = userEvent.setup();
    renderCreateTripPage();

    await waitFor(() => {
      expect(screen.getByText("Downtown Commute")).toBeInTheDocument();
    });

    // Should filter out inactive routes
    expect(screen.queryByText("Airport Express")).not.toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /schedule trip/i });
    await user.click(submitBtn);

    expect(
      await screen.findByText("Please select a route for this trip."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please select a vehicle for this trip."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please choose a departure date."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a departure time."),
    ).toBeInTheDocument();
    expect(tripsApi.create).not.toHaveBeenCalled();
  });

  it("submits the form successfully and displays the success modal", async () => {
    const user = userEvent.setup();
    vi.mocked(tripsApi.create).mockResolvedValueOnce(mockCreatedTrip);

    renderCreateTripPage();

    await waitFor(() => {
      expect(screen.getByText("Downtown Commute")).toBeInTheDocument();
    });

    // Select route
    const routeSelect = screen.getByLabelText(/select route/i);
    await user.selectOptions(routeSelect, "route-1");

    // Verify RouteDetailsCard rendered stops below
    expect(await screen.findByText("Grand Central Terminal")).toBeInTheDocument();
    expect(screen.getByText("Silicon Boulevard")).toBeInTheDocument();
    expect(screen.getByText("Origin")).toBeInTheDocument();
    expect(screen.getByText("Destination")).toBeInTheDocument();
    expect(screen.getByText("Metro City")).toBeInTheDocument();

    // Select vehicle
    const vehicleSelect = screen.getByLabelText(/select vehicle/i);
    await user.selectOptions(vehicleSelect, "veh-1");

    // Dynamic capacity text check
    expect(
      screen.getByText(/4 open passenger seats/i),
    ).toBeInTheDocument();

    // Fill date and time (using future date)
    const dateInput = screen.getByLabelText(/departure date/i);
    await user.type(dateInput, "2030-01-01");

    const timeInput = screen.getByLabelText(/departure time/i);
    await user.type(timeInput, "10:00");

    // Submit
    const submitBtn = screen.getByRole("button", { name: /schedule trip/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(tripsApi.create).toHaveBeenCalledWith({
        route_id: "route-1",
        vehicle_id: "veh-1",
        departure_date: "2030-01-01",
        departure_time: "10:00:00",
      });
    });

    // Verify modal appeared
    expect(await screen.findByText("Trip Scheduled!")).toBeInTheDocument();
    const modal = screen.getByRole("dialog");
    expect(within(modal).getByText("Downtown Commute")).toBeInTheDocument();
    expect(within(modal).getByRole("button", { name: /back to home/i })).toBeInTheDocument();
  });

  it("displays server error message when API fails", async () => {
    const user = userEvent.setup();
    vi.mocked(tripsApi.create).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: { detail: "Departure time cannot be in the past" },
      },
    });

    renderCreateTripPage();

    await waitFor(() => {
      expect(screen.getByText("Downtown Commute")).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText(/select route/i), "route-1");
    await user.selectOptions(screen.getByLabelText(/select vehicle/i), "veh-1");
    await user.type(screen.getByLabelText(/departure date/i), "2030-01-01");
    await user.type(screen.getByLabelText(/departure time/i), "10:00");

    await user.click(screen.getByRole("button", { name: /schedule trip/i }));

    expect(
      await screen.findByText("Departure time cannot be in the past"),
    ).toBeInTheDocument();
  });
});
