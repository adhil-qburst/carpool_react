import BrandMark from "@shared/ui/BrandMark";

export type NotificationStatsSidebarProps = {
  totalNotifications: number;
  unreadCount: number;
  readCount: number;
  isLoading?: boolean;
};

const NotificationStatsSidebar = ({
  totalNotifications,
  unreadCount,
  readCount,
  isLoading = false,
}: NotificationStatsSidebarProps) => {
  return (
    <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
      <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="relative flex items-center gap-3">
        <BrandMark />
        <span className="text-lg font-bold tracking-tight">Carpool</span>
      </div>

      <div className="relative my-auto max-w-sm">
        <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100 uppercase">
          NOTIFICATION CENTER
        </p>
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white">
          Stay updated on your rides and requests.
        </h1>
        <p className="mt-5 max-w-xs text-base leading-7 text-slate-300">
          Real-time alerts for booking confirmations, trip schedule changes,
          commute updates, and system announcements.
        </p>
      </div>

      <div className="relative grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
          <p className="text-2xl font-semibold">
            {isLoading ? "–" : totalNotifications}
          </p>
          <p className="mt-1 text-xs text-slate-400">Total</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
          <p className="text-2xl font-semibold text-indigo-400">
            {isLoading ? "–" : unreadCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">Unread</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
          <p className="text-2xl font-semibold text-emerald-400">
            {isLoading ? "–" : readCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">Read</p>
        </div>
      </div>
    </aside>
  );
};

export default NotificationStatsSidebar;
