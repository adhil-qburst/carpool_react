---
description: "Tailwind CSS v4 styling conventions for components and pages."
applyTo: "src/**/*.tsx"
---

# Tailwind CSS Guidelines

- Style with Tailwind utility classes directly in JSX `className`; avoid new custom CSS files (`App.css`/`index.css` are legacy/global only — don't add feature-specific CSS files).
- This is Tailwind v4 via `@tailwindcss/vite` — there is no `tailwind.config.js`. Don't create one; theme customization (if ever needed) goes in `index.css` via `@theme`.
- Keep the existing color/spacing language: slate neutrals, indigo as primary accent, rose for errors (`border-rose-400`, `text-rose-600`), consistent radii (`rounded-xl`, `rounded-2xl`, `rounded-4xl`).
- For conditional classes, use a small local helper function or inline template literal/ternary (see `fieldClass` in [RegisterPage.tsx](../../src/features/auth/pages/RegisterPage.tsx)) rather than pulling in a new classnames library.
- Co-locate long `className` strings on the JSX element; extract to a variable/helper only when the class list is conditional or reused multiple times in the same component.
- Preserve accessibility attributes already used alongside styling (`aria-invalid`, `aria-describedby`, `htmlFor`/`id` pairs) when editing form markup.
