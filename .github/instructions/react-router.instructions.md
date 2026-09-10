---
description: "React Router v7 conventions: route registration, navigation, redirects, and router testing."
applyTo: "src/core/router.tsx,src/**/pages/**/*.tsx,src/**/*.test.tsx"
---

# React Router Guidelines

- This project uses the `react-router` package (v7 data router API), not `react-router-dom`. Import `createBrowserRouter`, `RouterProvider`, `Link`, `redirect`, etc. from `"react-router"`.
- Register every route in [src/core/router.tsx](../../src/core/router.tsx) via `createBrowserRouter([...])`; don't create ad-hoc `<Routes>`/`<Route>` trees elsewhere.
- Use a `loader` returning `redirect(path)` for routes that only perform a redirect (see the `/email-verification-success` route) instead of a page component with a `useEffect` navigate.
- Use `<Link to="...">` for in-app navigation instead of `<a href>`.
- When adding a route that needs data before render, prefer a route `loader`/`action` over fetching in a `useEffect` inside the page component, to stay consistent with the data-router pattern already in use.
- In tests, wrap the component under test in `<MemoryRouter>` (see [RegisterPage.test.tsx](../../src/features/auth/pages/RegisterPage.test.tsx)) rather than mocking `react-router`.
