import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { _resetRefreshState, httpClient, refreshClient } from "./httpClient";
import { tokenStorage } from "@core/auth/tokenStorage";
import { resetRedirectHandler, setRedirectHandler } from "@core/auth/authRedirect";

describe("httpClient refresh token mechanism", () => {
  const redirectMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    redirectMock.mockClear();
    setRedirectHandler(redirectMock);
    _resetRefreshState();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    resetRedirectHandler();
    _resetRefreshState();
  });

  it("attaches Authorization header when access token is present", async () => {
    tokenStorage.setTokens({
      accessToken: "valid-access-token",
      refreshToken: "valid-refresh-token",
    });

    let capturedConfig: InternalAxiosRequestConfig | undefined;
    httpClient.defaults.adapter = async (config) => {
      capturedConfig = config;
      return {
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      } as AxiosResponse;
    };

    const res = await httpClient.get("/api/v1/vehicles");

    expect(res.data).toEqual({ ok: true });
    expect(capturedConfig?.headers?.Authorization).toBe("Bearer valid-access-token");
  });

  it("does not attach Authorization header to refresh requests", async () => {
    tokenStorage.setTokens({
      accessToken: "expired-access-token",
      refreshToken: "valid-refresh-token",
    });

    let capturedConfig: InternalAxiosRequestConfig | undefined;
    httpClient.defaults.adapter = async (config) => {
      capturedConfig = config;
      return {
        data: { access_token: "new-token", token_type: "bearer", expires_in: 900 },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      } as AxiosResponse;
    };

    await httpClient.post("/api/v1/auth/refresh", { refresh_token: "valid-refresh-token" });

    expect(capturedConfig?.headers?.Authorization).toBeUndefined();
  });

  it("successfully refreshes token and retries request on 401", async () => {
    tokenStorage.setTokens({
      accessToken: "expired-token",
      refreshToken: "valid-refresh-token",
    });

    let requestCount = 0;
    httpClient.defaults.adapter = async (config) => {
      requestCount++;
      if (requestCount === 1) {
        throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, {
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config,
          data: { detail: "Token expired" },
        } as AxiosResponse);
      }

      return {
        data: { vehicles: ["car1"] },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      } as AxiosResponse;
    };

    const refreshSpy = vi.spyOn(refreshClient, "post").mockResolvedValueOnce({
      data: {
        access_token: "refreshed-access-token",
        token_type: "bearer",
        expires_in: 900,
      },
    } as AxiosResponse);

    const response = await httpClient.get("/api/v1/vehicles");

    expect(refreshSpy).toHaveBeenCalledWith("/api/v1/auth/refresh", {
      refresh_token: "valid-refresh-token",
    });
    expect(tokenStorage.getAccessToken()).toBe("refreshed-access-token");
    expect(tokenStorage.getRefreshToken()).toBe("valid-refresh-token");
    expect(response.data).toEqual({ vehicles: ["car1"] });
    expect(requestCount).toBe(2);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("handles concurrent 401 requests with a single refresh call", async () => {
    tokenStorage.setTokens({
      accessToken: "expired-token",
      refreshToken: "valid-refresh-token",
    });

    httpClient.defaults.adapter = async (config) => {
      if (!config._retry) {
        throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, {
          status: 401,
          statusText: "Unauthorized",
          headers: {},
          config,
          data: { detail: "Token expired" },
        } as AxiosResponse);
      }

      return {
        data: { endpoint: config.url },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      } as AxiosResponse;
    };

    let resolveRefresh: ((value: AxiosResponse) => void) | null = null;
    const refreshSpy = vi.spyOn(refreshClient, "post").mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRefresh = resolve as (value: AxiosResponse) => void;
        }),
    );

    const req1 = httpClient.get("/api/v1/vehicles");
    const req2 = httpClient.get("/api/v1/profile");

    // Wait until requests hit 401 and invoke refreshClient.post
    await vi.waitFor(() => {
      expect(refreshSpy).toHaveBeenCalledTimes(1);
    });

    // Resolve the single refresh call
    resolveRefresh!({
      data: {
        access_token: "new-shared-token",
        token_type: "bearer",
        expires_in: 900,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    });

    const [res1, res2] = await Promise.all([req1, req2]);

    expect(res1.data).toEqual({ endpoint: "/api/v1/vehicles" });
    expect(res2.data).toEqual({ endpoint: "/api/v1/profile" });
    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(tokenStorage.getAccessToken()).toBe("new-shared-token");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("redirects to login and clears tokens if refresh API returns 422 validation error", async () => {
    tokenStorage.setTokens({
      accessToken: "expired-token",
      refreshToken: "malformed-refresh-token",
    });

    httpClient.defaults.adapter = async (config) => {
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: { detail: "Unauthorized" },
      } as AxiosResponse);
    };

    vi.spyOn(refreshClient, "post").mockRejectedValueOnce(
      new AxiosError("Unprocessable Entity", "ERR_BAD_REQUEST", undefined, null, {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        data: {
          detail: [
            {
              loc: ["body", "refresh_token"],
              msg: "Field required",
              type: "value_error.missing",
            },
          ],
        },
      } as AxiosResponse),
    );

    await expect(httpClient.get("/api/v1/vehicles")).rejects.toThrow();

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("redirects to login and clears tokens if refresh API returns 401 or other error", async () => {
    tokenStorage.setTokens({
      accessToken: "expired-token",
      refreshToken: "expired-refresh-token",
    });

    httpClient.defaults.adapter = async (config) => {
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: { detail: "Unauthorized" },
      } as AxiosResponse);
    };

    vi.spyOn(refreshClient, "post").mockRejectedValueOnce(
      new AxiosError("Unauthorized", "ERR_BAD_REQUEST", undefined, null, {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
        data: { detail: "Invalid refresh token" },
      } as AxiosResponse),
    );

    await expect(httpClient.get("/api/v1/vehicles")).rejects.toThrow();

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("redirects to login and clears tokens if 401 occurs with no refresh token available", async () => {
    tokenStorage.setTokens({
      accessToken: "expired-token",
      refreshToken: "",
    });

    httpClient.defaults.adapter = async (config) => {
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: { detail: "Unauthorized" },
      } as AxiosResponse);
    };

    await expect(httpClient.get("/api/v1/vehicles")).rejects.toThrow();

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("redirects to login and clears tokens if direct call to /api/v1/auth/refresh fails", async () => {
    tokenStorage.setTokens({
      accessToken: "token",
      refreshToken: "token",
    });

    httpClient.defaults.adapter = async (config) => {
      throw new AxiosError("Unprocessable Entity", "ERR_BAD_REQUEST", config, null, {
        status: 422,
        statusText: "Unprocessable Entity",
        headers: {},
        config,
        data: {
          detail: [
            {
              loc: ["body", "refresh_token"],
              msg: "string",
              type: "string",
            },
          ],
        },
      } as AxiosResponse);
    };

    await expect(
      httpClient.post("/api/v1/auth/refresh", { refresh_token: "invalid" }),
    ).rejects.toThrow();

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("does not attempt refresh or redirect if /api/v1/auth/login returns 401", async () => {
    httpClient.defaults.adapter = async (config) => {
      throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: { detail: "Incorrect username or password" },
      } as AxiosResponse);
    };

    const refreshSpy = vi.spyOn(refreshClient, "post");

    await expect(
      httpClient.post("/api/v1/auth/login", { email: "a@b.com", password: "wrong" }),
    ).rejects.toThrow();

    expect(refreshSpy).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
