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

  it("triggers TODO notice when clicking Delete button", async () => {
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
      await screen.findByText(/Deleting "Airport Run" is coming soon/i),
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
