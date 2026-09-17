import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import HomePage from "./HomePage";

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
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
        name: /people together for a greener tomorrow/i,
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
    const swapButton = screen.getByRole("button", { name: /swap locations/i });

    await user.type(fromInput, "Downtown");
    await user.type(toInput, "Airport");

    expect(fromInput).toHaveValue("Downtown");
    expect(toInput).toHaveValue("Airport");

    await user.click(swapButton);

    expect(fromInput).toHaveValue("Airport");
    expect(toInput).toHaveValue("Downtown");
  });

  it("renders feature summary strip with 4 key pillars", () => {
    renderHomePage();

    expect(screen.getByText("Travel with Confidence")).toBeInTheDocument();
    expect(screen.getByText("Make an Impact")).toBeInTheDocument();
    expect(screen.getByText("Verified users and secure bookings")).toBeInTheDocument();
    expect(screen.getByText("Reduce emissions and support sustainable travel")).toBeInTheDocument();
  });

  it("renders 'Why Choose CarPool' section with heading and 3 cards", () => {
    renderHomePage();

    expect(screen.getByText(/why choose carpool/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /more than just a ride/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lower your travel costs")).toBeInTheDocument();
    expect(screen.getByText("Reduce your carbon footprint")).toBeInTheDocument();
    expect(screen.getByText("Meet amazing people")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /learn more/i })).toBeInTheDocument();
  });
});
