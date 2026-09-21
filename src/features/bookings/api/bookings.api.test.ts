import { describe, expect, it, vi, beforeEach } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { bookingsApi } from "./bookings.api";
import type {
  BookingResponse,
  CreateBookingRequest,
  PaginatedBookingsResponse,
} from "../types/bookings.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockPickupStop = {
  id: "stop-pickup-1",
  route_id: "route-1",
  location_id: "loc-1",
  sequence: 1,
  location: {
    id: "loc-1",
    name: "Downtown Terminal",
    city: "San Francisco",
    status: "active",
    created_at: "2026-09-20T10:00:00Z",
    updated_at: "2026-09-20T10:00:00Z",
  },
};

const mockDropoffStop = {
  id: "stop-dropoff-2",
  route_id: "route-1",
  location_id: "loc-2",
  sequence: 3,
  location: {
    id: "loc-2",
    name: "Uptown Plaza",
    city: "San Francisco",
    status: "active",
    created_at: "2026-09-20T10:00:00Z",
    updated_at: "2026-09-20T10:00:00Z",
  },
};

const mockBookingResponse: BookingResponse = {
  id: "b-123",
  rider_id: "rider-456",
  trip_id: "trip-789",
  pickup_stop_id: "stop-pickup-1",
  dropoff_stop_id: "stop-dropoff-2",
  seats_booked: 2,
  status: "pending",
  pickup_stop: mockPickupStop,
  dropoff_stop: mockDropoffStop,
  created_at: "2026-09-20T10:00:00Z",
  updated_at: "2026-09-20T10:00:00Z",
};

const mockPaginatedBookings: PaginatedBookingsResponse = {
  items: [mockBookingResponse],
  page: 1,
  limit: 20,
  total: 1,
};

describe("bookingsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a booking by posting to /api/v1/bookings", async () => {
    const payload: CreateBookingRequest = {
      trip_id: "trip-789",
      pickup_stop_id: "stop-pickup-1",
      dropoff_stop_id: "stop-dropoff-2",
      seats_booked: 2,
    };

    vi.mocked(httpClient.post).mockResolvedValueOnce({
      data: mockBookingResponse,
    });

    const result = await bookingsApi.create(payload);

    expect(httpClient.post).toHaveBeenCalledWith("/api/v1/bookings", payload);
    expect(result).toEqual(mockBookingResponse);
  });

  it("lists bookings by getting /api/v1/bookings with params", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: mockPaginatedBookings,
    });

    const params = { page: 2, limit: 10, status: "pending" as const };
    const result = await bookingsApi.list(params);

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/bookings", {
      params,
    });
    expect(result).toEqual(mockPaginatedBookings);
  });

  it("gets a booking by id by getting /api/v1/bookings/:booking_id", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: mockBookingResponse,
    });

    const result = await bookingsApi.getById("b-123");

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/bookings/b-123");
    expect(result).toEqual(mockBookingResponse);
  });

  it("deletes a booking by deleting /api/v1/bookings/:booking_id", async () => {
    vi.mocked(httpClient.delete).mockResolvedValueOnce({ data: undefined });

    await bookingsApi.delete("b-123");

    expect(httpClient.delete).toHaveBeenCalledWith("/api/v1/bookings/b-123");
  });
});
