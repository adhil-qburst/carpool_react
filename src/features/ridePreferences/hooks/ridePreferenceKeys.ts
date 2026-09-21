export const ridePreferenceKeys = {
  all: ["ridePreferences"] as const,
  lists: () => [...ridePreferenceKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...ridePreferenceKeys.lists(), filters] as const,
  matches: (filters?: Record<string, unknown>) =>
    [...ridePreferenceKeys.all, "matches", filters] as const,
  details: () => [...ridePreferenceKeys.all, "detail"] as const,
  detail: (id: string) => [...ridePreferenceKeys.details(), id] as const,
};
