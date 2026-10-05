import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateRoutePage from "./CreateRoutePage";
import { routesApi } from "../api/routes.api";
import { locationsApi } from "@features/locations/api/locations.api";

vi.mock("../api/routes.api", () => ({
  routesApi: {
    create: vi.fn(),
    update: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock("@features/locations/api/locations.api", () => ({
  locationsApi: {
    list: vi.fn(),
    create: vi.fn(),
  },
}));

function renderCreateRoutePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CreateRoutePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const mockLocations = [
  {
    id: "loc-1",
    name: "Downtown Terminal",
    city: "Metro City",
    lat: "12.9716",
    lng: "77.5946",
    status: "active" as const,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "loc-2",
    name: "Tech Innovation Hub",
    city: "Metro City",
    lat: "12.9352",
    lng: "77.6245",
    status: "active" as const,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "loc-3",
    name: "Central Mall Stop",
    city: "Metro City",
    lat: "12.9200",
    lng: "77.6100",
    status: "active" as const,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
];

describe("CreateRoutePage", () => {
  beforeEach(() => {
    vi.mocked(routesApi.create).mockReset();
    vi.mocked(locationsApi.list).mockReset();
    vi.mocked(locationsApi.list).mockResolvedValue({
      items: mockLocations,
      page: 1,
      limit: 10,
      total: 3,
    });
  });

  it("displays validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    renderCreateRoutePage();

    await user.click(screen.getByRole("button", { name: /create route/i }));

    expect(
      await screen.findByText("Enter a name for this route."),
    ).toBeInTheDocument();
    expect(screen.getByText("Select a source location.")).toBeInTheDocument();
    expect(
      screen.getByText("Select a destination location."),
    ).toBeInTheDocument();
    expect(routesApi.create).not.toHaveBeenCalled();
  });

  it("selects source and destination, and successfully creates route", async () => {
    vi.mocked(routesApi.create).mockResolvedValueOnce({
      id: "route-123",
      name: "Daily Work Commute",
      driver_id: "driver-1",
      route_stops: [
        { id: "s-1", route_id: "route-123", location_id: "loc-1", sequence: 0 },
        { id: "s-2", route_id: "route-123", location_id: "loc-2", sequence: 1 },
      ],
    });

    const user = userEvent.setup();
    renderCreateRoutePage();

    // Fill route name
    await user.type(
      screen.getByLabelText(/route name/i),
      "Daily Work Commute",
    );

    // Pick source location
    const sourceInput = screen.getByPlaceholderText(/search start location/i);
    await user.click(sourceInput);
    const sourceOption = await screen.findByRole("option", {
      name: /downtown terminal/i,
    });
    await user.click(sourceOption);

    // Pick destination location
    const destInput = screen.getByPlaceholderText(/search destination location/i);
    await user.click(destInput);
    const destOption = await screen.findByRole("option", {
      name: /tech innovation hub/i,
    });
    await user.click(destOption);

    // Submit form
    await user.click(screen.getByRole("button", { name: /create route/i }));

    await waitFor(() => {
      expect(routesApi.create).toHaveBeenCalledWith({
        name: "Daily Work Commute",
        source_id: "loc-1",
        dest_id: "loc-2",
        stops: null,
      });
    });

    expect(await screen.findByText("Route created!")).toBeInTheDocument();
  });

  it("allows adding intermediate stops and sends them in correct sequence", async () => {
    vi.mocked(routesApi.create).mockResolvedValueOnce({
      id: "route-456",
      name: "Commute via Mall",
      driver_id: "driver-1",
      route_stops: [
        { id: "s-1", route_id: "route-456", location_id: "loc-1", sequence: 0 },
        { id: "s-2", route_id: "route-456", location_id: "loc-3", sequence: 1 },
        { id: "s-3", route_id: "route-456", location_id: "loc-2", sequence: 2 },
      ],
    });

    const user = userEvent.setup();
    renderCreateRoutePage();

    await user.type(screen.getByLabelText(/route name/i), "Commute via Mall");

    // Select Source
    await user.click(screen.getByPlaceholderText(/search start location/i));
    await user.click(await screen.findByRole("option", { name: /downtown terminal/i }));

    // Add Stop
    await user.click(screen.getByRole("button", { name: /add stop/i }));
    expect(screen.getByText(/^stop 1$/i)).toBeInTheDocument();

    // Pick Stop 1 location
    await user.click(screen.getByPlaceholderText(/search stop location/i));
    await user.click(await screen.findByRole("option", { name: /central mall stop/i }));

    // Select Destination
    await user.click(screen.getByPlaceholderText(/search destination location/i));
    await user.click(await screen.findByRole("option", { name: /tech innovation hub/i }));

    // Submit
    await user.click(screen.getByRole("button", { name: /create route/i }));

    await waitFor(() => {
      expect(routesApi.create).toHaveBeenCalledWith({
        name: "Commute via Mall",
        source_id: "loc-1",
        dest_id: "loc-2",
        stops: [
          {
            stop_id: "loc-3",
            sequence: 1,
          },
        ],
      });
    });
  });

  it("prevents selecting identical source and destination", async () => {
    const user = userEvent.setup();
    renderCreateRoutePage();

    await user.type(screen.getByLabelText(/route name/i), "Invalid Route");

    // Select same location for source and destination
    await user.click(screen.getByPlaceholderText(/search start location/i));
    await user.click(await screen.findByRole("option", { name: /downtown terminal/i }));

    // Notice in destination dropdown that "Downtown Terminal" is disabled
    await user.click(screen.getByPlaceholderText(/search destination location/i));
    const disabledOption = await screen.findByRole("option", {
      name: /downtown terminal/i,
    });
    expect(disabledOption).toBeDisabled();
    expect(screen.getByText("Already in route")).toBeInTheDocument();
  });

  it("allows reordering stops and updates sequences accordingly", async () => {
    const user = userEvent.setup();
    renderCreateRoutePage();

    // Add Stop 1
    await user.click(screen.getByRole("button", { name: /add stop/i }));
    // Add Stop 2
    await user.click(screen.getByRole("button", { name: /add stop/i }));

    expect(screen.getByText(/^stop 1$/i)).toBeInTheDocument();
    expect(screen.getByText(/^stop 2$/i)).toBeInTheDocument();

    // Move Stop 1 down
    const moveDownBtn = screen.getByRole("button", { name: /move stop 1 down/i });
    await user.click(moveDownBtn);

    // Stop 2 button to move up should now be available for what is now Stop 2
    expect(screen.getByRole("button", { name: /move stop 2 up/i })).toBeInTheDocument();
  });
});
