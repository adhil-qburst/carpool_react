import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import { route_paths } from "@core/router/route_paths";

const HomePage = () => {
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
              to={route_paths.routes}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              My Routes
            </Link>
            <Link
              to={route_paths.vehicles}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              My Vehicles
            </Link>
            <Link
              to={route_paths.trips}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              My Trips
            </Link>
            <Link
              to={route_paths.tripsNew}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              Schedule Trip
            </Link>
            <Link
              to={route_paths.login}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Sign out
            </Link>
          </nav>
        </header>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FieldIcon type="pin" className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Route Builder
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Set up your commute with origin, destination, and intermediate
                pickup stops.
              </p>
            </div>
            <Link
              to={route_paths.routes}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              View routes →
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FieldIcon type="car" className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Driver Garage
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage your registered vehicles, update seat availability, and add
                new cars for upcoming carpool trips.
              </p>
            </div>
            <Link
              to={route_paths.vehicles}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Manage vehicles →
            </Link>
          </div>

          <div className="rounded-3xl border border-indigo-200 bg-white p-8 shadow-sm flex flex-col justify-between ring-1 ring-indigo-500/10">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <FieldIcon type="calendar" className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Schedule Trip
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Publish an upcoming journey with your vehicle, route, and departure time for passengers.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Link
                to={route_paths.trips}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                View trips →
              </Link>
              <Link
                to={route_paths.tripsNew}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
              >
                + Schedule
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FieldIcon type="users" className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Find a Ride
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Discover convenient carpool routes on your commute and share costs
                with coworkers and fellow commuters.
              </p>
            </div>
            <span className="mt-6 inline-block rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
              Coming soon
            </span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
