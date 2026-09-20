import FieldIcon from "@shared/ui/FieldIcon";
import ShieldCheckIcon from "@shared/ui/ShieldCheckIcon";
import StarIcon from "@shared/ui/StarIcon";
import RupeeIcon from "@shared/ui/RupeeIcon";
import LeafIcon from "@shared/ui/LeafIcon";

const RegisterHeroPanel = () => {
  return (
    <section className="relative flex flex-col justify-between overflow-hidden border-b border-surface-mint-border bg-gradient-to-b from-[#F0FDF4] via-surface-mint to-[#E6F4F1] p-6 lg:col-span-5 lg:border-r lg:border-b-0 lg:p-10">
      {/* Top Brand & Live Stat Chip */}
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
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
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-surface-mint-border bg-surface-card/90 px-3 py-1 text-xs font-semibold text-primary shadow-xs">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-primary" />
            <span>Verified Community</span>
          </span>
        </div>

        {/* Live Stat Pill Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-surface-mint-border bg-surface-card px-3 py-1.5 text-xs font-medium text-on-surface shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span>
            🌱 <strong>142 kg CO₂</strong> saved per shared commute
          </span>
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-on-surface leading-tight lg:text-3xl">
          Shared journeys for smoother, greener daily commutes.
        </h1>
        <p className="text-sm leading-relaxed text-text-muted">
          Join thousands of verified commuters connecting across Kerala and beyond. Share empty seats, cut commute expenses, and travel with certified companions.
        </p>
      </div>

      {/* Center Visual Showcase: Photography & Trust Cards */}
      <div className="relative z-10 my-6 space-y-4">
        {/* Main Carpool Photography Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-surface-card shadow-md">
          <img
            alt="Modern commuters carpooling together happily in an eco-friendly vehicle"
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-52"
            src="/auth/carpool_commute.jpg"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4">
            <div className="text-white">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
                <LeafIcon className="h-3.5 w-3.5 text-emerald-200" />
                <span>Community Verified Trips</span>
              </div>
              <p className="line-clamp-1 text-xs font-medium text-white/90">
                Friendly companions, split fuel costs &amp; serene highway travel.
              </p>
            </div>
          </div>
        </div>

        {/* Micro Testimonial + Route illustration thumbnail */}
        <div className="flex items-center gap-3.5 rounded-xl border border-surface-mint-border bg-surface-card/90 p-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-white p-1">
            <img
              alt="Carpool concept illustration"
              className="h-full w-full object-contain"
              src="/auth/carpool_network.png"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-1 text-amber-500">
              <StarIcon className="h-3.5 w-3.5 text-amber-500" />
              <StarIcon className="h-3.5 w-3.5 text-amber-500" />
              <StarIcon className="h-3.5 w-3.5 text-amber-500" />
              <StarIcon className="h-3.5 w-3.5 text-amber-500" />
              <StarIcon className="h-3.5 w-3.5 text-amber-500" />
              <span className="ml-1 text-[11px] font-medium text-text-muted">
                4.9/5 Rating
              </span>
            </div>
            <p className="truncate text-xs font-medium text-on-surface">
              &ldquo;Offsets ₹4,500 monthly commute costs seamlessly!&rdquo;
            </p>
            <p className="text-[11px] text-text-muted">
              Divya M. • Regular Kochi to InfoPark commuter
            </p>
          </div>
        </div>

        {/* Three Core Trust Pillars */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="rounded-xl border border-border-subtle bg-surface-card/70 p-2.5 shadow-2xs">
            <ShieldCheckIcon className="mx-auto mb-1 h-5 w-5 text-primary" />
            <div className="text-[11px] font-semibold text-on-surface leading-tight">
              Govt. KYC Verified
            </div>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-card/70 p-2.5 shadow-2xs">
            <RupeeIcon className="mx-auto mb-1 h-5 w-5 text-primary" />
            <div className="text-[11px] font-semibold text-on-surface leading-tight">
              0% Platform Fee
            </div>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-card/70 p-2.5 shadow-2xs">
            <FieldIcon type="clock" className="mx-auto mb-1 h-5 w-5 text-primary" />
            <div className="text-[11px] font-semibold text-on-surface leading-tight">
              24/7 Ride SOS
            </div>
          </div>
        </div>
      </div>

      {/* Left Panel Footer Details */}
      <div className="relative z-10 flex items-center justify-between border-t border-surface-mint-border pt-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          3,400+ commutes active this week
        </span>
        <span className="font-medium text-primary">Kerala &amp; Regional Hubs</span>
      </div>
    </section>
  );
};

export default RegisterHeroPanel;
