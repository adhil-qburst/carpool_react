import { useState } from "react";
import SearchIcon from "@shared/ui/SearchIcon";
import HelpCircleIcon from "@shared/ui/HelpCircleIcon";
import BellIcon from "@shared/ui/BellIcon";
import MenuIcon from "@shared/ui/MenuIcon";

export type DriverTopBarProps = {
  driverName?: string;
  driverInitials?: string;
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
};

const DriverTopBar = ({
  driverName = "Arun Kumar",
  driverInitials = "AK",
  onSearch,
  onMenuClick,
}: DriverTopBarProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    onSearch?.(next);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-surface-card px-4 shadow-xs sm:px-6 lg:px-8">
      {/* Left Leading Actions: Mobile Menu Toggle & Global Search */}
      <div className="flex flex-1 items-center gap-2.5 sm:gap-4">
        {/* Hamburger Menu Toggle (mobile only) */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle text-text-muted transition-colors hover:bg-surface-canvas hover:text-on-surface lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-[200px] xs:max-w-[240px] sm:max-w-xs md:max-w-sm">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search trips, routes, vehicles..."
            className="w-full rounded-xl border border-border-subtle bg-surface-canvas py-2 pr-3 pl-9 text-xs sm:text-sm text-on-surface placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-fixed"
          />
        </div>
      </div>

      {/* Right Trailing Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Support Link */}
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs sm:text-sm font-medium text-text-muted transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          <HelpCircleIcon className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Support</span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative cursor-pointer rounded-xl p-2 text-text-muted transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-surface-card" />
        </button>

        <div className="mx-0.5 sm:mx-1 h-6 w-px bg-border-subtle" />

        {/* User Quick Badge */}
        <div className="flex items-center gap-2 pl-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-xs">
            {driverInitials}
          </div>
          <span className="hidden text-sm font-semibold text-on-surface md:inline">
            {driverName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default DriverTopBar;
