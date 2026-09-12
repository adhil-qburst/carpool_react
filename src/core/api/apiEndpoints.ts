export const apiEndpoints = {
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    refresh: "/api/v1/auth/refresh",
  },
  users: {
    currentUser: "/api/v1/current_user",
  },
  vehicles: {
    list: "/api/v1/vehicles",
    create: "/api/v1/vehicles",
    byId: (vehicleId: string | number) => `/api/v1/vehicles/${vehicleId}`,
    update: (vehicleId: string | number) => `/api/v1/vehicles/${vehicleId}`,
    delete: (vehicleId: string | number) => `/api/v1/vehicles/${vehicleId}`,
  },
  locations: {
    list: "/api/v1/locations",
    create: "/api/v1/locations",
  },
  routes: {
    create: "/api/v1/routes",
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;

export const API_ENDPOINTS = apiEndpoints;
export const api_endpoints = apiEndpoints;
export default apiEndpoints;
