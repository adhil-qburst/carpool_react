import { tokenStorage } from "@core/auth/tokenStorage";
import { redirect } from "react-router";
import { routePaths } from "../route_paths";

export async function authMiddleware() {
  console.log("Running authMiddleware");

  const accessToken = tokenStorage.getAccessToken();
  const refreshToken = tokenStorage.getRefreshToken();

  if (!accessToken || !refreshToken) {
    throw redirect(routePaths.LOGIN);
  }
}
