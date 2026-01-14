


"use client";

import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useStudents } from "@/app/querry/useStudent";
import SchoolCalendar from "@/components/holidays/SchoolCalendar";

export default function TeacherDashboard() {
  // Mock user data - replace with actual auth context
  const { user, loading } = useAuth();
   const { data: students = [], isLoading, error } = useStudents();
  

  // Mock teacher profile data
  const teacherProfile = {
    assignedClass: {
      className: "10th Grade",
      section: "A"
    }
  };
  const profileLoading = false;

  const stats = [
    {
      icon: Users,
      value: students.length,
      label: "Total Students",
      bgColor: "accent-blue"
    },
    {
      icon: CheckCircle,
      value: "32",
      label: "Present Today",
      bgColor: "accent-green"
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
      bgColor: "accent-teal"
    }
  ];

  const quickActions = [
    {
      icon: ClipboardList,
      title: "Mark Attendance",
      bgColor: "accent-blue"
    },
    {
      icon: Users,
      title: "View Students",
      bgColor: "accent-teal"
    },
    {
      icon: BookOpen,
      title: "My Class",
      bgColor: "accent-purple"
    },
    {
      icon: Calendar,
      title: "Attendance History",
      bgColor: "accent-orange"
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

 

  

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold dashboard-text mb-2">
          Welcome, {user?.name?.split(" ")[0] || "Teacher"}! 📚
        </h2>
        {profileLoading ? (
          <p className="text-sm lg:text-base dashboard-text-muted">
            Loading class information...
          </p>
        ) : teacherProfile?.assignedClass ? (
          <p className="text-sm lg:text-base dashboard-text-muted">
            Class {teacherProfile.assignedClass.className} - {teacherProfile.assignedClass.section}
          </p>
        ) : (
          <p className="text-sm lg:text-base dashboard-text-muted">
            No class assigned yet
          </p>
        )}
      </div>

      {/* Mark Attendance Button - Mobile */}
      <button className="lg:hidden w-full accent-blue text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-dashboard">
        <ClipboardList className="w-5 h-5" />
        <span>Mark Attendance</span>
      </button>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col gap-3">
              <div className={`${stat.bgColor} p-3 rounded-xl w-fit`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <div className="text-xs dashboard-text-muted mb-1">
                  {stat.label}
                </div>
                <div className="text-2xl lg:text-3xl font-bold dashboard-text">
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
        <div className="dashboard-card border rounded-xl p-6">
          <h3 className="text-lg lg:text-xl font-semibold dashboard-text mb-1">
            Quick Actions
          </h3>
          <p className="text-sm dashboard-text-muted mb-6">
            Common tasks for your class
          </p>

          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                className="flex flex-col items-center justify-center p-6 lg:p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-dashboard group"
              >
                <div
                  className={`${action.bgColor} p-4 rounded-xl mb-3 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <span className="text-xs lg:text-sm font-medium dashboard-text text-center">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="dashboard-card border rounded-xl p-6">
          <h3 className="text-lg lg:text-xl font-semibold dashboard-text mb-1">
            Recent Attendance
          </h3>
          <p className="text-sm dashboard-text-muted mb-6">
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
                    <div className="text-sm font-semibold dashboard-text">
                      {record.date}
                    </div>
                    <div className="text-xs dashboard-text-muted">
                      {record.present} present, {record.absent} absent
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold dashboard-text">
                  {record.rate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class Calendar */}
      <div className="dashboard-card border rounded-xl p-6">

        <SchoolCalendar/>
        {/* <div className="flex items-start gap-3 mb-6">
          <Calendar className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg lg:text-xl font-semibold dashboard-text">
              Class Calendar
            </h3>
            <p className="text-sm dashboard-text-muted">
              View class events and attendance schedule
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar 
          <div>
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-dashboard">
                <ChevronLeft className="w-5 h-5 dashboard-text" />
              </button>
              <span className="text-base font-semibold dashboard-text">
                December 2025
              </span>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-dashboard">
                <ChevronRight className="w-5 h-5 dashboard-text" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-sm font-semibold dashboard-text-muted py-2 text-center"
                >
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((item, index) => (
                <button
                  key={index}
                  className={`py-2.5 text-sm rounded-lg transition-dashboard ${
                    item.day === 31 && item.isCurrentMonth
                      ? "accent-teal text-white hover:opacity-90"
                      : item.isCurrentMonth
                      ? "dashboard-text hover:bg-gray-100 dark:hover:bg-gray-700"
                      : "text-gray-400 dark:text-gray-600 opacity-40"
                  }`}
                >
                  {item.day}
                </button>
              ))}
            </div>
          </div>

          {/* Today's Events & Upcoming 
          <div className="space-y-6">
            <div>
              <div className="text-sm font-semibold dashboard-text mb-3">
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
              <h4 className="text-sm font-semibold dashboard-text mb-4">
                Upcoming Events
              </h4>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-dashboard"
                  >
                    <div className="flex items-center gap-3">
                      <event.icon className="w-4 h-4 dashboard-text-muted flex-shrink-0" />
                      <span className="text-sm dashboard-text">
                        {event.title}
                      </span>
                    </div>
                    <span className="text-sm dashboard-text-muted font-medium">
                      {event.date}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legend 
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t dashboard-card-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs dashboard-text-muted">Event</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-xs dashboard-text-muted">Holiday</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs dashboard-text-muted">Alert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs dashboard-text-muted">Present</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}