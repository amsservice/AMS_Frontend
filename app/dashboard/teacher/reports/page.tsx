"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Search,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useTeacherTodayStudents,
  useTeacherTodaySummary,
  useTeacherAssignedClass,
  AttendanceStatus,
} from "@/app/querry/useAttendance";
import { useHolidays } from "@/app/querry/useHolidays";
import { toast } from "sonner";

import StudentPersonalAttendanceSection from "./StudentPersonalAttendanceSection";

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  hasData: boolean;
  isHoliday: boolean;
}

export default function AttendanceViewPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | "all">("all");

  const formattedDate = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  const {
    data: students = [],
    isLoading: studentsLoading,
    error: studentsError,
  } = useTeacherTodayStudents(formattedDate);

  const {
    data: summary,
    isLoading: summaryLoading,
  } = useTeacherTodaySummary(formattedDate);

  const { data: assignedClass } = useTeacherAssignedClass();
  const { data: holidays = [] } = useHolidays();

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          (student.rollNo && student.rollNo.toString().includes(query))
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((student) => student.status === filterStatus);
    }

    return filtered;
  }, [students, searchQuery, filterStatus]);

  const holidayDateSet = useMemo(() => {
    const set = new Set<string>();

    const formatIstDateKey = (value: string | Date) => {
      const dt = new Date(value);
      if (!Number.isFinite(dt.getTime())) return null;

      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(dt);
    };

    const parseDateKeyToLocalDate = (key: string) => {
      const [y, m, d] = key.split("-").map((x) => Number(x));
      if (!y || !m || !d) return null;

      const dt = new Date(y, m - 1, d);
      dt.setHours(0, 0, 0, 0);
      return dt;
    };

    const formatLocalDateKey = (dt: Date) => {
      const x = new Date(dt);
      x.setHours(0, 0, 0, 0);
      return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(
        x.getDate()
      ).padStart(2, "0")}`;
    };

    (holidays as any[]).forEach((h) => {
      const startKey = formatIstDateKey(h?.startDate);
      const endKey = formatIstDateKey(h?.endDate ?? h?.startDate);
      if (!startKey) return;

      const start = parseDateKeyToLocalDate(startKey);
      const end = parseDateKeyToLocalDate(endKey || startKey) ?? start;
      if (!start || !end) return;

      const cursor = new Date(start);
      while (cursor.getTime() <= end.getTime()) {
        set.add(formatLocalDateKey(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    });

    return set;
  }, [holidays]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isPast: true,
        isToday: false,
        hasData: false,
        isHoliday: false,
      });
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let date = 1; date <= daysInMonth; date++) {
      const currentDate = new Date(year, month, date);
      currentDate.setHours(0, 0, 0, 0);

      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

      const isPast = currentDate < today;
      const isToday = currentDate.getTime() === today.getTime();

      days.push({
        date,
        isCurrentMonth: true,
        isPast,
        isToday,
        hasData: isPast || isToday,
        isHoliday: holidayDateSet.has(dateKey),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        isPast: false,
        isToday: false,
        hasData: false,
        isHoliday: false,
      });
    }

    return days;
  }, [currentMonth, holidayDateSet]);

  const handlePrevMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
    const nextSelectedDay = Math.min(selectedDate.getDate(), daysInNextMonth);
    setCurrentMonth(nextMonth);
    setSelectedDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextSelectedDay));
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const daysInNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
    const nextSelectedDay = Math.min(selectedDate.getDate(), daysInNextMonth);
    setCurrentMonth(nextMonth);
    setSelectedDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextSelectedDay));
  };

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;

    if (day.isHoliday) {
      toast("It's a holiday, no attendance is there");
      return;
    }

    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day.date
    );
    setSelectedDate(newDate);
  };

  const classLabel = assignedClass?.name && assignedClass?.section
    ? `Class ${assignedClass.name}-${assignedClass.section}`
    : 'Class';

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "absent":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "late":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50";
    }
  };

  const getStatusLabel = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "late":
        return "Late";
      case "not_marked":
        return "Not Marked";
      default:
        return status;
    }
  };

  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleExport = () => {
    toast.success("Exporting attendance data...");
    // Implement export functionality
  };

  if (studentsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-red-200/50 dark:border-red-800/50 p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                Failed to Load Attendance Data
              </h3>
              <p className="text-red-600/80 dark:text-red-400/80 mb-6 max-w-md">
                {studentsError?.message || "An error occurred while loading attendance data."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Class Attendance
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
              View date-wise attendance for your class students ({classLabel})
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Total Students
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {studentsLoading ? "..." : students.length}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50 shadow-xl rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                    Present
                  </p>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {summaryLoading ? "..." : summary?.present || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 border border-red-200/50 dark:border-red-700/50 shadow-xl rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                    Absent
                  </p>
                </div>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {summaryLoading ? "..." : summary?.absent || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 shadow-xl rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    Rate
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {summaryLoading ? "..." : `${summary?.presentPercentage || 0}%`}
                </p>
              </motion.div>
            </div>

            {/* Calendar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {classLabel} Attendance Calendar
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a date to view attendance records
              </p>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {formatMonthYear()}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                  className="rounded-xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isSelected =
                    day.isCurrentMonth &&
                    day.date === selectedDate.getDate() &&
                    currentMonth.getMonth() === selectedDate.getMonth() &&
                    currentMonth.getFullYear() === selectedDate.getFullYear();

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(day)}
                      disabled={!day.isCurrentMonth || (!day.hasData && !day.isHoliday)}
                      className={`
                        relative aspect-square rounded-lg text-sm font-medium transition-all
                        ${
                          !day.isCurrentMonth
                            ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                            : day.isToday && isSelected
                            ? "bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-lg"
                            : isSelected
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
                            : day.isToday
                            ? "bg-teal-100 dark:bg-teal-900/30 text-teal-900 dark:text-teal-100 border border-teal-500"
                            : day.isHoliday
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border border-orange-500"
                            : day.hasData
                            ? "bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                            : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        }
                        ${day.isCurrentMonth && (day.hasData || day.isHoliday) ? "cursor-pointer" : ""}
                      `}
                    >
                      {day.date}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Holiday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Student List */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              {/* Date Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatSelectedDate()}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-300 font-semibold">
                        Present: {summary?.present || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-red-700 dark:text-red-300 font-semibold">
                        Absent: {summary?.absent || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleExport}
                  className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search students by name or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    onClick={() => setFilterStatus("all")}
                    className="rounded-xl"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "present" ? "default" : "outline"}
                    onClick={() => setFilterStatus("present")}
                    className="rounded-xl"
                  >
                    Present
                  </Button>
                  <Button
                    variant={filterStatus === "absent" ? "default" : "outline"}
                    onClick={() => setFilterStatus("absent")}
                    className="rounded-xl"
                  >
                    Absent
                  </Button>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {studentsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchQuery || filterStatus !== "all"
                        ? "No students found matching your filters"
                        : "No students found for this date"}
                    </p>
                  </div>
                ) : (
                  filteredStudents.map((student, index) => (
                    <motion.div
                      key={student.studentId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {student.name}
                          </p>
                          {student.rollNo && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Roll No: {student.rollNo}
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {getStatusLabel(student.status)}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Pagination Info */}
              {!studentsLoading && filteredStudents.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Showing {filteredStudents.length} of {students.length} students
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <StudentPersonalAttendanceSection
          students={students}
          studentsLoading={studentsLoading}
          classLabel={classLabel}
        />
      </main>
    </div>
  );
}