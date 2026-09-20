import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import { route_paths } from "@core/router/route_paths";

export type TripsEmptyStateProps = {
  isFiltered?: boolean;
  onResetFilters?: () => void;
};

const TripsEmptyState = ({
  isFiltered = false,
  onResetFilters,
}: TripsEmptyStateProps) => {
  if (isFiltered) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-card p-12 text-center text-text-muted">
        <p className="text-sm font-medium">
          No trips match the current filter selection.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-3 cursor-pointer text-xs font-semibold text-primary underline"
          >
            Reset all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid place-items-center rounded-2xl border border-border-subtle bg-surface-card py-16 text-center">
      <div className="max-w-xs">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <FieldIcon type="calendar" className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-950">
          No trips scheduled yet
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Create your first trip to offer shared rides to your passengers.
        </p>
        <Link
          to={route_paths.tripsNew}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Schedule your first trip</span>
        </Link>
      </div>
    </div>
  );
};

export default TripsEmptyState;
