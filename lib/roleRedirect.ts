// src/lib/roleRedirect.ts
import type { Role } from "@/app/context/AuthContext";

export function getDashboardPath(role: Role) {
  switch (role) {
    case "principal":
    case "coordinator":
      return "/dashboard/principal";
    case "teacher":
      return "/dashboard/teacher";
    case "student":
      return "/dashboard/student";
    default:
      return "/";
  }
}

