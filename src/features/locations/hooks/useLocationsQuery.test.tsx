import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { locationsApi } from "../api/locations.api";
import type { PaginatedLocationsResponse } from "../types/locations.api.types";
import { useLocationsQuery } from "./useLocationsQuery";

vi.mock("../api/locations.api", () => ({
  locationsApi: {
    list: vi.fn(),
  },
}));

const mockPaginatedLocations: PaginatedLocationsResponse = {
  items: [
    {
      id: "loc-1",
      name: "Central Station",
      city: "Kochi",
      lat: "9.9816",
      lng: "76.2999",
      status: "active",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
  ],
  page: 1,
  limit: 20,
  total: 1,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useLocationsQuery", () => {
  beforeEach(() => {
    vi.mocked(locationsApi.list).mockReset();
  });

  it("fetches and returns the paginated locations list", async () => {
    vi.mocked(locationsApi.list).mockResolvedValueOnce(mockPaginatedLocations);

    const { result } = renderHook(() => useLocationsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPaginatedLocations);
    expect(locationsApi.list).toHaveBeenCalledWith(undefined);
  });

  it("passes search params to the API call", async () => {
    vi.mocked(locationsApi.list).mockResolvedValueOnce(mockPaginatedLocations);

    const params = { search: "Central", page: 1, limit: 10 };
    const { result } = renderHook(() => useLocationsQuery(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(locationsApi.list).toHaveBeenCalledWith(params);
  });

  it("handles fetch errors", async () => {
    const error = new Error("Failed to fetch locations");
    vi.mocked(locationsApi.list).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useLocationsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
