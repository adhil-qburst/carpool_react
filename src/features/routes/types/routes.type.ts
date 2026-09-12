export interface RouteStop {
  id: string;
  routeId: string;
  locationId: string;
  sequence: number;
}

export interface Route {
  id: string;
  name: string;
  driverId: string;
  routeStops: RouteStop[];
}

export interface CreateRouteStopForm {
  stopId: string;
  sequence: number | string;
}

export interface CreateRouteForm {
  name: string;
  sourceId: string;
  destId: string;
  stops?: CreateRouteStopForm[] | null;
}

export type RouteFormErrors = Partial<
  Record<keyof CreateRouteForm, string>
>;

export interface UpdateRouteStopForm {
  stopId?: string | null;
  locationId?: string | null;
  sequence: number | string;
}

export interface UpdateRouteForm {
  name: string;
  sourceId: string;
  destId: string;
  stops?: UpdateRouteStopForm[] | null;
}

export type UpdateRouteFormErrors = Partial<
  Record<keyof UpdateRouteForm, string>
>;

export interface PaginatedRoutes {
  items: Route[];
  page: number;
  limit: number;
  total: number;
}
