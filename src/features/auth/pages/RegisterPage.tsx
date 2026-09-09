import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link } from "react-router";
import VerificationModal from "../modals/VerificationModal";
import FieldIcon from "@shared/ui/FieldIcon";
import type { FormErrors, RegisterForm, Role } from "../types/auth.type";
import BrandMark from "@shared/ui/BrandMark";
import { emailPattern } from "@core/types/util.types";
import { useRegisterMutation } from "../hooks/useRegisterMutation";
import { toApiError } from "@core/api/apiError";

const ROLES: { value: Role; description: string; icon: "car" | "pin" }[] = [
  { value: "Driver", description: "Offer seats on your route", icon: "car" },
  { value: "Rider", description: "Find a ride that fits", icon: "pin" },
];
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

const RegisterPage = () => {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();

  function updateField<K extends keyof RegisterForm>(
    field: K,
    value: RegisterForm[K],
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (errors[field])
      setErrors((previous) => ({ ...previous, [field]: undefined }));
  }
  function toggleRole(role: Role) {
    updateField(
      "roles",
      form.roles.includes(role)
        ? form.roles.filter((item) => item !== role)
        : [...form.roles, role],
    );
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
    `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${hasError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"}`;

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
              MOVE BETTER, TOGETHER
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white">
              Your everyday journey just got easier.
            </h1>
            <p className="mt-5 max-w-xs text-base leading-7 text-slate-300">
              Share the ride, the cost, and a little more of the good in every
              commute.
            </p>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-white/[.07] p-5 backdrop-blur-sm">
            <div className="mb-3 flex -space-x-2">
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-950 bg-amber-300 text-xs font-bold text-slate-800">
                A
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-950 bg-sky-300 text-xs font-bold text-slate-800">
                M
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-950 bg-rose-300 text-xs font-bold text-slate-800">
                J
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-200">
              “The simplest way I’ve found to make my commute more affordable.”
            </p>
            <p className="mt-3 text-xs font-semibold text-white">
              Maya S.{" "}
              <span className="font-normal text-slate-400">
                • Carpool member
              </span>
            </p>
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
                to="/login"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </div>
            <div className="mt-12 lg:mt-0">
              <p className="text-sm font-semibold text-indigo-600">
                GET STARTED
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Create your account
              </h2>
              <p className="mt-2 text-[15px] leading-6 text-slate-500">
                Join a smarter way to get where you’re going.
              </p>
            </div>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>
                <div className="relative text-slate-400">
                  <span className="pointer-events-none absolute left-3.5 top-3.5">
                    <FieldIcon type="person" />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Morgan"
                    className={fieldClass(Boolean(errors.name))}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="mt-1.5 text-sm text-rose-600">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <div className="relative text-slate-400">
                  <span className="pointer-events-none absolute left-3.5 top-3.5">
                    <FieldIcon type="mail" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={fieldClass(Boolean(errors.email))}
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-rose-600">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative text-slate-400">
                  <span className="pointer-events-none absolute left-3.5 top-3.5">
                    <FieldIcon type="lock" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className={`${fieldClass(Boolean(errors.password))} pr-12`}
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="password-help"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-2.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p
                  id="password-help"
                  className={`mt-1.5 text-xs ${errors.password ? "text-rose-600" : "text-slate-400"}`}
                >
                  {errors.password ?? "Use 8 or more characters."}
                </p>
              </div>
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-slate-700">
                  How will you carpool?
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ROLES.map((role) => {
                    const selected = form.roles.includes(role.value);
                    return (
                      <label
                        key={role.value}
                        className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${selected ? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600" : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"}`}
                      >
                        <input
                          type="checkbox"
                          name="roles"
                          value={role.value}
                          checked={selected}
                          onChange={() => toggleRole(role.value)}
                          className="sr-only"
                        />
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-lg ${selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"}`}
                        >
                          <FieldIcon type={role.icon} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-800">
                            {role.value}
                          </span>
                          <span className="block text-xs text-slate-500">
                            {role.description}
                          </span>
                        </span>
                        {selected && (
                          <span className="absolute right-3 top-3 grid h-4 w-4 place-items-center rounded-full bg-indigo-600 text-[10px] text-white">
                            ✓
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {errors.roles && (
                  <p className="mt-1.5 text-sm text-rose-600">{errors.roles}</p>
                )}
              </fieldset>
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
                disabled={registerMutation.isPending}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerMutation.isPending ? (
                  "Creating account…"
                ) : (
                  <>
                    Create account{" "}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </>
                )}
              </button>
              <p className="px-3 text-center text-xs leading-5 text-slate-500">
                By creating an account, you agree to our{" "}
                <a
                  href="#terms"
                  className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-indigo-600"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#privacy"
                  className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-indigo-600"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
      {isModalOpen && (
        <VerificationModal email={form.email} onClose={handleModalClose} />
      )}
    </main>
  );
};

export default RegisterPage;
