import type { Role } from "./auth.type";

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
