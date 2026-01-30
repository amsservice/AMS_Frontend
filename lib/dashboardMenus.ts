import {
  Home,
  BookOpen,
  Users,
  Calendar,
  ClipboardList,
  Umbrella,
  BarChart3,
  School,
  User
} from "lucide-react";

export type Role = "principal" | "teacher" | "student" | "coordinator";

interface MenuItem {
  icon: any;
  text: string;
  path: string;
}

const principalMenus: MenuItem[] = [
  { icon: Home, text: "Overview", path: "/dashboard/principal" },
  { icon: School, text: "School Profile", path: "/dashboard/principal/schoolProfile" },
  { icon: Calendar, text: "Sessions", path: "/dashboard/principal/session" },
  { icon: BookOpen, text: "Classes", path: "/dashboard/principal/class" },
  { icon: Users, text: "Staff", path: "/dashboard/principal/teachers" },
  { icon: Users, text: "Students", path: "/dashboard/principal/students" },
  { icon: Umbrella, text: "Holidays", path: "/dashboard/principal/holidays" },
  { icon: BarChart3, text: "Reports", path: "/dashboard/principal/reports" },
];

const coordinatorMenus: MenuItem[] = principalMenus
  .filter(
    (m) =>
      m.path !== "/dashboard/principal/schoolProfile" &&
      m.path !== "/dashboard/principal/session" &&
      m.path !== "/dashboard/principal/reports"
  )
  .map((m) => ({
    ...m,
    path: m.path.replace("/dashboard/principal", "/dashboard/coordinator")
  }));

const teacherMenus: MenuItem[] = [
  { icon: Home, text: "Overview", path: "/dashboard/teacher" },
  { icon: Users, text: "Students", path: "/dashboard/teacher/student" },
  { icon: ClipboardList, text: "Attendance", path: "/dashboard/teacher/attendance-mark" },
   { icon: BarChart3, text: "Reports", path: "/dashboard/teacher/reports" },
     { icon: User, text: "My Profile", path: "/dashboard/teacher/teacher-profile" },
];

const studentMenus: MenuItem[] = [
  { icon: Home, text: "Overview", path: "/dashboard/student" },
  { icon: ClipboardList, text: "My Attendance", path: "/dashboard/student/attendance" },
];

export const DASHBOARD_MENUS: Record<Role, MenuItem[]> = {
  principal: principalMenus,
  coordinator: coordinatorMenus,
  teacher: teacherMenus,
  student: studentMenus,
};


// export const DASHBOARD_MENUS: Record<Role, {
//   icon: any;
//   text: string;
//   path: string;
// }[]> = {
//   principal: [
//     { icon: Home, text: "Overview", path: "/dashboard/principal" },
//     { icon: School, text: "School Profile", path: "/dashboard/principal/schoolProfile" },
//     { icon: Calendar, text: "Sessions", path: "/dashboard/principal/session" },
//     { icon: BookOpen, text: "Classes", path: "/dashboard/principal/class" },
//     { icon: Users, text: "Teachers", path: "/dashboard/principal/teachers" },
//     { icon: Users, text: "Students", path: "/dashboard/principal/students" },
//     { icon: Umbrella, text: "Holidays", path: "/dashboard/principal/holidays" },
//     { icon: BarChart3, text: "Reports", path: "/dashboard/principal/reports" }
//   ],

//   teacher: [
//     { icon: Home, text: "Overview", path: "/dashboard/teacher" },
//     { icon: BookOpen, text: "My Class", path: "/dashboard/teacher/classes" },
//     { icon: Users, text: "Students", path: "/dashboard/teacher/student" },
//     { icon: ClipboardList, text: "Attendance", path: "/dashboard/teacher/attendance" }
//   ],

//   student: [
//     { icon: Home, text: "Overview", path: "/dashboard/student" },
//     { icon: ClipboardList, text: "My Attendance", path: "/dashboard/student/attendance" }
//   ]
// };
