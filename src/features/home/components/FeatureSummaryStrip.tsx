import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import ShieldCheckIcon from "@shared/ui/ShieldCheckIcon";
import LeafIcon from "@shared/ui/LeafIcon";
import CheckCircleIcon from "@shared/ui/CheckCircleIcon";
import { route_paths } from "@core/router/route_paths";

export default function FeatureSummaryStrip() {
  const pillars = [
    {
      id: "verified-safety",
      title: "Verified Community & Safety",
      description:
        "Every driver and passenger is verified with Government ID (Aadhaar/DL) and official corporate email addresses before their first booking.",
      points: [
        "Employer & Tech Park verification",
        "Mutual driver-passenger ratings",
        "Women-only carpool option available",
      ],
      icon: (
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-primary border border-surface-mint-border flex items-center justify-center mb-4">
          <ShieldCheckIcon className="h-6 w-6" />
        </div>
      ),
    },
    {
      id: "fixed-corridors",
      title: "Fixed Corridors & Guaranteed Seats",
      description:
        "No detours through narrow lanes. Vehicles stick strictly to regional highway axes with designated, easily reachable pickup nodes.",
      points: [
        "Scheduled pickup windows with live ETA",
        "Guaranteed seat reservation in advance",
        "Spacious AC sedans and MPVs",
      ],
      icon: (
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-primary border border-surface-mint-border flex items-center justify-center mb-4">
          <FieldIcon type="car" className="h-6 w-6" />
        </div>
      ),
    },
    {
      id: "cut-emissions",
      title: "Cut Costs & Emissions",
      description:
        "Save up to ₹4,500 every month compared to individual petrol expenses or on-demand rides, while keeping highway lanes clear of traffic.",
      points: [
        "Fixed fares from ₹80 per seat",
        "Monthly commuter tax-deductible receipt",
        "Live carbon savings counter per trip",
      ],
      icon: (
        <div className="w-12 h-12 rounded-xl bg-surface-mint text-primary border border-surface-mint-border flex items-center justify-center mb-4">
          <LeafIcon className="h-6 w-6" />
        </div>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-surface-card border-y border-border-subtle z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-surface-mint text-primary text-xs font-semibold border border-surface-mint-border">
            Why Choose CarPool
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-3">
            Designed for Dignified, Predictable Daily Travel
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-2">
            Eliminate packed bus queues and expensive solo cab rides with scheduled corporate carpooling.
          </p>
        </div>

        {/* 3 Value Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-surface-canvas rounded-2xl p-6 sm:p-8 border border-border-subtle hover:border-primary transition-all flex flex-col justify-between"
            >
              <div>
                {pillar.icon}
                <h3 className="text-lg font-bold text-on-surface mb-2">{pillar.title}</h3>
                <p className="text-sm text-text-muted mb-6 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <ul className="space-y-2 border-t border-border-subtle pt-4">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs text-on-surface">
                    <CheckCircleIcon className="h-4 w-4 text-primary shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Route Browse Banner */}
        <div className="mt-10 text-center">
          <Link
            to={route_paths.trips}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <span>Explore all scheduled routes across Kerala corridors</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
