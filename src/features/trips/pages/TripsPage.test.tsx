import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TripsPage from "./TripsPage";
import { tripsApi } from "../api/trips.api";
import type { PaginatedTripsResponse, TripResponse } from "../types/trips.api.types";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    list: vi.fn(),
    delete: vi.fn(),
    getRoutes: vi.fn(),
    getVehicles: vi.fn(),
  },
}));

const mockTrip: TripResponse = {
  id: "trip-1",
  route_id: "route-100",
  driver_id: "driver-1",
  vehicle_id: "vehicle-200",
  departure_date: "2030-06-15",
  departure_time: "08:30:00",
  available_seats: 3,
  status: "scheduled",
  created_at: "2026-09-14T10:00:00Z",
  updated_at: "2026-09-14T10:00:00Z",
};

const mockRoutes = {
  items: [{ id: "route-100", name: "Downtown Express", status: "active" }],
};

const mockVehicles = [
  { id: "vehicle-200", make: "Tesla", model: "Model 3", license_plate: "EV-9999", total_seats: 5 },
];

function renderTripsPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TripsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("TripsPage", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.list).mockReset();
    vi.mocked(tripsApi.delete).mockReset();
    vi.mocked(tripsApi.getRoutes).mockReset();
    vi.mocked(tripsApi.getVehicles).mockReset();

    vi.mocked(tripsApi.getRoutes).mockResolvedValue(mockRoutes);
    vi.mocked(tripsApi.getVehicles).mockResolvedValue(mockVehicles);
  });

  it("shows empty state when no trips are scheduled", async () => {
    const emptyResponse: PaginatedTripsResponse = {
      items: [],
      page: 1,
      limit: 8,
      total: 0,
    };
    vi.mocked(tripsApi.list).mockResolvedValueOnce(emptyResponse);

    renderTripsPage();

    expect(
      await screen.findByText("No trips scheduled yet"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /schedule your first trip/i }),
    ).toBeInTheDocument();
  });

  it("renders list of trips with route name, vehicle, departure info, and status", async () => {
    const listResponse: PaginatedTripsResponse = {
      items: [mockTrip],
      page: 1,
      limit: 8,
      total: 1,
    };
    vi.mocked(tripsApi.list).mockResolvedValueOnce(listResponse);

    renderTripsPage();

    expect(await screen.findByText("Downtown Express")).toBeInTheDocument();
    expect(screen.getByText("Tesla Model 3 (EV-9999)")).toBeInTheDocument();
    expect(screen.getByText("2030-06-15")).toBeInTheDocument();
    expect(screen.getByText("08:30")).toBeInTheDocument();
    expect(screen.getAllByText("Scheduled").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("3 seats left")).toBeInTheDocument();

    // Verify edit link points to parameterized edit path
    const editLink = screen.getByRole("link", { name: /edit trip downtown express/i });
    expect(editLink).toHaveAttribute("href", "/trips/trip-1/edit");
  });

  it("disables edit and delete buttons when trip status is not scheduled", async () => {
    const user = userEvent.setup();
    const completedTrip: TripResponse = {
      ...mockTrip,
      id: "trip-completed",
      status: "completed",
    };
    const listResponse: PaginatedTripsResponse = {
      items: [completedTrip],
      page: 1,
      limit: 8,
      total: 1,
    };
    vi.mocked(tripsApi.list).mockResolvedValueOnce(listResponse);

    renderTripsPage();

    expect(await screen.findByText("Completed")).toBeInTheDocument();

    const editBtn = screen.getByRole("button", {
      name: /edit trip downtown express \(disabled\)/i,
    });
    expect(editBtn).toBeDisabled();

    const deleteBtn = screen.getByRole("button", {
      name: /delete trip downtown express/i,
    });
    expect(deleteBtn).toBeDisabled();

    // Clicking disabled delete does not open modal
    await user.click(deleteBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens DeleteTripModal on delete click and cancels cleanly", async () => {
    const user = userEvent.setup();
    const listResponse: PaginatedTripsResponse = {
      items: [mockTrip],
      page: 1,
      limit: 8,
      total: 1,
    };
    vi.mocked(tripsApi.list).mockResolvedValueOnce(listResponse);

    renderTripsPage();

    const deleteBtn = await screen.findByRole("button", {
      name: /delete trip downtown express/i,
    });
    await user.click(deleteBtn);

    // Modal appears
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Delete trip?", level: 2 }),
    ).toBeInTheDocument();

    // Cancel deletion
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(tripsApi.delete).not.toHaveBeenCalled();
  });

  it("successfully deletes a trip via confirmation modal and displays feedback banner", async () => {
    const user = userEvent.setup();
    const listResponse: PaginatedTripsResponse = {
      items: [mockTrip],
      page: 1,
      limit: 8,
      total: 1,
    };
    vi.mocked(tripsApi.list).mockResolvedValue(listResponse);
    vi.mocked(tripsApi.delete).mockResolvedValueOnce(undefined);

    renderTripsPage();

    const deleteBtn = await screen.findByRole("button", {
      name: /delete trip downtown express/i,
    });
    await user.click(deleteBtn);

    // Confirm in modal
    const confirmDeleteBtn = screen.getByRole("button", {
      name: "Delete trip",
    });
    await user.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(tripsApi.delete).toHaveBeenCalledWith("trip-1");
    });

    expect(
      await screen.findByText(/has been deleted\./i),
    ).toBeInTheDocument();
  });

  it("displays error message when delete mutation fails", async () => {
    const user = userEvent.setup();
    const listResponse: PaginatedTripsResponse = {
      items: [mockTrip],
      page: 1,
      limit: 8,
      total: 1,
    };
    vi.mocked(tripsApi.list).mockResolvedValue(listResponse);
    vi.mocked(tripsApi.delete).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: { detail: "Cannot delete active trip" },
      },
    });

    renderTripsPage();

    const deleteBtn = await screen.findByRole("button", {
      name: /delete trip downtown express/i,
    });
    await user.click(deleteBtn);

    const confirmDeleteBtn = screen.getByRole("button", {
      name: "Delete trip",
    });
    await user.click(confirmDeleteBtn);

    expect(
      await screen.findByText("Cannot delete active trip"),
    ).toBeInTheDocument();
  });

  it("handles pagination when multiple pages exist", async () => {
    const user = userEvent.setup();
    const page1Response: PaginatedTripsResponse = {
      items: [mockTrip],
      page: 1,
      limit: 8,
      total: 12,
    };
    const page2Response: PaginatedTripsResponse = {
      items: [{ ...mockTrip, id: "trip-2", departure_date: "2030-06-16" }],
      page: 2,
      limit: 8,
      total: 12,
    };

    vi.mocked(tripsApi.list)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    renderTripsPage();

    expect(
      await screen.findByText(
        (_, el) =>
          el?.tagName.toLowerCase() === "p" &&
          el?.textContent?.replace(/\s+/g, " ").trim() === "Page 1 of 2",
      ),
    ).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: "Next" });
    const prevBtn = screen.getByRole("button", { name: "Previous" });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();

    await user.click(nextBtn);

    await waitFor(() => {
      expect(tripsApi.list).toHaveBeenCalledWith({ page: 2, limit: 8 });
    });

    expect(
      await screen.findByText(
        (_, el) =>
          el?.tagName.toLowerCase() === "p" &&
          el?.textContent?.replace(/\s+/g, " ").trim() === "Page 2 of 2",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("2030-06-16")).toBeInTheDocument();
  });
});
