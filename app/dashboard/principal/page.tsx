"use client";

import {
  Users,
  BookOpen,
  UserPlus,
  TrendingUp,
  School,
  Calendar,
  Book,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useTotalClasses } from "@/app/querry/useClasses";
import SchoolCalendar from "@/components/holidays/SchoolCalendar";


export default function PrincipalDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [billableStudents, setBillableStudents] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [activeTeachers, setActiveTeachers] = useState<number>(0);


  // Fetch dashboard stats using React Query
  const { data: totalclasscount, isLoading: statsLoading } = useTotalClasses();


  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (user.role !== "principal") return;

    const fetchBillableStudents = async () => {
      try {
        const res = await apiFetch("/api/subscription/billable-students");
        setBillableStudents(res.billableStudents);
      } catch (err) {
        console.error("Failed to fetch billable students", err);
      }
    };

    fetchBillableStudents();
  }, [loading, user]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (user.role !== "principal") return;

    const fetchTotalStudents = async () => {
      try {
        const res = await apiFetch("/api/student/school-students");
        setTotalStudents(Array.isArray(res) ? res.length : 0);
      } catch (err) {
        console.error("Failed to fetch total students", err);
      }
    };

    fetchTotalStudents();
  }, [loading, user]);

  useEffect(() => {
    if (!user) {
      router.replace('/'); // redirect to home
    }
  }, [user, router]);

  /* ===============================
     FETCH ACTIVE TEACHERS
  =============================== */
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (user.role !== "principal") return;

    const fetchActiveTeachers = async () => {
      try {
        const res = await apiFetch("/api/teacher/active-teachers");
        setActiveTeachers(res.totalActiveTeachers || 0);
      } catch (err) {
        console.error("Failed to fetch active teachers", err);
      }
    };

    fetchActiveTeachers();
  }, [loading, user]);

  const capacity = billableStudents || 0;
  const filledPercent = capacity > 0 ? Math.min(100, Math.round((totalStudents / capacity) * 100)) : 0;
  const remainingStudents = Math.max(0, capacity - totalStudents);
  const remainingPercent = Math.max(0, 100 - filledPercent);

  const stats = [
    {
      id: "students",
      icon: Users,
      value: `${totalStudents}/${capacity}`,
      label: "Students / Capacity",
      bgGradient: "from-purple-500 to-blue-500"
    },
    {
      id: "teachers",
      icon: Users,
      value: activeTeachers ? activeTeachers.toString() : "0",
      label: "Total Teachers",
      bgGradient: "from-blue-500 to-indigo-500"
    },
    {
      id: "classes",
      icon: BookOpen,
      label: "Total Classes",
      value: statsLoading ? "..." : (totalclasscount?.totalClasses?.toString() || "0"),
      bgGradient: "from-indigo-500 to-purple-500"
    },
    {
      id: "attendance",
      icon: TrendingUp,
      label: "Today's Attendance",
      value: "92%",
      bgGradient: "from-purple-400 to-blue-400"
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "New Session",
      href: "/dashboard/principal/session",
      bgGradient: "from-purple-500 to-blue-500"
    },
    {
      icon: BookOpen,
      title: "Add Class",
      href: "/dashboard/principal/class",
      bgGradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: UserPlus,
      title: "Add Teacher",
      href: "/dashboard/principal/teachers",
      bgGradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: FileText,
      title: "View Reports",
      href: "/dashboard/principal/reports",
      bgGradient: "from-purple-400 to-blue-400"
    }
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      text: "Class 10-A attendance marked",
      time: "10 min ago",
      color: "text-purple-500 dark:text-purple-400"
    },
    {
      icon: UserPlus,
      text: "New teacher added: Sarah Johnson",
      time: "1 hour ago",
      color: "text-blue-500 dark:text-blue-400"
    },
    {
      icon: AlertCircle,
      text: "Low attendance in Class 8-B",
      time: "2 hours ago",
      color: "text-indigo-500 dark:text-indigo-400"
    },
    {
      icon: CheckCircle,
      text: "Class 9-C attendance marked",
      time: "3 hours ago",
      color: "text-purple-500 dark:text-purple-400"
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden">
      {/* Header with matching gradient */}
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900 shadow-2xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                Welcome back, {user?.name?.split(" ")[0] || "Principal"}! 
              </h1>
              <p className="mt-2 text-sm sm:text-base text-purple-100 font-medium">
                Here's what's happening at your school today
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/95 backdrop-blur-sm text-purple-600 rounded-xl text-sm font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center border border-purple-200/50">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline">Add Teacher</span>
                <span className="sm:hidden">Teacher</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Stats Cards with gradient accents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200/50 dark:border-purple-700/30 overflow-hidden"
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.bgGradient}`}></div>
                
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}>
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {stat.label}
                  </p>
                  
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </p>
                  
                  {stat.id === "students" && (
                    <div className="space-y-2 mt-3">
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${stat.bgGradient} transition-all duration-500`}
                          style={{ width: `${filledPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {filledPercent}% filled
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {remainingStudents} remaining
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Quick Actions */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl border border-purple-200/50 dark:border-purple-700/30 p-5 sm:p-6 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="flex items-center mb-5 sm:mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                    <Book className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Quick Actions
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Common tasks to manage your school
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      onClick={() => {
                        if (!action.href) return;
                        router.push(action.href);
                      }}
                      disabled={!action.href}
                      className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/40 dark:hover:to-blue-900/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-purple-200/50 dark:border-purple-700/30"
                    >
                      <div
                        className={`bg-gradient-to-br ${action.bgGradient} p-3 sm:p-3.5 rounded-xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-md`}
                      >
                        <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-center">
                        {action.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl border border-purple-200/50 dark:border-purple-700/30 p-5 sm:p-6 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="flex items-center mb-5 sm:mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Recent Activity
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Latest updates from your school
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 border border-purple-200/30 dark:border-purple-700/20"
                    >
                      <div className={`${activity.color} mt-0.5 flex-shrink-0`}>
                        <activity.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {activity.text}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* School Calendar */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl border border-purple-200/50 dark:border-purple-700/30 p-5 sm:p-6 relative overflow-hidden">
            {/* Decorative gradient corners */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <SchoolCalendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}