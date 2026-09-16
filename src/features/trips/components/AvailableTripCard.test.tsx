import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AvailableTripCard from "./AvailableTripCard";
import type { TripResponse } from "../types/trips.api.types";

const mockTrip: TripResponse = {
  id: "trip-abcdef12-3456",
  route_id: "route-1",
  driver_id: "driver-1",
  vehicle_id: "veh-1",
  departure_date: "2026-09-22",
  departure_time: "09:15:00",
  available_seats: 4,
  status: "scheduled",
  created_at: "2026-09-14T10:00:00Z",
  updated_at: "2026-09-14T10:00:00Z",
  route: {
    id: "route-1",
    name: "North Campus to Metro Central",
    status: "active",
  },
};

describe("AvailableTripCard", () => {
  it("renders trip information and responds to Book Ride click", async () => {
    const user = userEvent.setup();
    const handleBook = vi.fn();

    render(
      <AvailableTripCard
        trip={mockTrip}
        sourceName="North Campus"
        destinationName="Metro Central"
        seatsNeeded={2}
        onBook={handleBook}
      />,
    );

    expect(screen.getByText("North Campus to Metro Central")).toBeInTheDocument();
    expect(screen.getByText("4 seats left")).toBeInTheDocument();
    expect(screen.getByText("2026-09-22")).toBeInTheDocument();
    expect(screen.getByText("09:15")).toBeInTheDocument();

    const bookButton = screen.getByRole("button", { name: /book ride/i });
    expect(bookButton).not.toBeDisabled();
    await user.click(bookButton);

    expect(handleBook).toHaveBeenCalledWith(mockTrip);
  });

  it("disables booking button when not enough seats or trip is not scheduled", () => {
    const soldOutTrip: TripResponse = {
      ...mockTrip,
      available_seats: 0,
    };

    render(
      <AvailableTripCard
        trip={soldOutTrip}
        seatsNeeded={1}
        onBook={vi.fn()}
      />,
    );

    expect(screen.getByText("Sold out")).toBeInTheDocument();
    const bookButton = screen.getByRole("button", { name: /book ride/i });
    expect(bookButton).toBeDisabled();
  });
});
