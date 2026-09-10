import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.api.types";

export const authApi = {
  register: (payload: RegisterRequest) =>
    httpClient
      .post<RegisterResponse>(apiEndpoints.auth.register, payload)
      .then((res) => res.data),
  login: (payload: LoginRequest) =>
    httpClient
      .post<LoginResponse>(apiEndpoints.auth.login, payload)
      .then((res) => res.data),
  refresh: (payload: RefreshTokenRequest) =>
    httpClient
      .post<RefreshTokenResponse>(apiEndpoints.auth.refresh, payload)
      .then((res) => res.data),
};
