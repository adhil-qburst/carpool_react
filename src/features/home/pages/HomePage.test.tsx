import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./HomePage";
import { route_paths } from "@core/router/route_paths";

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("HomePage", () => {
  it("renders navigation header with My Bookings menu link", () => {
    renderHomePage();

    const bookingNavLinks = screen.getAllByRole("link", {
      name: /my bookings/i,
    });
    expect(bookingNavLinks.length).toBeGreaterThanOrEqual(1);

    const headerBookingLink = bookingNavLinks[0];
    expect(headerBookingLink).toHaveAttribute("href", route_paths.bookings);
  });

  it("renders the My Bookings menu card in the home dashboard", () => {
    renderHomePage();

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
    renderHomePage();

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
    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  it("renders navigation header with Ride Preferences menu link", () => {
    renderHomePage();

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
    renderHomePage();

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

  it("renders navigation header with Notifications menu link", () => {
    renderHomePage();

    const notificationNavLinks = screen.getAllByRole("link", {
      name: /notifications/i,
    });
    expect(notificationNavLinks.length).toBeGreaterThanOrEqual(1);

    const headerNotificationLink = notificationNavLinks[0];
    expect(headerNotificationLink).toHaveAttribute(
      "href",
      route_paths.notifications,
    );
  });

  it("renders the Notifications menu card with link to view notifications", () => {
    renderHomePage();

    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();

    const viewNotificationsLink = screen.getByRole("link", {
      name: /view notifications/i,
    });
    expect(viewNotificationsLink).toBeInTheDocument();
    expect(viewNotificationsLink).toHaveAttribute(
      "href",
      route_paths.notifications,
    );
  });
});

