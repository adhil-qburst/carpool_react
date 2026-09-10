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
      .post<RegisterResponse>("/api/v1/auth/register", payload)
      .then((res) => res.data),
  login: (payload: LoginRequest) =>
    httpClient
      .post<LoginResponse>("/api/v1/auth/login", payload)
      .then((res) => res.data),
  refresh: (payload: RefreshTokenRequest) =>
    httpClient
      .post<RefreshTokenResponse>("/api/v1/auth/refresh", payload)
      .then((res) => res.data),
};
