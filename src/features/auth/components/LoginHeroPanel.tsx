import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import LeafIcon from "@shared/ui/LeafIcon";
import ShieldCheckIcon from "@shared/ui/ShieldCheckIcon";
import { route_paths } from "@core/router/route_paths";

const LoginHeroPanel = () => {
  return (
    <section className="relative flex flex-col justify-between overflow-hidden border-b border-surface-mint-border bg-gradient-to-b from-[#F0FDF4] via-surface-mint to-[#E6F4F1] p-6 lg:col-span-6 lg:border-r lg:border-b-0 lg:p-10 xl:col-span-6">
      {/* Top Brand & Verified Community Badge */}
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to={route_paths.home}
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
            aria-label="CarPool Home"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
              <FieldIcon type="car" className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-primary">
                CarPool
              </span>
              <span className="block text-xs font-medium text-text-muted">
                Sustainable Commute Network
              </span>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full border border-surface-mint-border bg-surface-card/90 px-3 py-1 text-xs font-semibold text-primary shadow-xs">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-primary" />
            <span>Verified Community</span>
          </span>
        </div>

        {/* Intelligent Community Transit Pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-surface-mint-border bg-surface-card px-3 py-1.5 text-xs font-semibold text-primary shadow-xs">
          <LeafIcon className="h-3.5 w-3.5 text-primary" />
          <span>Intelligent Community Transit</span>
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-on-surface leading-tight lg:text-3xl">
          One unified platform for drivers and daily commuters.
        </h1>
        <p className="text-sm leading-relaxed text-text-muted">
          Connect with verified coworkers and trusted neighbors. Reduce your carbon footprint while enjoying predictable, split-fare journeys.
        </p>
      </div>

      {/* Center Visual Showcase: Photography Card */}
      <div className="relative z-10 my-6 space-y-4">
        <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-surface-card shadow-md">
          <img
            alt="Friendly commuters and driver carpooling peacefully"
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-52"
            src="/auth/carpool_commute.jpg"
          />
          <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4">
            <div className="text-white">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-200" />
                <span>Over 12,000 verified trips</span>
              </div>
              <p className="line-clamp-1 text-xs font-medium text-white/90">
                Across Kerala corridors &amp; daily workplace relays
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-xl bg-surface-card/90 px-2.5 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-sm sm:flex">
              <span>Eco Commute Relay</span>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-surface-mint-border bg-surface-card/80 p-3 shadow-2xs backdrop-blur-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-mint text-primary">
              <ShieldCheckIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-on-surface">Verified Community</h3>
              <p className="mt-0.5 text-[11px] text-text-muted leading-snug">
                Strict identity &amp; license safety checks for both drivers and riders.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-surface-mint-border bg-surface-card/80 p-3 shadow-2xs backdrop-blur-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-mint text-primary">
              <FieldIcon type="pin" className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-on-surface">Smart Corridor Routes</h3>
              <p className="mt-0.5 text-[11px] text-text-muted leading-snug">
                Pre-calculated pickup waypoints that keep commutes direct and swift.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Status Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-surface-mint-border pt-4 text-xs text-text-muted">
        <div className="flex items-center gap-2 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span>All Corridor Relays Active &amp; Monitored</span>
        </div>
        <span className="font-medium text-primary">v2.4 Production</span>
      </div>
    </section>
  );
};

export default LoginHeroPanel;
