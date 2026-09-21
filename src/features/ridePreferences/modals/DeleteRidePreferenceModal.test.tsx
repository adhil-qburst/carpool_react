import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteRidePreferenceModal from "./DeleteRidePreferenceModal";
import type { RidePreferenceResponse } from "../types/ridePreferences.api.types";

const mockPreference: RidePreferenceResponse = {
  id: "pref-1",
  rider_id: "user-1",
  source_location_id: "loc-1",
  destination_location_id: "loc-2",
  preferred_departure_time: "08:30:00",
  seats_needed: 1,
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

describe("DeleteRidePreferenceModal", () => {
  it("renders preference details and calls onConfirm when clicked", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    render(
      <DeleteRidePreferenceModal
        preference={mockPreference}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />,
    );

    expect(screen.getByText("Delete preference?")).toBeInTheDocument();
    expect(screen.getByText("Office Morning Route")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: /delete preference/i,
    });
    await user.click(deleteButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <DeleteRidePreferenceModal
        preference={mockPreference}
        onConfirm={vi.fn()}
        onClose={handleClose}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
