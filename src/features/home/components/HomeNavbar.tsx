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
    <header className="sticky top-0 z-40 w-full bg-surface-card/95 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to={route_paths.home}
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
          aria-label="CarPool Home"
        >
          <CarPoolLogo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to={route_paths.home}
            className="relative py-1 text-sm font-semibold text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
          >
            Home
          </Link>
          <Link
            to={route_paths.trips}
            className="text-sm font-medium text-text-muted transition hover:text-primary"
          >
            Find a Ride
          </Link>
          <Link
            to={route_paths.tripsNew}
            className="text-sm font-medium text-text-muted transition hover:text-primary"
          >
            Offer a Ride
          </Link>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-text-muted transition hover:text-primary"
          >
            How It Works
          </a>
          <a
            href="#safety"
            className="text-sm font-medium text-text-muted transition hover:text-primary"
          >
            Safety &amp; Trust
          </a>
          <a
            href="#drive"
            className="text-sm font-medium text-text-muted transition hover:text-primary flex items-center gap-1.5"
          >
            <span>Drive with Us</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-mint text-primary text-[11px] font-semibold border border-surface-mint-border">
              Earn ₹18k/mo
            </span>
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={route_paths.driverDashboard}
                className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-canvas"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to={route_paths.login}
                className="rounded-xl border border-border-subtle px-5 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-canvas"
              >
                Log in
              </Link>
              <Link
                to={route_paths.register}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
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
        <div className="border-t border-border-subtle bg-surface-card px-4 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to={route_paths.home}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-primary"
            >
              Home
            </Link>
            <Link
              to={route_paths.trips}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-muted hover:text-on-surface"
            >
              Find a Ride
            </Link>
            <Link
              to={route_paths.tripsNew}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-muted hover:text-on-surface"
            >
              Offer a Ride
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-muted hover:text-on-surface"
            >
              How It Works
            </a>
            <a
              href="#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-muted hover:text-on-surface"
            >
              Safety &amp; Trust
            </a>
            <a
              href="#drive"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-text-muted hover:text-on-surface flex items-center gap-2"
            >
              <span>Drive with Us</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-mint text-primary text-[11px] font-semibold border border-surface-mint-border">
                Earn ₹18k/mo
              </span>
            </a>
            <div className="mt-2 flex flex-col gap-2 pt-3 border-t border-divider-line">
              {isAuthenticated ? (
                <>
                  <Link
                    to={route_paths.driverDashboard}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-xl border border-border-subtle py-2.5 text-sm font-semibold text-on-surface"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-on-primary"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={route_paths.login}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-xl border border-border-subtle py-2.5 text-sm font-semibold text-on-surface"
                  >
                    Log in
                  </Link>
                  <Link
                    to={route_paths.register}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center rounded-xl bg-primary py-2.5 text-sm font-semibold text-on-primary"
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
