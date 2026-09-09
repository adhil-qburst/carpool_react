import { createBrowserRouter, redirect } from "react-router";

import App from "../App";
import LoginPage from "@features/auth/pages/LoginPage";
import RegisterPage from "@features/auth/pages/RegisterPage";
import HomePage from "@features/home/pages/HomePage";

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
]);

export default router;
