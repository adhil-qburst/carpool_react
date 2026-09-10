export type UserRole = "driver" | "rider";

export interface CurrentUserResponse {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export type UserResponse = CurrentUserResponse;
