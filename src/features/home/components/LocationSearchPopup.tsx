import { useState, useRef, useEffect } from "react";
import FieldIcon from "@shared/ui/FieldIcon";
import XMarkIcon from "@shared/ui/XMarkIcon";
import ChevronDownIcon from "@shared/ui/ChevronDownIcon";
import { useLocationsQuery } from "@features/locations/hooks/useLocationsQuery";
import type { LocationResponse } from "@features/locations/types/locations.api.types";

export interface LocationSearchPopupProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  popularLocations?: string[];
}

function formatLocationLabel(loc: LocationResponse): string {
  if (loc.city && !loc.name.toLowerCase().includes(loc.city.toLowerCase())) {
    return `${loc.name}, ${loc.city}`;
  }
  return loc.name;
}

export default function LocationSearchPopup({
  id,
  label,
  value,
  onChange,
  placeholder,
  popularLocations = [],
}: LocationSearchPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce user input for the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  const locationsQuery = useLocationsQuery({
    search: debouncedSearch.trim() || undefined,
    limit: 8,
    status: "active",
  });

  const locations = locationsQuery.data?.items ?? [];

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(loc: LocationResponse) {
    const formatted = formatLocationLabel(loc);
    onChange(formatted);
    setIsOpen(false);
  }

  function handleQuickSelect(locName: string) {
    onChange(locName);
    setIsOpen(false);
  }

  function handleClear() {
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isOpen ? "z-50" : "z-10"}`}
    >
      {/* Field Input Shell */}
      <div className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-canvas focus-within:border-primary focus-within:bg-surface-card focus-within:ring-2 focus-within:ring-surface-mint-border transition-all">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-primary shrink-0 hover:scale-105 transition-transform"
          aria-label={`Toggle ${label} location options`}
          title={`Choose ${label} location`}
        >
          <FieldIcon type="pin" className="h-5 w-5" />
        </button>

        <div className="flex-1 text-left min-w-0">
          <label
            htmlFor={id}
            className="block text-[11px] font-semibold text-text-muted"
          >
            {label}
          </label>
          <input
            id={id}
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${id}-popup`}
            aria-haspopup="dialog"
            aria-autocomplete="list"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full text-sm font-medium text-on-surface placeholder:text-text-muted/60 focus:outline-none bg-transparent"
          />
        </div>

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg text-text-muted hover:text-on-surface hover:bg-slate-200/60 transition"
            aria-label={`Clear ${label} location`}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}

        {/* Popup Toggle Indicator */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`p-1 rounded-lg text-text-muted hover:text-primary transition-transform ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
          aria-label={`Open ${label} location popup`}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Floating Location Selection Popup */}
      {isOpen && (
        <div
          id={`${id}-popup`}
          role="dialog"
          aria-label={`Select ${label} location`}
          className="absolute inset-x-0 top-full mt-2 z-50 rounded-2xl bg-surface-card border border-border-subtle p-3.5 shadow-2xl flex flex-col max-h-80 overflow-hidden"
        >
          {/* Popup Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-divider-line">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-bold text-on-surface">
                Select {label} Stop
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-mint text-primary font-semibold border border-surface-mint-border">
                Corridors
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-text-muted hover:text-on-surface hover:bg-surface-canvas transition"
              aria-label="Close location popup"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Trending Corridors Chips */}
          {popularLocations.length > 0 && (
            <div className="mb-2.5">
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Popular Stops
              </p>
              <div className="flex flex-wrap gap-1.5">
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleQuickSelect(loc)}
                    className="px-2 py-1 rounded-lg bg-surface-canvas hover:bg-surface-mint text-text-muted hover:text-primary text-xs font-medium border border-border-subtle transition"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Results List */}
          <div className="overflow-y-auto space-y-1 -mr-1 pr-1 flex-1">
            {locationsQuery.isLoading && (
              <div className="flex items-center gap-2.5 p-3 text-xs text-text-muted">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Searching corridor stops...</span>
              </div>
            )}

            {locationsQuery.isError && (
              <div className="p-3 text-xs text-rose-600 bg-rose-50 rounded-xl">
                Unable to load locations. You can type your location directly.
              </div>
            )}

            {!locationsQuery.isLoading &&
              !locationsQuery.isError &&
              locations.length === 0 && (
                <div className="p-3 text-center">
                  <p className="text-xs text-text-muted">
                    {value.trim()
                      ? `No verified stops found matching "${value}"`
                      : "No active corridor stops found."}
                  </p>
                  {value.trim() && (
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-mint text-primary text-xs font-semibold hover:bg-primary hover:text-on-primary transition border border-surface-mint-border"
                    >
                      Use &ldquo;{value.trim()}&rdquo;
                    </button>
                  )}
                </div>
              )}

            {!locationsQuery.isLoading &&
              locations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-surface-mint/80 text-left transition group min-h-11"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-mint text-primary group-hover:bg-primary group-hover:text-on-primary transition shrink-0">
                      <FieldIcon type="pin" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {loc.name}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {loc.city} • Highway Corridor
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                    Select
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
