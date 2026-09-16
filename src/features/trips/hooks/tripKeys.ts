export const tripKeys = {
  all: ["trips"] as const,
  lists: () => [...tripKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...tripKeys.lists(), filters] as const,
  searches: () => [...tripKeys.all, "search"] as const,
  search: (filters?: Record<string, unknown>) =>
    [...tripKeys.searches(), filters] as const,
  details: () => [...tripKeys.all, "detail"] as const,
  detail: (id: string) => [...tripKeys.details(), id] as const,
  driverRoutes: () => [...tripKeys.all, "driverRoutes"] as const,
  driverVehicles: () => [...tripKeys.all, "driverVehicles"] as const,
};
