import { describe, expect, it } from "vitest";
import { notificationKeys } from "./notificationKeys";

describe("notificationKeys", () => {
  it("generates correct base all key", () => {
    expect(notificationKeys.all).toEqual(["notifications"]);
  });

  it("generates correct lists root key", () => {
    expect(notificationKeys.lists()).toEqual(["notifications", "list"]);
  });

  it("generates correct list key with filters", () => {
    expect(
      notificationKeys.list({ page: 1, limit: 10, isRead: false }),
    ).toEqual([
      "notifications",
      "list",
      { page: 1, limit: 10, isRead: false },
    ]);
  });

  it("generates correct unreadCount key", () => {
    expect(notificationKeys.unreadCount()).toEqual([
      "notifications",
      "unread-count",
    ]);
  });

  it("generates correct details root key", () => {
    expect(notificationKeys.details()).toEqual(["notifications", "detail"]);
  });

  it("generates correct detail key with id", () => {
    expect(notificationKeys.detail("notif-123")).toEqual([
      "notifications",
      "detail",
      "notif-123",
    ]);
  });
});
