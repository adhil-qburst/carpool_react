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

    expect(
      screen.getByRole("heading", { name: "Route Builder" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Driver Garage" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Schedule Trip" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Find a Ride" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "My Bookings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ride Preferences" }),
    ).toBeInTheDocument();
  });

  it("renders navigation header with Ride Preferences menu link", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    const preferenceNavLinks = screen.getAllByRole("link", {
      name: /ride preferences/i,
    });
    expect(preferenceNavLinks.length).toBeGreaterThanOrEqual(1);

    const headerPreferenceLink = preferenceNavLinks[0];
    expect(headerPreferenceLink).toHaveAttribute(
      "href",
      route_paths.ridePreferences,
    );
  });

  it("renders the Ride Preferences menu card with links to view and set preferences", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Ride Preferences" }),
    ).toBeInTheDocument();

    const viewPrefsLink = screen.getByRole("link", {
      name: /view preferences/i,
    });
    expect(viewPrefsLink).toBeInTheDocument();
    expect(viewPrefsLink).toHaveAttribute("href", route_paths.ridePreferences);

    const setPrefLink = screen.getByRole("link", {
      name: /\+ set preference/i,
    });
    expect(setPrefLink).toBeInTheDocument();
    expect(setPrefLink).toHaveAttribute("href", route_paths.ridePreferencesNew);
  });
});
