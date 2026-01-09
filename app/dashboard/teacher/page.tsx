// "use client";

// import {
//   Users,
//   BookOpen,
//   TrendingUp,
//   Calendar,
//   Moon,
//   Sun,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Home,
//   ClipboardList,
//   Menu,
//   X
// } from "lucide-react";
// import { useState, useEffect } from "react";

// export default function TeacherDashboard() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeMenu, setActiveMenu] = useState("Overview");

//   // Mock user data
//   const user = {
//     name: "Jane Teacher",
//     email: "teacher@school.com",
//     role: "Teacher",
//     class: "Class 10 - A",
//     subject: "Mathematics"
//   };

//   // Toggle dark mode
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [darkMode]);

//   const stats = [
//     {
//       icon: Users,
//       value: "35",
//       label: "Total Students",
//       bgColor: "bg-blue-500"
//     },
//     {
//       icon: CheckCircle,
//       value: "32",
//       label: "Present Today",
//       bgColor: "bg-green-500"
//     },
//     {
//       icon: XCircle,
//       value: "3",
//       label: "Absent Today",
//       bgColor: "bg-red-500"
//     },
//     {
//       icon: TrendingUp,
//       value: "91.4%",
//       label: "Attendance Rate",
//       bgColor: "bg-teal-500"
//     }
//   ];

//   const quickActions = [
//     {
//       icon: ClipboardList,
//       title: "Mark Attendance",
//       bgColor: "bg-blue-500"
//     },
//     {
//       icon: Users,
//       title: "View Students",
//       bgColor: "bg-teal-500"
//     },
//     {
//       icon: BookOpen,
//       title: "My Class",
//       bgColor: "bg-purple-500"
//     },
//     {
//       icon: Calendar,
//       title: "Attendance History",
//       bgColor: "bg-orange-500"
//     }
//   ];

//   const recentAttendance = [
//     {
//       date: "2024-03-15",
//       present: 33,
//       absent: 2,
//       rate: "94.3%"
//     },
//     {
//       date: "2024-03-14",
//       present: 31,
//       absent: 4,
//       rate: "88.6%"
//     },
//     {
//       date: "2024-03-13",
//       present: 34,
//       absent: 1,
//       rate: "97.1%"
//     },
//     {
//       date: "2024-03-12",
//       present: 30,
//       absent: 5,
//       rate: "85.7%"
//     }
//   ];

//   const upcomingEvents = [
//     {
//       icon: Calendar,
//       title: "Staff Meeting",
//       date: "Dec 31"
//     },
//     {
//       icon: Calendar,
//       title: "Parent Meeting",
//       date: "Jan 2"
//     },
//     {
//       icon: Clock,
//       title: "Exam Week Starts",
//       date: "Jan 5"
//     }
//   ];

//   // Generate calendar days
//   const generateCalendarDays = () => {
//     const days = [];
//     // Start from day 30 (previous month)
//     days.push({ day: 30, isCurrentMonth: false });
    
//     // Add days of current month
//     for (let i = 1; i <= 31; i++) {
//       days.push({ day: i, isCurrentMonth: true });
//     }
    
//     // Add next month days to fill grid
//     for (let i = 1; i <= 3; i++) {
//       days.push({ day: i, isCurrentMonth: false });
//     }
//     return days;
//   };

//   const menuItems = [
//     { icon: Home, label: "Overview", active: true },
//     { icon: BookOpen, label: "My Class", active: false },
//     { icon: Users, label: "Students", active: false },
//     { icon: ClipboardList, label: "Attendance", active: false }
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar - Desktop */}
//       <div className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white">
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-800">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
//               <BookOpen className="w-6 h-6" />
//             </div>
//             <span className="text-xl font-bold">AttendEase</span>
//           </div>
//         </div>

//         {/* User Info */}
//         <div className="p-6 border-b border-gray-800">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//               {user.name.charAt(0)}
//             </div>
//             <div>
//               <div className="font-semibold">{user.name}</div>
//               <div className="text-sm text-gray-400">{user.role}</div>
//             </div>
//           </div>
//         </div>

