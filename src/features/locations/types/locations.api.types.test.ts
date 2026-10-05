import { describe, expect, it } from "vitest";
import {
  toCreateLocationRequest,
  toLocation,
} from "./locations.api.types";
import type { LocationResponse } from "./locations.api.types";
import type { CreateLocationForm } from "./locations.type";

describe("toCreateLocationRequest", () => {
  it("trims name and city, keeps status and numeric coordinates", () => {
    const form: CreateLocationForm = {
      name: "  Central Station  ",
      city: "  Kochi  ",
      lat: 9.9816,
      lng: 76.2999,
      status: "active",
    };

    const result = toCreateLocationRequest(form);

    expect(result).toEqual({
      name: "Central Station",
      city: "Kochi",
      lat: 9.9816,
      lng: 76.2999,
      status: "active",
    });
  });

  it("defaults status to active when not provided", () => {
    const form: CreateLocationForm = {
      name: "Airport",
      city: "Nedumbassery",
    };

    const result = toCreateLocationRequest(form);

    expect(result).toEqual({
      name: "Airport",
      city: "Nedumbassery",
      lat: null,
      lng: null,
      status: "active",
    });
  });

  it("handles string coordinates, trimming and converting empty strings to null", () => {
    const form: CreateLocationForm = {
      name: "InfoPark",
      city: "Kakkanad",
      lat: "  9.9816  ",
      lng: "   ",
      status: "inactive",
    };

    const result = toCreateLocationRequest(form);

    expect(result).toEqual({
      name: "InfoPark",
      city: "Kakkanad",
      lat: "9.9816",
      lng: null,
      status: "inactive",
    });
  });
});

describe("toLocation", () => {
  it("maps wire response to camelCase domain model", () => {
    const dto: LocationResponse = {
      id: "loc-123",
      name: "Central Station",
      city: "Kochi",
      lat: "9.9816",
      lng: "76.2999",
      status: "active",
      created_at: "2026-01-01T12:00:00Z",
      updated_at: "2026-01-02T12:00:00Z",
    };

    const result = toLocation(dto);

    expect(result).toEqual({
      id: "loc-123",
      name: "Central Station",
      city: "Kochi",
      lat: "9.9816",
      lng: "76.2999",
      status: "active",
      createdAt: "2026-01-01T12:00:00Z",
      updatedAt: "2026-01-02T12:00:00Z",
    });
  });
});
