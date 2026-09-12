import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routesApi } from "../api/routes.api";
import type { PaginatedRoutesResponse } from "../types/routes.api.types";
import { useRoutesQuery } from "./useRoutesQuery";

vi.mock("../api/routes.api", () => ({
  routesApi: {
    list: vi.fn(),
  },
}));

const mockPaginatedRoutes: PaginatedRoutesResponse = {
  items: [
    {
      id: "route-1",
      name: "Commute Route",
      driver_id: "driver-1",
      route_stops: [
        {
          id: "stop-1",
          route_id: "route-1",
          location_id: "loc-1",
          sequence: 0,
        },
        {
          id: "stop-2",
          route_id: "route-1",
          location_id: "loc-2",
          sequence: 1,
        },
      ],
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

describe("useRoutesQuery", () => {
  beforeEach(() => {
    vi.mocked(routesApi.list).mockReset();
  });

  it("fetches and returns the paginated routes list", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce(mockPaginatedRoutes);

    const { result } = renderHook(() => useRoutesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPaginatedRoutes);
    expect(routesApi.list).toHaveBeenCalledWith(undefined);
  });

  it("passes pagination params to the API call", async () => {
    vi.mocked(routesApi.list).mockResolvedValueOnce(mockPaginatedRoutes);

    const params = { page: 2, limit: 10 };
    const { result } = renderHook(() => useRoutesQuery(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(routesApi.list).toHaveBeenCalledWith(params);
  });

  it("handles fetch errors", async () => {
    const error = new Error("Failed to load routes");
    vi.mocked(routesApi.list).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useRoutesQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
