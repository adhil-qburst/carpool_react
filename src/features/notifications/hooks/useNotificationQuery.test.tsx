import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications.api";
import type { NotificationResponse } from "../types/notifications.api.types";
import { useNotificationQuery } from "./useNotificationQuery";

vi.mock("../api/notifications.api", () => ({
  notificationsApi: {
    getById: vi.fn(),
  },
}));

const mockNotification: NotificationResponse = {
  id: "notif-1",
  user_id: "user-1",
  title: "Trip Updated",
  message: "Departure time updated for your trip.",
  type: "trip_updated",
  status: "read",
  is_read: true,
  read_at: "2026-09-21T12:00:00Z",
  data: { trip_id: "trip-99" },
  created_at: "2026-09-21T10:00:00Z",
  updated_at: "2026-09-21T12:00:00Z",
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useNotificationQuery", () => {
  beforeEach(() => {
    vi.mocked(notificationsApi.getById).mockReset();
  });

  it("fetches and returns a notification by id", async () => {
    vi.mocked(notificationsApi.getById).mockResolvedValueOnce(mockNotification);

    const { result } = renderHook(() => useNotificationQuery("notif-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockNotification);
    expect(notificationsApi.getById).toHaveBeenCalledWith("notif-1");
  });

  it("does not fetch when notificationId is empty", async () => {
    const { result } = renderHook(() => useNotificationQuery(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(notificationsApi.getById).not.toHaveBeenCalled();
  });

  it("handles fetch errors", async () => {
    const error = new Error("Notification not found");
    vi.mocked(notificationsApi.getById).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useNotificationQuery("notif-missing"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
