import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./LoginPage";
import { authApi } from "../api/auth.api";

vi.mock("../api/auth.api", () => ({
  authApi: { login: vi.fn() },
}));

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(authApi.login).mockReset();
  });

  it("renders the Stitch Serene Transit elements, in-card branding, and trust badges", () => {
    renderLoginPage();

    expect(screen.getByRole("link", { name: /CarPool Home/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Shared Mobility/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Verified Hub/i)).toBeInTheDocument();

    expect(screen.getByText(/256-bit SSL Encryption/i)).toBeInTheDocument();
    expect(screen.getByText(/Government Guidelines Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 Transit Support/i)).toBeInTheDocument();
  });

  it("renders unified welcome headline and create account link", () => {
    renderLoginPage();

    expect(screen.getByRole("heading", { name: /Welcome back to CarPool/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In to CarPool/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create an account/i })).toBeInTheDocument();
  });

  it("shows validation errors and prevents API call on empty submit", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole("button", { name: /Sign In to CarPool/i }));

    expect(await screen.findByText("Enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it("toggles password visibility when clicking the eye button", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button", { name: /Show password/i });
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /Hide password/i })).toBeInTheDocument();
  });

  it("submits the form successfully and displays the success feedback", async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      access_token: "access-token-123",
      refresh_token: "refresh-token-456",
      token_type: "bearer",
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/Email Address/i), "passenger@example.com");
    await user.type(screen.getByLabelText(/^Password$/i), "securepassword");
    await user.click(screen.getByRole("button", { name: /Sign In to CarPool/i }));

    expect(authApi.login).toHaveBeenCalledWith({
      email: "passenger@example.com",
      password: "securepassword",
    });
    expect(await screen.findByRole("status")).toHaveTextContent(/Signed in/i);
  });

  it("shows server error messages when login fails", async () => {
    vi.mocked(authApi.login).mockRejectedValueOnce({
      isAxiosError: true,
      message: "Request failed",
      response: {
        status: 401,
        data: { detail: "Invalid email or password" },
      },
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/Email Address/i), "passenger@example.com");
    await user.type(screen.getByLabelText(/^Password$/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /Sign In to CarPool/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password");
  });
});
