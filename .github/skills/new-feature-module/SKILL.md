---
name: new-feature-module
description: "Use when adding a new feature module (e.g. profile, rides, payments) to the Carpool React app, or adding a new route/page/API hook to an existing feature. Covers folder layout, path aliases, TanStack Query hooks, and React Router registration."
---

# New Feature Module

Scaffold new feature work to match the existing `src/features/auth` module exactly.

## Folder layout

```
src/features/<feature>/
  api/<feature>.api.ts            # axios calls via @core/api/httpClient, return res.data
  types/<feature>.api.types.ts    # request/response DTOs (API wire shapes)
  types/<feature>.type.ts         # domain/UI types (form state, FormErrors, enums)
  hooks/use<Name>Mutation.ts      # useMutation wrapper per API mutation
  hooks/use<Name>Query.ts         # useQuery wrapper per API query
  pages/<Name>Page.tsx            # route-level component
  pages/<Name>Page.test.tsx       # colocated test (Testing Library)
  modals/<Name>Modal.tsx          # optional, feature-local modals
```

Never import across `src/features/*` boundaries — shared code goes in `@core` or `@shared` instead.

## Steps

1. **Types first**: define `<feature>.api.types.ts` (request/response) and `<feature>.type.ts` (domain/form types) in `types/`.
2. **API layer**: in `api/<feature>.api.ts`, export an object (e.g. `export const <feature>Api = { ... }`) with one method per endpoint, each using `httpClient` from `@core/api/httpClient` and `.then((res) => res.data)`.
3. **Query hooks**: wrap each API call in `hooks/use<Name>Mutation.ts` (`useMutation`) or `use<Name>Query.ts` (`useQuery`) from `@tanstack/react-query`. Handle side effects (e.g. token storage) in `onSuccess`.
4. **Page component**: build the screen in `pages/<Name>Page.tsx` as a function component. Use local `useState` for form state, a plain `validate(form)` helper for client-side validation, and `toApiError` from `@core/api/apiError` in the mutation's `onError` to populate field errors.
5. **Register the route**: add the page to the route array in [src/core/router.tsx](../../../src/core/router.tsx), importing via the `@features/<feature>/pages/...` alias. Use a `loader` for pure redirects instead of a page.
6. **Test**: colocate `<Name>Page.test.tsx`, mock the feature's `api/*.api.ts` module with `vi.mock`, and wrap the component in `<MemoryRouter>` + `QueryClientProvider` (see [RegisterPage.test.tsx](../../../src/features/auth/pages/RegisterPage.test.tsx)).
7. **Style**: use Tailwind utility classes directly; keep the existing slate/indigo/rose color language.

## Checklist before finishing

- [ ] All type-only imports use `import type { ... }`
- [ ] No relative imports cross `core`/`features`/`shared` boundaries — use `@core/*`, `@features/*`, `@shared/*`
- [ ] Route added to `src/core/router.tsx`
- [ ] `npm run lint` and `npm test` pass
