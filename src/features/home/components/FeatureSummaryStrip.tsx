import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import ShieldCheckIcon from "@shared/ui/ShieldCheckIcon";
import LeafIcon from "@shared/ui/LeafIcon";
import { route_paths } from "@core/router/route_paths";

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  to?: string;
}

export default function FeatureSummaryStrip() {
  const features: FeatureItem[] = [
    {
      id: "find-ride",
      title: "Find a Ride",
      description: "Search and book seats on available trips",
      to: route_paths.trips,
      icon: (
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#e8f5e9] text-[#1b5e20] shadow-sm">
          <FieldIcon type="users" className="h-6 w-6" />
        </div>
      ),
    },

    {
      id: "travel-confidence",
      title: "Travel with Confidence",
      description: "Verified users and secure bookings",
      icon: (
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#fff3e0] text-[#e65100] shadow-sm">
          <ShieldCheckIcon className="h-6 w-6" />
        </div>
      ),
    },
    {
      id: "make-impact",
      title: "Make an Impact",
      description: "Reduce emissions and support sustainable travel",
      icon: (
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#e8f5e9] text-[#2e7d32] shadow-sm">
          <LeafIcon className="h-6 w-6" />
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="border-y border-slate-100 bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const content = (
              <div className="flex items-center gap-4 group">
                <div className="shrink-0 transition-transform group-hover:scale-105">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0f5132] transition">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );

            return feature.to ? (
              <Link
                key={feature.id}
                to={feature.to}
                className="focus:outline-none focus:ring-2 focus:ring-[#0f5132]/20 rounded-xl p-1 -m-1"
              >
                {content}
              </Link>
            ) : (
              <div key={feature.id} className="p-1 -m-1">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