//         {/* Menu Items */}
//         <nav className="flex-1 p-4">
//           {menuItems.map((item) => (
//             <button
//               key={item.label}
//               onClick={() => setActiveMenu(item.label)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
//                 activeMenu === item.label
//                   ? "bg-blue-500 text-white"
//                   : "text-gray-400 hover:bg-gray-800 hover:text-white"
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         {/* School Info */}
//         <div className="p-6 border-t border-gray-800">
//           <div className="text-sm text-gray-400 mb-1">School</div>
//           <div className="font-semibold">Springfield High School</div>
//         </div>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-800">
//           <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {sidebarOpen && (
//         <div className="lg:hidden fixed inset-0 z-50">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setSidebarOpen(false)}
//           />
//           <div className="absolute inset-y-0 left-0 w-64 bg-gray-900 text-white">
//             {/* Logo */}
//             <div className="p-6 border-b border-gray-800 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
//                   <BookOpen className="w-6 h-6" />
//                 </div>
//                 <span className="text-xl font-bold">AttendEase</span>
//               </div>
//               <button onClick={() => setSidebarOpen(false)}>
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             {/* User Info */}
//             <div className="p-6 border-b border-gray-800">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                   {user.name.charAt(0)}
//                 </div>
//                 <div>
//                   <div className="font-semibold">{user.name}</div>
//                   <div className="text-sm text-gray-400">{user.role}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Menu Items */}
//             <nav className="flex-1 p-4">
//               {menuItems.map((item) => (
//                 <button
//                   key={item.label}
//                   onClick={() => {
//                     setActiveMenu(item.label);
//                     setSidebarOpen(false);
//                   }}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
//                     activeMenu === item.label
//                       ? "bg-blue-500 text-white"
//                       : "text-gray-400 hover:bg-gray-800 hover:text-white"
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span>{item.label}</span>
//                 </button>
//               ))}
//             </nav>

