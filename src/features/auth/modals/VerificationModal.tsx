type VerificationModalProps = { email: string; onClose: () => void };

const VerificationModal = ({ email, onClose }: VerificationModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-3xl text-emerald-600">
          ✓
        </div>
        <p className="mt-5 text-xs font-bold tracking-widest text-emerald-600">
          ONE LAST STEP
        </p>
        <h2
          id="verification-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Check your inbox
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          We sent a verification link to{" "}
          <span className="font-semibold text-slate-700">{email}</span>. Open it
          to activate your Carpool account.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerificationModal;
