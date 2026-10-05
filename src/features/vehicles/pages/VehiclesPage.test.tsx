import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VehiclesPage from "./VehiclesPage";
import { vehiclesApi } from "../api/vehicles.api";

vi.mock("../api/vehicles.api", () => ({
  vehiclesApi: {
    list: vi.fn(),
    delete: vi.fn(),
  },
}));

function renderVehiclesPage() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("VehiclesPage", () => {
  beforeEach(() => {
    vi.mocked(vehiclesApi.list).mockReset();
    vi.mocked(vehiclesApi.delete).mockReset();
  });

  it("shows empty state when no vehicles are registered", async () => {
    vi.mocked(vehiclesApi.list).mockResolvedValueOnce([]);

    renderVehiclesPage();

    expect(
      await screen.findByText("No vehicles registered yet"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /register your first vehicle/i }),
    ).toBeInTheDocument();
  });

  it("renders list of vehicles and deletes a vehicle via confirmation modal", async () => {
    vi.mocked(vehiclesApi.list).mockResolvedValueOnce([
      {
        id: "v-1",
        driver_id: "d-1",
        make: "Toyota",
        model: "Prius",
        registration_number: "KA-01-AB-1234",
        total_seats: 4,
        created_at: "2026-09-10T00:00:00Z",
        updated_at: "2026-09-10T00:00:00Z",
      },
    ]);
    vi.mocked(vehiclesApi.delete).mockResolvedValueOnce();

    const user = userEvent.setup();
    renderVehiclesPage();

    expect(await screen.findByText("Toyota")).toBeInTheDocument();
    expect(screen.getByText("Prius")).toBeInTheDocument();
    expect(screen.getByText("KA-01-AB-1234")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", {
      name: /delete toyota prius/i,
    });
    await user.click(deleteBtn);

    expect(await screen.findByText("Delete vehicle?")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete your/i),
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /^delete vehicle$/i,
    });
    await user.click(confirmBtn);

    expect(vehiclesApi.delete).toHaveBeenCalledWith("v-1");
  });

  it("shows an error state when list query fails", async () => {
    vi.mocked(vehiclesApi.list).mockRejectedValueOnce(
      new Error("Network connection error"),
    );

    renderVehiclesPage();

    expect(
      await screen.findByText("Could not load your vehicles"),
    ).toBeInTheDocument();
    expect(screen.getByText("Network connection error")).toBeInTheDocument();
  });
});