//             {/* School Info */}
//             <div className="p-6 border-t border-gray-800">
//               <div className="text-sm text-gray-400 mb-1">School</div>
//               <div className="font-semibold">Springfield High School</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Header */}
//         <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
//           <div className="flex items-center justify-between px-4 lg:px-8 py-4">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
//               >
//                 <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
//               </button>
//               <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
//                 Teacher Dashboard
//               </h1>
//             </div>
//             <div className="flex items-center gap-2 lg:gap-4">
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 {darkMode ? (
//                   <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//                 ) : (
//                   <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//                 )}
//               </button>
//               <div className="hidden lg:flex items-center gap-3">
//                 <div className="text-right">
//                   <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                     {user.name}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {user.email}
//                   </div>
//                 </div>
//                 <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
//                   {user.name.charAt(0)}
//                 </div>
//               </div>
//               <div className="lg:hidden w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                 {user.name.charAt(0)}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 overflow-auto p-4 lg:p-8">
//           <div className="max-w-[1400px] mx-auto space-y-6">
//             {/* Welcome Section */}
//             <div>
//               <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                 Welcome, Teacher! 📚
//               </h2>
//               <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
//                 {user.class} | {user.subject}
//               </p>
//             </div>

//             {/* Mark Attendance Button - Mobile */}
//             <button className="lg:hidden w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-blue-600 transition-colors">
//               <ClipboardList className="w-5 h-5" />
//               <span>Mark Attendance</span>
//             </button>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               {stats.map((stat) => (
//                 <div
//                   key={stat.label}
//                   className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow"
//                 >
//                   <div className="flex flex-col gap-3">
//                     <div className={`${stat.bgColor} p-3 rounded-xl w-fit`}>
//                       <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
//                         {stat.label}
//                       </div>
//                       <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
//                         {stat.value}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Quick Actions & Recent Attendance */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Quick Actions */}
//               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
//                 <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-1">
//                   Quick Actions
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
//                   Common tasks for your class
//                 </p>

//                 <div className="grid grid-cols-2 gap-4">
//                   {quickActions.map((action) => (
//                     <button
//                       key={action.title}
//                       className="flex flex-col items-center justify-center p-6 lg:p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
//                     >
//                       <div
//                         className={`${action.bgColor} p-4 rounded-xl mb-3 group-hover:scale-110 transition-transform`}
//                       >
//                         <action.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
//                       </div>
//                       <span className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white text-center">
//                         {action.title}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Recent Attendance */}
//               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
//                 <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-1">
//                   Recent Attendance
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
//                   Last 4 days attendance summary
//                 </p>

//                 <div className="space-y-3">
//                   {recentAttendance.map((record, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
//                     >
//                       <div className="flex items-center gap-3">
//                         <Calendar className="w-5 h-5 text-blue-500" />
//                         <div>
//                           <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                             {record.date}
//                           </div>
//                           <div className="text-xs text-gray-600 dark:text-gray-400">
//                             {record.present} present, {record.absent} absent
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-lg font-bold text-gray-900 dark:text-white">
//                         {record.rate}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Class Calendar */}
//             <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
//               <div className="flex items-start gap-3 mb-6">
//                 <Calendar className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
//                 <div className="flex-1">
//                   <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
//                     Class Calendar
//                   </h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     View class events and attendance schedule
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Calendar */}
//                 <div>
//                   <div className="flex items-center justify-between mb-6">
//                     <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//                       <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//                     </button>
//                     <span className="text-base font-semibold text-gray-900 dark:text-white">
//                       December 2025
//                     </span>
//                     <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//                       <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-7 gap-2">
//                     {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
//                       <div
//                         key={day}
//                         className="text-sm font-semibold text-gray-500 dark:text-gray-400 py-2 text-center"
//                       >
//                         {day}
//                       </div>
//                     ))}
//                     {generateCalendarDays().map((item, index) => (
//                       <button
//                         key={index}
//                         className={`py-2.5 text-sm rounded-lg transition-colors ${
//                           item.day === 31 && item.isCurrentMonth
//                             ? "bg-teal-500 text-white hover:bg-teal-600"
//                             : item.isCurrentMonth
//                             ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
//                             : "text-gray-400 dark:text-gray-600 opacity-40"
//                         }`}
//                       >
//                         {item.day}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Today's Events & Upcoming */}
//                 <div className="space-y-6">
//                   <div>
//                     <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
//                       Wednesday, December 31
//                     </div>
//                     <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
//                       <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400">
//                         <Calendar className="w-5 h-5" />
//                         <span className="font-medium">Staff Meeting</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
//                       Upcoming Events
//                     </h4>
//                     <div className="space-y-3">
//                       {upcomingEvents.map((event, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
//                         >
//                           <div className="flex items-center gap-3">
//                             <event.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
//                             <span className="text-sm text-gray-900 dark:text-white">
//                               {event.title}
//                             </span>
//                           </div>
//                           <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
//                             {event.date}
//                           </span>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Legend */}
//                     <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                         <span className="text-xs text-gray-600 dark:text-gray-400">Event</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full bg-gray-400"></div>
//                         <span className="text-xs text-gray-600 dark:text-gray-400">Holiday</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full bg-amber-500"></div>
//                         <span className="text-xs text-gray-600 dark:text-gray-400">Alert</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                         <span className="text-xs text-gray-600 dark:text-gray-400">Present</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Home,
  ClipboardList,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useMyTeacherProfile } from "@/app/querry/useTeachers";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const { user, loading, logout } = useAuth();
  const { data: teacherProfile, isLoading: profileLoading } = useMyTeacherProfile();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Overview");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const stats = [
    {
      icon: Users,
      value: "35",
      label: "Total Students",
      bgColor: "bg-blue-500"
    },
    {
      icon: CheckCircle,
      value: "32",
      label: "Present Today",
      bgColor: "bg-green-500"
    },
    {
      icon: XCircle,
      value: "3",
      label: "Absent Today",
      bgColor: "bg-red-500"
    },
    {
      icon: TrendingUp,
      value: "91.4%",
      label: "Attendance Rate",
      bgColor: "bg-teal-500"
    }
  ];

  const quickActions = [
    {
      icon: ClipboardList,
      title: "Mark Attendance",
      bgColor: "bg-blue-500"
    },
    {
      icon: Users,
      title: "View Students",
      bgColor: "bg-teal-500"
    },
    {
      icon: BookOpen,
      title: "My Class",
      bgColor: "bg-purple-500"
    },
    {
      icon: Calendar,
      title: "Attendance History",
      bgColor: "bg-orange-500"
    }
  ];

  const recentAttendance = [
    {
      date: "2024-03-15",
      present: 33,
      absent: 2,
      rate: "94.3%"
    },
    {
      date: "2024-03-14",
      present: 31,
      absent: 4,
      rate: "88.6%"
    },
    {
      date: "2024-03-13",
      present: 34,
      absent: 1,
      rate: "97.1%"
    },
    {
      date: "2024-03-12",
      present: 30,
      absent: 5,
      rate: "85.7%"
    }
  ];

  const upcomingEvents = [
    {
      icon: Calendar,
      title: "Staff Meeting",
      date: "Dec 31"
    },
    {
      icon: Calendar,
      title: "Parent Meeting",
      date: "Jan 2"
    },
    {
      icon: Clock,
      title: "Exam Week Starts",
      date: "Jan 5"
    }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    // Start from day 30 (previous month)
    days.push({ day: 30, isCurrentMonth: false });
    
    // Add days of current month
    for (let i = 1; i <= 31; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Add next month days to fill grid
    for (let i = 1; i <= 3; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    return days;
  };

  const menuItems = [
    { icon: Home, label: "Overview", active: true },
    { icon: BookOpen, label: "My Class", active: false },
    { icon: Users, label: "Students", active: false },
    { icon: ClipboardList, label: "Attendance", active: false }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">AttendEase</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user?.name?.charAt(0) || "T"}
            </div>
            <div>
              <div className="font-semibold">{user?.name || "Teacher"}</div>
              <div className="text-sm text-gray-400">{user?.role || "Teacher"}</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeMenu === item.label
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* School Info */}
        <div className="p-6 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-1">School</div>
          <div className="font-semibold">Springfield High School</div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-gray-900 text-white">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">AttendEase</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user?.name?.charAt(0) || "T"}
                </div>
                <div>
                  <div className="font-semibold">{user?.name || "Teacher"}</div>
                  <div className="text-sm text-gray-400">{user?.role || "Teacher"}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveMenu(item.label);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeMenu === item.label
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* School Info */}
            <div className="p-6 border-t border-gray-800">
              <div className="text-sm text-gray-400 mb-1">School</div>
              <div className="font-semibold">Springfield High School</div>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-gray-800">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                Teacher Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <div className="hidden lg:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.name || "Teacher"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || "teacher@school.com"}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || "T"}
                </div>
              </div>
              <div className="lg:hidden w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0) || "T"}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Welcome Section */}
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {user?.name?.split(" ")[0] || "Teacher"}! 📚
              </h2>
              {profileLoading ? (
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  Loading class information...
                </p>
              ) : teacherProfile?.assignedClass ? (
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  Class {teacherProfile.assignedClass.className} - {teacherProfile.assignedClass.section}
                </p>
              ) : (
                <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  No class assigned yet
                </p>
              )}
            </div>

            {/* Mark Attendance Button - Mobile */}
            <button className="lg:hidden w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-blue-600 transition-colors">
              <ClipboardList className="w-5 h-5" />
              <span>Mark Attendance</span>
            </button>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col gap-3">
                    <div className={`${stat.bgColor} p-3 rounded-xl w-fit`}>
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Quick Actions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Common tasks for your class
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      className="flex flex-col items-center justify-center p-6 lg:p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
                    >
                      <div
                        className={`${action.bgColor} p-4 rounded-xl mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white text-center">
                        {action.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Attendance */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Recent Attendance
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Last 4 days attendance summary
                </p>

                <div className="space-y-3">
                  {recentAttendance.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {record.date}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {record.present} present, {record.absent} absent
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {record.rate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Class Calendar */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                    Class Calendar
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View class events and attendance schedule
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      December 2025
                    </span>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div
                        key={day}
                        className="text-sm font-semibold text-gray-500 dark:text-gray-400 py-2 text-center"
                      >
                        {day}
                      </div>
                    ))}
                    {generateCalendarDays().map((item, index) => (
                      <button
                        key={index}
                        className={`py-2.5 text-sm rounded-lg transition-colors ${
                          item.day === 31 && item.isCurrentMonth
                            ? "bg-teal-500 text-white hover:bg-teal-600"
                            : item.isCurrentMonth
                            ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            : "text-gray-400 dark:text-gray-600 opacity-40"
                        }`}
                      >
                        {item.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Today's Events & Upcoming */}
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Wednesday, December 31
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-400">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Staff Meeting</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                      Upcoming Events
                    </h4>
                    <div className="space-y-3">
                      {upcomingEvents.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <event.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {event.title}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {event.date}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Event</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Holiday</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Alert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Present</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}