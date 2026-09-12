import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routesApi } from "../api/routes.api";
import { routeKeys } from "./routeKeys";
import { useCreateRouteMutation } from "./useCreateRouteMutation";
import type {
  CreateRouteRequest,
  RouteResponse,
} from "../types/routes.api.types";
import type { CreateRouteForm } from "../types/routes.type";

vi.mock("../api/routes.api", () => ({
  routesApi: {
    create: vi.fn(),
  },
}));

const mockRouteResponse: RouteResponse = {
  id: "route-1",
  name: "Daily Commute",
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

describe("useCreateRouteMutation", () => {
  beforeEach(() => {
    vi.mocked(routesApi.create).mockReset();
  });

  it("submits a CreateRouteForm, transforms fields and invalidates routes list query", async () => {
    vi.mocked(routesApi.create).mockResolvedValueOnce(mockRouteResponse);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateRouteMutation(), {
      wrapper,
    });

    const form: CreateRouteForm = {
      name: "  Daily Commute  ",
      sourceId: "  loc-src  ",
      destId: "  loc-dest  ",
      stops: [
        {
          stopId: "  loc-mid  ",
          sequence: "1",
        },
      ],
    };

    result.current.mutate(form);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(routesApi.create).toHaveBeenCalledWith({
      name: "Daily Commute",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: [
        {
          stop_id: "loc-mid",
          sequence: 1,
        },
      ],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: routeKeys.lists(),
    });
  });

  it("submits a raw CreateRouteRequest directly", async () => {
    vi.mocked(routesApi.create).mockResolvedValueOnce(mockRouteResponse);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateRouteMutation(), {
      wrapper,
    });

    const request: CreateRouteRequest = {
      name: "Direct Route",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: null,
    };

    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(routesApi.create).toHaveBeenCalledWith({
      name: "Direct Route",
      source_id: "loc-src",
      dest_id: "loc-dest",
      stops: null,
    });
  });

  it("handles route creation errors", async () => {
    const error = new Error("Route creation failed");
    vi.mocked(routesApi.create).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateRouteMutation(), {
      wrapper,
    });

    result.current.mutate({
      name: "Failing Route",
      sourceId: "loc-src",
      destId: "loc-dest",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
