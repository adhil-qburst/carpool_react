import { describe, expect, it } from "vitest";
import {
  toCreateRidePreferenceRequest,
  toRidePreference,
  toUpdateRidePreferenceRequest,
} from "./ridePreferences.api.types";
import type {
  CreateRidePreferenceForm,
  UpdateRidePreferenceForm,
} from "./ridePreferences.type";
import type { RidePreferenceResponse } from "./ridePreferences.api.types";

describe("Ride Preferences Types and Mappers", () => {
  describe("toCreateRidePreferenceRequest", () => {
    it("converts form data to request payload with trimmed strings", () => {
      const form: CreateRidePreferenceForm = {
        sourceLocationId: " loc-1 ",
        destinationLocationId: " loc-2 ",
        preferredDepartureTime: " 08:30:00 ",
        seatsNeeded: "2",
        isActive: true,
        label: " Work Commute ",
      };

      const result = toCreateRidePreferenceRequest(form);

      expect(result).toEqual({
        source_location_id: "loc-1",
        destination_location_id: "loc-2",
        preferred_departure_time: "08:30:00",
        seats_needed: 2,
        is_active: true,
        label: "Work Commute",
      });
    });

    it("handles minimal form data with empty or omitted optional fields", () => {
      const form: CreateRidePreferenceForm = {
        sourceLocationId: "loc-1",
        destinationLocationId: "loc-2",
        preferredDepartureTime: "",
        label: "",
      };

      const result = toCreateRidePreferenceRequest(form);

      expect(result).toEqual({
        source_location_id: "loc-1",
        destination_location_id: "loc-2",
        preferred_departure_time: null,
        label: null,
      });
    });
  });

  describe("toUpdateRidePreferenceRequest", () => {
    it("converts partial update form correctly", () => {
      const form: UpdateRidePreferenceForm = {
        seatsNeeded: 3,
        isActive: false,
        label: " Weekend Trip ",
      };

      const result = toUpdateRidePreferenceRequest(form);

      expect(result).toEqual({
        seats_needed: 3,
        is_active: false,
        label: "Weekend Trip",
      });
    });

    it("handles null values for clearing optional fields", () => {
      const form: UpdateRidePreferenceForm = {
        preferredDepartureTime: null,
        label: null,
      };

      const result = toUpdateRidePreferenceRequest(form);

      expect(result).toEqual({
        preferred_departure_time: null,
        label: null,
      });
    });
  });

  describe("toRidePreference", () => {
    it("maps snake_case response to camelCase domain model with nested objects", () => {
      const dto: RidePreferenceResponse = {
        id: "pref-1",
        rider_id: "user-1",
        source_location_id: "loc-1",
        destination_location_id: "loc-2",
        preferred_departure_time: "09:00:00",
        seats_needed: 1,
        is_active: true,
        label: "Morning",
        created_at: "2026-09-21T08:00:00Z",
        updated_at: "2026-09-21T08:00:00Z",
        source: {
          id: "loc-1",
          name: "Downtown",
          city: "Metropolis",
          lat: "10.0",
          lng: "20.0",
          status: "active",
          created_at: "2026-09-21T08:00:00Z",
          updated_at: "2026-09-21T08:00:00Z",
        },
        destination: null,
        rider: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          roles: ["rider"],
        },
      };

      const result = toRidePreference(dto);

      expect(result).toEqual({
        id: "pref-1",
        riderId: "user-1",
        sourceLocationId: "loc-1",
        destinationLocationId: "loc-2",
        preferredDepartureTime: "09:00:00",
        seatsNeeded: 1,
        isActive: true,
        label: "Morning",
        createdAt: "2026-09-21T08:00:00Z",
        updatedAt: "2026-09-21T08:00:00Z",
        source: {
          id: "loc-1",
          name: "Downtown",
          city: "Metropolis",
          lat: "10.0",
          lng: "20.0",
          status: "active",
          createdAt: "2026-09-21T08:00:00Z",
          updatedAt: "2026-09-21T08:00:00Z",
        },
        destination: null,
        rider: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          roles: ["rider"],
        },
      });
    });
  });
});
