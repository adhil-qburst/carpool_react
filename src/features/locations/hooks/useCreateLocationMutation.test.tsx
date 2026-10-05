import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { locationsApi } from "../api/locations.api";
import { locationKeys } from "./locationKeys";
import { useCreateLocationMutation } from "./useCreateLocationMutation";
import type {
  CreateLocationRequest,
  LocationResponse,
} from "../types/locations.api.types";
import type { CreateLocationForm } from "../types/locations.type";

vi.mock("../api/locations.api", () => ({
  locationsApi: {
    create: vi.fn(),
  },
}));

const mockCreatedLocation: LocationResponse = {
  id: "loc-1",
  name: "Central Station",
  city: "Kochi",
  lat: "9.9816",
  lng: "76.2999",
  status: "active",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
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

describe("useCreateLocationMutation", () => {
  beforeEach(() => {
    vi.mocked(locationsApi.create).mockReset();
  });

  it("submits a CreateLocationForm, transforms fields and invalidates locations lists query", async () => {
    vi.mocked(locationsApi.create).mockResolvedValueOnce(mockCreatedLocation);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateLocationMutation(), {
      wrapper,
    });

    const form: CreateLocationForm = {
      name: "  Central Station  ",
      city: "  Kochi  ",
      lat: "9.9816",
      lng: "76.2999",
      status: "active",
    };

    result.current.mutate(form);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(locationsApi.create).toHaveBeenCalledWith({
      name: "Central Station",
      city: "Kochi",
      lat: "9.9816",
      lng: "76.2999",
      status: "active",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: locationKeys.lists(),
    });
  });

  it("submits a raw CreateLocationRequest directly", async () => {
    vi.mocked(locationsApi.create).mockResolvedValueOnce(mockCreatedLocation);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateLocationMutation(), {
      wrapper,
    });

    const request: CreateLocationRequest = {
      name: "Airport",
      city: "Nedumbassery",
      lat: 10.1518,
      lng: 76.393,
      status: "active",
    };

    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(locationsApi.create).toHaveBeenCalledWith({
      name: "Airport",
      city: "Nedumbassery",
      lat: 10.1518,
      lng: 76.393,
      status: "active",
    });
  });

  it("handles location creation errors", async () => {
    const error = new Error("Creation failed");
    vi.mocked(locationsApi.create).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateLocationMutation(), {
      wrapper,
    });

    result.current.mutate({
      name: "Airport",
      city: "Nedumbassery",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
