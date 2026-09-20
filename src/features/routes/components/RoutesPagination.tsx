export type RoutesPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

const RoutesPagination = ({
  page,
  totalPages,
  onPageChange,
}: RoutesPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border-subtle pt-4 text-xs sm:text-sm text-text-muted">
      <p>
        Page <span className="font-semibold text-on-surface">{page}</span> of{" "}
        <span className="font-semibold text-on-surface">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="rounded-lg border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-semibold text-on-surface transition hover:bg-surface-container-low disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="rounded-lg border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-semibold text-on-surface transition hover:bg-surface-container-low disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RoutesPagination;
