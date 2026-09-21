import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotificationsPage from "./NotificationsPage";
import { notificationsApi } from "../api/notifications.api";
import type {
  PaginatedNotificationsResponse,
  NotificationResponse,
} from "../types/notifications.api.types";

vi.mock("../api/notifications.api", () => ({
  notificationsApi: {
    list: vi.fn(),
    getUnreadCount: vi.fn(),
    getById: vi.fn(),
  },
}));

const mockNotification1: NotificationResponse = {
  id: "notif-1",
  user_id: "user-100",
  title: "Ride Booking Confirmed",
  message: "Your ride from Downtown to Airport has been confirmed.",
  type: "booking_confirmation",
  status: "unread",
  is_read: false,
  read_at: null,
  data: { trip_id: "trip-999" },
  created_at: "2026-09-21T10:00:00Z",
  updated_at: "2026-09-21T10:00:00Z",
};

const mockNotification2: NotificationResponse = {
  id: "notif-2",
  user_id: "user-100",
  title: "Trip Schedule Updated",
  message: "Departure time has been moved to 09:30 AM.",
  type: "trip_updated",
  status: "read",
  is_read: true,
  read_at: "2026-09-21T11:00:00Z",
  data: null,
  created_at: "2026-09-21T09:00:00Z",
  updated_at: "2026-09-21T11:00:00Z",
};

const mockListResponse: PaginatedNotificationsResponse = {
  items: [mockNotification1, mockNotification2],
  page: 1,
  limit: 8,
  total: 2,
  unread_count: 1,
};

function renderNotificationsPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("NotificationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(notificationsApi.getUnreadCount).mockResolvedValue({
      unread_count: 1,
    });
  });

  it("renders notifications list and summary stats", async () => {
    vi.mocked(notificationsApi.list).mockResolvedValue(mockListResponse);

    renderNotificationsPage();

    expect(await screen.findByText("Ride Booking Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Trip Schedule Updated")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your ride from Downtown to Airport has been confirmed.",
      ),
    ).toBeInTheDocument();
  });

  it("renders empty state when there are no notifications", async () => {
    vi.mocked(notificationsApi.list).mockResolvedValue({
      items: [],
      page: 1,
      limit: 8,
      total: 0,
      unread_count: 0,
    });

    renderNotificationsPage();

    expect(await screen.findByText("No notifications")).toBeInTheDocument();
    expect(
      screen.getByText(
        /You are completely caught up! We will alert you here when new trip or booking updates occur./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders error state and handles retry", async () => {
    vi.mocked(notificationsApi.list)
      .mockRejectedValueOnce(new Error("Network Error"))
      .mockResolvedValueOnce(mockListResponse);

    renderNotificationsPage();

    expect(
      await screen.findByText("Failed to load notifications"),
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    const user = userEvent.setup();
    await user.click(retryBtn);

    expect(await screen.findByText("Ride Booking Confirmed")).toBeInTheDocument();
  });

  it("opens quick view modal when clicking Quick view button", async () => {
    vi.mocked(notificationsApi.list).mockResolvedValue(mockListResponse);

    renderNotificationsPage();

    expect(await screen.findByText("Ride Booking Confirmed")).toBeInTheDocument();

    const quickViewButtons = screen.getAllByRole("button", {
      name: /quick view/i,
    });
    const user = userEvent.setup();
    await user.click(quickViewButtons[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: "Ride Booking Confirmed" }),
    ).toBeInTheDocument();

    const closeBtn = within(dialog).getByRole("button", { name: /close/i });
    await user.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("filters notifications when clicking status filter tabs", async () => {
    vi.mocked(notificationsApi.list).mockResolvedValue(mockListResponse);

    renderNotificationsPage();

    const unreadTab = await screen.findByRole("button", { name: /unread/i });
    const user = userEvent.setup();
    await user.click(unreadTab);

    expect(notificationsApi.list).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "unread",
      }),
    );
  });
});
