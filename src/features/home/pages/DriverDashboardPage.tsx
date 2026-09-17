import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import { route_paths } from "@core/router/route_paths";

export default function DriverDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="text-xl font-bold tracking-tight text-slate-950">
              Carpool
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to={route_paths.login}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Sign out
            </Link>
          </nav>
        </header>

        <section className="mt-12 flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">
            Driver Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Coming soon
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-7 text-slate-500">
            Your driver dashboard is on its way. Check back soon for trips,
            routes, and earnings at a glance.
          </p>
        </section>
      </div>
    </main>
  );
}
