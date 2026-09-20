import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import { route_paths } from "@core/router/route_paths";

const RoutesEmptyState = () => {
  return (
    <div className="grid place-items-center rounded-3xl border-2 border-dashed border-border-subtle bg-surface-card p-10 text-center shadow-xs sm:p-14">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-surface-mint text-primary">
        <FieldIcon type="pin" className="h-8 w-8" />
      </div>
      <h2 className="mt-5 text-lg sm:text-xl font-bold text-on-surface">
        No routes created yet
      </h2>
      <p className="mt-2 max-w-sm text-xs sm:text-sm text-text-muted leading-relaxed">
        You haven&rsquo;t configured any travel routes yet. Create a route with
        ordered pickup and dropoff points to start sharing rides.
      </p>
      <Link
        to={route_paths.routesNew}
        className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-primary-hover active:scale-95"
      >
        <PlusIcon className="h-4 w-4 text-white" />
        Create your first route
      </Link>
    </div>
  );
};

export default RoutesEmptyState;
