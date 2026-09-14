export const API_PREFIX = "/api/v1";

export const apiEndpoints = {
  auth: {
    register: `${API_PREFIX}/auth/register`,
    login: `${API_PREFIX}/auth/login`,
    refresh: `${API_PREFIX}/auth/refresh`,
  },
  users: {
    currentUser: `${API_PREFIX}/current_user`,
  },
  vehicles: {
    list: `${API_PREFIX}/vehicles`,
    create: `${API_PREFIX}/vehicles`,
    byId: (vehicleId: string | number) => `${API_PREFIX}/vehicles/${vehicleId}`,
    update: (vehicleId: string | number) => `${API_PREFIX}/vehicles/${vehicleId}`,
    delete: (vehicleId: string | number) => `${API_PREFIX}/vehicles/${vehicleId}`,
  },
  locations: {
    list: `${API_PREFIX}/locations`,
    create: `${API_PREFIX}/locations`,
  },
  routes: {
    list: `${API_PREFIX}/routes`,
    create: `${API_PREFIX}/routes`,
    byId: (routeId: string | number) => `${API_PREFIX}/routes/${routeId}`,
    update: (routeId: string | number) => `${API_PREFIX}/routes/${routeId}`,
    patch: (routeId: string | number) => `${API_PREFIX}/routes/${routeId}`,
    delete: (routeId: string | number) => `${API_PREFIX}/routes/${routeId}`,
  },
  trips: {
    list: `${API_PREFIX}/trips`,
    create: `${API_PREFIX}/trips`,
    byId: (tripId: string | number) => `${API_PREFIX}/trips/${tripId}`,
    update: (tripId: string | number) => `${API_PREFIX}/trips/${tripId}`,
    delete: (tripId: string | number) => `${API_PREFIX}/trips/${tripId}`,
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;

export const API_ENDPOINTS = apiEndpoints;
export const api_endpoints = apiEndpoints;
export default apiEndpoints;

