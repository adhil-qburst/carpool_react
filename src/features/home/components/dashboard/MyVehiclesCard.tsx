import { Link } from "react-router";
import FieldIcon from "@shared/ui/FieldIcon";
import PlusIcon from "@shared/ui/PlusIcon";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import PencilIcon from "@shared/ui/PencilIcon";
import type { VehicleResponse } from "@features/vehicles/types/vehicles.api.types";
import { route_paths } from "@core/router/route_paths";

type MyVehiclesCardProps = {
  vehicles?: VehicleResponse[];
};

type DisplayVehicle = {
  id: string;
  model: string;
  registration_number: string;
  total_seats: number;
};

const defaultVehicles: DisplayVehicle[] = [
  {
    id: "v-1",
    model: "Toyota Innova",
    registration_number: "KL 07 AB 1234",
    total_seats: 12,
  },
  {
    id: "v-2",
    model: "Swift Dzire",
    registration_number: "KL 41 CD 5678",
    total_seats: 4,
  },
];

const MyVehiclesCard = ({ vehicles }: MyVehiclesCardProps) => {
  const displayVehicles: DisplayVehicle[] =
    vehicles && vehicles.length > 0
      ? vehicles.slice(0, 3).map((v) => ({
          id: v.id,
          model: v.model,
          registration_number: v.registration_number,
          total_seats: v.total_seats,
        }))
      : defaultVehicles;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-xs sm:p-7 lg:col-span-5">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-5">
          <h2 className="text-lg font-semibold text-on-surface">My Vehicles</h2>
          <Link
            to={route_paths.vehicles}
            className="flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:underline"
          >
            <span>View All</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Vehicle Items List */}
        <div className="mt-6 flex flex-col gap-3.5">
          {displayVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-canvas p-4 transition-colors hover:border-surface-mint-border"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-subtle bg-surface-card text-primary">
                  <FieldIcon type="car" className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-on-surface">
                      {vehicle.model}
                    </span>
                    <span className="rounded-full border border-surface-mint-border bg-surface-mint px-2 py-0.5 text-[11px] font-bold text-primary">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {vehicle.registration_number} • {vehicle.total_seats} seats total
                  </span>
                </div>
              </div>

              <Link
                to={route_paths.getVehicleEditPath(vehicle.id)}
                aria-label={`Edit ${vehicle.model}`}
                className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-card hover:text-primary"
              >
                <PencilIcon className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Add Vehicle Prompt */}
      <div className="mt-6 border-t border-border-subtle pt-4">
        <Link
          to={route_paths.vehiclesNew}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-card text-sm font-semibold text-on-surface shadow-xs transition-colors duration-150 hover:bg-surface-container-low hover:text-primary"
        >
          <PlusIcon className="h-4 w-4 text-primary" />
          <span>Register New Vehicle</span>
        </Link>
      </div>
    </div>
  );
};

export default MyVehiclesCard;
