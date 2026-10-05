import { describe, expect, it } from "vitest";
import { routeKeys } from "./routeKeys";

describe("routeKeys", () => {
  it("generates correct base all key", () => {
    expect(routeKeys.all).toEqual(["routes"]);
  });

  it("generates correct lists key", () => {
    expect(routeKeys.lists()).toEqual(["routes", "list"]);
  });

  it("generates correct list key with filters", () => {
    const filters = { search: "City" };
    expect(routeKeys.list(filters)).toEqual(["routes", "list", filters]);
  });

  it("generates correct details root key", () => {
    expect(routeKeys.details()).toEqual(["routes", "detail"]);
  });

  it("generates correct detail key with id", () => {
    expect(routeKeys.detail("route-123")).toEqual([
      "routes",
      "detail",
      "route-123",
    ]);
  });
});
