import { Link } from "react-router";
import PlusIcon from "@shared/ui/PlusIcon";
import { route_paths } from "@core/router/route_paths";

type DriverHeroBannerProps = {
  driverName?: string;
};

const DriverHeroBanner = ({ driverName = "Arun" }: DriverHeroBannerProps) => {
  // Extract first name for warm personal greeting
  const firstName = driverName.split(" ")[0] || driverName;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-xs sm:p-8">
      {/* Subtle scenic background element with soft gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('/dashboard/hero_highway.jpg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface-card via-surface-card/95 to-transparent" />

      <div className="relative z-10 flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-surface-mint-border bg-surface-mint px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Driver Steward</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-on-surface sm:text-3xl lg:text-4xl">
            Good day, {firstName}!
          </h1>

          <p className="text-sm sm:text-base font-medium text-text-muted">
            Thanks for keeping the journey going.
          </p>
          <p className="text-xs sm:text-sm text-text-muted">
            Every trip you share helps build a cleaner, more connected community with less traffic congestion.
          </p>
        </div>

        {/* Quick Action Cluster */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to={route_paths.tripsNew}
            className="flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-primary-hover active:scale-95"
          >
            <PlusIcon className="h-4 w-4 text-white" />
            <span className="whitespace-nowrap font-semibold text-white">
              Create Trip
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DriverHeroBanner;
