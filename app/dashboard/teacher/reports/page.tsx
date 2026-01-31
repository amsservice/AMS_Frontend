"use client";

import type React from "react";
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
import { useSessions } from "@/app/querry/useSessions";
import { useHolidays, type Holiday } from "@/app/querry/useHolidays";
import { apiFetch } from "@/lib/api";
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

  const [exportProgress, setExportProgress] = useState<{
    type: "monthly" | "overall" | null;
    done: number;
    total: number;
  }>({ type: null, done: 0, total: 0 });

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
  const { data: sessions = [] } = useSessions();

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

  const toIstDateKey = (value: string | Date) => {
    const raw = value instanceof Date ? value : String(value);

    if (raw instanceof Date) {
      if (!Number.isFinite(raw.getTime())) return null;
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(raw);
    }

    const str = raw.trim();
    const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;

    const dt = new Date(str);
    if (!Number.isFinite(dt.getTime())) return null;

    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(dt);
  };

  const formatDdMmYy = (dateKey: string) => {
    const [y, m, d] = dateKey.split("-");
    if (!y || !m || !d) return dateKey;
    return `${d}-${m}-${String(y).slice(-2)}`;
  };

  const holidayByDateKey = useMemo(() => {
    const map = new Map<string, { name: string; description: string }>();
    (holidays as Holiday[]).forEach((h) => {
      const startKey = toIstDateKey(h?.startDate);
      const endKey = toIstDateKey(h?.endDate ?? h?.startDate);
      if (!startKey) return;

      const [sy, sm, sd] = startKey.split("-").map((x) => Number(x));
      const [ey, em, ed] = (endKey || startKey).split("-").map((x) => Number(x));
      if (!sy || !sm || !sd || !ey || !em || !ed) return;

      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);

      const cursor = new Date(start);
      while (cursor.getTime() <= end.getTime()) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(
          cursor.getDate()
        ).padStart(2, "0")}`;
        map.set(key, {
          name: h?.name || "Holiday",
          description: h?.description || "",
        });
        cursor.setDate(cursor.getDate() + 1);
      }
    });
    return map;
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
        isHoliday: holidayByDateKey.has(dateKey),
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
  }, [currentMonth, holidayByDateKey]);

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
        return "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800";
      case "absent":
        return "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800";
      case "late":
        return "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800";
      default:
        return "text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700";
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

  const exportPercent = useMemo(() => {
    if (!exportProgress.type) return 0;
    if (exportProgress.total <= 0) return 0;
    return Math.min(100, Math.floor((exportProgress.done / exportProgress.total) * 100));
  }, [exportProgress]);

  const exportMonthlyReport = async () => {
    if (students.length === 0) {
      toast.error("No students to export");
      return;
    }

    setExportProgress({ type: "monthly", done: 0, total: students.length });
    const toastId = toast.loading(`Generating monthly report... (0/${students.length})`);

    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const daysInMonth = new Date(year, month, 0).getDate();

      const dateKeys: string[] = [];
      const dateHeaders: string[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        dateKeys.push(dateKey);
        dateHeaders.push(formatDdMmYy(dateKey));
      }

      // Build CSV rows
      const rows = [
        [`${classLabel} - Monthly Attendance Report`],
        [`Month: ${formatMonthYear()}`],
        [""],
        ["Student Name", "Roll No", ...dateHeaders, "Present", "Absent", "Late", "Marked Days", "%"],
      ];

      const concurrency = 20;
      let completed = 0;

      const studentRows: string[][] = new Array(students.length);

      const buildStudentRow = async (student: (typeof students)[number]) => {
        const res = await apiFetch(
          `/api/attendance/teacher/student-monthly-history?studentId=${student.studentId}&year=${year}&month=${month}`
        );

        const sessions: Array<{ date: string; status: AttendanceStatus }> = Array.isArray(res?.data)
          ? (res.data as any[])
          : [];

        const statusByDateKey = new Map<string, AttendanceStatus>();
        sessions.forEach((i) => {
          const key = toIstDateKey(i?.date);
          if (!key) return;
          statusByDateKey.set(String(key), i?.status as AttendanceStatus);
        });

        const studentData: string[] = [student.name, student.rollNo?.toString() || "N/A"];

        let present = 0;
        let absent = 0;
        let late = 0;
        let markedDays = 0;

        for (const dateKey of dateKeys) {
          if (holidayByDateKey.has(dateKey)) {
            studentData.push("H");
            continue;
          }

          const status = statusByDateKey.get(dateKey);
          if (status === "present") {
            studentData.push("P");
            present += 1;
            markedDays += 1;
          } else if (status === "absent") {
            studentData.push("A");
            absent += 1;
            markedDays += 1;
          } else if (status === "late") {
            studentData.push("L");
            late += 1;
            markedDays += 1;
          } else {
            studentData.push("-");
          }
        }

        const percentage = markedDays > 0 ? Math.round((present / markedDays) * 100) : 0;
        studentData.push(
          String(present),
          String(absent),
          String(late),
          String(markedDays),
          `${percentage}%`
        );

        return studentData;
      };

      let nextIndex = 0;
      const worker = async () => {
        while (true) {
          const index = nextIndex;
          nextIndex += 1;
          if (index >= students.length) return;

          const row = await buildStudentRow(students[index]);
          studentRows[index] = row;

          completed += 1;
          setExportProgress((prev) =>
            prev.type === "monthly" ? { ...prev, done: completed } : prev
          );

          if (completed % 25 === 0 || completed === students.length) {
            toast.loading(`Generating monthly report... (${completed}/${students.length})`, {
              id: toastId,
            });
          }
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(concurrency, students.length) }, () => worker())
      );

      studentRows.forEach((r) => rows.push(r));

      // Add legend
      rows.push([]);
      rows.push(["Legend: P = Present, A = Absent, L = Late, H = Holiday, - = Not Marked"]);

      rows.push([]);
      rows.push(["Holidays (for this month)"]);
      rows.push(["Date", "Holiday", "Description"]);

      const monthHolidayKeys = dateKeys.filter((k) => holidayByDateKey.has(k));
      if (monthHolidayKeys.length === 0) {
        rows.push(["-", "-", "-"]);
      } else {
        monthHolidayKeys.forEach((key) => {
          const h = holidayByDateKey.get(key);
          rows.push([formatDdMmYy(key), h?.name || "Holiday", h?.description || ""]);
        });
      }

      const csv = rows
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${classLabel.replace(/\s+/g, '_')}_Monthly_Attendance_${year}-${String(month).padStart(2, '0')}.csv`;
      a.click();

      URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success("Monthly report exported successfully!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to export monthly report");
    } finally {
      setExportProgress((prev) => (prev.type === "monthly" ? { type: null, done: 0, total: 0 } : prev));
    }
  };

  const exportOverallReport = async () => {
    if (students.length === 0) {
      toast.error("No students to export");
      return;
    }

    const activeSession = (sessions as any[]).find((s) => s?.isActive);
    if (!activeSession?.startDate || !activeSession?.endDate) {
      toast.error("No active session found. Please ask admin to create/activate a session.");
      return;
    }

    const sessionStartKey = toIstDateKey(activeSession.startDate);
    const sessionEndKey = toIstDateKey(activeSession.endDate);
    if (!sessionStartKey || !sessionEndKey) {
      toast.error("Active session dates are invalid.");
      return;
    }

    const [ssY, ssM, ssD] = sessionStartKey.split("-").map((x) => Number(x));
    const [seY, seM, seD] = sessionEndKey.split("-").map((x) => Number(x));
    if (!ssY || !ssM || !ssD || !seY || !seM || !seD) {
      toast.error("Active session dates are invalid.");
      return;
    }

    const sessionStart = new Date(ssY, ssM - 1, ssD);
    const sessionEnd = new Date(seY, seM - 1, seD);
    sessionStart.setHours(0, 0, 0, 0);
    sessionEnd.setHours(0, 0, 0, 0);

    if (!Number.isFinite(sessionStart.getTime()) || !Number.isFinite(sessionEnd.getTime())) {
      toast.error("Active session dates are invalid.");
      return;
    }
    if (sessionEnd.getTime() < sessionStart.getTime()) {
      toast.error("Active session end date cannot be before start date.");
      return;
    }

    const monthPairs: Array<{ year: number; month: number }> = [];
    {
      const cursor = new Date(sessionStart);
      cursor.setDate(1);
      cursor.setHours(0, 0, 0, 0);
      const last = new Date(sessionEnd);
      last.setDate(1);
      last.setHours(0, 0, 0, 0);
      while (cursor.getTime() <= last.getTime()) {
        monthPairs.push({ year: cursor.getFullYear(), month: cursor.getMonth() + 1 });
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }

    const totalTasks = students.length * monthPairs.length;
    setExportProgress({ type: "overall", done: 0, total: totalTasks });
    const toastId = toast.loading(`Generating overall report... (0/${totalTasks})`);

    try {
      // Get current date for the overall report
      const today = new Date();
      const dateKeys: string[] = [];
      const dateHeaders: string[] = [];
      {
        const cursor = new Date(sessionStart);
        while (cursor.getTime() <= sessionEnd.getTime()) {
          const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(
            cursor.getDate()
          ).padStart(2, "0")}`;
          dateKeys.push(key);
          dateHeaders.push(formatDdMmYy(key));
          cursor.setDate(cursor.getDate() + 1);
        }
      }

      const rows: string[][] = [
        [`${classLabel} - Overall Attendance Report`],
        [`Session: ${activeSession?.name || "Active Session"}`],
        [`From: ${formatDdMmYy(sessionStartKey)}  To: ${formatDdMmYy(sessionEndKey)}`],
        [`Generated on: ${today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`],
        [""],
        [
          "Student Name",
          "Roll No",
          ...dateHeaders,
          "Total Present",
          "Total Absent",
          "Total Late",
          "Total Days",
          "Attendance %",
          "Status",
        ],
      ];

      const statusByDateKeyByStudent: Array<Map<string, AttendanceStatus>> = Array.from(
        { length: students.length },
        () => new Map<string, AttendanceStatus>()
      );

      type Task = { studentIndex: number; year: number; month: number };
      const tasks: Task[] = [];
      for (let i = 0; i < students.length; i++) {
        for (const p of monthPairs) {
          tasks.push({ studentIndex: i, year: p.year, month: p.month });
        }
      }

      const concurrency = 20;
      let completed = 0;
      let nextIndex = 0;

      const worker = async () => {
        while (true) {
          const index = nextIndex;
          nextIndex += 1;
          if (index >= tasks.length) return;

          const t = tasks[index];
          const student = students[t.studentIndex];

          try {
            const res = await apiFetch(
              `/api/attendance/teacher/student-monthly-history?studentId=${student.studentId}&year=${t.year}&month=${t.month}`
            );

            const sessions: Array<{ date: string; status: AttendanceStatus }> = Array.isArray(res?.data)
              ? (res.data as any[])
              : [];

            const map = statusByDateKeyByStudent[t.studentIndex];
            sessions.forEach((i) => {
              const key = toIstDateKey(i?.date);
              if (!key) return;
              const dt = new Date(key);
              if (!Number.isFinite(dt.getTime())) return;
              if (dt.getTime() < sessionStart.getTime() || dt.getTime() > sessionEnd.getTime()) return;

              const status = i?.status as AttendanceStatus;
              if (status === "present" || status === "absent" || status === "late") {
                map.set(String(key), status);
              }
            });
          } catch {
            // ignore per-task errors; the row will show '-' for missing days
          } finally {
            completed += 1;
            setExportProgress((prev) =>
              prev.type === "overall" ? { ...prev, done: completed } : prev
            );

            if (completed % 100 === 0 || completed === tasks.length) {
              toast.loading(`Generating overall report... (${completed}/${tasks.length})`, {
                id: toastId,
              });
            }
          }
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker())
      );

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const map = statusByDateKeyByStudent[i];

        let present = 0;
        let absent = 0;
        let late = 0;
        let markedDays = 0;

        const row: string[] = [student.name, student.rollNo?.toString() || "N/A"];
        for (const dateKey of dateKeys) {
          if (holidayByDateKey.has(dateKey)) {
            row.push("H");
            continue;
          }

          const status = map.get(dateKey);
          if (status === "present") {
            row.push("P");
            present += 1;
            markedDays += 1;
          } else if (status === "absent") {
            row.push("A");
            absent += 1;
            markedDays += 1;
          } else if (status === "late") {
            row.push("L");
            late += 1;
            markedDays += 1;
          } else {
            row.push("-");
          }
        }

        const percentage = markedDays > 0 ? Math.round((present / markedDays) * 100) : 0;
        const statusLabel = percentage >= 75 ? "Good" : percentage >= 60 ? "Average" : "Poor";

        row.push(
          String(present),
          String(absent),
          String(late),
          String(markedDays),
          `${percentage}%`,
          statusLabel
        );

        rows.push(row);
      }

      // Add summary
      rows.push([]);
      rows.push(["Summary"]);
      rows.push(["Total Students", students.length.toString()]);
      rows.push(["Average Attendance", `${summary?.presentPercentage || 0}%`]);

      rows.push([]);
      rows.push(["Legend: P = Present, A = Absent, L = Late, H = Holiday, - = Not Marked"]);

      rows.push([]);
      rows.push(["Holidays (for this session)"]);
      rows.push(["Date", "Holiday", "Description"]);

      const sessionHolidayKeys = dateKeys.filter((k) => holidayByDateKey.has(k));
      if (sessionHolidayKeys.length === 0) {
        rows.push(["-", "-", "-"]);
      } else {
        sessionHolidayKeys.forEach((key) => {
          const h = holidayByDateKey.get(key);
          rows.push([formatDdMmYy(key), h?.name || "Holiday", h?.description || ""]);
        });
      }

      const csv = rows
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${classLabel.replace(/\s+/g, '_')}_Overall_Attendance_Report.csv`;
      a.click();

      URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success("Overall report exported successfully!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to export overall report");
    } finally {
      setExportProgress((prev) => (prev.type === "overall" ? { type: null, done: 0, total: 0 } : prev));
    }
  };

  if (studentsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-rose-200 dark:border-rose-800 p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
              <h3 className="text-xl font-semibold text-rose-600 dark:text-rose-400 mb-2">
                Failed to Load Attendance Data
              </h3>
              <p className="text-rose-600/80 dark:text-rose-400/80 mb-6 max-w-md">
                {studentsError?.message || "An error occurred while loading attendance data."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-slate-900 dark:to-purple-950 overflow-hidden min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Class Attendance
            </h1>
            <p className="mt-2 text-sm sm:text-base text-indigo-100 font-medium">
              View date-wise attendance for your class students ({classLabel})
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Calendar and Stats */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-3 md:p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Total
                  </p>
                </div>
                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  {studentsLoading ? "..." : students.length}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 border border-emerald-200 dark:border-emerald-800 shadow-xl rounded-2xl p-3 md:p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Present
                  </p>
                </div>
                <p className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {summaryLoading ? "..." : summary?.present || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/40 border border-rose-200 dark:border-rose-800 shadow-xl rounded-2xl p-3 md:p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                    Absent
                  </p>
                </div>
                <p className="text-xl md:text-2xl font-bold text-rose-900 dark:text-rose-100">
                  {summaryLoading ? "..." : summary?.absent || 0}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40 border border-indigo-200 dark:border-indigo-800 shadow-xl rounded-2xl p-3 md:p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                    Rate
                  </p>
                </div>
                <p className="text-xl md:text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {summaryLoading ? "..." : `${summary?.presentPercentage || 0}%`}
                </p>
              </motion.div>
            </div>

            {/* Calendar */}
            <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                  <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate">
                    Attendance Calendar
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                    {classLabel}
                  </p>
                </div>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                  {formatMonthYear()}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                  className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] md:text-xs font-semibold text-slate-600 dark:text-slate-400 py-1 md:py-2"
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
                        relative aspect-square rounded-lg text-xs md:text-sm font-medium transition-all
                        ${
                          !day.isCurrentMonth
                            ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                            : day.isToday && isSelected
                            ? "bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-lg ring-2 ring-teal-400"
                            : isSelected
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg ring-2 ring-indigo-400"
                            : day.isToday
                            ? "bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-100 border-2 border-teal-500"
                            : day.isHoliday
                            ? "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 border-2 border-amber-500"
                            : day.hasData
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                            : "text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-800"
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
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] md:text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-teal-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">Today</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-indigo-600 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">Selected</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">Holiday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Student List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6">
              {/* Date Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {formatSelectedDate()}
                  </h3>
                  <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                        Present: {summary?.present || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XCircle className="w-3 h-3 md:w-4 md:h-4 text-rose-600 dark:text-rose-400" />
                      <span className="text-rose-700 dark:text-rose-300 font-semibold">
                        Absent: {summary?.absent || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={exportMonthlyReport}
                    disabled={exportProgress.type !== null}
                    className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Monthly Report
                  </Button>
                  <Button
                    onClick={exportOverallReport}
                    disabled={exportProgress.type !== null}
                    className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Overall Report
                  </Button>
                </div>
              </div>

              {exportProgress.type !== null && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-2">
                    <span className="font-medium">
                      {exportProgress.type === "monthly" ? "Generating Monthly Report" : "Generating Overall Report"}
                    </span>
                    <span className="font-semibold">
                      {exportProgress.done}/{exportProgress.total} ({exportPercent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      style={{ width: `${exportPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    onClick={() => setFilterStatus("all")}
                    size="sm"
                    className={`rounded-xl whitespace-nowrap ${filterStatus === "all" ? "bg-indigo-600 hover:bg-indigo-700" : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === "present" ? "default" : "outline"}
                    onClick={() => setFilterStatus("present")}
                    size="sm"
                    className={`rounded-xl whitespace-nowrap ${filterStatus === "present" ? "bg-emerald-600 hover:bg-emerald-700" : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    Present
                  </Button>
                  <Button
                    variant={filterStatus === "absent" ? "default" : "outline"}
                    onClick={() => setFilterStatus("absent")}
                    size="sm"
                    className={`rounded-xl whitespace-nowrap ${filterStatus === "absent" ? "bg-rose-600 hover:bg-rose-700" : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    Absent
                  </Button>
                  <Button
                    variant={filterStatus === "late" ? "default" : "outline"}
                    onClick={() => setFilterStatus("late")}
                    size="sm"
                    className={`rounded-xl whitespace-nowrap ${filterStatus === "late" ? "bg-amber-600 hover:bg-amber-700" : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    Late
                  </Button>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-2 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {studentsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">
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
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="text-white font-bold text-xs md:text-sm">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm md:text-base text-slate-900 dark:text-white truncate">
                            {student.name}
                          </p>
                          {student.rollNo && (
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                              Roll: {student.rollNo}
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold flex-shrink-0 ${getStatusColor(
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
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 text-center">
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(148 163 184 / 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(148 163 184 / 0.7);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(71 85 105 / 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(71 85 105 / 0.7);
        }
      `}</style>
    </div>
  );
}