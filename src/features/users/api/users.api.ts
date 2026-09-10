import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type { CurrentUserResponse } from "../types/users.api.types";

export const usersApi = {
  getCurrentUser: () =>
    httpClient
      .get<CurrentUserResponse>(apiEndpoints.users.currentUser)
      .then((res) => res.data),
};