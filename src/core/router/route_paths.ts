export const route_paths = {
  root: "/",
  register: "/register",
  login: "/login",
  emailVerificationSuccess: "/email-verification-success",
  home: "/home",
  vehicles: "/vehicles",
  vehiclesNew: "/vehicles/new",
  vehiclesEdit: "/vehicles/:vehicleId/edit",
  routes: "/routes",
  routesNew: "/routes/new",
  routesEdit: "/routes/:routeId/edit",
  trips: "/trips",
  tripsNew: "/trips/new",
  tripsEdit: "/trips/:tripId/edit",

  // Aliases for convenience and common conventions
  vehicleNew: "/vehicles/new",
  vehicleEdit: "/vehicles/:vehicleId/edit",
  newVehicle: "/vehicles/new",
  editVehicle: "/vehicles/:vehicleId/edit",
  newRoute: "/routes/new",
  routeNew: "/routes/new",
  routeEdit: "/routes/:routeId/edit",
  editRoute: "/routes/:routeId/edit",
  newTrip: "/trips/new",
  tripNew: "/trips/new",
  email_verification_success: "/email-verification-success",
  vehicles_new: "/vehicles/new",
  vehicles_edit: "/vehicles/:vehicleId/edit",
  routes_new: "/routes/new",
  routes_edit: "/routes/:routeId/edit",
  trips_new: "/trips/new",
  trips_edit: "/trips/:tripId/edit",

  // Uppercase constants
  ROOT: "/",
  REGISTER: "/register",
  LOGIN: "/login",
  EMAIL_VERIFICATION_SUCCESS: "/email-verification-success",
  HOME: "/home",
  VEHICLES: "/vehicles",
  VEHICLES_NEW: "/vehicles/new",
  VEHICLES_EDIT: "/vehicles/:vehicleId/edit",
  ROUTES: "/routes",
  ROUTES_NEW: "/routes/new",
  ROUTES_EDIT: "/routes/:routeId/edit",
  TRIPS: "/trips",
  TRIPS_NEW: "/trips/new",
  TRIPS_EDIT: "/trips/:tripId/edit",

  // Helper for parameterized routes
  getVehicleEditPath: (vehicleId: string | number) =>
    `/vehicles/${vehicleId}/edit`,
  getRouteEditPath: (routeId: string | number) =>
    `/routes/${routeId}/edit`,
  getTripEditPath: (tripId: string | number) =>
    `/trips/${tripId}/edit`,
} as const;

export type RoutePath = (typeof route_paths)[keyof typeof route_paths];

export const ROUTE_PATHS = route_paths;
export const routePaths = route_paths;
export default route_paths;
