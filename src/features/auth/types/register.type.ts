export type Role = "Driver" | "Rider";
export type RegisterForm = {
  name: string;
  email: string;
  password: string;
  roles: Role[];
};
export type FormErrors = Partial<Record<keyof RegisterForm, string>>;
