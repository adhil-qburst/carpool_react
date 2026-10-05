import { beforeEach, describe, expect, it } from "vitest";
import { tokenStorage } from "./tokenStorage";

describe("tokenStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and retrieves access and refresh tokens", () => {
    tokenStorage.setTokens({
      accessToken: "access-123",
      refreshToken: "refresh-456",
    });

    expect(tokenStorage.getAccessToken()).toBe("access-123");
    expect(tokenStorage.getRefreshToken()).toBe("refresh-456");
  });

  it("updates access token without modifying refresh token", () => {
    tokenStorage.setTokens({
      accessToken: "old-access",
      refreshToken: "keep-refresh",
    });

    tokenStorage.setAccessToken("new-access");

    expect(tokenStorage.getAccessToken()).toBe("new-access");
    expect(tokenStorage.getRefreshToken()).toBe("keep-refresh");
  });

  it("clears both tokens", () => {
    tokenStorage.setTokens({
      accessToken: "access-123",
      refreshToken: "refresh-456",
    });

    tokenStorage.clear();

    expect(tokenStorage.getAccessToken()).toBeNull();
    expect(tokenStorage.getRefreshToken()).toBeNull();
  });
});
