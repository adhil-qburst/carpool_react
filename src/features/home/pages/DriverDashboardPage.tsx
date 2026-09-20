import { useState } from "react";
import { useCurrentUserQuery } from "@features/users/hooks/useCurrentUserQuery";
import { useTripsQuery } from "@features/trips/hooks/useTripsQuery";
import { useVehiclesQuery } from "@features/vehicles/hooks/useVehiclesQuery";
import DriverSidebar from "../components/dashboard/DriverSidebar";
import DriverTopBar from "../components/dashboard/DriverTopBar";
import DriverHeroBanner from "../components/dashboard/DriverHeroBanner";
import NextTripCard from "../components/dashboard/NextTripCard";
import MyVehiclesCard from "../components/dashboard/MyVehiclesCard";
import UpcomingTripsTable from "../components/dashboard/UpcomingTripsTable";

const DriverDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: currentUser } = useCurrentUserQuery();
  const tripsQuery = useTripsQuery();
  const vehiclesQuery = useVehiclesQuery();

  const driverName = currentUser?.name || "Arun Kumar";
  const driverInitials =
    driverName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AK";

  const nextTrip =
    tripsQuery.data?.items?.find((t) => t.status === "scheduled") ??
    tripsQuery.data?.items?.[0] ??
    null;

  return (
    <div className="flex min-h-screen bg-surface-canvas font-sans text-on-surface antialiased selection:bg-surface-mint selection:text-primary">
      {/* Responsive Sidebar Navigation (slide-over drawer on mobile/tablet, fixed on desktop) */}
      <DriverSidebar
        driverName={driverName}
        driverInitials={driverInitials}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Workspace Container (pl-0 on mobile/tablet, lg:pl-64 on desktop) */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Top App Bar with hamburger menu toggle on mobile */}
        <DriverTopBar
          driverName={driverName}
          driverInitials={driverInitials}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable Content Canvas */}
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:p-8">
          {/* 1. Hero Banner Section */}
          <DriverHeroBanner driverName={driverName} />

          {/* 2. Core Operational Split Grid */}
          <section className="grid grid-cols-1 items-stretch gap-6 sm:gap-8 lg:grid-cols-12">
            {/* Left 7-col on lg: Your Next Trip */}
            <NextTripCard trip={nextTrip} isLoading={tripsQuery.isLoading} />

            {/* Right 5-col on lg: My Vehicles */}
            <MyVehiclesCard vehicles={vehiclesQuery.data} />
          </section>

          {/* 3. Upcoming Trips Data Table Section */}
          <UpcomingTripsTable
            trips={tripsQuery.data?.items}
            isLoading={tripsQuery.isLoading}
          />
        </main>
      </div>
    </div>
  );
};

export default DriverDashboardPage;
