import FieldIcon from "@shared/ui/FieldIcon";
import type {
  RecentTripSearch,
  TripRouteStopLocation,
} from "@features/trips/types/trips.api.types";

interface RecentSearchesCardProps {
  searches: RecentTripSearch[];
  isLoading: boolean;
  onSelect: (
    search: RecentTripSearch,
    sourceName: string,
    destinationName: string,
  ) => void;
}

function getStopLocation(
  search: RecentTripSearch,
  locationId: string,
): TripRouteStopLocation | undefined {
  const location =
    locationId === search.source_location_id
      ? search.source_location
      : locationId === search.destination_location_id
        ? search.dest_location
        : undefined;
  if (location) return location;

  for (const trip of search.items) {
    const stop = trip.route?.route_stops?.find(
      (routeStop) => routeStop.location_id === locationId,
    );
    if (stop?.location) return stop.location;
  }
  return undefined;
}

function getLocationLabel(
  search: RecentTripSearch,
  locationId: string,
): string {
  const location = getStopLocation(search, locationId);
  if (!location) return `Location ${locationId.slice(0, 8)}`;
  return location.city ? `${location.name}, ${location.city}` : location.name;
}

const RecentSearchesCard = ({
  searches,
  isLoading,
  onSelect,
}: RecentSearchesCardProps) => (
  <section
    aria-labelledby="recent-searches-heading"
    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
  >
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-mint text-primary">
          <FieldIcon type="clock" className="h-4 w-4" />
        </span>
        <div>
          <h2
            id="recent-searches-heading"
            className="text-sm font-bold text-slate-950"
          >
            Recent searches
          </h2>
          <p className="text-xs text-slate-500">Pick up where you left off</p>
        </div>
      </div>
      <span className="text-xs font-medium text-slate-500">
        {searches.length > 0 ? `${searches.length} routes` : "Last 10"}
      </span>
    </div>

    {isLoading ? (
      <div className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Loading recent searches">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="h-16 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    ) : searches.length > 0 ? (
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {searches.map((search) => {
          const sourceName = getLocationLabel(search, search.source_location_id);
          const destinationName = getLocationLabel(
            search,
            search.destination_location_id,
          );

          return (
            <li key={`${search.source_location_id}-${search.destination_location_id}`}>
              <button
                type="button"
                onClick={() => onSelect(search, sourceName, destinationName)}
                aria-label={`Search ${sourceName} to ${destinationName}`}
                className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left transition hover:border-primary hover:bg-surface-mint/40 focus:outline-none focus:ring-4 focus:ring-primary-fixed"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {sourceName}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    to {destinationName}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-medium text-slate-500">
                  {search.total} {search.total === 1 ? "ride" : "rides"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
        Your recent routes will appear here after you search.
      </p>
    )}
  </section>
);

export default RecentSearchesCard;