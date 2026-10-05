import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterVehiclePage from "./RegisterVehiclePage";
import { vehiclesApi } from "../api/vehicles.api";

vi.mock("../api/vehicles.api", () => ({
  vehiclesApi: {
    register: vi.fn(),
  },
}));

function renderRegisterVehiclePage() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RegisterVehiclePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("RegisterVehiclePage", () => {
  beforeEach(() => {
    vi.mocked(vehiclesApi.register).mockReset();
  });

  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    renderRegisterVehiclePage();

    await user.click(screen.getByRole("button", { name: /register vehicle/i }));

    expect(
      await screen.findByText("Enter the vehicle make."),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter the vehicle model.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter the registration number."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter total available seats."),
    ).toBeInTheDocument();
    expect(vehiclesApi.register).not.toHaveBeenCalled();
  });

  it("registers vehicle and displays success modal upon successful submission", async () => {
    vi.mocked(vehiclesApi.register).mockResolvedValueOnce({
      id: "v-1",
      driver_id: "d-1",
      make: "Toyota",
      model: "Prius",
      registration_number: "KA-01-AB-1234",
      total_seats: 4,
      created_at: "2026-09-10T00:00:00Z",
      updated_at: "2026-09-10T00:00:00Z",
    });

    const user = userEvent.setup();
    renderRegisterVehiclePage();

    await user.type(screen.getByLabelText(/vehicle make/i), "Toyota");
    await user.type(screen.getByLabelText(/vehicle model/i), "Prius");
    await user.type(
      screen.getByLabelText(/registration \/ license plate number/i),
      "KA-01-AB-1234",
    );
    await user.type(screen.getByLabelText(/total available seats/i), "4");

    await user.click(screen.getByRole("button", { name: /register vehicle/i }));

    expect(await screen.findByText("Vehicle registered!")).toBeInTheDocument();
    expect(
      screen.getByText(/KA-01-AB-1234.*added to your garage/i),
    ).toBeInTheDocument();
    expect(vehiclesApi.register).toHaveBeenCalledWith({
      make: "Toyota",
      model: "Prius",
      registration_number: "KA-01-AB-1234",
      total_seats: 4,
    });
  });

  it("handles server validation errors from the API", async () => {
    vi.mocked(vehiclesApi.register).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          detail: [
            {
              loc: ["body", "registration_number"],
              msg: "Vehicle registration number already exists",
              type: "value_error",
            },
          ],
        },
      },
    });

    const user = userEvent.setup();
    renderRegisterVehiclePage();

    await user.type(screen.getByLabelText(/vehicle make/i), "Honda");
    await user.type(screen.getByLabelText(/vehicle model/i), "Civic");
    await user.type(
      screen.getByLabelText(/registration \/ license plate number/i),
      "DUPLICATE-1",
    );
    await user.type(screen.getByLabelText(/total available seats/i), "3");

    await user.click(screen.getByRole("button", { name: /register vehicle/i }));

    expect(
      await screen.findByText("Vehicle registration number already exists"),
    ).toBeInTheDocument();
  });
});
