import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./HomePage";
import { locationsApi } from "@features/locations/api/locations.api";

vi.mock("@features/locations/api/locations.api", () => ({
  locationsApi: {
    list: vi.fn().mockResolvedValue({
      items: [
        {
          id: "loc-1",
          name: "Kaloor Junction",
          city: "Kochi",
          lat: "9.9984",
          lng: "76.2999",
          status: "active",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
        {
          id: "loc-2",
          name: "Swaraj Round",
          city: "Thrissur",
          lat: "10.5276",
          lng: "76.2144",
          status: "active",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        },
      ],
      page: 1,
      limit: 10,
      total: 2,
    }),
    create: vi.fn(),
  },
}));

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
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
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders header with CarPool logo and navigation links", () => {
    renderHomePage();

    expect(screen.getByRole("link", { name: /carpool home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^find a ride$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^offer a ride$/i })).toBeInTheDocument();
  });

  it("renders hero section with headline, description, and benefit pills", () => {
    renderHomePage();

    expect(screen.getByText(/share the journey/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /smarter commutes/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/carpool makes it easy to share rides/i),
    ).toBeInTheDocument();

    expect(screen.getByText("Save Money")).toBeInTheDocument();
    expect(screen.getByText("Meet New People")).toBeInTheDocument();
    expect(screen.getByText("Greener Planet")).toBeInTheDocument();
  });

  it("allows typing in search inputs and swapping locations", async () => {
    const user = userEvent.setup();
    renderHomePage();

    const fromInput = screen.getByLabelText(/^from$/i);
    const toInput = screen.getByLabelText(/^to$/i);
    const swapButtons = screen.getAllByRole("button", { name: /swap locations/i });

    await user.type(fromInput, "Downtown");
    await user.type(toInput, "Airport");

    expect(fromInput).toHaveValue("Downtown");
    expect(toInput).toHaveValue("Airport");

    await user.click(swapButtons[0]);

    expect(fromInput).toHaveValue("Airport");
    expect(toInput).toHaveValue("Downtown");
  });

  it("opens location popup and selects location from query results", async () => {
    const user = userEvent.setup();
    renderHomePage();

    const fromInput = screen.getByLabelText(/^from$/i);
    await user.click(fromInput);

    expect(screen.getByRole("dialog", { name: /select from location/i })).toBeInTheDocument();
    expect(await screen.findByText("Kaloor Junction")).toBeInTheDocument();

    await user.click(screen.getByText("Kaloor Junction"));

    expect(fromInput).toHaveValue("Kaloor Junction, Kochi");
    expect(screen.queryByRole("dialog", { name: /select from location/i })).not.toBeInTheDocument();
  });

  it("allows selecting a popular stop from the location popup", async () => {
    const user = userEvent.setup();
    renderHomePage();

    const toInput = screen.getByLabelText(/^to$/i);
    await user.click(toInput);

    expect(screen.getByRole("dialog", { name: /select to location/i })).toBeInTheDocument();

    const popularChip = screen.getByRole("button", { name: "Infopark" });
    await user.click(popularChip);

    expect(toInput).toHaveValue("Infopark");
    expect(screen.queryByRole("dialog", { name: /select to location/i })).not.toBeInTheDocument();
  });

  it("renders feature summary strip with 3 key commuter pillars", () => {
    renderHomePage();

    expect(screen.getByText("Verified Community & Safety")).toBeInTheDocument();
    expect(screen.getByText("Fixed Corridors & Guaranteed Seats")).toBeInTheDocument();
    expect(screen.getByText("Cut Costs & Emissions")).toBeInTheDocument();
    expect(screen.getByText("Employer & Tech Park verification")).toBeInTheDocument();
  });

  it("renders 'How CarPool Works' section with 3 steps", () => {
    renderHomePage();

    expect(screen.getByText(/simple daily workflow/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /how carpool works in 3 steps/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Search Your Route")).toBeInTheDocument();
    expect(screen.getByText("Book Instant or Schedule")).toBeInTheDocument();
    expect(screen.getByText("Ride & Relax")).toBeInTheDocument();
  });

  it("renders Trust & Safety standards and Dual CTA sections", () => {
    renderHomePage();

    expect(screen.getByText("Safety and Trust Built into Every Mile")).toBeInTheDocument();
    expect(screen.getByText("Government ID Vetting")).toBeInTheDocument();
    expect(screen.getByText("Live Corridor Tracking")).toBeInTheDocument();
    expect(screen.getByText("For Daily Commuters")).toBeInTheDocument();
    expect(screen.getByText("For Car Owners")).toBeInTheDocument();
  });
});
