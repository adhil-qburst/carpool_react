---
description: "TypeScript conventions for this project: path aliases, type-only imports, strictness."
applyTo: "src/**/*.{ts,tsx}"
---

# TypeScript Guidelines

- Use the path aliases `@core/*`, `@features/*`, `@shared/*` instead of long relative imports (`../../../`).
- Centralize API endpoints in `@core/api/apiEndpoints` — do not hardcode API URL strings in `*.api.ts` or services.
- `verbatimModuleSyntax` is on: import types with `import type { Foo } from "..."` (or inline `import { type Foo, bar } from "..."`). Never import a type without the `type` qualifier.
- `noUnusedLocals` / `noUnusedParameters` are enforced — remove dead imports/variables rather than prefixing with `_` unless the parameter is genuinely required by an interface.
- Prefer explicit request/response types per feature (`types/<feature>.api.types.ts`) over `any`; keep domain/UI-facing types in a separate `types/<feature>.type.ts`.
- Model form/validation errors as a typed `FormErrors` shape (see [auth.type.ts](../../src/features/auth/types/auth.type.ts)) rather than loose `Record<string, string>` scattered across components.
- Favor small, pure helper functions (e.g. `validate(form)`, `toApiError(error)`) over inlining logic in components, so they stay independently testable.
- Do not add a `tailwind.config.*` or new TS project references without checking `vite.config.ts` / `tsconfig.app.json` first — this project uses Tailwind v4's zero-config Vite plugin.
- Cap every file at 500 lines. If a file would exceed that, subdivide it — pull sub-components, hooks, validators, or types out into their own files (following the `api/`/`hooks/`/`pages/`/`types/` layout) rather than growing one file past the limit.
