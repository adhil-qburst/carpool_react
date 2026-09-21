import BrandMark from "@shared/ui/BrandMark";
import TripDetailSidebar from "./TripDetailSidebar";

export default function TripDetailSkeleton() {
  return (
    <main
      className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"
      role="status"
      aria-label="Loading trip details"
      data-testid="trip-detail-skeleton"
    >
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.85fr_1.15fr]">
        <TripDetailSidebar isLoading />

        <section className="flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto">
          {/* Mobile Header Skeleton */}
          <div className="flex items-center justify-between lg:hidden mb-6">
            <div className="flex items-center gap-3">
              <BrandMark />
              <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200" />
            </div>
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
          </div>

          {/* Desktop Navigation & Actions Header Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-60 animate-pulse rounded-lg bg-slate-200" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>

          {/* Overview Grid Skeleton */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2"
              >
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Route Details Card Skeleton */}
          <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 space-y-4">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-slate-300 animate-pulse" />
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="ml-2 h-6 w-0.5 bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-slate-300 animate-pulse" />
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>

          {/* Passenger Section Skeleton */}
          <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Metadata Audit Card Skeleton */}
          <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-64 animate-pulse rounded bg-slate-200" />
          </div>
        </section>
      </div>
    </main>
  );
}
