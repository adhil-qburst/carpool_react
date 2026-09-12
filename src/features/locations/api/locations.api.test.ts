import { describe, expect, it, vi, beforeEach } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { locationsApi } from "./locations.api";
import type {
  CreateLocationRequest,
  LocationResponse,
  PaginatedLocationsResponse,
  SearchLocationsQueryParams,
} from "../types/locations.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockLocationResponse: LocationResponse = {
  id: "loc-1",
  name: "Central Station",
  city: "Kochi",
  lat: "9.9816",
  lng: "76.2999",
  status: "active",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const mockPaginatedResponse: PaginatedLocationsResponse = {
  items: [mockLocationResponse],
  page: 1,
  limit: 20,
  total: 1,
};

describe("locationsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches paginated locations without params", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: mockPaginatedResponse,
    });

    const result = await locationsApi.list();

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/locations", {
      params: undefined,
    });
    expect(result).toEqual(mockPaginatedResponse);
  });

  it("fetches paginated locations with query params", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      data: mockPaginatedResponse,
    });

    const params: SearchLocationsQueryParams = {
      search: "Central",
      page: 2,
      limit: 10,
      status: "active",
    };

    const result = await locationsApi.list(params);

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/locations", {
      params,
    });
    expect(result).toEqual(mockPaginatedResponse);
  });

  it("creates a new location", async () => {
    const payload: CreateLocationRequest = {
      name: "Central Station",
      city: "Kochi",
      lat: 9.9816,
      lng: 76.2999,
      status: "active",
    };

    vi.mocked(httpClient.post).mockResolvedValueOnce({
      data: mockLocationResponse,
    });

    const result = await locationsApi.create(payload);

    expect(httpClient.post).toHaveBeenCalledWith("/api/v1/locations", payload);
    expect(result).toEqual(mockLocationResponse);
  });
});
