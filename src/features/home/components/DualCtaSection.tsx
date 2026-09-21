import { Link } from "react-router";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import { route_paths } from "@core/router/route_paths";

interface DualCtaSectionProps {
  id?: string;
}

export default function DualCtaSection({ id = "drive" }: DualCtaSectionProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Commuter Persona Card */}
          <div className="bg-surface-card rounded-3xl p-8 sm:p-10 border border-border-subtle shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-info-surface text-info-text border border-blue-200 text-xs font-semibold">
                For Daily Commuters
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Commuting to work? Book your seat today and skip the bus rush.
              </h3>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Enjoy comfortable air-conditioned journeys with reliable pickup schedules, verified peer travelers, and guaranteed seats every morning.
              </p>
            </div>
            <div className="mt-8 pt-4">
              <Link
                to={route_paths.trips}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm"
              >
                <span>Find a Ride Now</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Driver Persona Card */}
          <div className="bg-surface-card rounded-3xl p-8 sm:p-10 border border-border-subtle shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-surface-mint text-primary border border-surface-mint-border text-xs font-semibold">
                For Car Owners
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Own a car? Turn empty seats into monthly fuel savings.
              </h3>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Offset 100% of your highway fuel and toll bills by sharing your everyday commute with vetted colleagues heading in your same direction.
              </p>
            </div>
            <div className="mt-8 pt-4">
              <Link
                to={route_paths.tripsNew}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-primary text-primary hover:bg-surface-mint text-sm font-semibold transition-all"
              >
                <span>Register as a Driver</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
