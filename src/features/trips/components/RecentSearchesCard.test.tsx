import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RecentSearchesCard from "@features/trips/components/RecentSearchesCard";
import type {
  RecentTripSearch,
  TripResponse,
} from "@features/trips/types/trips.api.types";

const source = { id: "source-123", name: "Central Station", city: "Metro" };
const destination = { id: "destination-123", name: "Airport", city: "" };

const emptySearch: RecentTripSearch = {
  source_location_id: source.id,
  destination_location_id: destination.id,
  source_location: source,
  dest_location: destination,
  items: [],
  total: 0,
};

describe("RecentSearchesCard", () => {
  it("shows locations for empty results and passes their labels on selection", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <RecentSearchesCard
        searches={[emptySearch]}
        isLoading={false}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("0 rides")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", {
        name: "Search Central Station, Metro to Airport",
      }),
    );
    expect(onSelect).toHaveBeenCalledWith(
      emptySearch,
      "Central Station, Metro",
      "Airport",
    );
  });

  it("falls back to IDs when locations are missing and results are empty", () => {
    render(
      <RecentSearchesCard
        searches={[{
          ...emptySearch,
          source_location: null,
          dest_location: null,
        }]}
        isLoading={false}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Search Location source-1 to Location destinat",
      }),
    ).toBeInTheDocument();
  });

  it("uses route-stop locations when the new fields are absent", () => {
    const trip: TripResponse = {
      id: "trip-123",
      route_id: "route-123",
      driver_id: "driver-123",
      vehicle_id: "vehicle-123",
      departure_date: "2026-10-20",
      departure_time: "10:00:00",
      available_seats: 2,
      status: "scheduled",
      created_at: "2026-10-15T10:00:00Z",
      updated_at: "2026-10-15T10:00:00Z",
      route: {
        id: "route-123",
        name: "Airport Express",
        status: "active",
        route_stops: [source, destination].map((location, index) => ({
          id: `stop-${index}`,
          route_id: "route-123",
          location_id: location.id,
          sequence: index + 1,
          location,
        })),
      },
    };
    render(
      <RecentSearchesCard
        searches={[{
          source_location_id: source.id,
          destination_location_id: destination.id,
          items: [trip],
          total: 1,
        }]}
        isLoading={false}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Search Central Station, Metro to Airport",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 ride")).toBeInTheDocument();
  });
});