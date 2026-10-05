export const routeKeys = {
  all: ["routes"] as const,
  lists: () => [...routeKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...routeKeys.lists(), filters] as const,
  details: () => [...routeKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...routeKeys.details(), String(id)] as const,
};
