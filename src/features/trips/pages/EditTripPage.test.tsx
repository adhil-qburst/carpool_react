import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditTripPage from "./EditTripPage";
import { tripsApi } from "../api/trips.api";
import type { TripResponse } from "../types/trips.api.types";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    create: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    getRoutes: vi.fn(),
    getVehicles: vi.fn(),
  },
}));

const mockTrip: TripResponse = {
  id: "trip-123",
  route_id: "route-1",
  driver_id: "driver-1",
  vehicle_id: "veh-1",
  departure_date: "2030-05-10",
  departure_time: "09:30:00",
  available_seats: 4,
  status: "scheduled",
  created_at: "2026-09-14T10:00:00Z",
  updated_at: "2026-09-14T10:00:00Z",
};

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

function renderEditTripPage(tripId = "trip-123") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/trips/${tripId}/edit`]}>
        <Routes>
          <Route path="/trips/:tripId/edit" element={<EditTripPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("EditTripPage", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.getById).mockReset();
    vi.mocked(tripsApi.getRoutes).mockReset();
    vi.mocked(tripsApi.getVehicles).mockReset();
    vi.mocked(tripsApi.update).mockReset();

    vi.mocked(tripsApi.getById).mockResolvedValue(mockTrip);
    vi.mocked(tripsApi.getRoutes).mockResolvedValue(mockRoutes);
    vi.mocked(tripsApi.getVehicles).mockResolvedValue(mockVehicles);
  });

  it("loads existing trip, displays assigned route stops below, and saves updates", async () => {
    const user = userEvent.setup();
    vi.mocked(tripsApi.update).mockResolvedValueOnce({
      ...mockTrip,
      departure_time: "11:00:00",
    });

    renderEditTripPage();

    // Verify trip information and route details loaded
    expect(
      await screen.findByRole("heading", { name: "Update Trip", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Grand Central Terminal")).toBeInTheDocument();
    expect(screen.getByText("Silicon Boulevard")).toBeInTheDocument();
    expect(screen.getByText("Origin")).toBeInTheDocument();
    expect(screen.getByText("Destination")).toBeInTheDocument();

    // Change departure time
    const timeInput = screen.getByLabelText(/departure time/i);
    await user.clear(timeInput);
    await user.type(timeInput, "11:00");

    // Submit form
    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(tripsApi.update).toHaveBeenCalledWith("trip-123", {
        vehicle_id: "veh-1",
        departure_date: "2030-05-10",
        departure_time: "11:00:00",
        status: "scheduled",
      });
    });

    expect(
      await screen.findByText("Trip updated successfully!"),
    ).toBeInTheDocument();
  });

  it("shows error state when trip cannot be found", async () => {
    vi.mocked(tripsApi.getById).mockRejectedValueOnce(new Error("Not found"));

    renderEditTripPage("non-existent");

    expect(await screen.findByText("Trip not found")).toBeInTheDocument();
  });
});
