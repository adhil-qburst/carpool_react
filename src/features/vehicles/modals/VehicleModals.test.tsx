import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteVehicleModal from "./DeleteVehicleModal";
import VehicleSuccessModal from "./VehicleSuccessModal";

describe("Vehicle Modals", () => {
  it("DeleteVehicleModal triggers onConfirm and onClose correctly", async () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();
    const user = userEvent.setup();

    const mockVehicle = {
      id: "v-1",
      driver_id: "d-1",
      make: "Honda",
      model: "Civic",
      registration_number: "DL-01-9999",
      total_seats: 4,
      created_at: "2026-09-10T00:00:00Z",
      updated_at: "2026-09-10T00:00:00Z",
    };

    const { rerender } = render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />,
    );

    expect(screen.getByText("Delete vehicle?")).toBeInTheDocument();
    expect(screen.getByText("DL-01-9999")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^delete vehicle$/i }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    rerender(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        isDeleting={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />,
    );

    expect(screen.getByText("Deleting...")).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("VehicleSuccessModal renders title, message, and calls onClose", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <VehicleSuccessModal
        eyebrow="SUCCESS"
        title="Vehicle registered!"
        message="Your vehicle is ready."
        actionText="View all vehicles"
        onClose={handleClose}
      />,
    );

    expect(screen.getByText("SUCCESS")).toBeInTheDocument();
    expect(screen.getByText("Vehicle registered!")).toBeInTheDocument();
    expect(screen.getByText("Your vehicle is ready.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /view all vehicles/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
