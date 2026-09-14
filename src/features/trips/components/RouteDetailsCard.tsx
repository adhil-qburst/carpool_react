import { useMemo } from "react";
import type { TripRouteOption } from "../types/trips.api.types";

export interface RouteDetailsCardProps {
  route: TripRouteOption | null | undefined;
  className?: string;
}

export default function RouteDetailsCard({
  route,
  className = "",
}: RouteDetailsCardProps) {
  const sortedStops = useMemo(() => {
    if (!route?.route_stops) return [];
    return [...route.route_stops].sort((a, b) => a.sequence - b.sequence);
  }, [route?.route_stops]);

  if (!route) {
    return null;
  }

  const stopCount = sortedStops.length;

  return (
    <div
      aria-label="Route details"
      className={`rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-slate-50/70 p-4 sm:p-5 transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100/80 pb-3">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
            Route Details
          </span>
          <h3 className="text-base font-bold text-slate-900">{route.name}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            {route.status}
          </span>
          <span className="inline-flex items-center rounded-full bg-indigo-100/80 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            {stopCount} {stopCount === 1 ? "stop" : "stops"}
          </span>
        </div>
      </div>

      {/* Stops Timeline */}
      {stopCount === 0 ? (
        <p className="mt-3 text-xs text-slate-500 italic">
          No intermediate or destination stops configured for this route.
        </p>
      ) : (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Route Waypoints & Stops
          </p>
          <div className="relative pl-2">
            {sortedStops.map((stop, index) => {
              const isFirst = index === 0;
              const isLast = index === stopCount - 1 && stopCount > 1;
              const locationName =
                stop.location?.name ?? `Location #${stop.location_id.slice(0, 8)}`;
              const cityName = stop.location?.city;

              return (
                <div key={stop.id} className="relative flex items-start gap-3 pb-4 last:pb-1">
                  {/* Vertical connecting line */}
                  {index < stopCount - 1 && (
                    <div
                      className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-indigo-200"
                      aria-hidden="true"
                    />
                  )}

                  {/* Marker Node */}
                  <div
                    className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ring-4 ring-white ${
                      isFirst
                        ? "bg-emerald-600 text-white"
                        : isLast
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {stop.sequence}
                  </div>

                  {/* Stop Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 truncate">
                        {locationName}
                      </span>
                      {isFirst && (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider border border-emerald-200">
                          Origin
                        </span>
                      )}
                      {isLast && (
                        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider border border-indigo-200">
                          Destination
                        </span>
                      )}
                      {!isFirst && !isLast && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          Stop {stop.sequence}
                        </span>
                      )}
                    </div>
                    {cityName && (
                      <p className="text-xs text-slate-500 mt-0.5">{cityName}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
