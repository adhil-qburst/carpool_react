import type {
  CreateRouteForm,
  CreateRouteStopForm,
  PaginatedRoutes,
  Route,
  RouteStop,
  UpdateRouteForm,
  UpdateRouteStopForm,
} from "./routes.type";

export interface PaginatedRoutesResponse {
  items: RouteResponse[];
  page: number;
  limit: number;
  total: number;
}

export interface ListRoutesQueryParams {
  page?: number;
  limit?: number;
}

export interface CreateRouteStopRequest {
  stop_id?: string | null;
  location_id?: string | null;
  sequence: number;
}

export type UpdateRouteStopRequest = CreateRouteStopRequest;

export interface CreateRouteRequest {
  name: string;
  source_id: string;
  dest_id: string;
  stops?: CreateRouteStopRequest[] | null;
}

export interface UpdateRouteRequest {
  name: string;
  source_id: string;
  dest_id: string;
  stops?: CreateRouteStopRequest[] | null;
}

export interface LocationResponse {
  id: string;
  name: string;
  city: string;
  lat?: string | number | null;
  lng?: string | number | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RouteStopResponse {
  id: string;
  route_id: string;
  location_id: string;
  sequence: number;
  location?: LocationResponse | null;
}

export interface RouteResponse {
  id: string;
  name: string;
  driver_id: string;
  route_stops: RouteStopResponse[];
}

export function toCreateRouteRequest(
  form: CreateRouteForm | CreateRouteRequest,
): CreateRouteRequest {
  if ("source_id" in form) {
    return form;
  }

  const stops = form.stops
    ? form.stops.map((stop: CreateRouteStopForm) => ({
        stop_id: stop.stopId.trim(),
        sequence: Number(stop.sequence),
      }))
    : null;

  return {
    name: form.name.trim(),
    source_id: form.sourceId.trim(),
    dest_id: form.destId.trim(),
    stops,
  };
}

export function toUpdateRouteRequest(
  form: UpdateRouteForm | UpdateRouteRequest,
): UpdateRouteRequest {
  if ("source_id" in form) {
    return form;
  }

  const stops = form.stops
    ? form.stops.map((stop: UpdateRouteStopForm) => {
        const stopId = stop.stopId ? stop.stopId.trim() : null;
        const locationId = stop.locationId ? stop.locationId.trim() : null;
        return {
          ...(stopId ? { stop_id: stopId } : {}),
          ...(locationId ? { location_id: locationId } : {}),
          sequence: Number(stop.sequence),
        };
      })
    : null;

  return {
    name: form.name.trim(),
    source_id: form.sourceId.trim(),
    dest_id: form.destId.trim(),
    stops,
  };
}

export function toRouteStop(dto: RouteStopResponse): RouteStop {
  return {
    id: dto.id,
    routeId: dto.route_id,
    locationId: dto.location_id,
    sequence: dto.sequence,
    location: dto.location
      ? {
          id: dto.location.id,
          name: dto.location.name,
          city: dto.location.city,
          lat: dto.location.lat,
          lng: dto.location.lng,
          status: dto.location.status,
        }
      : null,
  };
}

export function toRoute(dto: RouteResponse): Route {
  return {
    id: dto.id,
    name: dto.name,
    driverId: dto.driver_id,
    routeStops: (dto.route_stops ?? []).map(toRouteStop),
  };
}

export function toPaginatedRoutes(dto: PaginatedRoutesResponse): PaginatedRoutes {
  return {
    items: (dto.items ?? []).map(toRoute),
    page: dto.page,
    limit: dto.limit,
    total: dto.total,
  };
}
