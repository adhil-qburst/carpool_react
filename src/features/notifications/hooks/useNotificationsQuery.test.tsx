import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications.api";
import type { PaginatedNotificationsResponse } from "../types/notifications.api.types";
import { useNotificationsQuery } from "./useNotificationsQuery";

vi.mock("../api/notifications.api", () => ({
  notificationsApi: {
    list: vi.fn(),
  },
}));

const mockPaginatedNotifications: PaginatedNotificationsResponse = {
  items: [
    {
      id: "notif-1",
      user_id: "user-1",
      title: "Booking Request",
      message: "New passenger booked a seat.",
      type: "booking_request",
      status: "unread",
      is_read: false,
      read_at: null,
      data: { booking_id: "book-1" },
      created_at: "2026-09-21T10:00:00Z",
      updated_at: "2026-09-21T10:00:00Z",
    },
  ],
  page: 1,
  limit: 20,
  total: 1,
  unread_count: 1,
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

describe("useNotificationsQuery", () => {
  beforeEach(() => {
    vi.mocked(notificationsApi.list).mockReset();
  });

  it("fetches and returns the paginated notifications list", async () => {
    vi.mocked(notificationsApi.list).mockResolvedValueOnce(
      mockPaginatedNotifications,
    );

    const { result } = renderHook(() => useNotificationsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPaginatedNotifications);
    expect(notificationsApi.list).toHaveBeenCalledWith(undefined);
  });

  it("passes pagination and filter params to the API call", async () => {
    vi.mocked(notificationsApi.list).mockResolvedValueOnce(
      mockPaginatedNotifications,
    );

    const params = { page: 2, limit: 10, is_read: false, status: "unread" as const };
    const { result } = renderHook(() => useNotificationsQuery(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(notificationsApi.list).toHaveBeenCalledWith(params);
  });

  it("handles fetch errors", async () => {
    const error = new Error("Failed to load notifications");
    vi.mocked(notificationsApi.list).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useNotificationsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
