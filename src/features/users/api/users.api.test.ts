import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "@core/api/httpClient";
import { usersApi } from "./users.api";
import { apiEndpoints } from "@core/api/apiEndpoints";
import type { CurrentUserResponse } from "../types/users.api.types";

vi.mock("@core/api/httpClient", () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

describe("usersApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the current user", async () => {
    const mockUser: CurrentUserResponse = {
      id: "u-1",
      name: "Adhil",
      email: "adhil@example.com",
      roles: ["driver"],
    };

    vi.mocked(httpClient.get).mockResolvedValueOnce({ data: mockUser });

    const result = await usersApi.getCurrentUser();

    expect(httpClient.get).toHaveBeenCalledWith(apiEndpoints.users.currentUser);
    expect(result).toEqual(mockUser);
  });
});
