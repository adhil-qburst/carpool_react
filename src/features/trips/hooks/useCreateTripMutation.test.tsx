import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import { tripKeys } from "./tripKeys";
import { useCreateTripMutation } from "./useCreateTripMutation";
import type {
  CreateTripRequest,
  TripResponse,
} from "../types/trips.api.types";
import type { CreateTripForm } from "../types/trips.type";

vi.mock("../api/trips.api", () => ({
  tripsApi: {
    create: vi.fn(),
  },
}));

const mockCreatedTrip: TripResponse = {
  id: "trip-1",
  route_id: "route-1",
  driver_id: "driver-1",
  vehicle_id: "veh-1",
  departure_date: "2026-09-20",
  departure_time: "08:30:00",
  available_seats: 3,
  status: "scheduled",
  created_at: "2026-09-14T10:00:00Z",
  updated_at: "2026-09-14T10:00:00Z",
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

describe("useCreateTripMutation", () => {
  beforeEach(() => {
    vi.mocked(tripsApi.create).mockReset();
  });

  it("submits a CreateTripForm, converting to wire DTO and invalidating trips queries", async () => {
    vi.mocked(tripsApi.create).mockResolvedValueOnce(mockCreatedTrip);
    const { queryClient, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateTripMutation(), {
      wrapper,
    });

    const form: CreateTripForm = {
      routeId: "route-1",
      vehicleId: "veh-1",
      departureDate: "2026-09-20",
      departureTime: "08:30",
    };

    result.current.mutate(form);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(tripsApi.create).toHaveBeenCalledWith({
      route_id: "route-1",
      vehicle_id: "veh-1",
      departure_date: "2026-09-20",
      departure_time: "08:30:00",
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: tripKeys.all,
    });
  });

  it("submits raw CreateTripRequest directly without transformation", async () => {
    vi.mocked(tripsApi.create).mockResolvedValueOnce(mockCreatedTrip);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateTripMutation(), {
      wrapper,
    });

    const request: CreateTripRequest = {
      route_id: "route-1",
      vehicle_id: "veh-1",
      departure_date: "2026-09-20",
      departure_time: "08:30:00",
    };

    result.current.mutate(request);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(tripsApi.create).toHaveBeenCalledWith(request);
  });

  it("handles trip creation errors", async () => {
    const error = new Error("Failed to create trip");
    vi.mocked(tripsApi.create).mockRejectedValueOnce(error);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateTripMutation(), {
      wrapper,
    });

    result.current.mutate({
      routeId: "route-1",
      vehicleId: "veh-1",
      departureDate: "2026-09-20",
      departureTime: "08:30",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
