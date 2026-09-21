import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditRidePreferencePage from "./EditRidePreferencePage";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import { locationsApi } from "@features/locations/api/locations.api";
import type { RidePreferenceResponse } from "../types/ridePreferences.api.types";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
    getById: vi.fn(),
    update: vi.fn(),
    list: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    getMatches: vi.fn(),
  },
}));

vi.mock("@features/locations/api/locations.api", () => ({
  locationsApi: {
    list: vi.fn(),
  },
}));

const mockPreference: RidePreferenceResponse = {
  id: "pref-123",
  rider_id: "user-1",
  source_location_id: "loc-1",
  destination_location_id: "loc-2",
  preferred_departure_time: "09:15:00",
  seats_needed: 3,
  is_active: true,
  label: "Office Rush",
  created_at: "2026-09-20T00:00:00Z",
  updated_at: "2026-09-20T00:00:00Z",
  source: {
    id: "loc-1",
    name: "Downtown Terminal",
    city: "Metropolis",
    status: "active",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  destination: {
    id: "loc-2",
    name: "Tech Park Hub",
    city: "Metropolis",
    status: "active",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
};

function renderEditRidePreferencePage(preferenceId = "pref-123") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/ride-preferences/${preferenceId}/edit`]}>
        <Routes>
          <Route
            path="/ride-preferences/:preferenceId/edit"
            element={<EditRidePreferencePage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("EditRidePreferencePage", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.getById).mockReset();
    vi.mocked(ridePreferencesApi.update).mockReset();
    vi.mocked(locationsApi.list).mockReset();
    vi.mocked(locationsApi.list).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    });
  });

  it("loads and populates existing preference values", async () => {
    vi.mocked(ridePreferencesApi.getById).mockResolvedValueOnce(mockPreference);

    renderEditRidePreferencePage();

    expect(
      await screen.findByDisplayValue("Office Rush"),
    ).toBeInTheDocument();
    expect(screen.getByText("Downtown Terminal")).toBeInTheDocument();
    expect(screen.getByText("Tech Park Hub")).toBeInTheDocument();
    expect(screen.getByDisplayValue("09:15")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
  });

  it("submits updated values when saved", async () => {
    const user = userEvent.setup();
    vi.mocked(ridePreferencesApi.getById).mockResolvedValueOnce(mockPreference);
    vi.mocked(ridePreferencesApi.update).mockResolvedValueOnce({
      ...mockPreference,
      label: "Updated Office Rush",
    });

    renderEditRidePreferencePage();

    const labelInput = await screen.findByDisplayValue("Office Rush");
    await user.clear(labelInput);
    await user.type(labelInput, "Updated Office Rush");

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(ridePreferencesApi.update).toHaveBeenCalledWith(
        "pref-123",
        expect.objectContaining({
          label: "Updated Office Rush",
        }),
      );
    });
  });

  it("allows clearing preferred departure time to null", async () => {
    const user = userEvent.setup();
    vi.mocked(ridePreferencesApi.getById).mockResolvedValueOnce(mockPreference);
    vi.mocked(ridePreferencesApi.update).mockResolvedValueOnce({
      ...mockPreference,
      preferred_departure_time: null,
    });

    renderEditRidePreferencePage();

    expect(await screen.findByDisplayValue("09:15")).toBeInTheDocument();

    const clearTimeBtn = screen.getByRole("button", { name: /clear time/i });
    await user.click(clearTimeBtn);

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(ridePreferencesApi.update).toHaveBeenCalledWith(
        "pref-123",
        expect.objectContaining({
          preferred_departure_time: null,
        }),
      );
    });
  });

  it("shows not found message when preference fails to load", async () => {
    vi.mocked(ridePreferencesApi.getById).mockRejectedValueOnce(
      new Error("Not found"),
    );

    renderEditRidePreferencePage("unknown-id");

    expect(
      await screen.findByText("Preference not found."),
    ).toBeInTheDocument();
  });
});
