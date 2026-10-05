export type VehicleSuccessModalProps = {
  title: string;
  eyebrow?: string;
  message: string;
  actionText?: string;
  onClose: () => void;
};

export default function VehicleSuccessModal({
  title,
  eyebrow = "SUCCESS",
  message,
  actionText = "View vehicles",
  onClose,
}: VehicleSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-success-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-3xl text-emerald-600">
          ✓
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-500" />
        </div>
        <p className="mt-5 text-xs font-bold tracking-widest text-emerald-600">
          {eyebrow}
        </p>
        <h2
          id="vehicle-success-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>
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
