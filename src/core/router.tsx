import { createBrowserRouter, redirect } from "react-router";

import App from "../App";
import LoginPage from "@features/auth/pages/LoginPage";
import RegisterPage from "@features/auth/pages/RegisterPage";
import HomePage from "@features/home/pages/HomePage";
import VehiclesPage from "@features/vehicles/pages/VehiclesPage";
import RegisterVehiclePage from "@features/vehicles/pages/RegisterVehiclePage";
import EditVehiclePage from "@features/vehicles/pages/EditVehiclePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/email-verification-success",
    loader: () => redirect("/login?verified=true"),
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/vehicles",
    element: <VehiclesPage />,
  },
  {
    path: "/vehicles/new",
    element: <RegisterVehiclePage />,
  },
  {
    path: "/vehicles/:vehicleId/edit",
    element: <EditVehiclePage />,
  },
]);

export default router;
