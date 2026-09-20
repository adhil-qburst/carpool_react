import { Link } from "react-router";
import PlusIcon from "@shared/ui/PlusIcon";
import ChevronRightIcon from "@shared/ui/ChevronRightIcon";
import { route_paths } from "@core/router/route_paths";

export type MyTripsHeaderProps = {
  title?: string;
  subtitle?: string;
};

const MyTripsHeader = ({
  title = "My Trips",
  subtitle = "Manage and monitor your scheduled, completed, and recurring carpool journeys.",
}: MyTripsHeaderProps) => {
  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
          <Link
            to={route_paths.driverDashboard}
            className="transition-colors hover:text-on-surface"
          >
            Workspace
          </Link>
          <ChevronRightIcon className="h-3.5 w-3.5 text-text-muted" />
          <span className="font-semibold text-primary">My Trips</span>
        </nav>

        {/* Title and subtitle */}
        <h1 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          {title}
        </h1>
        <p className="mt-0.5 text-xs sm:text-sm text-text-muted">
          {subtitle}
        </p>
      </div>

      {/* Action CTA */}
      <div className="flex items-center gap-3">
        <Link
          to={route_paths.tripsNew}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-primary-hover active:scale-95"
        >
          <PlusIcon className="h-4 w-4 text-white" />
          <span>Create Trip</span>
        </Link>
      </div>
    </section>
  );
};

export default MyTripsHeader;
