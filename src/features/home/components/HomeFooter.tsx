import { Link } from "react-router";
import CarPoolLogo from "@shared/ui/CarPoolLogo";
import { route_paths } from "@core/router/route_paths";

export default function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-card border-t border-border-subtle pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-divider-line">
          {/* Brand Summary Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to={route_paths.home} className="inline-block">
              <CarPoolLogo />
            </Link>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">
              Empowering regional commuters with reliable, sustainable, and dignified shared mobility along high-frequency regional corridors.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-text-muted text-xs">
              <span className="font-medium">Active Corridors:</span>
              <span className="font-semibold text-on-surface">Kochi • Thrissur • Aluva • Kakkanad</span>
            </div>
          </div>

          {/* Commuters Column */}
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-3 tracking-wide">Commuters</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link to={route_paths.trips} className="hover:text-primary transition-colors">
                  Find a Commute
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-primary transition-colors">
                  Safety Standards
                </a>
              </li>
              <li>
                <Link to={route_paths.trips} className="hover:text-primary transition-colors">
                  Fixed Corridors
                </Link>
              </li>
            </ul>
          </div>

          {/* Drivers Column */}
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-3 tracking-wide">Drivers</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link to={route_paths.tripsNew} className="hover:text-primary transition-colors">
                  Publish a Route
                </Link>
              </li>
              <li>
                <Link to={route_paths.vehicles} className="hover:text-primary transition-colors">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link to={route_paths.routes} className="hover:text-primary transition-colors">
                  Manage Routes
                </Link>
              </li>
              <li>
                <a href="#drive" className="hover:text-primary transition-colors">
                  Driver Benefits
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-3 tracking-wide">Legal &amp; Trust</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a href="#safety" className="hover:text-primary transition-colors">
                  Safety Standards
                </a>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Zero-Surge Policy</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© {currentYear} CarPool Mobility Inc. All rights reserved. Built for calm, clean, shared transit.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            <span className="font-medium text-on-surface">All Regional Routes Operating Normally</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
