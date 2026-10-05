import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import EmailVerifiedModal from "../modals/EmailVerifiedModal";
import BrandMark from "@shared/ui/BrandMark";
import MailIcon from "@shared/ui/MailIcon";
import LockIcon from "@shared/ui/LockIcon";
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
    `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"}`;

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
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.93fr_1.07fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <BrandMark />
            <span className="text-lg font-bold tracking-tight">Carpool</span>
          </div>
          <div className="relative my-auto max-w-sm">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100">
              WELCOME BACK
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white">
              Good journeys start with good company.
            </h1>
            <p className="mt-5 max-w-xs text-base leading-7 text-slate-300">
              Pick up right where you left off and make today’s commute count.
            </p>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold">12k+</p>
              <p className="mt-1 text-xs text-slate-400">members moving</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold">4.9</p>
              <p className="mt-1 text-xs text-slate-400">member rating</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-2xl font-semibold">34%</p>
              <p className="mt-1 text-xs text-slate-400">average saved</p>
            </div>
          </div>
        </aside>
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-3">
                <BrandMark />
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Carpool
                </span>
              </div>
              <Link
                to={route_paths.register}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create account
              </Link>
            </div>
            <div className="mt-12 lg:mt-0">
              <p className="text-sm font-semibold text-indigo-600">
                WELCOME BACK
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Sign in to Carpool
              </h1>
              <p className="mt-2 text-[15px] leading-6 text-slate-500">
                Enter your details to continue your journey.
              </p>
            </div>
            {loginMutation.isSuccess && (
              <div
                className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                role="status"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  ✓
                </span>
                <span>
                  <strong className="font-semibold">Signed in.</strong> Welcome
                  back to Carpool. You'll be redirect to the home...
                </span>
              </div>
            )}
            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <div className="relative text-slate-400">
                  <span className="pointer-events-none absolute left-3.5 top-3.5">
                    <MailIcon />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={fieldClass(Boolean(errors.email))}
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-rose-600">{errors.email}</p>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <a
                    href="#forgot-password"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative text-slate-400">
                  <span className="pointer-events-none absolute left-3.5 top-3.5">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`${fieldClass(Boolean(errors.password))} pr-12`}
                    value={form.password}
                    onChange={(event) => update("password", event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-2.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-rose-600">
                    {errors.password}
                  </p>
                )}
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                Remember me for 30 days
              </label>
              {formError && (
                <p
                  role="alert"
                  className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600"
                >
                  {formError}
                </p>
              )}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginMutation.isPending ? (
                  "Signing in…"
                ) : (
                  <>
                    Sign in{" "}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">
              New to Carpool?{" "}
              <Link
                to={route_paths.register}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
      {isEmailVerified && <EmailVerifiedModal onClose={closeVerifiedModal} />}
    </main>
  );
};

export default LoginPage;
