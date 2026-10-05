import { describe, expect, it } from "vitest";
import { bookingKeys } from "./bookingKeys";

describe("bookingKeys", () => {
  it("generates key hierarchy correctly", () => {
    expect(bookingKeys.all).toEqual(["bookings"]);
    expect(bookingKeys.lists()).toEqual(["bookings", "list"]);
    expect(bookingKeys.list({ page: 1 })).toEqual([
      "bookings",
      "list",
      { page: 1 },
    ]);
    expect(bookingKeys.details()).toEqual(["bookings", "detail"]);
    expect(bookingKeys.detail("b-123")).toEqual([
      "bookings",
      "detail",
      "b-123",
    ]);
  });
});
