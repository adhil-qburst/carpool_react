import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { env } from "@core/config/env";
import { tokenStorage } from "@core/auth/tokenStorage";
import { redirectToLogin } from "@core/auth/authRedirect";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export interface RefreshTokenResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string> | null = null;

export function _resetRefreshState(): void {
  refreshPromise = null;
}

export async function requestNewAccessToken(refreshToken: string): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshTokenResponseData>("/api/v1/auth/refresh", {
        refresh_token: refreshToken,
      })
      .then((res) => {
        const newAccessToken = res.data.access_token;
        tokenStorage.setAccessToken(newAccessToken);
        return newAccessToken;
      })
      .catch((err: unknown) => {
        tokenStorage.clear();
        redirectToLogin();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

httpClient.interceptors.request.use((config) => {
  if (!config.url?.includes("/api/v1/auth/refresh")) {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      if (config.headers?.set) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      } else if (config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? "";

    // Any error on the refresh endpoint triggers clear & redirect to login
    if (requestUrl.includes("/api/v1/auth/refresh")) {
      tokenStorage.clear();
      redirectToLogin();
      return Promise.reject(error);
    }

    // Do not attempt refresh on login or register endpoints
    if (
      requestUrl.includes("/api/v1/auth/login") ||
      requestUrl.includes("/api/v1/auth/register")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest) {
      if (originalRequest._retry) {
        tokenStorage.clear();
        redirectToLogin();
        return Promise.reject(error);
      }

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        redirectToLogin();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newAccessToken = await requestNewAccessToken(refreshToken);
        if (originalRequest.headers?.set) {
          originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        } else if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return httpClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
