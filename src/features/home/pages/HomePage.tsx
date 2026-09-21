import { Link } from "react-router";
import BrandMark from "@shared/ui/BrandMark";
import FieldIcon from "@shared/ui/FieldIcon";
import { route_paths } from "@core/router/route_paths";
import { useNotificationUnreadCountQuery } from "@features/notifications/hooks/useNotificationUnreadCountQuery";

const HomePage = () => {
  const { data: unreadData } = useNotificationUnreadCountQuery();
  const unreadCount = unreadData?.unread_count ?? 0;
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="text-xl font-bold tracking-tight text-slate-950">
              Carpool
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-3 sm:gap-4">
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
              to={route_paths.bookings}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              My Bookings
            </Link>
            <Link
              to={route_paths.ridePreferences}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Ride Preferences
            </Link>
            <Link
              to={route_paths.notifications}
              className="relative inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
            <Link
              to={route_paths.tripsBook}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              Book Ride
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

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

          <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-sm flex flex-col justify-between ring-1 ring-emerald-500/10">
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
            <Link
              to={route_paths.tripsBook}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              Search rides →
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FieldIcon type="tag" className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                My Bookings
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Track your reserved carpool rides, check pickup stops, and manage
                seat confirmations with ease.
              </p>
            </div>
            <Link
              to={route_paths.bookings}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              View bookings →
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FieldIcon type="clock" className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Ride Preferences
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Save your regular commute routes, desired departure times, and
                seats needed to get matched with upcoming carpools automatically.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Link
                to={route_paths.ridePreferences}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                View preferences →
              </Link>
              <Link
                to={route_paths.ridePreferencesNew}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700"
              >
                + Set Preference
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FieldIcon type="bell" className="h-6 w-6" />
                </div>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    {unreadCount} new
                  </span>
                )}
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Notifications
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Stay informed on booking updates, trip requests, seat status changes,
                and carpool community alerts.
              </p>
            </div>
            <Link
              to={route_paths.notifications}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              View notifications →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
