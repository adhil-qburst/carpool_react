export type RouteSuccessModalProps = {
  title: string;
  eyebrow?: string;
  message: string;
  routeName: string;
  stopsCount: number;
  actionText?: string;
  onClose: () => void;
};

export default function RouteSuccessModal({
  title,
  eyebrow = "ROUTE CREATED",
  message,
  routeName,
  stopsCount,
  actionText = "Done",
  onClose,
}: RouteSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="route-success-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-3xl text-emerald-600">
          ✓
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-500" />
        </div>
        <p className="mt-5 text-xs font-bold tracking-widest text-emerald-600 uppercase">
          {eyebrow}
        </p>
        <h2
          id="route-success-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Route Name</span>
            <span className="font-semibold text-slate-900">{routeName}</span>
          </div>
          <div className="flex justify-between py-1 pt-2">
            <span className="text-slate-500">Total Stops</span>
            <span className="font-semibold text-slate-900">
              {stopsCount} {stopsCount === 1 ? "stop" : "stops"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}
