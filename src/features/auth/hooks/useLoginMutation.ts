import { useMutation } from "@tanstack/react-query";
import type { LoginForm } from "../types/auth.type";
import { authApi } from "../api/auth.api";
import { tokenStorage } from "@core/auth/tokenStorage";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (form: LoginForm) =>
      authApi.login({
        email: form.email,
        password: form.password,
      }),
    onSuccess: (data) =>
      tokenStorage.setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      }),
  });
}
