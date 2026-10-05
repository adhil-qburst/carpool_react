import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookRidePage from "./BookRidePage";
import { tripsApi } from "../api/trips.api";
import { locationsApi } from "@features/locations/api/locations.api";
import type { SearchTripsResponse } from "../types/trips.api.types";
import type { PaginatedLocationsResponse } from "@features/locations/types/locations.api.types";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    search: vi.fn(),
  },
}));

vi.mock("@features/locations/api/locations.api", () => ({
  locationsApi: {
    list: vi.fn(),
    create: vi.fn(),
  },
}));

const mockLocations: PaginatedLocationsResponse = {
  items: [
    {
      id: "loc-1",
      name: "Downtown Station",
      city: "Metro City",
      lat: null,
      lng: null,
      status: "active",
      created_at: "2026-09-01T00:00:00Z",
      updated_at: "2026-09-01T00:00:00Z",
    },
    {
      id: "loc-2",
      name: "Tech Park Gateway",
      city: "Metro City",
      lat: null,
      lng: null,
      status: "active",
      created_at: "2026-09-01T00:00:00Z",
      updated_at: "2026-09-01T00:00:00Z",
    },
  ],
  page: 1,
  limit: 10,
  total: 2,
};

const mockSearchResults: SearchTripsResponse = {
  items: [
    {
      id: "trip-101",
      route_id: "route-1",
      driver_id: "driver-1",
      vehicle_id: "veh-1",
      departure_date: "2026-09-25",
      departure_time: "08:30:00",
      available_seats: 3,
      status: "scheduled",
      created_at: "2026-09-14T10:00:00Z",
      updated_at: "2026-09-14T10:00:00Z",
      route: {
        id: "route-1",
        name: "Express Line A",
        status: "active",
      },
    },
  ],
  page: 1,
  limit: 20,
  total: 1,
};

function renderBookRidePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <BookRidePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("BookRidePage", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.search).mockReset();
    vi.mocked(locationsApi.list).mockReset();
    vi.mocked(locationsApi.list).mockResolvedValue(mockLocations);
  });

  it("renders page header, search form, and initial ready state", () => {
    renderBookRidePage();

    expect(screen.getByRole("heading", { name: "Find and Book a Ride" })).toBeInTheDocument();
    expect(screen.getByText("Ready to Search")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search rides/i })).toBeInTheDocument();
  });

  it("validates required source and destination before searching", async () => {
    const user = userEvent.setup();
    renderBookRidePage();

    const searchButton = screen.getByRole("button", { name: /search rides/i });
    await user.click(searchButton);

    expect(
      screen.getByText("Please select a pickup / source location."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please select a drop-off / destination location."),
    ).toBeInTheDocument();
    expect(tripsApi.search).not.toHaveBeenCalled();
  });

  it("performs search, lists available trips, and handles booking modal", async () => {
    const user = userEvent.setup();
    vi.mocked(tripsApi.search).mockResolvedValue(mockSearchResults);

    renderBookRidePage();

    // Select source location
    const pickupInput = screen.getByPlaceholderText("Search origin location...");
    await user.click(pickupInput);
    const downtownOption = await screen.findByText("Downtown Station");
    await user.click(downtownOption);

    // Select destination location
    const destInput = screen.getByPlaceholderText("Search destination...");
    await user.click(destInput);
    const techParkOption = await screen.findByText("Tech Park Gateway");
    await user.click(techParkOption);

    // Click Search Rides
    const searchButton = screen.getByRole("button", { name: /search rides/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(tripsApi.search).toHaveBeenCalledWith(
        expect.objectContaining({
          source_location_id: "loc-1",
          destination_location_id: "loc-2",
        }),
      );
    });

    // Displays the trip card
    expect(await screen.findByText("Available Trips (1)")).toBeInTheDocument();
    expect(screen.getByText("Express Line A")).toBeInTheDocument();
    expect(screen.getByText("3 seats left")).toBeInTheDocument();

    // Click Book Ride to open confirmation popup
    const bookButton = screen.getByRole("button", { name: /book ride/i });
    await user.click(bookButton);

    expect(screen.getByText("Book this Ride?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm booking/i })).toBeInTheDocument();

  });

  it("displays empty state when no rides are available", async () => {
    const user = userEvent.setup();
    vi.mocked(tripsApi.search).mockResolvedValue({
      items: [],
      page: 1,
      limit: 20,
      total: 0,
    });

    renderBookRidePage();

    // Select source & destination
    await user.click(screen.getByPlaceholderText("Search origin location..."));
    await user.click(await screen.findByText("Downtown Station"));

    await user.click(screen.getByPlaceholderText("Search destination..."));
    await user.click(await screen.findByText("Tech Park Gateway"));

    await user.click(screen.getByRole("button", { name: /search rides/i }));

    expect(await screen.findByText("No Rides Found")).toBeInTheDocument();
  });
});
