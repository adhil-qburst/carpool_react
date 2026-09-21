import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotificationDetailPage from "./NotificationDetailPage";
import { notificationsApi } from "../api/notifications.api";
import type { NotificationResponse } from "../types/notifications.api.types";

vi.mock("../api/notifications.api", () => ({
  notificationsApi: {
    list: vi.fn(),
    getUnreadCount: vi.fn(),
    getById: vi.fn(),
  },
}));

const mockNotification: NotificationResponse = {
  id: "notif-123",
  user_id: "user-456",
  title: "Ride Booking Confirmed",
  message: "Your seat for trip #trip-789 has been confirmed by the driver.",
  type: "booking_confirmation",
  status: "read",
  is_read: true,
  read_at: "2026-09-21T12:30:00Z",
  data: {
    trip_id: "trip-789",
    booking_id: "book-001",
  },
  created_at: "2026-09-21T12:00:00Z",
  updated_at: "2026-09-21T12:30:00Z",
};

function renderNotificationDetailPage(notificationId = "notif-123") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/notifications/${notificationId}`]}>
        <Routes>
          <Route
            path="/notifications/:notificationId"
            element={<NotificationDetailPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("NotificationDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders notification details with metadata and contextual links", async () => {
    vi.mocked(notificationsApi.getById).mockResolvedValue(mockNotification);

    renderNotificationDetailPage();

    expect(
      await screen.findByRole("heading", { name: "Ride Booking Confirmed" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your seat for trip #trip-789 has been confirmed by the driver.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("booking confirmation")).toBeInTheDocument();

    // Contextual links to trip and booking
    expect(
      screen.getByRole("link", { name: /view trip details/i }),
    ).toHaveAttribute("href", "/trips/trip-789");
    expect(
      screen.getByRole("link", { name: /view my bookings/i }),
    ).toHaveAttribute("href", "/bookings");
  });

  it("renders not found error when notification query fails", async () => {
    vi.mocked(notificationsApi.getById).mockRejectedValue(
      new Error("Notification not found"),
    );

    renderNotificationDetailPage("invalid-id");

    expect(
      await screen.findByText("Notification not found"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to notifications/i }),
    ).toHaveAttribute("href", "/notifications");
  });
});
