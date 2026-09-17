import HomeNavbar from "../components/HomeNavbar";
import HeroSection from "../components/HeroSection";
import FeatureSummaryStrip from "../components/FeatureSummaryStrip";
import WhyChooseSection from "../components/WhyChooseSection";
import CarPoolLogo from "@shared/ui/CarPoolLogo";
import { Link } from "react-router";
import { route_paths } from "@core/router/route_paths";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#0f5132]/10 selection:text-[#0f5132]">
      {/* Top Navigation Bar */}
      <HomeNavbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Banner with Ride Search */}
        <HeroSection />

        {/* 4 Pillars Value Summary Strip */}
        <FeatureSummaryStrip />

        {/* Why Choose CarPool Section with Story Cards */}
        <WhyChooseSection />
      </main>

      {/* Clean Modern Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <CarPoolLogo />
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <Link to={route_paths.trips} className="hover:text-[#0f5132] transition">
                Find Rides
              </Link>

              <Link to={route_paths.vehicles} className="hover:text-[#0f5132] transition">
                Vehicles
              </Link>
              <Link to={route_paths.routes} className="hover:text-[#0f5132] transition">
                Routes
              </Link>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} CarPool. People together for a greener tomorrow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
