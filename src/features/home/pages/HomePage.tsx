import HomeNavbar from "../components/HomeNavbar";
import HeroSection from "../components/HeroSection";
import FeatureSummaryStrip from "../components/FeatureSummaryStrip";
import WhyChooseSection from "../components/WhyChooseSection";
import TrustSafetySection from "../components/TrustSafetySection";
import DualCtaSection from "../components/DualCtaSection";
import HomeFooter from "../components/HomeFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-canvas text-on-surface flex flex-col selection:bg-primary/10 selection:text-primary">
      {/* Top Sticky Navigation Bar */}
      <HomeNavbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Dual Imagery & Corridor Search Engine */}
        <HeroSection />

        {/* Key Commuter Pillars (Verified Safety, Fixed Corridors, Cut Costs) */}
        <FeatureSummaryStrip />

        {/* How It Works (3 Steps) */}
        <WhyChooseSection />

        {/* Trust & Safety Standards Bento */}
        <TrustSafetySection />

        {/* Dual Persona Commuter & Driver CTA */}
        <DualCtaSection />
      </main>

      {/* Comprehensive Platform Footer */}
      <HomeFooter />
    </div>
  );
}
