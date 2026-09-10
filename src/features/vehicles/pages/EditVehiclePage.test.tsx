import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditVehiclePage from "./EditVehiclePage";
import { vehiclesApi } from "../api/vehicles.api";

vi.mock("../api/vehicles.api", () => ({
  vehiclesApi: {
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

function renderEditVehiclePage(vehicleId = "v-1") {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/vehicles/${vehicleId}/edit`]}>
        <Routes>
          <Route
            path="/vehicles/:vehicleId/edit"
            element={<EditVehiclePage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("EditVehiclePage", () => {
  beforeEach(() => {
    vi.mocked(vehiclesApi.getById).mockReset();
    vi.mocked(vehiclesApi.update).mockReset();
  });

  it("pre-fills vehicle data and updates successfully", async () => {
    vi.mocked(vehiclesApi.getById).mockResolvedValueOnce({
      id: "v-1",
      driver_id: "d-1",
      make: "Tesla",
      model: "Model 3",
      registration_number: "TS-01-EV",
      total_seats: 4,
      created_at: "2026-09-10T00:00:00Z",
      updated_at: "2026-09-10T00:00:00Z",
    });

    vi.mocked(vehiclesApi.update).mockResolvedValueOnce({
      id: "v-1",
      driver_id: "d-1",
      make: "Tesla",
      model: "Model Y",
      registration_number: "TS-01-EV",
      total_seats: 5,
      created_at: "2026-09-10T00:00:00Z",
      updated_at: "2026-09-10T00:00:00Z",
    });

    const user = userEvent.setup();
    renderEditVehiclePage("v-1");

    expect(await screen.findByDisplayValue("Tesla")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Model 3")).toBeInTheDocument();
    expect(screen.getByDisplayValue("TS-01-EV")).toBeInTheDocument();
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();

    const modelInput = screen.getByLabelText(/vehicle model/i);
    await user.clear(modelInput);
    await user.type(modelInput, "Model Y");

    const seatsInput = screen.getByLabelText(/total available seats/i);
    await user.clear(seatsInput);
    await user.type(seatsInput, "5");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText("Vehicle updated!")).toBeInTheDocument();
    expect(vehiclesApi.update).toHaveBeenCalledWith("v-1", {
      make: "Tesla",
      model: "Model Y",
      registration_number: "TS-01-EV",
      total_seats: 5,
    });
  });

  it("shows an error state if vehicle retrieval fails", async () => {
    vi.mocked(vehiclesApi.getById).mockRejectedValueOnce(
      new Error("Vehicle not found"),
    );

    renderEditVehiclePage("v-404");

    expect(
      await screen.findByText("Failed to load vehicle"),
    ).toBeInTheDocument();
    expect(screen.getByText("Vehicle not found")).toBeInTheDocument();
  });
});
