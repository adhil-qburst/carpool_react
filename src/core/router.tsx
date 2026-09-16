/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, redirect } from "react-router";

import LoginPage from "@features/auth/pages/LoginPage";
import RegisterPage from "@features/auth/pages/RegisterPage";
import HomePage from "@features/home/pages/HomePage";
import VehiclesPage from "@features/vehicles/pages/VehiclesPage";
import RegisterVehiclePage from "@features/vehicles/pages/RegisterVehiclePage";
import EditVehiclePage from "@features/vehicles/pages/EditVehiclePage";
import CreateRoutePage from "@features/routes/pages/CreateRoutePage";
import EditRoutePage from "@features/routes/pages/EditRoutePage";
import RoutesPage from "@features/routes/pages/RoutesPage";
import CreateTripPage from "@features/trips/pages/CreateTripPage";
import EditTripPage from "@features/trips/pages/EditTripPage";
import TripsPage from "@features/trips/pages/TripsPage";
import BookRidePage from "@features/trips/pages/BookRidePage";
import { tokenStorage } from "./auth/tokenStorage";
import { route_paths } from "./router/route_paths";
import { authMiddleware } from "./router/middlewares/auth.middleware";

export { route_paths, routePaths, ROUTE_PATHS } from "./router/route_paths";
export type { RoutePath } from "./router/route_paths";

const router = createBrowserRouter([
  {
    path: route_paths.root,
    loader: () => {
      if (tokenStorage.getAccessToken() !== null) {
        return redirect(route_paths.home);
      } else {
        return redirect(route_paths.login);
      }
    },
  },
  {
    path: route_paths.register,
    element: <RegisterPage />,
  },
  {
    path: route_paths.login,
    element: <LoginPage />,
  },
  {
    path: route_paths.emailVerificationSuccess,
    loader: () => redirect(`${route_paths.login}?verified=true`),
  },
  {
    middleware: [authMiddleware],
    children: [
      {
        path: route_paths.home,
        element: <HomePage />,
      },
      {
        path: route_paths.vehicles,
        element: <VehiclesPage />,
      },
      {
        path: route_paths.vehiclesNew,
        element: <RegisterVehiclePage />,
      },
      {
        path: route_paths.vehiclesEdit,
        element: <EditVehiclePage />,
      },
      {
        path: route_paths.routes,
        element: <RoutesPage />,
      },
      {
        path: route_paths.routesNew,
        element: <CreateRoutePage />,
      },
      {
        path: route_paths.routesEdit,
        element: <EditRoutePage />,
      },
      {
        path: route_paths.trips,
        element: <TripsPage />,
      },
      {
        path: route_paths.tripsNew,
        element: <CreateTripPage />,
      },
      {
        path: route_paths.tripsEdit,
        element: <EditTripPage />,
      },
      {
        path: route_paths.tripsBook,
        element: <BookRidePage />,
      },
      {
        path: route_paths.tripsSearch,
        element: <BookRidePage />,
      },
    ],
  },
]);

export default router;
