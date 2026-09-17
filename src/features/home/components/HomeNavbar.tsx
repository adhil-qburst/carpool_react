import { useState } from "react";
import { Link, useNavigate } from "react-router";
import CarPoolLogo from "@shared/ui/CarPoolLogo";
import { route_paths } from "@core/router/route_paths";
import { tokenStorage } from "@core/auth/tokenStorage";

export default function HomeNavbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = Boolean(tokenStorage.getAccessToken());

  function handleSignOut() {
    tokenStorage.clear();
    navigate(route_paths.login, { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to={route_paths.home}
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20 rounded-lg"
          aria-label="CarPool Home"
        >
          <CarPoolLogo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to={route_paths.home}
            className="relative py-1 text-sm font-semibold text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0f5132] after:rounded-full"
          >
            Home
          </Link>
          <Link
            to={route_paths.trips}
            className="text-sm font-medium text-slate-600 transition hover:text-[#0f5132]"
          >
            Find a Ride
          </Link>
          <Link
            to={route_paths.tripsNew}
            className="text-sm font-medium text-slate-600 transition hover:text-[#0f5132]"
          >
            Offer a Ride
          </Link>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-[#0f5132]"
          >
            How It Works
          </a>
          <a
            href="#why-carpool"
            className="text-sm font-medium text-slate-600 transition hover:text-[#0f5132]"
          >
            About
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={route_paths.driverDashboard}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl bg-[#0d4f3e] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#093d30]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to={route_paths.login}
                className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Log in
              </Link>
              <Link
                to={route_paths.register}
                className="rounded-xl bg-[#0d4f3e] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#093d30]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to={route_paths.home}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#0f5132]"
            >
              Home
            </Link>
            <Link
              to={route_paths.trips}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600"
            >
              Find a Ride
            </Link>

            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600"
            >
              How It Works
            </a>
            <a
              href="#why-carpool"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-600"
            >
              About
            </a>
            <div className="mt-2 flex flex-col gap-2 pt-3 border-t border-slate-100">
              {isAuthenticated ? (
                <>
                  <Link
                    to={route_paths.driverDashboard}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full rounded-xl bg-[#0d4f3e] py-2.5 text-sm font-semibold text-white"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={route_paths.login}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    Log in
                  </Link>
                  <Link
                    to={route_paths.register}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-xl bg-[#0d4f3e] py-2.5 text-sm font-semibold text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
