import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { notificationsApi } from "./notifications.api";
import type {
  ListNotificationsQueryParams,
  NotificationResponse,
  NotificationUnreadCountResponse,
  PaginatedNotificationsResponse,
} from "../types/notifications.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const mockNotificationResponse: NotificationResponse = {
  id: "notif-1",
  user_id: "user-1",
  title: "Trip Cancelled",
  message: "Trip 123 has been cancelled by driver.",
  type: "trip_cancelled",
  status: "unread",
  is_read: false,
  read_at: null,
  data: { trip_id: "trip-123" },
  created_at: "2026-09-21T10:00:00Z",
  updated_at: "2026-09-21T10:00:00Z",
};

const mockPaginatedResponse: PaginatedNotificationsResponse = {
  items: [mockNotificationResponse],
  page: 1,
  limit: 20,
  total: 1,
  unread_count: 1,
};

const mockUnreadCountResponse: NotificationUnreadCountResponse = {
  unread_count: 3,
};

describe("notificationsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("fetches the list of notifications with query params", async () => {
      const params: ListNotificationsQueryParams = {
        page: 1,
        limit: 20,
        is_read: false,
        status: "unread",
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        data: mockPaginatedResponse,
      });

      const result = await notificationsApi.list(params);

      expect(httpClient.get).toHaveBeenCalledWith("/api/v1/notifications", {
        params,
      });
      expect(result).toEqual(mockPaginatedResponse);
    });

    it("fetches the list of notifications without params", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        data: mockPaginatedResponse,
      });

      const result = await notificationsApi.list();

      expect(httpClient.get).toHaveBeenCalledWith("/api/v1/notifications", {
        params: undefined,
      });
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe("getUnreadCount", () => {
    it("fetches the unread notifications count", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        data: mockUnreadCountResponse,
      });

      const result = await notificationsApi.getUnreadCount();

      expect(httpClient.get).toHaveBeenCalledWith(
        "/api/v1/notifications/unread-count",
      );
      expect(result).toEqual(mockUnreadCountResponse);
    });
  });

  describe("getById", () => {
    it("fetches a single notification by id", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce({
        data: mockNotificationResponse,
      });

      const result = await notificationsApi.getById("notif-1");

      expect(httpClient.get).toHaveBeenCalledWith(
        "/api/v1/notifications/notif-1",
      );
      expect(result).toEqual(mockNotificationResponse);
    });
  });
});
