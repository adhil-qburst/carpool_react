import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RouteDetailsCard from "./RouteDetailsCard";
import type { TripRouteOption } from "../types/trips.api.types";

const mockRouteWithStops: TripRouteOption = {
  id: "route-1",
  name: "City to Airport Express",
  status: "active",
  route_stops: [
    {
      id: "stop-2",
      route_id: "route-1",
      location_id: "loc-2",
      sequence: 2,
      location: {
        id: "loc-2",
        name: "Tech Park Central",
        city: "Metro City",
      },
    },
    {
      id: "stop-1",
      route_id: "route-1",
      location_id: "loc-1",
      sequence: 1,
      location: {
        id: "loc-1",
        name: "Main Bus Station",
        city: "Metro City",
      },
    },
    {
      id: "stop-3",
      route_id: "route-1",
      location_id: "loc-3",
      sequence: 3,
      location: {
        id: "loc-3",
        name: "Terminal 1",
        city: "International Airport",
      },
    },
  ],
};

describe("RouteDetailsCard", () => {
  it("renders null when no route is provided", () => {
    const { container } = render(<RouteDetailsCard route={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders route name, status, and sorted stops with origin/destination badges", () => {
    render(<RouteDetailsCard route={mockRouteWithStops} />);

    expect(screen.getByText("City to Airport Express")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("3 stops")).toBeInTheDocument();

    // Check stops in sorted order
    expect(screen.getByText("Main Bus Station")).toBeInTheDocument();
    expect(screen.getByText("Tech Park Central")).toBeInTheDocument();
    expect(screen.getByText("Terminal 1")).toBeInTheDocument();

    // Check badges
    expect(screen.getByText("Origin")).toBeInTheDocument();
    expect(screen.getByText("Stop 2")).toBeInTheDocument();
    expect(screen.getByText("Destination")).toBeInTheDocument();
  });

  it("renders message when route has no stops", () => {
    const emptyRoute: TripRouteOption = {
      id: "route-empty",
      name: "Empty Route",
      status: "active",
      route_stops: [],
    };
    render(<RouteDetailsCard route={emptyRoute} />);

    expect(screen.getByText("Empty Route")).toBeInTheDocument();
    expect(
      screen.getByText(/No intermediate or destination stops configured/i),
    ).toBeInTheDocument();
  });
});
