import { useQuery } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import type { SearchTripsQueryParams } from "../types/trips.api.types";
import { tripKeys } from "./tripKeys";

export function useSearchTripsQuery(
  params?: SearchTripsQueryParams | null,
  options?: { enabled?: boolean },
) {
  const isEnabled =
    options?.enabled !== undefined
      ? options.enabled
      : Boolean(params?.source_location_id && params?.destination_location_id);

  return useQuery({
    queryKey: tripKeys.search(params as Record<string, unknown>),
    queryFn: () => {
      if (!params) {
        throw new Error("Search parameters are required");
      }
      return tripsApi.search(params);
    },
    enabled: isEnabled,
  });
}
