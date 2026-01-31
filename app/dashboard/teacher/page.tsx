

"use client";

import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext"
import { useMyTeacherFullProfile } from "@/app/querry/useTeachers";
import { useTeacherTodaySummary, useTeacherTodayStudents } from "@/app/querry/useAttendance";


import { useState } from "react";
import SchoolCalendar from "@/components/holidays/SchoolCalendar"; // Import the SchoolCalendar component

export default function TeacherDashboard() {
  // Mock data
  // const user = { name: "Sarah Johnson" };
  const { user } = useAuth();
  const students = Array(35).fill(null);

  const getIstDateKey = (value: Date = new Date()) => {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(value);
  };

  const { data, isLoading } = useMyTeacherFullProfile();
  const activeClass = data?.data?.history?.find(h => h.isActive);
  const today = getIstDateKey();

  const { data: summary } = useTeacherTodaySummary(today);
  const {
    data: todayStudents = [],
    isLoading: studentsLoading
  } = useTeacherTodayStudents(today);




  const stats = [
    {
      id: "students",
      icon: Users,
      value: summary?.total ?? 0,
      label: "Total",
      bgGradient: "from-slate-500 to-slate-600",
      cardClass:
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700",
      labelClass: "text-slate-600 dark:text-slate-400",
      valueClass: "text-slate-900 dark:text-white"
    },
    {
      id: "present",
      icon: CheckCircle,
      value: summary?.present ?? 0,
      label: "Present",
      bgGradient: "from-emerald-500 to-emerald-600",
      cardClass:
        "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 border border-emerald-200 dark:border-emerald-800",
      labelClass: "text-emerald-700 dark:text-emerald-300",
      valueClass: "text-emerald-900 dark:text-emerald-100"
    },
    {
      id: "absent",
      icon: XCircle,
      value: summary?.absent ?? 0,
      label: "Absent",
      bgGradient: "from-rose-500 to-rose-600",
      cardClass:
        "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/40 border border-rose-200 dark:border-rose-800",
      labelClass: "text-rose-700 dark:text-rose-300",
      valueClass: "text-rose-900 dark:text-rose-100"
    },
    {
      id: "rate",
      icon: TrendingUp,
      value: `${summary?.presentPercentage ?? 0}%`,
      label: "Rate",
      bgGradient: "from-indigo-500 to-indigo-600",
      cardClass:
        "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40 border border-indigo-200 dark:border-indigo-800",
      labelClass: "text-indigo-700 dark:text-indigo-300",
      valueClass: "text-indigo-900 dark:text-indigo-100"
    }
  ];

  const quickActions = [
    {
      icon: ClipboardList,
      title: "Mark Attendance",
      bgGradient: "from-purple-500 to-blue-500"
    },
    {
      icon: Users,
      title: "View Students",
      bgGradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: BookOpen,
      title: "My Class",
      bgGradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Calendar,
      title: "Attendance History",
      bgGradient: "from-purple-400 to-blue-400"
    }
  ];

  // const recentAttendance = [
  //   {
  //     date: "2024-03-15",
  //     present: 33,
  //     absent: 2,
  //     rate: "94.3%"
  //   },
  //   {
  //     date: "2024-03-14",
  //     present: 31,
  //     absent: 4,
  //     rate: "88.6%"
  //   },
  //   {
  //     date: "2024-03-13",
  //     present: 34,
  //     absent: 1,
  //     rate: "97.1%"
  //   },
  //   {
  //     date: "2024-03-12",
  //     present: 30,
  //     absent: 5,
  //     rate: "85.7%"
  //   }
  // ];

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-slate-900 dark:to-purple-950 overflow-hidden">
      {/* Header with matching gradient */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950 shadow-2xl border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                Welcome back, {user?.name?.split(" ")[0] || "Teacher"}! 📚
              </h1>
              <p className="mt-2 text-sm sm:text-base text-indigo-100 font-medium">
                {isLoading
                  ? "Loading class..."
                  : activeClass
                    ? `Class ${activeClass.className} - ${activeClass.section}`
                    : "No class assigned"}
              </p>

            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/95 backdrop-blur-sm text-purple-600 rounded-xl text-sm font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center border border-purple-200/50">
                <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span>Mark Attendance</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className={`group relative backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${stat.cardClass}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.bgGradient}`}></div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}>
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>

                  <p className={`text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 ${stat.labelClass}`}>
                    {stat.label}
                  </p>

                  <p className={`text-2xl sm:text-3xl font-bold ${stat.valueClass}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions & Recent Attendance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Quick Actions */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl rounded-2xl border border-indigo-200/50 dark:border-slate-700/50 p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-full blur-3xl"></div>

              <div className="relative">
                <div className="flex items-center mb-5 sm:mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                    <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Quick Actions
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Common tasks for your class
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-indigo-200/50 dark:border-slate-700/50"
                    >
                      <div
                        className={`bg-gradient-to-br ${action.bgGradient} p-3 sm:p-3.5 rounded-xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-md`}
                      >
                        <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white text-center">
                        {action.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Attendance – Student List */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl rounded-2xl border border-indigo-200/50 dark:border-slate-700/50 p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-full blur-3xl"></div>

              <div className="relative">
                <div className="flex items-center mb-5 sm:mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Today’s Attendance
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Student-wise attendance status
                    </p>
                  </div>
                </div>

                {/* CONTENT */}
                {studentsLoading ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Loading students...</p>
                ) : todayStudents.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Attendance not marked yet</p>
                ) : (
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {todayStudents.map((s) => (
                      <div
                        key={s.studentId}
                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/30 dark:border-slate-700/30"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {s.rollNo ? `${s.rollNo}. ` : ""}{s.name}
                          </div>
                        </div>

                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${s.status === "present"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : s.status === "absent"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : s.status === "late"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                        >
                          {s.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* School Calendar Component */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-xl rounded-2xl border border-indigo-200/50 dark:border-slate-700/50 p-5 sm:p-6 relative overflow-hidden">
            {/* Decorative gradient corners */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 dark:from-purple-500/5 dark:to-indigo-500/5 rounded-full blur-3xl"></div>

            <div className="relative">
              <SchoolCalendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}