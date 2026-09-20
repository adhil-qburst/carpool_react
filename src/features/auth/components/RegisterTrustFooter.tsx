import LockIcon from "@shared/ui/LockIcon";
import ShieldCheckIcon from "@shared/ui/ShieldCheckIcon";

const RegisterTrustFooter = () => {
  return (
    <div className="mt-8 border-t border-border-subtle pt-4 text-xs text-text-muted">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-primary">
            <LockIcon />
          </span>
          <span>256-bit SSL Encrypted Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-4 w-4 text-primary" />
          <span>Regional Transport &amp; KYC Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterTrustFooter;
