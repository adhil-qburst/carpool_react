import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegisterPage from "./RegisterPage";
import { authApi } from "../api/auth.api";

vi.mock("../api/auth.api", () => ({
  authApi: { register: vi.fn() },
}));

function renderRegisterPage() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Alex Morgan");
  await user.type(screen.getByLabelText(/email address/i), "alex@example.com");
  await user.type(screen.getByLabelText(/^password$/i), "password123");
  await user.click(screen.getByRole("checkbox", { name: /driver/i }));
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.mocked(authApi.register).mockReset();
  });

  it("renders the Stitch Serene Transit elements, hero panel, and trust badges", () => {
    renderRegisterPage();

    expect(
      screen.getByText(/Shared journeys for smoother, greener daily commutes/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/142 kg CO₂/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Community/i)).toBeInTheDocument();
    expect(screen.getByText(/Govt. KYC Verified/i)).toBeInTheDocument();
    expect(screen.getByText(/0% Platform Fee/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 Ride SOS/i)).toBeInTheDocument();
    expect(screen.getByText(/256-bit SSL Encrypted Workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/Join CarPool Network/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("dynamically displays role guidance when toggling roles", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    // Initially neither guidance is shown
    expect(screen.queryByText(/Driver Onboarding Step 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Quick Passenger Setup/i)).not.toBeInTheDocument();

    // Select Driver
    await user.click(screen.getByRole("checkbox", { name: /driver/i }));
    expect(screen.getByText(/Driver Onboarding Step 1/i)).toBeInTheDocument();

    // Select Passenger / Rider
    await user.click(screen.getByRole("checkbox", { name: /rider/i }));
    expect(screen.getByText(/Quick Passenger Setup/i)).toBeInTheDocument();
  });

  it("toggles password visibility with show/hide button", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button", { name: /show password/i });
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();
  });

  it("shows validation errors and does not call the API when the form is empty", async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText("Enter your full name."),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Create a password.")).toBeInTheDocument();
    expect(
      screen.getByText("Choose how you plan to use Carpool."),
    ).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });

  it("registers the user and shows the verification modal on success", async () => {
    vi.mocked(authApi.register).mockResolvedValueOnce({
      id: "1",
      name: "Alex Morgan",
      email: "alex@example.com",
      roles: ["driver"],
    });
    const user = userEvent.setup();
    renderRegisterPage();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/check your inbox/i)).toBeInTheDocument();
    expect(screen.getByText("alex@example.com")).toBeInTheDocument();
    expect(authApi.register).toHaveBeenCalledWith({
      name: "Alex Morgan",
      email: "alex@example.com",
      password: "password123",
      roles: ["driver"],
    });
  });

  it("shows server validation errors returned by the API", async () => {
    vi.mocked(authApi.register).mockRejectedValueOnce({
      isAxiosError: true,
      message: "Validation failed",
      response: {
        status: 422,
        data: {
          detail: [
            {
              loc: ["body", "email"],
              msg: "Email already registered",
              type: "value_error",
            },
          ],
        },
      },
    });
    const user = userEvent.setup();
    renderRegisterPage();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText("Email already registered"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/check your inbox/i)).not.toBeInTheDocument();
  });

  it("shows a banner when the API rejects an already-registered user", async () => {
    vi.mocked(authApi.register).mockRejectedValueOnce({
      isAxiosError: true,
      message: "Request failed",
      response: {
        status: 503,
        data: {
          detail: "User is already registered. Please login with your email.",
        },
      },
    });
    const user = userEvent.setup();
    renderRegisterPage();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "User is already registered. Please login with your email.",
    );
    expect(screen.queryByText(/check your inbox/i)).not.toBeInTheDocument();
  });
});
