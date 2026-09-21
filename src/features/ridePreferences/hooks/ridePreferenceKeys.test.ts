import { describe, expect, it } from "vitest";
import { ridePreferenceKeys } from "./ridePreferenceKeys";

describe("ridePreferenceKeys", () => {
  it("generates correct base all key", () => {
    expect(ridePreferenceKeys.all).toEqual(["ridePreferences"]);
  });

  it("generates correct lists key", () => {
    expect(ridePreferenceKeys.lists()).toEqual(["ridePreferences", "list"]);
  });

  it("generates correct list key with filters", () => {
    expect(ridePreferenceKeys.list({ activeOnly: true })).toEqual([
      "ridePreferences",
      "list",
      { activeOnly: true },
    ]);
  });

  it("generates correct matches key with filters", () => {
    expect(
      ridePreferenceKeys.matches({
        sourceLocationId: "loc-1",
        destinationLocationId: "loc-2",
      }),
    ).toEqual([
      "ridePreferences",
      "matches",
      {
        sourceLocationId: "loc-1",
        destinationLocationId: "loc-2",
      },
    ]);
  });

  it("generates correct details root key", () => {
    expect(ridePreferenceKeys.details()).toEqual([
      "ridePreferences",
      "detail",
    ]);
  });

  it("generates correct detail key with id", () => {
    expect(ridePreferenceKeys.detail("pref-123")).toEqual([
      "ridePreferences",
      "detail",
      "pref-123",
    ]);
  });
});
