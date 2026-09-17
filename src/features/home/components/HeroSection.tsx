import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import LeafIcon from "@shared/ui/LeafIcon";
import SearchIcon from "@shared/ui/SearchIcon";
import ArrowsRightLeftIcon from "@shared/ui/ArrowsRightLeftIcon";
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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pb-16 pt-8 sm:pb-24 lg:pt-12">
      {/* Background Image Container with Gradient Mask */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/homepage/hero-bg.jpg"
          alt="Scenic mountain lake carpool drive"
          className="h-full w-full object-cover object-[center_right] opacity-90"
        />
        {/* Soft gradient wash on left so dark text is crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent sm:w-3/4 lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.25fr_1fr] items-center gap-12">
          {/* Left Hero Content */}
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
              SHARE THE JOURNEY
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-slate-950 leading-[1.12]">
              People together{" "}
              <br />
              for a greener tomorrow
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              CarPool makes it easy to share rides, reduce travel costs, and help
              build a cleaner, more connected community.
            </p>

            {/* Ride Search Card */}
            <form
              onSubmit={handleSearch}
              className="mt-8 rounded-2xl bg-white p-3 shadow-xl shadow-slate-900/10 border border-slate-100/80 flex flex-col sm:flex-row items-center gap-2 max-w-2xl"
              role="search"
              aria-label="Find carpool rides"
            >
              {/* Pickup Location Field */}
              <div className="flex flex-1 items-center gap-3 w-full px-3 py-2">
                <div className="text-[#0f5132] shrink-0">
                  <FieldIcon type="pin" className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <label htmlFor="from-location" className="block text-[11px] font-semibold text-slate-400">
                    From
                  </label>
                  <input
                    id="from-location"
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwap}
                title="Swap pickup and destination"
                className="shrink-0 rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20"
                aria-label="Swap locations"
              >
                <ArrowsRightLeftIcon className="h-4 w-4" />
              </button>

              {/* Destination Field */}
              <div className="flex flex-1 items-center gap-3 w-full px-3 py-2">
                <div className="text-[#0f5132] shrink-0">
                  <FieldIcon type="pin" className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <label htmlFor="to-location" className="block text-[11px] font-semibold text-slate-400">
                    To
                  </label>
                  <input
                    id="to-location"
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d4f3e] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#0d4f3e]/20 transition hover:bg-[#093d30] focus:outline-none focus:ring-4 focus:ring-[#0f5132]/20"
              >
                <SearchIcon className="h-4 w-4" />
                <span>Find a Ride</span>
              </button>
            </form>

            {/* Three Benefit Badges Under Search */}
            <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-8">
              {/* Save Money */}
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e8f5e9] text-[#1b5e20] shadow-sm">
                  <LeafIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">Save Money</h3>
                  <p className="text-[11px] text-slate-500">Travel for less</p>
                </div>
              </div>

              {/* Meet New People */}
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e0f2f1] text-[#00695c] shadow-sm">
                  <FieldIcon type="users" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">Meet New People</h3>
                  <p className="text-[11px] text-slate-500">Build your community</p>
                </div>
              </div>

              {/* Greener Planet */}
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e8f5e9] text-[#1b5e20] shadow-sm">
                  <LeafIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">Greener Planet</h3>
                  <p className="text-[11px] text-slate-500">Fewer cars, cleaner air</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Floating Handwritten Script Accent */}
          <div className="hidden lg:flex justify-end pr-8">
            <div className="rotate-[-7deg] select-none">
              <span
                className="font-serif italic text-2xl sm:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] block tracking-wide"
                style={{ fontFamily: "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive" }}
              >
                A better way
                <br />
                to travel together
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
