import { describe, expect, it } from "vitest";
import { vehicleKeys } from "./vehicleKeys";

describe("vehicleKeys", () => {
  it("generates correct base all key", () => {
    expect(vehicleKeys.all).toEqual(["vehicles"]);
  });

  it("generates correct lists key", () => {
    expect(vehicleKeys.lists()).toEqual(["vehicles", "list"]);
  });

  it("generates correct details root key", () => {
    expect(vehicleKeys.details()).toEqual(["vehicles", "detail"]);
  });

  it("generates correct detail key with id", () => {
    expect(vehicleKeys.detail("veh-123")).toEqual([
      "vehicles",
      "detail",
      "veh-123",
    ]);
  });
});
