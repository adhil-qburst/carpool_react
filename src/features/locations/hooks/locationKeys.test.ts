import { describe, expect, it } from "vitest";
import { locationKeys } from "./locationKeys";

describe("locationKeys", () => {
  it("generates correct base all key", () => {
    expect(locationKeys.all).toEqual(["locations"]);
  });

  it("generates correct lists key", () => {
    expect(locationKeys.lists()).toEqual(["locations", "list"]);
  });

  it("generates correct list key with filters", () => {
    const filters = { search: "Metro", page: 1, limit: 10 };
    expect(locationKeys.list(filters)).toEqual([
      "locations",
      "list",
      filters,
    ]);
  });

  it("generates correct details root key", () => {
    expect(locationKeys.details()).toEqual(["locations", "detail"]);
  });

  it("generates correct detail key with id", () => {
    expect(locationKeys.detail("loc-123")).toEqual([
      "locations",
      "detail",
      "loc-123",
    ]);
  });
});
