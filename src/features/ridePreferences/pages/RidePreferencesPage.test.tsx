import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RidePreferencesPage from "./RidePreferencesPage";
import { ridePreferencesApi } from "../api/ridePreferences.api";
import type { RidePreferenceResponse } from "../types/ridePreferences.api.types";

vi.mock("../api/ridePreferences.api", () => ({
  ridePreferencesApi: {
    list: vi.fn(),
    create: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getMatches: vi.fn(),
  },
}));

function renderRidePreferencesPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RidePreferencesPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const mockPreference1: RidePreferenceResponse = {
  id: "pref-1",
  rider_id: "user-1",
  source_location_id: "loc-1",
  destination_location_id: "loc-2",
  preferred_departure_time: "08:30:00",
  seats_needed: 2,
  is_active: true,
  label: "Office Morning Route",
  created_at: "2026-09-20T08:00:00Z",
  updated_at: "2026-09-20T08:00:00Z",
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
    name: "Tech Park",
    city: "Metropolis",
    status: "active",
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
};

describe("RidePreferencesPage", () => {
  beforeEach(() => {
    vi.mocked(ridePreferencesApi.list).mockReset();
    vi.mocked(ridePreferencesApi.update).mockReset();
    vi.mocked(ridePreferencesApi.delete).mockReset();
  });

  it("shows empty state when no ride preferences exist", async () => {
    vi.mocked(ridePreferencesApi.list).mockResolvedValueOnce([]);

    renderRidePreferencesPage();

    expect(
      await screen.findByText("No ride preferences found"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /add first preference/i }),
    ).toBeInTheDocument();
  });

  it("renders list of ride preferences with details", async () => {
    vi.mocked(ridePreferencesApi.list).mockResolvedValueOnce([mockPreference1]);

    renderRidePreferencesPage();

    expect(
      await screen.findByText("Office Morning Route"),
    ).toBeInTheDocument();
    expect(screen.getByText("Downtown Terminal")).toBeInTheDocument();
    expect(screen.getByText("Tech Park")).toBeInTheDocument();
    expect(screen.getByText("8:30 AM")).toBeInTheDocument();
    expect(screen.getByText("2 seats")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("toggles active status when deactivate/activate button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(ridePreferencesApi.list).mockResolvedValueOnce([mockPreference1]);
    vi.mocked(ridePreferencesApi.update).mockResolvedValueOnce({
      ...mockPreference1,
      is_active: false,
    });

    renderRidePreferencesPage();

    const deactivateBtn = await screen.findByRole("button", {
      name: /deactivate/i,
    });
    await user.click(deactivateBtn);

    expect(ridePreferencesApi.update).toHaveBeenCalledWith("pref-1", {
      is_active: false,
    });
  });

  it("opens delete modal and confirms deletion", async () => {
    const user = userEvent.setup();
    vi.mocked(ridePreferencesApi.list).mockResolvedValueOnce([mockPreference1]);
    vi.mocked(ridePreferencesApi.delete).mockResolvedValueOnce();

    renderRidePreferencesPage();

    const deleteBtn = await screen.findByRole("button", {
      name: /delete office morning route/i,
    });
    await user.click(deleteBtn);

    expect(await screen.findByText("Delete preference?")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /^delete preference$/i,
    });
    await user.click(confirmBtn);

    expect(ridePreferencesApi.delete).toHaveBeenCalledWith("pref-1");
  });

  it("shows error state when query fails", async () => {
    vi.mocked(ridePreferencesApi.list).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    renderRidePreferencesPage();

    expect(
      await screen.findByText("Unable to load ride preferences."),
    ).toBeInTheDocument();
  });
});
