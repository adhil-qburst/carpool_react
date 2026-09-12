import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoutesPage from "./RoutesPage";
import { routesApi } from "../api/routes.api";

vi.mock("../api/routes.api", () => ({
  routesApi: {
    list: vi.fn(),
    delete: vi.fn(),
  },
}));

function renderRoutesPage() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RoutesPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("RoutesPage", () => {
  beforeEach(() => {
    vi.mocked(routesApi.list).mockReset();
    vi.mocked(routesApi.delete).mockReset();
  });

  it("shows empty state when no routes are configured", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [],
      page: 1,
      limit: 10,
      total: 0,
    });

    renderRoutesPage();

    expect(
      await screen.findByText("No routes created yet"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create your first route/i }),
    ).toBeInTheDocument();
  });

  it("renders list of routes with stop sequences", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [
        {
          id: "route-1",
          driver_id: "driver-1",
          name: "Morning Commute",
          route_stops: [
            {
              id: "stop-1",
              route_id: "route-1",
              location_id: "loc-1",
              sequence: 0,
            },
            {
              id: "stop-2",
              route_id: "route-1",
              location_id: "loc-2",
              sequence: 1,
            },
          ],
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    });

    renderRoutesPage();

    expect(await screen.findByText("Morning Commute")).toBeInTheDocument();
    expect(screen.getByText("2 stops")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
  });

  it("renders Edit link pointing to the route edit page", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [
        {
          id: "route-1",
          driver_id: "driver-1",
          name: "Airport Run",
          route_stops: [],
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    });

    renderRoutesPage();

    const editLink = await screen.findByRole("link", {
      name: /edit airport run/i,
    });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/routes/route-1/edit");
  });

  it("opens confirmation modal when clicking Delete button and allows cancelling", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [
        {
          id: "route-1",
          driver_id: "driver-1",
          name: "Airport Run",
          route_stops: [],
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    });

    const user = userEvent.setup();
    renderRoutesPage();

    const deleteBtn = await screen.findByRole("button", {
      name: /delete airport run/i,
    });
    await user.click(deleteBtn);

    expect(
      screen.getByRole("heading", { name: "Delete route?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete your route/i),
    ).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(
      screen.queryByRole("heading", { name: "Delete route?" }),
    ).not.toBeInTheDocument();
    expect(routesApi.delete).not.toHaveBeenCalled();
  });

  it("successfully deletes a route and displays feedback banner", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [
        {
          id: "route-1",
          driver_id: "driver-1",
          name: "Airport Run",
          route_stops: [],
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    });
    vi.mocked(routesApi.delete).mockResolvedValueOnce(undefined);

    const user = userEvent.setup();
    renderRoutesPage();

    const deleteBtn = await screen.findByRole("button", {
      name: /delete airport run/i,
    });
    await user.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^delete route$/i });
    await user.click(confirmBtn);

    expect(routesApi.delete).toHaveBeenCalledWith("route-1");
    expect(
      await screen.findByText(/"Airport Run" has been successfully deleted\./i),
    ).toBeInTheDocument();

    const dismissBtn = screen.getByRole("button", { name: /dismiss/i });
    await user.click(dismissBtn);

    expect(
      screen.queryByText(/"Airport Run" has been successfully deleted\./i),
    ).not.toBeInTheDocument();
  });

  it("handles delete errors by displaying an alert banner", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [
        {
          id: "route-1",
          driver_id: "driver-1",
          name: "Airport Run",
          route_stops: [],
        },
      ],
      page: 1,
      limit: 10,
      total: 1,
    });
    vi.mocked(routesApi.delete).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: { detail: "Cannot delete route with active rides" },
      },
    });

    const user = userEvent.setup();
    renderRoutesPage();

    const deleteBtn = await screen.findByRole("button", {
      name: /delete airport run/i,
    });
    await user.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^delete route$/i });
    await user.click(confirmBtn);

    expect(routesApi.delete).toHaveBeenCalledWith("route-1");
    expect(
      await screen.findByText("Cannot delete route with active rides"),
    ).toBeInTheDocument();
  });

  it("shows an error state when list query fails", async () => {
    vi.mocked(routesApi.list).mockRejectedValueOnce(
      new Error("Network connection error"),
    );

    renderRoutesPage();

    expect(
      await screen.findByText("Could not load your routes"),
    ).toBeInTheDocument();
    expect(screen.getByText("Network connection error")).toBeInTheDocument();
  });

  it("renders pagination controls and allows page switching when total exceeds limit", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [
        {
          id: "route-1",
          driver_id: "driver-1",
          name: "Route Page 1",
          route_stops: [],
        },
      ],
      page: 1,
      limit: 10,
      total: 20,
    });

    const user = userEvent.setup();
    renderRoutesPage();

    expect(await screen.findByText("Route Page 1")).toBeInTheDocument();
    expect(
      screen.getByText((_, el) => el?.textContent?.replace(/\s+/g, " ").trim() === "Page 1 of 2"),
    ).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /^next$/i });
    expect(nextBtn).toBeEnabled();

    vi.mocked(routesApi.list).mockResolvedValueOnce({
      items: [
        {
          id: "route-2",
          driver_id: "driver-1",
          name: "Route Page 2",
          route_stops: [],
        },
      ],
      page: 2,
      limit: 10,
      total: 20,
    });

    await user.click(nextBtn);

    expect(routesApi.list).toHaveBeenCalledWith({ page: 2, limit: 10 });
  });
});
