import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CurrentUserResponse } from "../types/users.api.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { usersApi } from "../api/users.api";
import { tokenStorage } from "@core/auth/tokenStorage";
import { renderHook, waitFor } from "@testing-library/react";
import { useCurrentUserQuery } from "./useCurrentUserQuery";

vi.mock("../api/users.api", () => ({
  usersApi: {
    getCurrentUser: vi.fn(),
  },
}));

vi.mock("@core/auth/tokenStorage", () => ({
  tokenStorage: { getAccessToken: vi.fn() },
}));

const mockCurrentUser: CurrentUserResponse = {
  id: "user_1",
  email: "user1@example.com",
  name: "User 1",
  roles: ["driver"],
};

const mockAccessToken: string = "fake-token";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {" "}
        {children}
      </QueryClientProvider>
    );
  };
}

describe("useCurrentUserQuery", () => {
  beforeEach(() => {
    vi.mocked(usersApi.getCurrentUser).mockReset();
    vi.mocked(tokenStorage.getAccessToken).mockReturnValueOnce(mockAccessToken);
  });

  it("fetches and return the current user", async () => {
    vi.mocked(usersApi.getCurrentUser).mockResolvedValueOnce(mockCurrentUser);

    const { result } = renderHook(() => useCurrentUserQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCurrentUser);
    expect(usersApi.getCurrentUser).toHaveBeenCalledTimes(1);
  });
});
