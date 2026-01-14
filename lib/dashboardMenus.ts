import {
  Home,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  Umbrella,
  BarChart3,
  School
} from "lucide-react";

export type Role = "principal" | "teacher" | "student";
export const DASHBOARD_MENUS: Record<Role, {
  icon: any;
  text: string;
  path: string;
}[]> = {
  principal: [
    { icon: Home, text: "Overview", path: "/dashboard/principal" },
    { icon: School, text: "School Profile", path: "/dashboard/principal/schoolProfile" },
    { icon: Calendar, text: "Sessions", path: "/dashboard/principal/session" },
    { icon: BookOpen, text: "Classes", path: "/dashboard/principal/class" },
    { icon: Users, text: "Teachers", path: "/dashboard/principal/teachers" },
    
    { icon: Umbrella, text: "Holidays", path: "/dashboard/principal/holidays" },
  { icon: BarChart3, text: "Reports", path: "/dashboard/principal/reports" }
  ],

  teacher: [
    { icon: Home, text: "Overview", path: "/dashboard/teacher" },
    { icon: Users, text: "My Profile", path: "/dashboard/teacher/profile" },
    { icon: Users, text: "Students", path: "/dashboard/teacher/student" },
    { icon: ClipboardList, text: "Attendance", path: "/dashboard/teacher/attendance" }
  ],

  student: [
    { icon: Home, text: "Overview", path: "/dashboard/student" },

    { icon: ClipboardList, text: "My Attendance", path: "/dashboard/student/attendance" },
    { icon: Users, text: "My Profile", path: "/dashboard/student/profile" },
  ]
};
