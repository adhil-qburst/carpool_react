import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { toApiRole } from "../types/auth.api.types";
import type { RegisterForm } from "../types/auth.type";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (form: RegisterForm) =>
      authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        roles: form.roles.map(toApiRole),
      }),
  });
}
