import { createBrowserRouter } from "react-router";

import App from "../App";
import RegisterPage from "../features/auth/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export default router;
