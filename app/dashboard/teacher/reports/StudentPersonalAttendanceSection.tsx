"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Loader2, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AttendanceStatus, StudentSessionItem, TeacherStudentItem, useTeacherStudentMonthlyHistory } from "@/app/querry/useAttendance";
import { toast } from "sonner";

export default function StudentPersonalAttendanceSection(props: {
  students: TeacherStudentItem[];
  studentsLoading: boolean;
  classLabel: string;
}) {
  const { students, studentsLoading, classLabel } = props;

  const toIstDateKey = (value: string | Date) => {
    const raw = value instanceof Date ? value : String(value);

    if (raw instanceof Date) {
      if (!Number.isFinite(raw.getTime())) return null;
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(raw);
    }

    const str = raw.trim();

    const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      return `${m[1]}-${m[2]}-${m[3]}`;
    }

    const dt = new Date(str);
    if (!Number.isFinite(dt.getTime())) return null;

    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dt);
  };

  const formatDisplayFromDateKey = (key: string | null, fallback: string) => {
    if (!key) return fallback;
    const parts = key.split('-');
    if (parts.length !== 3) return fallback;
    const y = parts[0];
    const m = String(Number(parts[1])).padStart(2, '0');
    const d = String(Number(parts[2])).padStart(2, '0');
    if (!y || !m || !d) return fallback;
    return `${d}-${m}-${y}`;
  };

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthYear = useMemo(
    () => ({ year: currentMonth.getFullYear(), month: currentMonth.getMonth() + 1 }),
    [currentMonth]
  );

  const filteredStudents = useMemo(() => {
    let filtered = [...students];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          (student.rollNo && student.rollNo.toString().includes(query))
      );
    }
    return filtered;
  }, [students, searchQuery]);

  const {
    data: selectedStudentHistory = [],
    isLoading: historyLoading,
    error: historyError,
  } = useTeacherStudentMonthlyHistory(selectedStudentId, monthYear.year, monthYear.month);

  const statusByDateKey = useMemo(() => {
    const m = new Map<string, AttendanceStatus>();
    (selectedStudentHistory as any[]).forEach((i) => {
      const key = toIstDateKey(i?.date);
      if (!key) return;
      m.set(String(key), i?.status as AttendanceStatus);
    });
    return m;
  }, [selectedStudentHistory]);

  const summary = useMemo(() => {
    const s = { present: 0, absent: 0, late: 0, total: 0 };
    (selectedStudentHistory || []).forEach((i: any) => {
      if (i?.status === "present") s.present += 1;
      else if (i?.status === "absent") s.absent += 1;
      else if (i?.status === "late") s.late += 1;
      s.total += 1;
    });
    return s;
  }, [selectedStudentHistory]);

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getMonthMeta = () => {
    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();
    const first = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstWeekday = first.getDay();
    return { year, monthIndex, month: monthIndex + 1, daysInMonth, firstWeekday };
  };

  const buildDateKey = (day: number) => {
    const meta = getMonthMeta();
    const y = meta.year;
    const m = String(meta.month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDayCellClass = (status?: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200/60 dark:border-green-700/30 text-green-900 dark:text-green-100';
      case 'absent':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200/60 dark:border-red-700/30 text-red-900 dark:text-red-100';
      case 'late':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200/60 dark:border-orange-700/30 text-orange-900 dark:text-orange-100';
      default:
        return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white';
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const exportToCsv = (items: StudentSessionItem[], filename: string) => {
    const rows = [
      ["Date", "Status"],
      ...items.map((i) => {
        const key = toIstDateKey(i.date);
        return [formatDisplayFromDateKey(key, String(i.date)), String(i.status)];
      }),
    ];

    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
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

  const getStatusPill = (status: AttendanceStatus) => {
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

  const handleExport = () => {
    if (!selectedStudentId) {
      toast.error("Please select a student first");
      return;
    }

    const student = students.find((s) => s.studentId === selectedStudentId);
    const safeName = (student?.name || "student").replace(/[^a-z0-9\-_]+/gi, "_");

    exportToCsv(
      selectedStudentHistory as any,
      `${safeName}_attendance_${monthYear.year}-${String(monthYear.month).padStart(2, "0")}.csv`
    );

    toast.success("Export started");
  };

  return (
    <div className="mt-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Student Personal Attendance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and export individual attendance records ({classLabel})
              </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
              />
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {studentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No students found</p>
                </div>
              ) : (
                filteredStudents.map((student, index) => {
                  const isActive = selectedStudentId === student.studentId;
                  return (
                    <motion.div
                      key={student.studentId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => setSelectedStudentId(student.studentId)}
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
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
                          <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                          {student.rollNo && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">Roll No: {student.rollNo}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">{formatMonthYear()}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Present: {summary.present} | Absent: {summary.absent} | Late: {summary.late}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="rounded-xl">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNextMonth} className="rounded-xl">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {historyError ? (
              <div className="text-sm text-red-600 dark:text-red-400">{(historyError as any)?.message || "Failed to load"}</div>
            ) : !selectedStudentId ? (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Select a student to view their attendance records.
              </div>
            ) : historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (selectedStudentHistory || []).length === 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-400">No attendance records found for this month.</div>
            ) : (
              <div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div
                      key={d}
                      className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {(() => {
                  const meta = getMonthMeta();
                  const cells: Array<{ day: number | null; key: string | null }> = [];

                  for (let i = 0; i < meta.firstWeekday; i += 1) {
                    cells.push({ day: null, key: null });
                  }
                  for (let day = 1; day <= meta.daysInMonth; day += 1) {
                    const key = buildDateKey(day);
                    cells.push({ day, key });
                  }

                  while (cells.length % 7 !== 0) {
                    cells.push({ day: null, key: null });
                  }

                  return (
                    <div className="grid grid-cols-7 gap-2">
                      {cells.map((c, idx) => {
                        const status = c.key ? statusByDateKey.get(c.key) : undefined;
                        return (
                          <div
                            key={`${c.key ?? 'empty'}-${idx}`}
                            className={`rounded-xl border p-2 min-h-[52px] flex items-start justify-start ${getDayCellClass(status)}`}
                          >
                            {c.day ? (
                              <div className="w-full">
                                <div className="text-sm font-bold leading-none">{c.day}</div>
                                {status ? (
                                  <div className="text-[10px] font-semibold opacity-90 mt-1">
                                    {getStatusLabel(status)}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
