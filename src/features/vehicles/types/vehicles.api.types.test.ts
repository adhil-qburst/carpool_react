import { describe, expect, it } from "vitest";
import {
  toCreateVehicleRequest,
  toUpdateVehicleRequest,
} from "./vehicles.api.types";
import type { CreateVehicleForm, UpdateVehicleForm } from "./vehicles.type";

describe("toCreateVehicleRequest", () => {
  it("trims fields, converts registration to uppercase, and converts totalSeats to number", () => {
    const form: CreateVehicleForm = {
      make: "  Toyota  ",
      model: "  Prius  ",
      registrationNumber: "  kl-07-cd-1234  ",
      totalSeats: "4",
    };

    const result = toCreateVehicleRequest(form);

    expect(result).toEqual({
      make: "Toyota",
      model: "Prius",
      registration_number: "KL-07-CD-1234",
      total_seats: 4,
    });
  });
});

describe("toUpdateVehicleRequest", () => {
  it("maps partially provided values and normalizes strings and numbers", () => {
    const form: UpdateVehicleForm = {
      make: "  Honda ",
      totalSeats: "5",
    };

    const result = toUpdateVehicleRequest(form);

    expect(result).toEqual({
      make: "Honda",
      total_seats: 5,
    });
  });

  it("handles null and undefined values properly", () => {
    const form: UpdateVehicleForm = {
      make: null,
      model: null,
      totalSeats: null,
      registrationNumber: "  kl-01-ab-9999  ",
    };

    const result = toUpdateVehicleRequest(form);

    expect(result).toEqual({
      make: null,
      model: null,
      total_seats: null,
      registration_number: "KL-01-AB-9999",
    });
  });

  it("handles model trimming and empty form", () => {
    const withModel = toUpdateVehicleRequest({ model: "  Civic  " });
    expect(withModel).toEqual({ model: "Civic" });

    const empty = toUpdateVehicleRequest({});
    expect(empty).toEqual({});
  });
});
