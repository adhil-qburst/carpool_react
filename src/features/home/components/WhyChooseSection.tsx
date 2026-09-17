import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import LeafIcon from "@shared/ui/LeafIcon";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import { route_paths } from "@core/router/route_paths";

interface ValueCard {
  id: string;
  imageSrc: string;
  imageAlt: string;
  badgeBg: string;
  badgeIcon: React.ReactNode;
  title: string;
  description: string;
}

export default function WhyChooseSection() {
  const cards: ValueCard[] = [
    {
      id: "lower-costs",
      imageSrc: "/homepage/lower-costs.jpg",
      imageAlt: "Friends laughing together in a carpool ride",
      badgeBg: "bg-[#00796b]",
      badgeIcon: <FieldIcon type="car" className="h-5 w-5 text-white" />,
      title: "Lower your travel costs",
      description: "Split the cost, save more",
    },
    {
      id: "carbon-footprint",
      imageSrc: "/homepage/carbon-footprint.jpg",
      imageAlt: "Aerial view of scenic highway along mountain lake",
      badgeBg: "bg-[#2e7d32]",
      badgeIcon: <LeafIcon className="h-5 w-5 text-white" />,
      title: "Reduce your carbon footprint",
      description: "Small rides make a big difference",
    },
    {
      id: "meet-people",
      imageSrc: "/homepage/meet-people.jpg",
      imageAlt: "Group of cheerful travelers and friends outdoors",
      badgeBg: "bg-[#00695c]",
      badgeIcon: <FieldIcon type="users" className="h-5 w-5 text-white" />,
      title: "Meet amazing people",
      description: "Turn trips into great connections",
    },
  ];

  return (
    <section id="why-carpool" className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2.4fr] lg:items-center">
          {/* Left Column Text and CTA */}
          <div className="max-w-md">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              WHY CHOOSE CARPOOL
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              More than just a ride
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
              We&apos;re building a community of everyday people who believe in
              smarter, kinder and more sustainable travel.
            </p>
            <Link
              to={route_paths.register}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0d4f3e] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#093d30] focus:outline-none focus:ring-4 focus:ring-[#0f5132]/20"
            >
              <span>Learn More</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Right Column 3 Photo Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="group flex flex-col rounded-2xl bg-white transition"
              >
                {/* Image Container with Floating Overlapping Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                  <img
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Floating Circle Badge */}
                  <div
                    className={`absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full ${card.badgeBg} shadow-md ring-2 ring-white`}
                  >
                    {card.badgeIcon}
                  </div>
                </div>

                {/* Card Copy */}
                <div className="pt-4">
                  <h3 className="text-base font-bold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
