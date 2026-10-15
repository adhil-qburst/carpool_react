import { useQuery } from "@tanstack/react-query";
import { tripsApi } from "../api/trips.api";
import { tripKeys } from "./tripKeys";

export function useRecentTripSearchesQuery(limit = 10) {
  return useQuery({
    queryKey: tripKeys.recentSearches(),
    queryFn: () => tripsApi.recentSearches(limit),
  });
}