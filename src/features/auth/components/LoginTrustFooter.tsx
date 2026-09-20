import LockIcon from "@shared/ui/LockIcon";
import ShieldCheckIcon from "@shared/ui/ShieldCheckIcon";
import FieldIcon from "@shared/ui/FieldIcon";

const LoginTrustFooter = () => {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-border-subtle pt-4 text-xs text-text-muted">
      <div className="flex items-center gap-1.5">
        <LockIcon />
        <span>256-bit SSL</span>
      </div>
      <span className="hidden text-border-subtle sm:inline" aria-hidden="true">
        •
      </span>
      <div className="flex items-center gap-1.5">
        <ShieldCheckIcon className="h-4 w-4 text-primary" />
        <span>Govt. Compliant</span>
      </div>
      <span className="hidden text-border-subtle sm:inline" aria-hidden="true">
        •
      </span>
      <div className="flex items-center gap-1.5">
        <FieldIcon type="clock" className="h-4 w-4 text-primary" />
        <span>24/7 Support</span>
      </div>
    </div>
  );
};

export default LoginTrustFooter;
