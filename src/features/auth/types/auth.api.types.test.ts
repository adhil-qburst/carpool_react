import { describe, expect, it } from "vitest";
import { toApiRole } from "./auth.api.types";

describe("toApiRole", () => {
  it("lowercases UI role values for the API", () => {
    expect(toApiRole("Driver")).toBe("driver");
    expect(toApiRole("Rider")).toBe("rider");
  });
});
