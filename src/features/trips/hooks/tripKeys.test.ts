import { describe, expect, it } from "vitest";
import { tripKeys } from "./tripKeys";

describe("tripKeys", () => {
  it("generates root and hierarchical keys correctly", () => {
    expect(tripKeys.all).toEqual(["trips"]);
    expect(tripKeys.lists()).toEqual(["trips", "list"]);
    expect(tripKeys.list({ page: 1 })).toEqual(["trips", "list", { page: 1 }]);
    expect(tripKeys.searches()).toEqual(["trips", "search"]);
    expect(tripKeys.search({ source_location_id: "1" })).toEqual([
      "trips",
      "search",
      { source_location_id: "1" },
    ]);
    expect(tripKeys.details()).toEqual(["trips", "detail"]);
    expect(tripKeys.detail("123")).toEqual(["trips", "detail", "123"]);
    expect(tripKeys.passengers("123", { status: "confirmed" })).toEqual([
      "trips",
      "detail",
      "123",
      "passengers",
      { status: "confirmed" },
    ]);
    expect(tripKeys.driverRoutes()).toEqual(["trips", "driverRoutes"]);
    expect(tripKeys.driverVehicles()).toEqual(["trips", "driverVehicles"]);
  });
});
