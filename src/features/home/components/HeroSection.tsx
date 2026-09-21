import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import LeafIcon from "@shared/ui/LeafIcon";
import ShieldCheckIcon from "@shared/ui/ShieldCheckIcon";
import SearchIcon from "@shared/ui/SearchIcon";
import ArrowsRightLeftIcon from "@shared/ui/ArrowsRightLeftIcon";
import LocationSearchPopup from "./LocationSearchPopup";
import { route_paths } from "@core/router/route_paths";

export default function HeroSection() {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  function handleSwap() {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (fromLocation.trim()) params.set("pickup", fromLocation.trim());
    if (toLocation.trim()) params.set("destination", toLocation.trim());
    const queryString = params.toString();
    navigate(queryString ? `${route_paths.trips}?${queryString}` : route_paths.trips);
  }

  return (
    <section className="relative pt-6 sm:pt-10 pb-16 lg:pb-24 overflow-visible bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 lg:mb-16">
          {/* Hero Copy Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-mint text-primary border border-surface-mint-border">
              <LeafIcon className="h-4 w-4" />
              <span className="text-xs font-semibold">Eco-Commute Corridor Network</span>
            </div>

            <p className="text-xs font-bold tracking-widest text-text-muted uppercase">
              SHARE THE JOURNEY
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface leading-[1.15]">
              Smarter Commutes.<br />
              <span className="text-primary">Cleaner Air.</span> Shared Journeys.
            </h1>

            <p className="text-base sm:text-lg text-text-muted max-w-2xl leading-relaxed">
              CarPool makes it easy to share rides, reduce travel costs, and help build a cleaner,
              more connected community along recurring Kerala highway corridors.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-on-surface">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheckIcon className="h-5 w-5 text-primary" />
                <span>100% ID Verified</span>
              </div>
              <div className="h-4 w-px bg-border-subtle" />
              <div className="flex items-center gap-2 font-medium">
                <FieldIcon type="car" className="h-5 w-5 text-primary" />
                <span>Zero Surge Pricing</span>
              </div>
              <div className="h-4 w-px bg-border-subtle" />
              <div className="flex items-center gap-2 font-medium">
                <FieldIcon type="users" className="h-5 w-5 text-primary" />
                <span>Guaranteed Seat</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Right Column with dual images */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-border-subtle bg-surface-card shadow-lg p-2.5">
              {/* Primary Carpool Photo */}
              <div className="rounded-xl overflow-hidden h-64 sm:h-72 w-full relative">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UHY0obgoTCD1EFR_ub8SBnsvzWVaT5CXxcB8CKN5A_FqjOdrnk9gnq2BF-aEdjxeQCNzywHINEsI6o-9_23jsM9IqEIf7bZ5kNY3mTRaJiLRxbNVIwULYYr77s7vuQ7tH9Vuj5J_3kdIQKT69gEDw1FezYwwDeyeFVriWUjv18Z5CfoHmy0qXqdncikA0i8UFXde2-j7YJ_zSGcbvZdhems0nuGmBDLZBHVNnmGHoAO9l3InLRsLILBAhn"
                  alt="A happy group of coworkers carpooling together comfortably in a modern electric vehicle on an open scenic highway"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    // Fallback to local asset if external image fails
                    (e.target as HTMLImageElement).src = "/homepage/hero-bg.jpg";
                  }}
                />
                <div className="absolute bottom-3 left-3 bg-surface-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border-subtle shadow-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold text-on-surface">Kochi ⇄ Thrissur Corridor Active</span>
                </div>
              </div>

              {/* Overlaid Concept Card */}
              <div className="mt-2.5 p-3 bg-surface-mint/70 rounded-xl border border-surface-mint-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-surface-card border border-border-subtle shrink-0 overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida/AEtjO1X1c9UQ4rN6_MmXdaNIkldugQEKeCEQF2siQbfNeqmbjfKr5Zr0a9VpHzyc0yVv5sOzIvsdIR697cQ2O3iWAz3x8ZdENqTcJB1vouB-mqU-TrNcxoYAE1Z40_yLu_zTlSZHbCbleclp9ui3w59wMfQcDo4exB2qP-gIXSHi2QS-a1LTRPi9uk327t1mKtsBEqlpNoFqqR9YF-knHiJ4vLyITDvGgvsdMLZOQucfqFqJDDapgZhtzPPWZGr-"
                    alt="Clean minimalist 3D isometric representation of smart shared carpooling route with GPS pinpoint"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/homepage/carbon-footprint.jpg";
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Daily Corporate Carpool</h4>
                  <p className="text-xs text-text-muted">4,820 kg CO₂ mitigated this month across NH-544 commuters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elevated Ride Search Widget */}
        <div id="search" className="relative z-20 bg-surface-card border border-border-subtle rounded-2xl p-4 sm:p-6 shadow-md max-w-6xl mx-auto">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-divider-line">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-semibold">
                <SearchIcon className="h-3.5 w-3.5" />
                <span>Find Daily Commute</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-canvas text-text-muted text-xs font-medium border border-border-subtle">
                Fixed Highway Corridor
              </span>
            </div>
            <span className="text-xs text-text-muted hidden sm:inline">Fixed stops along highways &amp; tech parks</span>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center relative z-10"
            role="search"
            aria-label="Find carpool rides"
          >
            {/* Origin Stop with Location Popup */}
            <div className="md:col-span-5 relative">
              <LocationSearchPopup
                id="from-location"
                label="From"
                value={fromLocation}
                onChange={setFromLocation}
                placeholder="Enter pickup location (e.g. Kaloor, Kochi)"
              />
            </div>

            {/* Swap Button (desktop) */}
            <div className="hidden md:flex md:col-span-1 justify-center relative">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap pickup and destination"
                className="shrink-0 rounded-xl border border-border-subtle p-2.5 text-text-muted hover:bg-surface-canvas hover:text-on-surface transition focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Swap locations"
              >
                <ArrowsRightLeftIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Destination Stop with Location Popup */}
            <div className="md:col-span-4 relative">
              <LocationSearchPopup
                id="to-location"
                label="To"
                value={toLocation}
                onChange={setToLocation}
                placeholder="Enter destination (e.g. Swaraj Round, Thrissur)"
              />
            </div>

            {/* Mobile Swap Button */}
            <div className="flex md:hidden justify-end">
              <button
                type="button"
                onClick={handleSwap}
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-on-surface py-1 px-2 rounded-lg border border-border-subtle"
                aria-label="Swap locations"
              >
                <ArrowsRightLeftIcon className="h-3.5 w-3.5" />
                <span>Swap pickup &amp; dropoff</span>
              </button>
            </div>

            {/* Search Submit CTA Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-11.5 rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-all shadow-sm active:scale-98"
              >
                <SearchIcon className="h-4 w-4" />
                <span>Find Commute</span>
              </button>
            </div>
          </form>

          {/* Quick Corridor Selection Pills */}
          <div className="mt-4 pt-3 border-t border-divider-line flex flex-wrap items-center gap-2 relative z-0">
            <span className="text-xs font-semibold text-text-muted mr-1">Trending Corridors:</span>
            <button
              type="button"
              onClick={() => {
                setFromLocation("Kochi");
                setToLocation("Thrissur");
              }}
              className="px-2.5 py-1 rounded-lg bg-surface-canvas hover:bg-surface-mint text-text-muted hover:text-primary text-xs border border-border-subtle transition-colors"
            >
              Kochi ⇄ Thrissur (₹180)
            </button>
            <button
              type="button"
              onClick={() => {
                setFromLocation("Aluva");
                setToLocation("Infopark");
              }}
              className="px-2.5 py-1 rounded-lg bg-surface-canvas hover:bg-surface-mint text-text-muted hover:text-primary text-xs border border-border-subtle transition-colors"
            >
              Aluva ⇄ Infopark (₹90)
            </button>
            <button
              type="button"
              onClick={() => {
                setFromLocation("Angamaly");
                setToLocation("Kakkanad");
              }}
              className="px-2.5 py-1 rounded-lg bg-surface-canvas hover:bg-surface-mint text-text-muted hover:text-primary text-xs border border-border-subtle transition-colors"
            >
              Angamaly ⇄ Kakkanad (₹110)
            </button>
            <button
              type="button"
              onClick={() => {
                setFromLocation("Thrissur");
                setToLocation("Koratty");
              }}
              className="px-2.5 py-1 rounded-lg bg-surface-canvas hover:bg-surface-mint text-text-muted hover:text-primary text-xs border border-border-subtle transition-colors"
            >
              Thrissur ⇄ Koratty (₹80)
            </button>
          </div>
        </div>

        {/* Three Benefit Badges Under Search */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {/* Save Money */}
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-mint text-primary border border-surface-mint-border shadow-sm">
              <LeafIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-on-surface leading-tight">Save Money</h3>
              <p className="text-[11px] text-text-muted">Travel for less</p>
            </div>
          </div>

          {/* Meet New People */}
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-mint text-primary border border-surface-mint-border shadow-sm">
              <FieldIcon type="users" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-on-surface leading-tight">Meet New People</h3>
              <p className="text-[11px] text-text-muted">Build your community</p>
            </div>
          </div>

          {/* Greener Planet */}
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-mint text-primary border border-surface-mint-border shadow-sm">
              <LeafIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-on-surface leading-tight">Greener Planet</h3>
              <p className="text-[11px] text-text-muted">Lower emissions together</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
