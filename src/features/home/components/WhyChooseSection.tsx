import FieldIcon from "@shared/ui/FieldIcon";

export default function WhyChooseSection() {
  const steps = [
    {
      step: "01",
      title: "Search Your Route",
      description:
        "Input your daily pickup point and preferred destination along key highway hubs like Edappally, Aluva, or Thrissur.",
      badge: "Auto-suggests verified highway transit bays",
      icon: <FieldIcon type="pin" className="h-5 w-5 text-primary" />,
    },
    {
      step: "02",
      title: "Book Instant or Schedule",
      description:
        "Review verified driver ratings, vehicle model (Sedan/SUV), available seat counts, and reserve with one click.",
      badge: "Digital OTP boarding security for each trip",
      icon: <FieldIcon type="users" className="h-5 w-5 text-primary" />,
    },
    {
      step: "03",
      title: "Ride & Relax",
      description:
        "Board at the designated pick-up node, track vehicle arrival with live GPS, and reach your destination fresh without stress.",
      badge: "Quiet or conversational ride preferences",
      icon: <FieldIcon type="car" className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-surface-mint text-primary text-xs font-semibold border border-surface-mint-border">
              Simple Daily Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight mt-2">
              How CarPool Works in 3 Steps
            </h2>
          </div>
          <p className="text-sm sm:text-base text-text-muted max-w-md">
            Seamless seat reservation designed around predictable workplace and highway schedules.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-surface-card rounded-2xl p-6 sm:p-8 border border-border-subtle shadow-sm relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-10 h-10 rounded-xl bg-surface-mint text-primary font-bold flex items-center justify-center border border-surface-mint-border text-sm">
                    {item.step}
                  </span>
                  <div className="p-2 rounded-lg bg-surface-canvas text-text-muted">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-6 p-3 bg-surface-canvas rounded-xl border border-divider-line text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className="text-on-surface font-medium">{item.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
