import type { Role } from "./register.type";

export type ApiRole = "driver" | "rider";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  roles: ApiRole[];
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  roles: ApiRole[];
}

export function toApiRole(role: Role): ApiRole {
  return role.toLowerCase() as ApiRole;
}
