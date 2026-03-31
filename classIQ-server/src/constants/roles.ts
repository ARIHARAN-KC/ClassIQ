export const ROLES = {
  TEACHER: "teacher",
  STUDENT: "student",
  ADMIN: "admin",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];