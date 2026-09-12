import type { SearchLocationsQueryParams } from "../types/locations.api.types";

export const locationKeys = {
  all: ["locations"] as const,
  lists: () => [...locationKeys.all, "list"] as const,
  list: (filters?: SearchLocationsQueryParams) =>
    [...locationKeys.lists(), filters] as const,
  details: () => [...locationKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...locationKeys.details(), String(id)] as const,
};
