export type UserRole = "driver" | "rider";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}
