import { useQuery } from "@tanstack/react-query";
import { locationsApi } from "../api/locations.api";
import type { SearchLocationsQueryParams } from "../types/locations.api.types";
import { locationKeys } from "./locationKeys";

export function useLocationsQuery(params?: SearchLocationsQueryParams) {
  return useQuery({
    queryKey: locationKeys.list(params),
    queryFn: () => locationsApi.list(params),
  });
}
