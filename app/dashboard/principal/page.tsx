


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

import { apiFetch } from "@/lib/api";
import { useTotalClasses } from "@/app/querry/useClasses";
import SchoolCalendar from "@/components/holidays/SchoolCalendar";


export default function PrincipalDashboard() {
  const { user, loading } = useAuth();
;
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
      bgColor: "accent-blue"
    },
    {
      icon: Users,
      value: activeTeachers ? activeTeachers.toString() : "0",
      label: "Total Teachers",
      bgColor: "accent-cyan"
    },
    {
      icon: BookOpen,
      label: "Total Classes",
      value: statsLoading ? "..." : (totalclasscount?.totalClasses?.toString() || "0"),
      bgColor: "accent-purple"
    },
    {
      icon: TrendingUp,
      label: "Today's Attendance",
      value: "92%",
      bgColor: "accent-green"
    }
  ];

  const quickActions = [
    {
      icon: Calendar,
      title: "New Session",
      bgColor: "accent-blue"
    },
    {
      icon: BookOpen,
      title: "Add Class",
      bgColor: "accent-teal"
    },
    {
      icon: UserPlus,
      title: "Add Teacher",
      bgColor: "accent-purple"
    },
    {
      icon: FileText,
      title: "View Reports",
      bgColor: "accent-orange"
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
  


      <div className="flex-1 w-full">
       

        {/* Main Content */}
        <div className="p-4 pt-3 lg:pt-0 lg:p-8">
          <div className="max-w-[1400px] mx-auto space-y-4 lg:space-y-6">
            {/* Welcome Section with Add Teacher - Desktop */}
            <div className="hidden lg:flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold dashboard-text mb-1">
                  Welcome back, {user?.name?.split(" ")[0] || "Principal"}! 👋
                </h2>
                <p className="text-sm dashboard-text-muted">
                  Here's what's happening at your school today
                </p>
              </div>
              <button className="accent-blue text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
                <span className="text-lg">+</span>
                <span>Add Teacher</span>
              </button>
            </div>

            {/* Mobile Welcome Section */}
            <div className="lg:hidden">
              <h2 className="text-xl font-bold dashboard-text mb-1">
                Welcome back, {user?.name?.split(" ")[0] || "Principal"}! 👋
              </h2>
              <p className="text-sm dashboard-text-muted">
                Here's what's happening at your school today
              </p>
            </div>

            {/* Add Teacher Button - Mobile Only */}
            <button className="lg:hidden w-full accent-blue text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
              <span className="text-lg">+</span>
              <span>Add Teacher</span>
            </button>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col gap-3 lg:gap-4">
                    <div className={`${stat.bgColor} p-2.5 lg:p-3 rounded-xl w-fit`}>
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs dashboard-text-muted mb-1">
                        {stat.label}
                      </div>
                      <div className="text-2xl lg:text-4xl font-bold dashboard-text">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Quick Actions */}
              <div className="dashboard-card border rounded-xl p-4 lg:p-6">
                <h3 className="text-base lg:text-xl font-semibold dashboard-text mb-1">
                  Quick Actions
                </h3>
                <p className="text-xs lg:text-sm dashboard-text-muted mb-4 lg:mb-6">
                  Common tasks to manage your school
                </p>

                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      className="flex flex-col items-center justify-center p-4 lg:p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                    >
                      <div
                        className={`${action.bgColor} p-3 lg:p-4 rounded-xl mb-2 lg:mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                      </div>
                      <span className="text-xs lg:text-sm font-medium dashboard-text text-center">
                        {action.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="dashboard-card border rounded-xl p-4 lg:p-6">
                <h3 className="text-base lg:text-xl font-semibold dashboard-text mb-1">
                  Recent Activity
                </h3>
                <p className="text-xs lg:text-sm dashboard-text-muted mb-4 lg:mb-6">
                  Latest updates from your school
                </p>

                <div className="space-y-3 lg:space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2.5 lg:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className={`${activity.color} mt-0.5 flex-shrink-0`}>
                        <activity.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm dashboard-text">
                          {activity.text}
                        </p>
                        <p className="text-xs dashboard-text-muted mt-0.5">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* School Calendar */}
            <div className="dashboard-card border rounded-xl p-4 lg:p-6">
             <SchoolCalendar/>
            </div>
          </div>
        </div>
      </div>
    
  );
}