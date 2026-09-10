# Carpool React — Project Guidelines

## Stack

React 19 + TypeScript + Vite, React Router v7 (`react-router` package, not `react-router-dom`),
TanStack Query for server state, Axios for HTTP, Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config`), Vitest + Testing Library.

## Architecture

- `src/core/` — app-wide infrastructure: router (`core/router.tsx`), API client (`core/api/httpClient.ts`, `apiError.ts`), auth token storage (`core/auth/tokenStorage.ts`), env config (`core/config/env.ts`), shared utility types (`core/types/`).
- `src/features/<name>/` — feature modules, each with its own `api/`, `hooks/`, `pages/`, `types/`, and optionally `modals/`. Features do not import from each other.
- `src/shared/ui/` — small, stateless, reusable presentational components (icons, brand mark) used across features.
- Path aliases: `@core/*`, `@features/*`, `@shared/*` (defined in [vite.config.ts](../vite.config.ts) and [tsconfig.app.json](../tsconfig.app.json)). Always import via aliases, never deep relative paths across `core`/`features`/`shared` boundaries.

## Build and Test

- `npm run dev` — start dev server
- `npm run build` — type-check (`tsc -b`) then build
- `npm run lint` — ESLint (flat config, typescript-eslint + react-hooks + react-refresh)
- `npm test` — run Vitest once; `npm run test:watch` for watch mode

## Conventions

- New feature work follows the existing `features/auth` structure: API calls in `api/<feature>.api.ts`, request/response types in `types/<feature>.api.types.ts`, domain/UI types in `types/<feature>.type.ts`, TanStack Query hooks in `hooks/use<Name>Mutation.ts` / `use<Name>Query.ts`, screens in `pages/`.
- Normalize API errors through `toApiError` from `@core/api/apiError` instead of handling Axios errors ad hoc.
- `verbatimModuleSyntax` is enabled — always use `import type { ... }` for type-only imports.
- Prefer colocated `*.test.tsx` files next to the component/page they test.
- Keep files to 500 lines or fewer. If a file grows past that, split it (e.g. extract subcomponents, hooks, or helpers into their own files under the existing `api/`/`hooks/`/`pages/`/`types/` structure) instead of letting it keep growing.
