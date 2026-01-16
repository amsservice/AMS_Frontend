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
    if (!user) {
      router.replace('/'); // redirect to home
    }
  }, [user, router]);

  if (!user) return null;

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

  const stats = [
    {
      icon: Users,
      value: billableStudents ? billableStudents.toString() : "0",
      label: "Total Students",
      bgGradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Users,
      value: activeTeachers ? activeTeachers.toString() : "0",
      label: "Total Teachers",
      bgGradient: "from-green-500 to-emerald-600"
    },
    {
      icon: BookOpen,
      label: "Total Classes",
      value: statsLoading ? "..." : (totalclasscount?.totalClasses?.toString() || "0"),
      bgGradient: "from-purple-500 to-violet-600"
    },
    {
      icon: TrendingUp,
      label: "Today's Attendance",
      value: "92%",
      bgGradient: "from-orange-500 to-amber-600"
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "New Session",
      bgGradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: BookOpen,
      title: "Add Class",
      bgGradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: UserPlus,
      title: "Add Teacher",
      bgGradient: "from-purple-500 to-violet-600"
    },
    {
      icon: FileText,
      title: "View Reports",
      bgGradient: "from-orange-500 to-amber-600"
    }
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      text: "Class 10-A attendance marked",
      time: "10 min ago",
      color: "text-green-500"
    },
    {
      icon: UserPlus,
      text: "New teacher added: Sarah Johnson",
      time: "1 hour ago",
      color: "text-blue-500"
    },
    {
      icon: AlertCircle,
      text: "Low attendance in Class 8-B",
      time: "2 hours ago",
      color: "text-amber-500"
    },
    {
      icon: CheckCircle,
      text: "Class 9-C attendance marked",
      time: "3 hours ago",
      color: "text-green-500"
    }
  ];

  return (
    <div className="flex-1 w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Modern Header with Gradient */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Welcome back, {user?.name?.split(" ")[0] || "Principal"}! 👋
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
                Here's what's happening at your school today
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center">
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
          {/* Modern Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`group bg-gradient-to-br ${index === 0 ? 'from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-700/50' :
                    index === 1 ? 'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200/50 dark:border-green-700/50' :
                      index === 2 ? 'from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200/50 dark:border-purple-700/50' :
                        'from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200/50 dark:border-orange-700/50'
                  } border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className={`p-2 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}>
                          <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Book className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
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
                    className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <div
                      className={`bg-gradient-to-br ${action.bgGradient} p-3 sm:p-4 rounded-xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white text-center">
                      {action.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Activity
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Latest updates from your school
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200/50 dark:border-gray-600/50"
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

          {/* School Calendar */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <SchoolCalendar />
          </div>
        </div>
      </main>
    </div>
  );
}