import { httpClient } from "@core/api/httpClient";
import type {
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.api.types";

export const authApi = {
  register: (payload: RegisterRequest) =>
    httpClient
      .post<RegisterResponse>("/api/v1/auth/register", payload)
      .then((res) => res.data),
};
