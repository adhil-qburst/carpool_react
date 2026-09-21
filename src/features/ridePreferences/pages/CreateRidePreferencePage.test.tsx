import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateRidePreferencePage from "./CreateRidePreferencePage";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import { locationsApi } from "@features/locations/api/locations.api";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
    create: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getMatches: vi.fn(),
  },
}));

vi.mock("@features/locations/api/locations.api", () => ({
  locationsApi: {
    list: vi.fn(),
  },
}));

function renderCreateRidePreferencePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CreateRidePreferencePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

import type { LocationResponse } from "@features/locations/types/locations.api.types";

const mockLocations: LocationResponse[] = [
  {
    id: "loc-1",
    name: "Downtown Terminal",
    city: "Metropolis",
    lat: null,
    lng: null,
    status: "active",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "loc-2",
    name: "Tech Park Hub",
    city: "Metropolis",
    lat: null,
    lng: null,
    status: "active",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
];

describe("CreateRidePreferencePage", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.create).mockReset();
    vi.mocked(locationsApi.list).mockReset();
    vi.mocked(locationsApi.list).mockResolvedValue({
      items: mockLocations,
      total: 2,
      page: 1,
      limit: 10,
    });
  });

  it("renders the form title and primary fields", () => {
    renderCreateRidePreferencePage();

    expect(
      screen.getByRole("heading", { name: "Create Ride Preference" }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g. Daily Office Commute"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/origin \/ pickup stop/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
  });

  it("validates that origin and destination are required", async () => {
    const user = userEvent.setup();
    renderCreateRidePreferencePage();

    const submitBtn = screen.getByRole("button", {
      name: /save ride preference/i,
    });
    await user.click(submitBtn);

    expect(
      await screen.findByText("Please select an origin location."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please select a destination location."),
    ).toBeInTheDocument();
    expect(ridePreferencesApi.create).not.toHaveBeenCalled();
  });

  it("submits the form when fields are filled properly", async () => {
    const user = userEvent.setup();
    vi.mocked(ridePreferencesApi.create).mockResolvedValueOnce({
      id: "new-pref",
      rider_id: "user-1",
      source_location_id: "loc-1",
      destination_location_id: "loc-2",
      preferred_departure_time: "08:30:00",
      seats_needed: 1,
      is_active: true,
      created_at: "2026-09-20T00:00:00Z",
      updated_at: "2026-09-20T00:00:00Z",
    });

    renderCreateRidePreferencePage();

    // Select Origin
    const originInput = screen.getByPlaceholderText(
      "Select pickup location...",
    );
    await user.click(originInput);
    const originOption = await screen.findByRole("option", {
      name: /downtown terminal metropolis/i,
    });
    await user.click(originOption);

    // Select Destination
    const destInput = screen.getByPlaceholderText(
      "Select drop-off location...",
    );
    await user.click(destInput);
    const destOption = await screen.findByRole("option", {
      name: /tech park hub metropolis/i,
    });
    await user.click(destOption);

    // Submit
    const submitBtn = screen.getByRole("button", {
      name: /save ride preference/i,
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(ridePreferencesApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          source_location_id: "loc-1",
          destination_location_id: "loc-2",
          seats_needed: 1,
          is_active: true,
        }),
      );
    });
  });

  it("submits the form with null preferredDepartureTime when time is not set", async () => {
    const user = userEvent.setup();
    vi.mocked(ridePreferencesApi.create).mockResolvedValueOnce({
      id: "pref-null-time",
      rider_id: "user-1",
      source_location_id: "loc-1",
      destination_location_id: "loc-2",
      preferred_departure_time: null,
      seats_needed: 1,
      is_active: true,
      created_at: "2026-09-20T00:00:00Z",
      updated_at: "2026-09-20T00:00:00Z",
    });

    renderCreateRidePreferencePage();

    // Select Origin
    const originInput = screen.getByPlaceholderText(
      "Select pickup location...",
    );
    await user.click(originInput);
    const originOption = await screen.findByRole("option", {
      name: /downtown terminal metropolis/i,
    });
    await user.click(originOption);

    // Select Destination
    const destInput = screen.getByPlaceholderText(
      "Select drop-off location...",
    );
    await user.click(destInput);
    const destOption = await screen.findByRole("option", {
      name: /tech park hub metropolis/i,
    });
    await user.click(destOption);

    // Submit without setting departure time
    const submitBtn = screen.getByRole("button", {
      name: /save ride preference/i,
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(ridePreferencesApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          source_location_id: "loc-1",
          destination_location_id: "loc-2",
          preferred_departure_time: null,
        }),
      );
    });
  });
});
