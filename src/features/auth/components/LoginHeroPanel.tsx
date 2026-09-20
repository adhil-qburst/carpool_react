import FieldIcon from "@shared/ui/FieldIcon";
import LeafIcon from "@shared/ui/LeafIcon";
import ShieldCheckIcon from "@shared/ui/ShieldCheckIcon";

const LoginHeroPanel = () => {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden rounded-3xl bg-primary text-white shadow-xl lg:col-span-6 lg:flex xl:col-span-7">
      {/* Background Hero Photo Container */}
      <div className="relative h-72 w-full overflow-hidden xl:h-80">
        <img
          src="/auth/carpool_commute.jpg"
          alt="Friendly commuters and driver carpooling peacefully"
          className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

        {/* Floated Top In-Card Brand & Community Badges */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-3 z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-on-surface shadow-md backdrop-blur-md">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white">
              <FieldIcon type="car" className="h-3 w-3 text-white" />
            </div>
            <span>
              Car<span className="text-primary">Pool</span>
            </span>
            <span className="text-border-subtle" aria-hidden="true">•</span>
            <span className="text-[11px] font-medium text-text-muted">Shared Mobility</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-md backdrop-blur-md">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-primary" />
            <span>12,000+ verified trips</span>
          </div>
        </div>

        {/* Overlaid Eco Badge */}
        <div className="absolute right-5 bottom-4 hidden items-center gap-3 rounded-2xl border border-primary-fixed/20 bg-primary-container/90 p-2 pr-3.5 shadow-lg backdrop-blur-md xl:flex">
          <img
            src="/auth/carpool_network.png"
            alt="Carpool network icon"
            className="h-10 w-10 rounded-xl bg-white p-1 object-contain shadow-xs"
          />
          <div className="text-left">
            <p className="text-xs font-bold leading-tight text-white">Eco Commute Relay</p>
            <p className="text-[11px] leading-tight text-primary-fixed">Zero-hassle city pairs</p>
          </div>
        </div>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-8 xl:p-10">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-fixed/20 bg-surface-mint/15 px-3 py-1 text-xs font-semibold text-primary-fixed">
            <LeafIcon className="h-3.5 w-3.5 text-primary-fixed" />
            <span>Intelligent Community Transit</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white leading-tight xl:text-4xl">
            One unified platform for drivers and daily commuters.
          </h1>
          <p className="mb-6 text-base text-primary-fixed-dim leading-relaxed">
            Connect with verified coworkers and trusted neighbors. Reduce your carbon footprint while enjoying predictable, split-fare journeys.
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-fixed/20 text-primary-fixed">
                <ShieldCheckIcon className="h-5 w-5 text-primary-fixed" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Verified Community</h3>
                <p className="mt-0.5 text-xs text-white/75 leading-snug">
                  Strict identity &amp; license safety checks for both drivers and riders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-fixed/20 text-primary-fixed">
                <FieldIcon type="pin" className="h-5 w-5 text-primary-fixed" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Smart Corridor Routes</h3>
                <p className="mt-0.5 text-xs text-white/75 leading-snug">
                  Pre-calculated pickup waypoints that keep commutes direct and swift.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Operational Status */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-primary-fixed">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-surface-mint-border opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-surface-mint-border" />
            </span>
            <span>All Corridor Relays Active &amp; Monitored</span>
          </div>
          <span>v2.4 Production</span>
        </div>
      </div>
    </div>
  );
};

export default LoginHeroPanel;
