import { Link, useLocation } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import RouteIcon from "@shared/ui/RouteIcon";
import XMarkIcon from "@shared/ui/XMarkIcon";
import { route_paths } from "@core/router/route_paths";

export type DriverSidebarProps = {
  driverName?: string;
  driverInitials?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

const DriverSidebar = ({
  driverName = "Arun Kumar",
  driverInitials = "AK",
  isOpen = false,
  onClose,
}: DriverSidebarProps) => {
  const location = useLocation();

  const isDashboard =
    location.pathname === route_paths.driverDashboard ||
    location.pathname === route_paths.home;
  const isTrips = location.pathname.startsWith(route_paths.trips);
  const isRoutes = location.pathname.startsWith(route_paths.routes);

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer on Mobile / Fixed Sidebar on Desktop */}
      <aside
        aria-label="Driver Sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border-subtle bg-surface-card shadow-xl transition-transform duration-300 ease-in-out lg:z-30 lg:translate-x-0 lg:shadow-xs ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full w-full flex-col justify-between p-4 overflow-y-auto">
          {/* Top Branding & Navigation */}
          <div className="flex flex-col gap-6">
            {/* Brand Header & Mobile Close Button */}
            <div className="flex items-center justify-between px-2 pt-2">
              <Link
                to={route_paths.home}
                onClick={handleLinkClick}
                className="flex items-center gap-3 transition-opacity hover:opacity-90"
                aria-label="CarPool Home"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-mint-border bg-surface-mint text-primary shadow-xs">
                  <FieldIcon type="car" className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-primary">
                    CarPool
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    Driver Workspace
                  </span>
                </div>
              </Link>

              {/* Close button on mobile */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface lg:hidden"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Create Trip Quick CTA */}
            <div className="px-1">
              <Link
                to={route_paths.tripsNew}
                onClick={handleLinkClick}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:bg-primary-hover active:scale-95"
              >
                <PlusIcon className="h-4 w-4 text-white" />
                <span>Create New Trip</span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav
              aria-label="Driver Navigation Links"
              className="flex flex-col gap-1.5"
            >
              {/* Dashboard Link */}
              <Link
                to={route_paths.driverDashboard}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isDashboard
                    ? "border border-surface-mint-border bg-surface-mint text-primary"
                    : "text-text-muted hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <FieldIcon type="tag" className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {/* My Trips Link */}
              <Link
                to={route_paths.trips}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isTrips
                    ? "border border-surface-mint-border bg-surface-mint text-primary"
                    : "text-text-muted hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <FieldIcon type="calendar" className="h-4 w-4" />
                <span>My Trips</span>
              </Link>

              {/* Routes Link */}
              <Link
                to={route_paths.routes}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isRoutes
                    ? "border border-surface-mint-border bg-surface-mint text-primary"
                    : "text-text-muted hover:bg-surface-container-low hover:text-on-surface font-medium"
                }`}
              >
                <RouteIcon className="h-4 w-4" />
                <span>Routes</span>
              </Link>

              {/* Vehicles Link */}
              <Link
                to={route_paths.vehicles}
                onClick={handleLinkClick}
                className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface"
              >
                <FieldIcon type="car" className="h-4 w-4" />
                <span>Vehicles</span>
              </Link>

              {/* Profile Link */}
              <Link
                to="#profile"
                onClick={handleLinkClick}
                className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface"
              >
                <FieldIcon type="person" className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </nav>
          </div>

          {/* Bottom Profile Quick View */}
          <div className="flex items-center justify-between border-t border-border-subtle px-2 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-mint text-sm font-semibold text-primary">
                {driverInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-on-surface">
                  {driverName}
                </span>
                <span className="text-xs text-text-muted">Verified Driver</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DriverSidebar;
