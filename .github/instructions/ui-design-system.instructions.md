---
description: "Existing UI design system: layout shell, typography scale, color roles, buttons, form fields, and modals. Use when building or editing any page/component so new UI matches the look of LoginPage/RegisterPage."
applyTo: "src/**/*.tsx"
---

# UI Design System

Match the visual language already established in [LoginPage.tsx](../../src/features/auth/pages/LoginPage.tsx), [RegisterPage.tsx](../../src/features/auth/pages/RegisterPage.tsx), and the auth modals. Don't invent a new visual style for new screens — reuse these patterns.

## Color roles
- **Neutral**: `slate` — `bg-slate-50` page background, `bg-slate-950` dark panels, text `text-slate-950`/`text-slate-900` (headings), `text-slate-500`/`text-slate-400` (body/muted).
- **Primary/accent**: `indigo` — `bg-indigo-600` buttons/brand, `text-indigo-600` links and eyebrow labels, `focus:ring-indigo-200`/`focus:border-indigo-500` on focus.
- **Error**: `rose` — `border-rose-400`, `text-rose-600`, `bg-rose-50` banners.
- **Success**: `emerald` — `bg-emerald-50`/`text-emerald-800` banners, `bg-emerald-100 text-emerald-600` icon badges.

## Page shell (full-screen auth-style layout)
```
<main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
  <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[.93fr_1.07fr]">
    <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col"> ... </aside>
    <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14"> ... </section>
  </div>
</main>
```
Reuse this two-pane shell (dark brand `aside` hidden below `lg`, content `section`) for new full-page screens instead of a plain unstyled container.

## Typography scale
- Eyebrow label: `text-sm font-semibold text-indigo-600` (uppercase copy, not the `uppercase` class).
- Page/section title: `text-3xl font-bold tracking-tight text-slate-950` (or `text-4xl font-semibold` for hero copy in the dark aside).
- Supporting text: `text-[15px] leading-6 text-slate-500`.
- Field label: `text-sm font-semibold text-slate-700`.

## Buttons
Primary action button:
```
className="rounded-xl bg-indigo-600 px-4 py-3(.5) text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
```
Secondary/text link: `text-sm font-semibold text-indigo-600 hover:text-indigo-700`.

## Form fields
- Wrap each field in a `<div>` with a `<label className="mb-2 block text-sm font-semibold text-slate-700">`.
- Icon-prefixed input: `<div className="relative text-slate-400">` containing an absolutely positioned icon (`pointer-events-none absolute left-3.5 top-3.5`) and the `<input>`.
- Build the input's className with a local `fieldClass(hasError)` helper (border/ring flips between slate and rose) — see `fieldClass` in RegisterPage/LoginPage — instead of hardcoding two class strings.
- Error text: `<p className="mt-1.5 text-sm text-rose-600">`. Always pair with `aria-invalid` on the input and `aria-describedby` pointing at the error's `id`.
- Form-level error banner: `role="alert"` with `rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600"`.

## Modals
Full-screen dialogs (see [VerificationModal.tsx](../../src/features/auth/modals/VerificationModal.tsx)) follow one shape:
```
<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="...">
  <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-3xl text-emerald-600">...icon...</div>
    <p className="mt-5 text-xs font-bold tracking-widest text-emerald-600">EYEBROW</p>
    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Title</h2>
    <p className="mt-3 text-sm leading-6 text-slate-500">Body copy.</p>
    {/* primary button, same styling as the button pattern above */}
  </div>
</div>
```
New modals take `{ onClose: () => void }` (plus any data props) and render nothing else at the page level — the parent page owns the open/closed boolean state.

## Icons and brand
- Don't inline raw `<svg>` markup in pages. Add new icons as a component in `@shared/ui` following [FieldIcon.tsx](../../src/shared/ui/FieldIcon.tsx) (24x24 viewBox, `stroke="currentColor"`, `strokeWidth={1.6}`, `aria-hidden="true"`) or as a standalone icon component like `MailIcon`/`LockIcon` for one-off cases.
- Reuse [BrandMark.tsx](../../src/shared/ui/BrandMark.tsx) for the "C" logo mark instead of recreating it.
