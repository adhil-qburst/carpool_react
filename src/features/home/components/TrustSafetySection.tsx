interface TrustSafetySectionProps {
  id?: string;
}

export default function TrustSafetySection({ id = "safety" }: TrustSafetySectionProps) {
  const safetyFeatures = [
    {
      id: "vetting",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
      title: "Government ID Vetting",
      description: "Aadhaar and valid Driving License cross-referenced via DigiLocker before any driver takes the wheel.",
    },
    {
      id: "tracking",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Live Corridor Tracking",
      description: "Share your live transit location with family contacts via encrypted WhatsApp live links.",
    },
    {
      id: "capacity",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Strict Capacity Caps",
      description: "No cramped center seats. Sedans are strictly limited to 3 passengers maximum for executive comfort.",
    },
    {
      id: "zero-surge",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "No Dynamic Surging",
      description: "Pre-agreed fuel contribution rates that never inflate during rain, festivals, or peak morning rush hours.",
    },
  ];

  return (
    <section id={id} className="py-16 bg-surface-canvas border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-card rounded-3xl p-8 sm:p-12 border border-border-subtle shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-surface-mint text-primary text-xs font-semibold border border-surface-mint-border">
                Zero Compromise
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Safety and Trust Built into Every Mile
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                CarPool is strictly a closed community network. We do not support anonymous pickups or ad-hoc commercial taxi hailing.
              </p>
              <div className="pt-2">
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <span>Read full Community Safety Guidelines</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right 2x2 Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safetyFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="p-5 rounded-2xl bg-surface-canvas border border-border-subtle"
                >
                  <div className="w-9 h-9 rounded-xl bg-surface-mint text-primary flex items-center justify-center mb-3 border border-surface-mint-border">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-bold text-on-surface mb-1">{feature.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
