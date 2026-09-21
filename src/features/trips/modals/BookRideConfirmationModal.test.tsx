import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookRideConfirmationModal from "./BookRideConfirmationModal";
import type { TripResponse } from "../types/trips.api.types";

const mockMutate = vi.fn();

vi.mock("@features/bookings/hooks/useCreateBookingMutation", () => ({
  useCreateBookingMutation: () => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
    error: null,
  }),
}));

const mockTrip: TripResponse = {
  id: "trip-12345678",
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
    name: "Downtown to Tech Park",
    status: "active",
  },
};

describe("BookRideConfirmationModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trip details and calls onClose when cancelled", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <BookRideConfirmationModal
        trip={mockTrip}
        sourceName="Downtown"
        destinationName="Tech Park"
        seatsRequested={2}
        onClose={handleClose}
      />,
    );

    expect(screen.getByText("Book this Ride?")).toBeInTheDocument();
    expect(screen.getByText("Downtown to Tech Park")).toBeInTheDocument();
    expect(screen.getByText("2026-09-25 at 08:30")).toBeInTheDocument();
    expect(screen.getByText("2 seats")).toBeInTheDocument();
    expect(screen.getByText("3 remaining")).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("calls createBookingMutation and shows confirmation success screen on success", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    mockMutate.mockImplementationOnce((_payload, options) => {
      options?.onSuccess?.();
    });

    render(
      <BookRideConfirmationModal
        trip={mockTrip}
        sourceName="Downtown"
        destinationName="Tech Park"
        seatsRequested={1}
        onClose={handleClose}
      />,
    );

    const confirmButton = screen.getByRole("button", {
      name: /confirm booking/i,
    });
    await user.click(confirmButton);

    expect(mockMutate).toHaveBeenCalledWith(
      {
        trip_id: "trip-12345678",
        pickup_stop_id: "route-1",
        dropoff_stop_id: "route-1",
        seats_booked: 1,
      },
      expect.any(Object),
    );

    expect(screen.getByText("Ride Booked!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your ride reservation has been placed successfully. You will be notified once your driver confirms the pickup.",
      ),
    ).toBeInTheDocument();

    const doneButton = screen.getByRole("button", { name: /done/i });
    await user.click(doneButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
