export const userKeys = {
  all: ["users"] as const,
  currentUser: () => [...userKeys.all, "currentUser"] as const,
};
