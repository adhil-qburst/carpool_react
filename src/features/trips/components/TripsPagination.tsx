export type TripsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

const TripsPagination = ({
  page,
  totalPages,
  onPageChange,
}: TripsPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-border-subtle pt-4">
      <p className="text-xs text-text-muted">
        Page <span className="font-semibold text-on-surface">{page}</span> of{" "}
        <span className="font-semibold text-on-surface">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="cursor-pointer rounded-xl border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-semibold text-on-surface transition hover:bg-surface-canvas disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="cursor-pointer rounded-xl border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-semibold text-on-surface transition hover:bg-surface-canvas disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TripsPagination;
