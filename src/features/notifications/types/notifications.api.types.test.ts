import { describe, expect, it } from "vitest";
import type {
  NotificationResponse,
  PaginatedNotificationsResponse,
} from "./notifications.api.types";
import {
  toListNotificationsQueryParams,
  toNotification,
  toNotificationUnreadCount,
  toPaginatedNotifications,
} from "./notifications.api.types";

const mockNotificationResponse: NotificationResponse = {
  id: "notif-1",
  user_id: "user-1",
  title: "Booking Confirmed",
  message: "Your booking for trip 123 is confirmed.",
  type: "booking_confirmation",
  status: "unread",
  is_read: false,
  read_at: null,
  data: { trip_id: "trip-123" },
  created_at: "2026-09-21T10:00:00Z",
  updated_at: "2026-09-21T10:00:00Z",
};

describe("notifications.api.types mappers", () => {
  describe("toNotification", () => {
    it("maps NotificationResponse DTO to Notification domain entity correctly", () => {
      const entity = toNotification(mockNotificationResponse);

      expect(entity).toEqual({
        id: "notif-1",
        userId: "user-1",
        title: "Booking Confirmed",
        message: "Your booking for trip 123 is confirmed.",
        type: "booking_confirmation",
        status: "unread",
        isRead: false,
        readAt: null,
        data: { trip_id: "trip-123" },
        createdAt: "2026-09-21T10:00:00Z",
        updatedAt: "2026-09-21T10:00:00Z",
      });
    });

    it("handles null data and defined read_at properly", () => {
      const dto: NotificationResponse = {
        ...mockNotificationResponse,
        status: "read",
        is_read: true,
        read_at: "2026-09-21T11:00:00Z",
        data: null,
      };

      const entity = toNotification(dto);

      expect(entity.status).toBe("read");
      expect(entity.isRead).toBe(true);
      expect(entity.readAt).toBe("2026-09-21T11:00:00Z");
      expect(entity.data).toBeNull();
    });
  });

  describe("toPaginatedNotifications", () => {
    it("maps PaginatedNotificationsResponse DTO to PaginatedNotifications", () => {
      const paginatedDto: PaginatedNotificationsResponse = {
        items: [mockNotificationResponse],
        page: 1,
        limit: 20,
        total: 1,
        unread_count: 1,
      };

      const result = toPaginatedNotifications(paginatedDto);

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.total).toBe(1);
      expect(result.unreadCount).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.id).toBe("notif-1");
      expect(result.items[0]?.userId).toBe("user-1");
    });
  });

  describe("toNotificationUnreadCount", () => {
    it("maps unread_count response correctly", () => {
      const result = toNotificationUnreadCount({ unread_count: 5 });
      expect(result).toEqual({ unreadCount: 5 });
    });
  });

  describe("toListNotificationsQueryParams", () => {
    it("returns empty object when no filters provided", () => {
      expect(toListNotificationsQueryParams()).toEqual({});
      expect(toListNotificationsQueryParams(undefined)).toEqual({});
    });

    it("maps defined filter fields to snake_case query params", () => {
      const params = toListNotificationsQueryParams({
        page: 2,
        limit: 10,
        isRead: false,
        status: "unread",
        type: "booking_request",
      });

      expect(params).toEqual({
        page: 2,
        limit: 10,
        is_read: false,
        status: "unread",
        type: "booking_request",
      });
    });
  });
});
