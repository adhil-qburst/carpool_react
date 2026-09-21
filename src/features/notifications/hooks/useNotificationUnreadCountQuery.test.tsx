import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications.api";
import type { NotificationUnreadCountResponse } from "../types/notifications.api.types";
import { useNotificationUnreadCountQuery } from "./useNotificationUnreadCountQuery";

vi.mock("../api/notifications.api", () => ({
  notificationsApi: {
    getUnreadCount: vi.fn(),
  },
}));

const mockUnreadCount: NotificationUnreadCountResponse = {
  unread_count: 5,
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

describe("useNotificationUnreadCountQuery", () => {
  beforeEach(() => {
    vi.mocked(notificationsApi.getUnreadCount).mockReset();
  });

  it("fetches and returns the unread count", async () => {
    vi.mocked(notificationsApi.getUnreadCount).mockResolvedValueOnce(
      mockUnreadCount,
    );

    const { result } = renderHook(() => useNotificationUnreadCountQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUnreadCount);
    expect(notificationsApi.getUnreadCount).toHaveBeenCalledTimes(1);
  });

  it("handles fetch errors", async () => {
    const error = new Error("Failed to load unread count");
    vi.mocked(notificationsApi.getUnreadCount).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useNotificationUnreadCountQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
