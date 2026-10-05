import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routesApi } from "../api/routes.api";
import { routeKeys } from "./routeKeys";
import { useUpdateRouteMutation } from "./useUpdateRouteMutation";
import type {
  RouteResponse,
  UpdateRouteRequest,
} from "../types/routes.api.types";
import type { UpdateRouteForm } from "../types/routes.type";

vi.mock("../api/routes.api", () => ({
  routesApi: {
    update: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockRouteResponse: RouteResponse = {
  id: "route-1",
  name: "Updated Commute",
  driver_id: "driver-1",
  route_stops: [
    {
      id: "stop-1",
      route_id: "route-1",
      location_id: "loc-src",
      sequence: 0,
    },
    {
      id: "stop-2",
      route_id: "route-1",
      location_id: "loc-dest",
      sequence: 1,
    },
  ],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return {
    queryClient,
    wrapper: function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  };
}

describe("useUpdateRouteMutation", () => {
  beforeEach(() => {
    vi.mocked(routesApi.update).mockReset();
    vi.mocked(routesApi.patch).mockReset();
  });

  it("submits an UpdateRouteForm via default patch method, transforms fields and invalidates queries", async () => {
    vi.mocked(routesApi.patch).mockResolvedValueOnce(mockRouteResponse);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateRouteMutation(), {
      wrapper,
    });

    const form: UpdateRouteForm = {
      name: "  Updated Commute  ",
      sourceId: "  loc-src  ",
      destId: "  loc-dest  ",
      stops: [
        {
          stopId: "  loc-mid  ",
          sequence: "1",
        },
      ],
    };

    result.current.mutate({
      routeId: "route-1",
      payload: form,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(routesApi.patch).toHaveBeenCalledWith("route-1", {
      name: "Updated Commute",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: [
        {
          stop_id: "loc-mid",
          sequence: 1,
        },
      ],
    });
    expect(routesApi.update).not.toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: routeKeys.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: routeKeys.detail("route-1"),
    });
  });

  it("submits an UpdateRouteForm via explicit put method", async () => {
    vi.mocked(routesApi.update).mockResolvedValueOnce(mockRouteResponse);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useUpdateRouteMutation(), {
      wrapper,
    });

    const form: UpdateRouteForm = {
      name: "Put Commute",
      sourceId: "loc-src",
      destId: "loc-dest",
      stops: null,
    };

    result.current.mutate({
      routeId: "route-1",
      payload: form,
      method: "put",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(routesApi.update).toHaveBeenCalledWith("route-1", {
      name: "Put Commute",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: null,
    });
    expect(routesApi.patch).not.toHaveBeenCalled();
  });

  it("submits a raw UpdateRouteRequest directly", async () => {
    vi.mocked(routesApi.patch).mockResolvedValueOnce(mockRouteResponse);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useUpdateRouteMutation(), {
      wrapper,
    });

    const request: UpdateRouteRequest = {
      name: "Direct Route",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: null,
    };

    result.current.mutate({
      routeId: "route-1",
      payload: request,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(routesApi.patch).toHaveBeenCalledWith("route-1", {
      name: "Direct Route",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: null,
    });
  });

  it("handles route update errors", async () => {
    const error = new Error("Route update failed");
    vi.mocked(routesApi.patch).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useUpdateRouteMutation(), {
      wrapper,
    });

    result.current.mutate({
      routeId: "route-1",
      payload: {
        name: "Failing Route",
        sourceId: "loc-src",
        destId: "loc-dest",
      },
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
