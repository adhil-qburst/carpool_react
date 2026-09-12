import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routesApi } from "../api/routes.api";
import { routeKeys } from "./routeKeys";
import { useDeleteRouteMutation } from "./useDeleteRouteMutation";

vi.mock("../api/routes.api", () => ({
  routesApi: {
    delete: vi.fn(),
  },
}));

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

describe("useDeleteRouteMutation", () => {
  beforeEach(() => {
    vi.mocked(routesApi.delete).mockReset();
  });

  it("deletes a route, invalidating lists and removing detail cache", async () => {
    vi.mocked(routesApi.delete).mockResolvedValueOnce(undefined);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(() => useDeleteRouteMutation(), {
      wrapper,
    });

    result.current.mutate("route-123");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(routesApi.delete).toHaveBeenCalledWith("route-123");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: routeKeys.lists(),
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: routeKeys.detail("route-123"),
    });
  });

  it("handles delete errors correctly", async () => {
    const error = new Error("Delete failed");
    vi.mocked(routesApi.delete).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteRouteMutation(), {
      wrapper,
    });

    result.current.mutate("route-123");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
