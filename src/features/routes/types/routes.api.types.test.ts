import { describe, expect, it } from "vitest";
import {
  toCreateRouteRequest,
  toPaginatedRoutes,
  toRoute,
  toRouteStop,
  toUpdateRouteRequest,
} from "./routes.api.types";
import type {
  CreateRouteRequest,
  PaginatedRoutesResponse,
  RouteResponse,
  RouteStopResponse,
  UpdateRouteRequest,
} from "./routes.api.types";
import type { CreateRouteForm, UpdateRouteForm } from "./routes.type";

describe("routes.api.types mappers", () => {
  describe("toCreateRouteRequest", () => {
    it("transforms CreateRouteForm to CreateRouteRequest with trimmed strings and numeric stop sequences", () => {
      const form: CreateRouteForm = {
        name: "  Daily Office Route  ",
        sourceId: "  loc-src-1  ",
        destId: "  loc-dst-2  ",
        stops: [
          {
            stopId: "  loc-stop-1  ",
            sequence: "1",
          },
          {
            stopId: "loc-stop-2",
            sequence: 2,
          },
        ],
      };

      const result = toCreateRouteRequest(form);

      expect(result).toEqual({
        name: "Daily Office Route",
        source_id: "loc-src-1",
        dest_id: "loc-dst-2",
        stops: [
          {
            stop_id: "loc-stop-1",
            sequence: 1,
          },
          {
            stop_id: "loc-stop-2",
            sequence: 2,
          },
        ],
      });
    });

    it("handles null or undefined stops in CreateRouteForm", () => {
      const form: CreateRouteForm = {
        name: "Express Route",
        sourceId: "loc-src",
        destId: "loc-dst",
      };

      const result = toCreateRouteRequest(form);

      expect(result).toEqual({
        name: "Express Route",
        source_id: "loc-src",
        dest_id: "loc-dst",
        stops: null,
      });
    });

    it("returns the object directly when passed a raw CreateRouteRequest", () => {
      const rawRequest: CreateRouteRequest = {
        name: "Airport Link",
        source_id: "loc-1",
        dest_id: "loc-2",
        stops: [{ stop_id: "loc-3", sequence: 1 }],
      };

      const result = toCreateRouteRequest(rawRequest);

      expect(result).toBe(rawRequest);
    });
  });

  describe("toRouteStop", () => {
    it("maps RouteStopResponse to camelCase RouteStop", () => {
      const dto: RouteStopResponse = {
        id: "stop-1",
        route_id: "route-1",
        location_id: "loc-1",
        sequence: 0,
      };

      const result = toRouteStop(dto);

      expect(result).toEqual({
        id: "stop-1",
        routeId: "route-1",
        locationId: "loc-1",
        sequence: 0,
      });
    });
  });

  describe("toRoute", () => {
    it("maps RouteResponse to camelCase Route including route stops", () => {
      const dto: RouteResponse = {
        id: "route-100",
        name: "North Corridor",
        driver_id: "driver-5",
        route_stops: [
          {
            id: "stop-1",
            route_id: "route-100",
            location_id: "loc-src",
            sequence: 0,
          },
          {
            id: "stop-2",
            route_id: "route-100",
            location_id: "loc-dest",
            sequence: 1,
          },
        ],
      };

      const result = toRoute(dto);

      expect(result).toEqual({
        id: "route-100",
        name: "North Corridor",
        driverId: "driver-5",
        routeStops: [
          {
            id: "stop-1",
            routeId: "route-100",
            locationId: "loc-src",
            sequence: 0,
          },
          {
            id: "stop-2",
            routeId: "route-100",
            locationId: "loc-dest",
            sequence: 1,
          },
        ],
      });
    });
  });

  describe("toUpdateRouteRequest", () => {
    it("transforms UpdateRouteForm to UpdateRouteRequest with trimmed strings and formatted stops", () => {
      const form: UpdateRouteForm = {
        name: "  Updated Commute  ",
        sourceId: "  loc-src-1  ",
        destId: "  loc-dst-2  ",
        stops: [
          {
            stopId: "  loc-stop-1  ",
            sequence: "1",
          },
          {
            locationId: "  loc-stop-2  ",
            sequence: 2,
          },
        ],
      };

      const result = toUpdateRouteRequest(form);

      expect(result).toEqual({
        name: "Updated Commute",
        source_id: "loc-src-1",
        dest_id: "loc-dst-2",
        stops: [
          {
            stop_id: "loc-stop-1",
            sequence: 1,
          },
          {
            location_id: "loc-stop-2",
            sequence: 2,
          },
        ],
      });
    });

    it("handles null or undefined stops in UpdateRouteForm", () => {
      const form: UpdateRouteForm = {
        name: "Direct Route",
        sourceId: "loc-src",
        destId: "loc-dst",
      };

      const result = toUpdateRouteRequest(form);

      expect(result).toEqual({
        name: "Direct Route",
        source_id: "loc-src",
        dest_id: "loc-dst",
        stops: null,
      });
    });

    it("returns the object directly when passed a raw UpdateRouteRequest", () => {
      const rawRequest: UpdateRouteRequest = {
        name: "Express Route",
        source_id: "loc-1",
        dest_id: "loc-2",
        stops: [{ stop_id: "loc-3", sequence: 1 }],
      };

      const result = toUpdateRouteRequest(rawRequest);

      expect(result).toBe(rawRequest);
    });
  });

  describe("toPaginatedRoutes", () => {
    it("transforms PaginatedRoutesResponse to PaginatedRoutes domain object", () => {
      const dto: PaginatedRoutesResponse = {
        items: [
          {
            id: "route-1",
            name: "Route A",
            driver_id: "driver-1",
            route_stops: [
              {
                id: "stop-1",
                route_id: "route-1",
                location_id: "loc-1",
                sequence: 0,
              },
            ],
          },
        ],
        page: 2,
        limit: 10,
        total: 25,
      };

      const result = toPaginatedRoutes(dto);

      expect(result).toEqual({
        items: [
          {
            id: "route-1",
            name: "Route A",
            driverId: "driver-1",
            routeStops: [
              {
                id: "stop-1",
                routeId: "route-1",
                locationId: "loc-1",
                sequence: 0,
              },
            ],
          },
        ],
        page: 2,
        limit: 10,
        total: 25,
      });
    });

    it("handles empty items array gracefully", () => {
      const dto: PaginatedRoutesResponse = {
        items: [],
        page: 1,
        limit: 20,
        total: 0,
      };

      const result = toPaginatedRoutes(dto);

      expect(result).toEqual({
        items: [],
        page: 1,
        limit: 20,
        total: 0,
      });
    });
  });
});

