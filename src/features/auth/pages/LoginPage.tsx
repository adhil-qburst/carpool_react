import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import EmailVerifiedModal from "../modals/EmailVerifiedModal";
import MailIcon from "@shared/ui/MailIcon";
import LockIcon from "@shared/ui/LockIcon";
import EyeIcon from "@shared/ui/EyeIcon";
import EyeSlashIcon from "@shared/ui/EyeSlashIcon";
import ArrowRightIcon from "@shared/ui/ArrowRightIcon";
import LoginHeroPanel from "../components/LoginHeroPanel";
import LoginTrustFooter from "../components/LoginTrustFooter";
import { emailPattern } from "@core/types/util.types";
import type { LoginForm } from "../types/auth.type";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { toApiError } from "@core/api/apiError";
import { route_paths } from "@core/router/route_paths";

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loginMutation = useLoginMutation();
  const isEmailVerified = searchParams.get("verified") === "true";
  const isLoginSuccessful = loginMutation.isSuccess;

  useEffect(() => {
    if (!isLoginSuccessful) return;
    const timer = setTimeout(
      () => navigate(route_paths.home, { replace: true }),
      2000,
    );
    return () => clearTimeout(timer);
  }, [isLoginSuccessful, navigate]);

  const update = (field: keyof LoginForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const fieldClass = (error?: boolean) =>
    `w-full rounded-xl border bg-surface-card py-2.5 pl-10 pr-11 text-sm text-on-surface outline-none transition placeholder:text-text-muted/60 focus:ring-2 ${
      error
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
        : "border-border-subtle focus:border-primary focus:ring-primary-fixed"
    }`;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const next: LoginErrors = {};
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!emailPattern.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    loginMutation.mutate(form, {
      onError: (error) => {
        const apiError = toApiError(error);
        const hasFieldErrors = Object.keys(apiError.fieldErrors).length > 0;
        setErrors((previous) => ({ ...previous, ...apiError.fieldErrors }));
        setFormError(hasFieldErrors ? null : apiError.message);
      },
    });
  }

  function closeVerifiedModal() {
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-canvas p-4 font-sans text-on-surface antialiased selection:bg-surface-mint selection:text-primary sm:p-6 lg:p-8">
      {/* Main Container: Split Two-Pane Card */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center">
        <div className="grid w-full grid-cols-1 items-stretch overflow-hidden rounded-3xl border border-border-subtle bg-surface-card shadow-xl lg:grid-cols-12">
          {/* Left Hero Showcase Panel */}
          <LoginHeroPanel />

          {/* Right Form Panel */}
          <div className="flex flex-col justify-between bg-surface-card p-6 sm:p-8 lg:col-span-6 lg:p-10 xl:col-span-6">
            <div className="w-full">
              {/* Welcome Headline */}
              <div className="mb-5">
                <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                  Welcome back
                </h1>
                <p className="mt-0.5 text-sm text-text-muted">
                  Enter your credentials to access your CarPool workspace and journeys.
                </p>
              </div>

              {/* Feedback States */}
              {loginMutation.isSuccess && (
                <div
                  className="mb-5 flex items-start gap-3 rounded-xl border border-surface-mint-border bg-surface-mint p-4 text-sm text-emerald-800"
                  role="status"
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                    ✓
                  </span>
                  <span>
                    <strong className="font-semibold">Signed in.</strong> Welcome
                    back to CarPool. Redirecting you to home...
                  </span>
                </div>
              )}

              {formError && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-600"
                >
                  {formError}
                </div>
              )}

              {/* Sign In Form */}
              <form
                id="login-form-content"
                className="space-y-4"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="signin-email"
                    className="mb-1.5 block text-xs font-semibold text-on-surface"
                  >
                    Email Address
                  </label>
                  <div className="relative text-text-muted">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <MailIcon />
                    </span>
                    <input
                      id="signin-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="rider@example.com"
                      className={fieldClass(Boolean(errors.email))}
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "signin-email-error" : undefined}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p id="signin-email-error" className="mt-1.5 text-xs text-rose-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="signin-password"
                      className="block text-xs font-semibold text-on-surface"
                    >
                      Password
                    </label>
                    <Link
                      to={route_paths.register}
                      className="text-xs font-semibold text-primary transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative text-text-muted">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <LockIcon />
                    </span>
                    <input
                      id="signin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your account password"
                      className={fieldClass(Boolean(errors.password))}
                      value={form.password}
                      onChange={(event) => update("password", event.target.value)}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? "signin-password-error" : undefined}
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-text-muted transition-colors hover:text-on-surface focus:outline-none"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="signin-password-error" className="mt-1.5 text-xs text-rose-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Keep Me Signed In Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs font-medium text-on-surface">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-4 w-4 rounded border-outline-variant text-primary accent-primary focus:ring-primary"
                    />
                    <span>Keep me signed in on this device</span>
                  </label>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loginMutation.isPending ? (
                    "Signing in…"
                  ) : (
                    <>
                      <span>Sign In to CarPool</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Email Verification Resend Box */}
              <div className="mt-5 flex items-center justify-center gap-2.5 rounded-xl border border-border-subtle bg-surface-container-low p-3.5 text-center sm:text-left">
                <span className="shrink-0 text-text-muted">
                  <MailIcon />
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1 text-xs leading-relaxed text-text-muted">
                  <span>Didn't receive or need a new verification link?</span>
                  <Link
                    to={route_paths.register}
                    className="inline-flex items-center gap-0.5 font-semibold text-primary hover:underline"
                  >
                    <span>Resend Verification Email</span>
                    <ArrowRightIcon className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Bottom Register Switch */}
              <div className="mt-5 border-t border-border-subtle pt-4 text-center">
                <p className="text-xs text-text-muted">
                  New to CarPool?
                  <Link
                    to={route_paths.register}
                    className="ml-1 font-bold text-primary transition-colors hover:text-primary-hover hover:underline"
                  >
                    Create an account →
                  </Link>
                </p>
              </div>
            </div>

            {/* Trust Badges Footer */}
            <LoginTrustFooter />
          </div>
        </div>
      </main>

      {isEmailVerified && <EmailVerifiedModal onClose={closeVerifiedModal} />}
    </div>
  );
};

export default LoginPage;
