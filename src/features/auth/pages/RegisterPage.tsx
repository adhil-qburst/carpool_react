import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link } from "react-router";
import VerificationModal from "../modals/VerificationModal";
import FieldIcon from "@shared/ui/FieldIcon";
import LockIcon from "@shared/ui/LockIcon";
import EyeIcon from "@shared/ui/EyeIcon";
import EyeSlashIcon from "@shared/ui/EyeSlashIcon";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import MailIcon from "@shared/ui/MailIcon";
import RegisterHeroPanel from "../components/RegisterHeroPanel";
import RegisterRoleSelector from "../components/RegisterRoleSelector";
import RegisterTrustFooter from "../components/RegisterTrustFooter";
import type { FormErrors, RegisterForm, Role } from "../types/auth.type";
import { emailPattern } from "@core/types/util.types";
import { useRegisterMutation } from "../hooks/useRegisterMutation";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";

const initialForm: RegisterForm = {
  name: "",
  email: "",
  password: "",
  roles: [],
};

function validate(form: RegisterForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Enter your full name.";
  if (!form.email.trim()) errors.email = "Enter your email address.";
  else if (!emailPattern.test(form.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!form.password) errors.password = "Create a password.";
  else if (form.password.length < 8)
    errors.password = "Use at least 8 characters.";
  if (!form.roles.length) errors.roles = "Choose how you plan to use Carpool.";
  return errors;
}

function getPasswordStrength(password: string): { score: number; label: string } {
  if (!password) return { score: 0, label: "Min. 8 characters" };
  if (password.length < 8) return { score: 1, label: "Weak" };
  const hasSpecialOrNumber = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  if (hasSpecialOrNumber && hasMixedCase && password.length >= 10) {
    return { score: 4, label: "Reliable" };
  }
  if (hasSpecialOrNumber || hasMixedCase) {
    return { score: 3, label: "Strong" };
  }
  return { score: 2, label: "Moderate" };
}

const RegisterPage = () => {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();

  const passwordStrength = getPasswordStrength(form.password);

  function updateField<K extends keyof RegisterForm>(
    field: K,
    value: RegisterForm[K],
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (errors[field])
      setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function toggleRole(role: Role) {
    const nextRoles = form.roles.includes(role)
      ? form.roles.filter((item) => item !== role)
      : [...form.roles, role];
    updateField("roles", nextRoles);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    registerMutation.mutate(form, {
      onSuccess: () => setIsModalOpen(true),
      onError: (error) => {
        const apiError = toApiError(error);
        const hasFieldErrors = Object.keys(apiError.fieldErrors).length > 0;
        setErrors((previous) => ({ ...previous, ...apiError.fieldErrors }));
        setFormError(hasFieldErrors ? null : apiError.message);
      },
    });
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setForm(initialForm);
  }

  const fieldClass = (hasError?: boolean) =>
    `w-full rounded-xl border bg-surface-card h-11 pl-11 pr-10 text-sm text-on-surface outline-none transition placeholder:text-text-muted/60 focus:ring-2 ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
        : "border-border-subtle focus:border-primary focus:ring-primary-fixed"
    }`;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-surface-canvas text-on-surface antialiased selection:bg-surface-mint selection:text-primary">
      {/* Main Container: Centered Split Registration Experience */}
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="grid min-h-[820px] w-full grid-cols-1 overflow-hidden rounded-2xl border border-border-subtle bg-surface-card shadow-xl lg:grid-cols-12">
          {/* Left Hero Panel: Visual Showcase & Brand Highlights */}
          <RegisterHeroPanel />

          {/* Right Panel: Role Selection & Production Registration Form */}
          <section className="flex flex-col justify-between bg-surface-card p-6 sm:p-8 lg:col-span-7 lg:p-12">
            <div className="mx-auto w-full max-w-xl">
              {/* Header */}
              <div className="mb-6">
                <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-info-surface px-3 py-1 text-xs font-semibold text-info-text">
                  <FieldIcon type="tag" className="h-3.5 w-3.5 text-info-text" />
                  <span>Join CarPool Network</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-on-surface lg:text-3xl">
                  Create your Account
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  Choose how you wish to travel today. You can offer rides as a driver or book seats as a passenger.
                </p>
              </div>

              {/* Interactive Role Selector */}
              <RegisterRoleSelector
                selectedRoles={form.roles}
                onToggleRole={toggleRole}
                error={errors.roles}
              />

              {/* Registration Form */}
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-xs font-semibold text-on-surface"
                  >
                    Full Name
                  </label>
                  <div className="relative flex items-center text-text-muted">
                    <span className="pointer-events-none absolute left-3.5">
                      <FieldIcon type="person" />
                    </span>
                    <input
                      id="fullName"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Alex Morgan"
                      className={fieldClass(Boolean(errors.name))}
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      required
                    />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-rose-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Address Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold text-on-surface"
                  >
                    Email Address
                  </label>
                  <div className="relative flex items-center text-text-muted">
                    <span className="pointer-events-none absolute left-3.5">
                      <MailIcon />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      className={fieldClass(Boolean(errors.email))}
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      required
                    />
                  </div>
                  {errors.email ? (
                    <p id="email-error" className="mt-1.5 text-xs text-rose-600">
                      {errors.email}
                    </p>
                  ) : (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-text-muted">
                      <span className="text-primary">ℹ</span>
                      <span>A verification link will be sent to this email. Only verified accounts can log in.</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-semibold text-on-surface"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center text-text-muted">
                    <span className="pointer-events-none absolute left-3.5">
                      <LockIcon />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      className={fieldClass(Boolean(errors.password))}
                      value={form.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 flex cursor-pointer items-center text-text-muted transition-colors hover:text-on-surface focus:outline-none"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="mt-1.5 text-xs text-rose-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Password Security Strength Bar */}
                <div className="rounded-lg border border-border-subtle bg-surface-canvas p-2.5">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      Security Strength:{" "}
                      <span className="font-semibold text-primary">
                        {passwordStrength.label}
                      </span>
                    </span>
                    <span>Min. 8 characters with numbers</span>
                  </div>
                  <div className="grid h-1.5 w-full grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-colors ${
                          passwordStrength.score >= step
                            ? "bg-primary"
                            : "bg-border-subtle"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="terms"
                    type="checkbox"
                    defaultChecked
                    required
                    className="mt-0.5 h-4 w-4 rounded border-border-subtle text-primary accent-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="terms"
                    className="cursor-pointer select-none text-xs leading-relaxed text-text-muted"
                  >
                    I agree to the{" "}
                    <a href="#terms" className="font-semibold text-primary hover:underline">
                      Terms of Service
                    </a>
                    ,{" "}
                    <a href="#guidelines" className="font-semibold text-primary hover:underline">
                      Community Safety Guidelines
                    </a>
                    , and{" "}
                    <a href="#privacy" className="font-semibold text-primary hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                {/* Form Level Error */}
                {formError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-600"
                  >
                    {formError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-sm text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {registerMutation.isPending ? (
                    "Creating account…"
                  ) : (
                    <>
                      <span>Create Account &amp; Send Verification</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Prominent Verification Required Alert */}
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-surface-mint-border bg-surface-mint p-3.5 shadow-2xs">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-primary">
                  <MailIcon />
                </div>
                <div className="text-xs leading-relaxed text-on-surface">
                  <strong className="mb-0.5 block font-semibold text-primary">
                    Verification Required:
                  </strong>
                  You will receive an activation email immediately. Please verify your email before logging in.
                </div>
              </div>

              {/* Switcher to Login */}
              <div className="mt-5 text-center">
                <p className="text-xs text-text-muted sm:text-sm">
                  Already have an account?
                  <Link
                    to={route_paths.login}
                    className="ml-1 inline-flex items-center gap-0.5 font-bold text-primary hover:underline"
                  >
                    <span>Sign In</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </p>
              </div>
            </div>

            {/* Trust & Security Badges */}
            <RegisterTrustFooter />
          </section>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full border-t border-border-subtle bg-surface-card py-4 text-center text-xs text-text-muted">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 sm:flex-row">
          <span>&copy; 2025 CarPool Mobility Platform. Committed to cleaner, shared journeys.</span>
          <div className="flex items-center gap-5">
            <a href="#privacy" className="transition-colors hover:text-primary">
              Privacy Notice
            </a>
            <a href="#guidelines" className="transition-colors hover:text-primary">
              Community Guidelines
            </a>
            <a href="#support" className="transition-colors hover:text-primary">
              Safety &amp; Support
            </a>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <VerificationModal email={form.email} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default RegisterPage;
