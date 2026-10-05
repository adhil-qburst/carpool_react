import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { authApi } from "./auth.api";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls register endpoint", async () => {
    const payload = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      roles: ["rider" as const],
    };
    const responseData = {
      id: "u-1",
      name: "John Doe",
      email: "john@example.com",
      roles: ["rider" as const],
    };

    vi.mocked(httpClient.post).mockResolvedValueOnce({ data: responseData });

    const result = await authApi.register(payload);

    expect(httpClient.post).toHaveBeenCalledWith(
      "/api/v1/auth/register",
      payload,
    );
    expect(result).toEqual(responseData);
  });

  it("calls login endpoint", async () => {
    const payload = {
      email: "john@example.com",
      password: "password123",
    };
    const responseData = {
      access_token: "token123",
      refresh_token: "refresh123",
      token_type: "bearer",
    };

    vi.mocked(httpClient.post).mockResolvedValueOnce({ data: responseData });

    const result = await authApi.login(payload);

    expect(httpClient.post).toHaveBeenCalledWith("/api/v1/auth/login", payload);
    expect(result).toEqual(responseData);
  });

  it("calls refresh endpoint", async () => {
    const payload = {
      refresh_token: "refresh123",
    };
    const responseData = {
      access_token: "new-token123",
      token_type: "bearer",
      expires_in: 900,
    };

    vi.mocked(httpClient.post).mockResolvedValueOnce({ data: responseData });

    const result = await authApi.refresh(payload);

    expect(httpClient.post).toHaveBeenCalledWith(
      "/api/v1/auth/refresh",
      payload,
    );
    expect(result).toEqual(responseData);
  });
});
