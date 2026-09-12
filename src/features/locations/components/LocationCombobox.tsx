import { useState, useRef, useEffect } from "react";
import FieldIcon from "@shared/ui/FieldIcon";
import XMarkIcon from "@shared/ui/XMarkIcon";
import { useLocationsQuery } from "../hooks/useLocationsQuery";

export interface SelectedLocation {
  id: string;
  name: string;
  city: string;
}

export interface LocationComboboxProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string | null;
  selectedLocation?: SelectedLocation | null;
  onSelect: (location: SelectedLocation) => void;
  onClear?: () => void;
  disabledLocationIds?: string[];
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function LocationCombobox({
  id,
  label,
  placeholder = "Search location by name or city...",
  value,
  selectedLocation,
  onSelect,
  onClear,
  disabledLocationIds = [],
  hasError = false,
  errorMessage,
  disabled = false,
  required = false,
}: LocationComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const locationsQuery = useLocationsQuery({
    search: search.trim() || undefined,
    limit: 10,
    status: "active",
  });

  const locations = locationsQuery.data?.items ?? [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(loc: { id: string; name: string; city: string }) {
    onSelect(loc);
    setSearch("");
    setIsOpen(false);
  }

  function handleClear() {
    setSearch("");
    if (onClear) {
      onClear();
    }
    setIsOpen(false);
    inputRef.current?.focus();
  }

  const borderClass = hasError
    ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-100"
    : "border-slate-200 focus-within:border-indigo-500 focus-within:ring-indigo-100";

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={`${id}-input`}
        className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700"
      >
        <span>
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </span>
        {selectedLocation && (
          <span className="text-xs font-normal text-emerald-600">Selected</span>
        )}
      </label>

      {selectedLocation ? (
        <div
          className={`flex items-center justify-between rounded-xl border bg-slate-50/70 p-3 text-sm transition ${
            hasError ? "border-rose-400" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
              <FieldIcon type="pin" className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {selectedLocation.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {selectedLocation.city}
              </p>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Change or clear location"
              aria-label={`Clear selected ${label}`}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`relative flex items-center rounded-xl border bg-white text-slate-400 transition focus-within:ring-4 ${borderClass}`}
        >
          <span className="pointer-events-none absolute left-3.5 top-3.5">
            <FieldIcon type="pin" className="h-5 w-5" />
          </span>
          <input
            id={`${id}-input`}
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            disabled={disabled}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-xl bg-transparent py-3 pl-11 pr-10 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Hidden input for form tracking if needed */}
      <input type="hidden" id={id} name={id} value={value ?? ""} />

      {/* Dropdown menu */}
      {isOpen && !selectedLocation && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          {locationsQuery.isLoading && (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-500">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span>Searching locations...</span>
            </div>
          )}

          {locationsQuery.isError && (
            <div className="p-3 text-sm text-rose-600">
              Unable to load locations. Please try again.
            </div>
          )}

          {!locationsQuery.isLoading &&
            !locationsQuery.isError &&
            locations.length === 0 && (
              <div className="p-3 text-sm text-slate-500">
                {search.trim()
                  ? `No locations found matching "${search}"`
                  : "No active locations available."}
              </div>
            )}

          {!locationsQuery.isLoading &&
            locations.map((loc) => {
              const isDisabled = disabledLocationIds.includes(loc.id);
              return (
                <button
                  key={loc.id}
                  type="button"
                  role="option"
                  aria-selected={false}
                  disabled={isDisabled}
                  onClick={() =>
                    handleSelect({
                      id: loc.id,
                      name: loc.name,
                      city: loc.city,
                    })
                  }
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    isDisabled
                      ? "cursor-not-allowed opacity-40"
                      : "hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate font-medium text-slate-900">
                      {loc.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {loc.city}
                    </p>
                  </div>
                  {isDisabled && (
                    <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      Already in route
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      )}

      {errorMessage && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
