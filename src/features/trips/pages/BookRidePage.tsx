import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import LocationCombobox, {
  type SelectedLocation,
} from "@features/locations/components/LocationCombobox";
import { route_paths } from "@core/router/route_paths";
import { toApiError } from "@core/api/apiError";
import { useSearchTripsQuery } from "../hooks/useSearchTripsQuery";
import BookRideSidebar from "../components/BookRideSidebar";
import AvailableTripCard from "../components/AvailableTripCard";
import BookRideConfirmationModal from "../modals/BookRideConfirmationModal";
import type {
  SearchTripsQueryParams,
  TripResponse,
} from "../types/trips.api.types";

interface FormErrors {
  source?: string;
  destination?: string;
  seats?: string;
}

export default function BookRidePage() {
  const [sourceLocation, setSourceLocation] = useState<SelectedLocation | null>(
    null,
  );
  const [destLocation, setDestLocation] = useState<SelectedLocation | null>(
    null,
  );
  const [departureDate, setDepartureDate] = useState("");
  const [seatsNeeded, setSeatsNeeded] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  // Active query parameters sent to the API
  const [activeParams, setActiveParams] =
    useState<SearchTripsQueryParams | null>(null);

  // Selected trip for booking confirmation modal
  const [tripToBook, setTripToBook] = useState<TripResponse | null>(null);

  const {
    data: searchData,
    isLoading,
    isError,
    error,
  } = useSearchTripsQuery(activeParams);

  const trips = searchData?.items ?? [];
  const totalResults = searchData?.total ?? trips.length;
  const hasSearched = activeParams !== null;

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!sourceLocation) {
      nextErrors.source = "Please select a pickup / source location.";
    }

    if (!destLocation) {
      nextErrors.destination = "Please select a drop-off / destination location.";
    }

    if (
      sourceLocation &&
      destLocation &&
      sourceLocation.id === destLocation.id
    ) {
      nextErrors.destination =
        "Pickup and drop-off locations must be different.";
    }

    if (seatsNeeded < 1) {
      nextErrors.seats = "Seats must be at least 1.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (sourceLocation && destLocation) {
      setActiveParams({
        source_location_id: sourceLocation.id,
        destination_location_id: destLocation.id,
        departure_date: departureDate.trim() || undefined,
        seats_needed: seatsNeeded > 0 ? seatsNeeded : undefined,
        page: 1,
        limit: 20,
      });
    }
  }

  function handleBookTrip(trip: TripResponse) {
    setTripToBook(trip);
  }

  const today = new Date().toISOString().split("T")[0];
  const apiError = isError && error ? toApiError(error) : null;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        <BookRideSidebar
          totalResults={totalResults}
          hasSearched={hasSearched}
        />

        <section className="flex flex-col p-6 sm:p-10 lg:p-12">
          {/* Mobile Header */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight text-slate-950">
                Carpool
              </span>
            </div>
            <Link
              to={route_paths.home}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600"
            >
              Dashboard
            </Link>
          </div>

          {/* Desktop Navigation Link */}
          <div className="hidden lg:flex items-center justify-between">
            <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              RIDE SEARCH & BOOKING
            </p>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <Link
                to={route_paths.home}
                className="text-slate-500 hover:text-slate-900 transition"
              >
                Dashboard
              </Link>
              <Link
                to={route_paths.trips}
                className="text-slate-500 hover:text-slate-900 transition"
              >
                My Trips
              </Link>
            </div>
          </div>

          <div className="mt-6 lg:mt-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Find and Book a Ride
            </h1>
            <p className="mt-1 text-[15px] leading-6 text-slate-500">
              Select your pickup and drop-off locations to explore available
              carpool journeys.
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/50 p-5 sm:p-6 shadow-sm"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <LocationCombobox
                  id="source-location"
                  label="Pickup Location"
                  placeholder="Search origin location..."
                  selectedLocation={sourceLocation}
                  onSelect={(loc) => {
                    setSourceLocation(loc);
                    setErrors((prev) => ({ ...prev, source: undefined }));
                  }}
                  onClear={() => {
                    setSourceLocation(null);
                  }}
                  disabledLocationIds={
                    destLocation ? [destLocation.id] : []
                  }
                  hasError={Boolean(errors.source)}
                  errorMessage={errors.source}
                  required
                />
              </div>

              <div>
                <LocationCombobox
                  id="destination-location"
                  label="Drop-off Destination"
                  placeholder="Search destination..."
                  selectedLocation={destLocation}
                  onSelect={(loc) => {
                    setDestLocation(loc);
                    setErrors((prev) => ({ ...prev, destination: undefined }));
                  }}
                  onClear={() => {
                    setDestLocation(null);
                  }}
                  disabledLocationIds={
                    sourceLocation ? [sourceLocation.id] : []
                  }
                  hasError={Boolean(errors.destination)}
                  errorMessage={errors.destination}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="departure-date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Departure Date (Optional)
                </label>
                <div className="relative text-slate-400">
                  <span className="pointer-events-none absolute left-3.5 top-3.5">
                    <FieldIcon type="calendar" className="h-5 w-5" />
                  </span>
                  <input
                    type="date"
                    id="departure-date"
                    min={today}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3 text-[15px] text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="seats-needed"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Seats Needed
                </label>
                <div className="relative text-slate-400">
                  <span className="pointer-events-none absolute left-3.5 top-3.5">
                    <FieldIcon type="users" className="h-5 w-5" />
                  </span>
                  <input
                    type="number"
                    id="seats-needed"
                    min={1}
                    max={10}
                    value={seatsNeeded}
                    onChange={(e) =>
                      setSeatsNeeded(Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3 text-[15px] text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
                {errors.seats && (
                  <p className="mt-1.5 text-xs text-rose-600">{errors.seats}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Search Rides
              </button>
            </div>
          </form>

          {/* Results Section */}
          <div className="mt-8 flex-1 flex flex-col">
            {apiError && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              >
                <p className="font-semibold">Search Failed</p>
                <p className="mt-1">{apiError.message}</p>
              </div>
            )}

            {isLoading && (
              <div className="my-auto flex flex-col items-center justify-center p-12 text-center">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Searching available trips...
                </p>
                <p className="text-xs text-slate-400">
                  Matching origin and destination routes
                </p>
              </div>
            )}

            {!isLoading && !hasSearched && (
              <div className="my-auto flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-10 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FieldIcon type="pin" className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-950">
                  Ready to Search
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Choose your pickup and drop-off points above and tap Search
                  Rides to find driver schedules.
                </p>
              </div>
            )}

            {!isLoading && hasSearched && trips.length === 0 && !apiError && (
              <div className="my-auto flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50/50 p-10 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                  <FieldIcon type="car" className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-950">
                  No Rides Found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  We could not find any active trips between these locations for
                  the requested criteria. Try selecting different locations or
                  clearing the date.
                </p>
              </div>
            )}

            {!isLoading && hasSearched && trips.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">
                    Available Trips ({trips.length})
                  </h2>
                  <span className="text-xs text-slate-500">
                    {sourceLocation?.name} → {destLocation?.name}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {trips.map((trip) => (
                    <AvailableTripCard
                      key={trip.id}
                      trip={trip}
                      sourceName={sourceLocation?.name}
                      destinationName={destLocation?.name}
                      seatsNeeded={seatsNeeded}
                      onBook={handleBookTrip}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Booking Confirmation Modal */}
      {tripToBook && (
        <BookRideConfirmationModal
          trip={tripToBook}
          sourceName={sourceLocation?.name}
          destinationName={destLocation?.name}
          seatsRequested={seatsNeeded}
          onClose={() => setTripToBook(null)}
        />
      )}
    </main>
  );
}
