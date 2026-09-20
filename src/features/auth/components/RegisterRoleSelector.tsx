import FieldIcon from "@shared/ui/FieldIcon";
import type { Role } from "../types/auth.type";

type RegisterRoleSelectorProps = {
  selectedRoles: Role[];
  onToggleRole: (role: Role) => void;
  error?: string;
};

const ROLES_CONFIG: {
  value: Role;
  label: string;
  description: string;
  icon: "car" | "pin";
}[] = [
  {
    value: "Driver",
    label: "Driver",
    description: "Offer rides, share empty seats, offset commute costs, register vehicle.",
    icon: "car",
  },
  {
    value: "Rider",
    label: "Passenger / Rider",
    description: "Find verified commutes, affordable daily rides, instant seat reservations.",
    icon: "pin",
  },
];

const RegisterRoleSelector = ({
  selectedRoles,
  onToggleRole,
  error,
}: RegisterRoleSelectorProps) => {
  const isDriverSelected = selectedRoles.includes("Driver");
  const isRiderSelected = selectedRoles.includes("Rider");

  return (
    <fieldset className="mb-6">
      <legend className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-text-muted">
        Select Your Primary Role
      </legend>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ROLES_CONFIG.map((role) => {
          const isSelected = selectedRoles.includes(role.value);
          return (
            <label
              key={role.value}
              className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 shadow-2xs transition-all duration-150 ${
                isSelected
                  ? "border-primary bg-surface-mint"
                  : "border-border-subtle bg-surface-card hover:border-primary/40"
              }`}
            >
              <input
                type="checkbox"
                name="roles"
                value={role.value}
                aria-label={role.value}
                checked={isSelected}
                onChange={() => onToggleRole(role.value)}
                className="sr-only"
              />
              <div className="mb-2 flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-surface-variant text-secondary"
                  }`}
                >
                  <FieldIcon
                    type={role.icon}
                    className={`h-5 w-5 ${isSelected ? "text-white" : "text-secondary"}`}
                  />
                </div>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    isSelected
                      ? "bg-primary text-white"
                      : "border border-border-subtle bg-surface-card text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              </div>
              <div className="text-sm font-bold text-on-surface">{role.label}</div>
              <p className="mt-1 text-xs leading-snug text-text-muted">
                {role.description}
              </p>
            </label>
          );
        })}
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}

      {/* Dynamic Role Guidance Banners */}
      {isDriverSelected && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-surface-mint-border bg-surface-mint/80 p-3">
          <span className="mt-0.5 shrink-0 text-primary">
            <FieldIcon type="tag" className="h-4 w-4 text-primary" />
          </span>
          <p className="text-xs leading-relaxed text-on-surface">
            <strong className="font-semibold text-primary">
              Driver Onboarding Step 1:
            </strong>{" "}
            Set up your basic account now. Vehicle details, RC, and driving license verification will be completed in your workspace right after email confirmation.
          </p>
        </div>
      )}

      {isRiderSelected && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-info-surface p-3">
          <span className="mt-0.5 shrink-0 text-info-text">
            <FieldIcon type="pin" className="h-4 w-4 text-info-text" />
          </span>
          <p className="text-xs leading-relaxed text-on-surface">
            <strong className="font-semibold text-info-text">
              Quick Passenger Setup:
            </strong>{" "}
            Confirm your email and start booking daily office corridors or weekend trips in under 1 minute!
          </p>
        </div>
      )}
    </fieldset>
  );
};

export default RegisterRoleSelector;
