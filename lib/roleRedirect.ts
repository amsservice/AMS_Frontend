// src/lib/roleRedirect.ts
import type { User } from "@/app/context/AuthContext";

export function getDashboardPath(role: User["role"]) {
  switch (role) {
    case "principal":
      return "/dashboard/principal";
    case "teacher":
      return "/dashboard/teacher";
    case "student":
      return "/dashboard/student";
    default:
      return "/login";
  }
}
