import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditRoutePage from "./EditRoutePage";
import { routesApi } from "../api/routes.api";
import { locationsApi } from "@features/locations/api/locations.api";
import type { RouteResponse } from "../types/routes.api.types";

vi.mock("../api/routes.api", () => ({
  routesApi: {
    list: vi.fn(),
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

const mockLocations = [
  {
    id: "loc-src",
    name: "Downtown Terminal",
    city: "Metro City",
    lat: "12.9716",
    lng: "77.5946",
    status: "active" as const,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "loc-dest",
    name: "Tech Innovation Hub",
    city: "Metro City",
    lat: "12.9352",
    lng: "77.6245",
    status: "active" as const,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "loc-mid",
    name: "Central Mall Stop",
    city: "Metro City",
    lat: "12.9200",
    lng: "77.6100",
    status: "active" as const,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
];

const mockRoute: RouteResponse = {
  id: "route-1",
  name: "Daily Commute",
  driver_id: "driver-1",
  route_stops: [
    {
      id: "stop-src",
      route_id: "route-1",
      location_id: "loc-src",
      sequence: 0,
    },
    {
      id: "stop-mid",
      route_id: "route-1",
      location_id: "loc-mid",
      sequence: 1,
    },
    {
      id: "stop-dest",
      route_id: "route-1",
      location_id: "loc-dest",
      sequence: 2,
    },
  ],
};

function renderEditRoutePage({
  routeId = "route-1",
  initialRoute,
}: {
  routeId?: string;
  initialRoute?: RouteResponse;
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  const initialEntries = [
    {
      pathname: `/routes/${routeId}/edit`,
      state: initialRoute ? { route: initialRoute } : undefined,
    },
  ];

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/routes/:routeId/edit" element={<EditRoutePage />} />
          <Route path="/routes" element={<div>Routes List Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("EditRoutePage", () => {
  beforeEach(() => {
    vi.mocked(routesApi.patch).mockReset();
    vi.mocked(routesApi.update).mockReset();
    vi.mocked(routesApi.list).mockReset();
    vi.mocked(locationsApi.list).mockReset();

    vi.mocked(routesApi.list).mockResolvedValue({
      items: [mockRoute],
      page: 1,
      limit: 100,
      total: 1,
    });

    vi.mocked(locationsApi.list).mockResolvedValue({
      items: mockLocations,
      page: 1,
      limit: 100,
      total: mockLocations.length,
    });
  });

  it("populates the form with existing route data from state", async () => {
    renderEditRoutePage({ initialRoute: mockRoute });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Daily Commute")).toBeInTheDocument();
    });

    expect(await screen.findByText("Downtown Terminal")).toBeInTheDocument();
    expect(await screen.findByText("Tech Innovation Hub")).toBeInTheDocument();
  });

  it("fetches route from routesApi.list if not present in navigation state", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [mockRoute],
      page: 1,
      limit: 100,
      total: 1,
    });

    renderEditRoutePage({ routeId: "route-1" });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Daily Commute")).toBeInTheDocument();
    });
  });

  it("displays Route not found if route is not found in routes list", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [],
      page: 1,
      limit: 100,
      total: 0,
    });

    renderEditRoutePage({ routeId: "unknown-route" });

    await waitFor(() => {
      expect(screen.getByText("Route not found")).toBeInTheDocument();
    });
  });

  it("shows validation error if route name is cleared", async () => {
    const user = userEvent.setup();
    renderEditRoutePage({ initialRoute: mockRoute });

    const nameInput = await screen.findByDisplayValue("Daily Commute");
    await user.clear(nameInput);

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitBtn);

    expect(await screen.findByText("Enter a name for this route.")).toBeInTheDocument();
    expect(routesApi.patch).not.toHaveBeenCalled();
  });

  it("submits route update via PATCH and displays success modal", async () => {
    const user = userEvent.setup();
    const updatedResponse: RouteResponse = {
      ...mockRoute,
      name: "Updated Morning Commute",
    };

    vi.mocked(routesApi.patch).mockResolvedValueOnce(updatedResponse);

    renderEditRoutePage({ initialRoute: mockRoute });

    const nameInput = await screen.findByDisplayValue("Daily Commute");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Morning Commute");

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(routesApi.patch).toHaveBeenCalledWith("route-1", {
        name: "Updated Morning Commute",
        source_id: "loc-src",
        dest_id: "loc-dest",
        stops: [
          {
            stop_id: "loc-mid",
            sequence: 1,
          },
        ],
      });
    });

    expect(
      await screen.findByText(/has been successfully updated/i),
    ).toBeInTheDocument();
  });

  it("handles backend API error gracefully", async () => {
    const user = userEvent.setup();
    vi.mocked(routesApi.patch).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 409,
        data: { detail: "Route with this name already exists for this driver." },
      },
    });

    renderEditRoutePage({ initialRoute: mockRoute });

    const submitBtn = await screen.findByRole("button", { name: /save changes/i });
    await user.click(submitBtn);

    expect(
      await screen.findByText(/Route with this name already exists/i),
    ).toBeInTheDocument();
  });
});
