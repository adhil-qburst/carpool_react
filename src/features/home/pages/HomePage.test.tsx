import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import HomePage from "./HomePage";
import { route_paths } from "@core/router/route_paths";

describe("HomePage", () => {
  it("renders navigation header with My Bookings menu link", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    const bookingNavLinks = screen.getAllByRole("link", {
      name: /my bookings/i,
    });
    expect(bookingNavLinks.length).toBeGreaterThanOrEqual(1);

    const headerBookingLink = bookingNavLinks[0];
    expect(headerBookingLink).toHaveAttribute("href", route_paths.bookings);
  });

  it("renders the My Bookings menu card in the home dashboard", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "My Bookings" }),
    ).toBeInTheDocument();

    const viewBookingsLink = screen.getByRole("link", {
      name: /view bookings/i,
    });
    expect(viewBookingsLink).toBeInTheDocument();
    expect(viewBookingsLink).toHaveAttribute("href", route_paths.bookings);
  });

  it("renders all dashboard feature menu cards", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Route Builder")).toBeInTheDocument();
    expect(screen.getByText("Driver Garage")).toBeInTheDocument();
    expect(screen.getByText("Schedule Trip")).toBeInTheDocument();
    expect(screen.getByText("Find a Ride")).toBeInTheDocument();
    expect(screen.getByText("My Bookings")).toBeInTheDocument();
  });
});
