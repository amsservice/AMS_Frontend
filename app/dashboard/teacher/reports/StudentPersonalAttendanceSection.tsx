"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, Loader2, Search, Users, User, TrendingUp } from "lucide-react";

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

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.studentId === selectedStudentId);
  }, [students, selectedStudentId]);

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

  const attendancePercentage = useMemo(() => {
    if (summary.total === 0) return 0;
    return Math.round((summary.present / summary.total) * 100);
  }, [summary]);

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
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/50 text-emerald-900 dark:text-emerald-100';
      case 'absent':
        return 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700/50 text-rose-900 dark:text-rose-100';
      case 'late':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-100';
      default:
        return 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400';
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const exportToCsv = (items: StudentSessionItem[], filename: string) => {
    const student = students.find((s) => s.studentId === selectedStudentId);
    
    const rows = [
      ["Student Attendance Report"],
      [""],
      ["Student Name", student?.name || "N/A"],
      ["Roll Number", student?.rollNo?.toString() || "N/A"],
      ["Class", classLabel],
      ["Month", formatMonthYear()],
      [""],
      ["Summary"],
      ["Total Days", summary.total.toString()],
      ["Present", summary.present.toString()],
      ["Absent", summary.absent.toString()],
      ["Late", summary.late.toString()],
      ["Attendance %", `${attendancePercentage}%`],
      [""],
      ["Daily Attendance Records"],
      ["Date", "Day", "Status"],
      ...items.map((i) => {
        const key = toIstDateKey(i.date);
        const dateObj = new Date(i.date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' });
        return [formatDisplayFromDateKey(key, String(i.date)), dayName, String(i.status).toUpperCase()];
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

    toast.success("Attendance report exported successfully!");
  };

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Student Personal Attendance
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {classLabel}
              </p>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={!selectedStudentId}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Student List */}
          <div className="lg:col-span-1">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {studentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">No students found</p>
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
                      className={`flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all cursor-pointer border-2 ${
                        isActive
                          ? "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-500 dark:border-indigo-400 shadow-md"
                          : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
                        isActive 
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 ring-4 ring-indigo-200 dark:ring-indigo-900/50" 
                          : "bg-gradient-to-br from-slate-500 to-slate-600"
                      }`}>
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
                        <p className={`font-semibold text-sm md:text-base truncate ${
                          isActive ? "text-indigo-900 dark:text-indigo-100" : "text-slate-900 dark:text-white"
                        }`}>
                          {student.name}
                        </p>
                        {student.rollNo && (
                          <p className={`text-xs md:text-sm ${
                            isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"
                          }`}>
                            Roll: {student.rollNo}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Calendar View */}
          <div className="lg:col-span-2">
            {selectedStudent && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h4>
                    {selectedStudent.rollNo && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">Roll No: {selectedStudent.rollNo}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-700">
                    <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-indigo-900 dark:text-indigo-100">{attendancePercentage}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{summary.present}</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs">Present</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-rose-200 dark:border-rose-800">
                    <div className="text-rose-600 dark:text-rose-400 font-bold text-lg">{summary.absent}</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs">Absent</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-amber-200 dark:border-amber-800">
                    <div className="text-amber-600 dark:text-amber-400 font-bold text-lg">{summary.late}</div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs">Late</div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{formatMonthYear()}</h4>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevMonth} 
                  className="rounded-xl border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextMonth} 
                  className="rounded-xl border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {historyError ? (
              <div className="text-sm text-rose-600 dark:text-rose-400 p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800">
                {(historyError as any)?.message || "Failed to load attendance data"}
              </div>
            ) : !selectedStudentId ? (
              <div className="text-center py-16 px-4">
                <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                  Select a student to view their attendance calendar
                </p>
              </div>
            ) : historyLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
            ) : (selectedStudentHistory || []).length === 0 ? (
              <div className="text-center py-16 px-4">
                <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                  No attendance records found for this month
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div
                      key={d}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 text-center py-2"
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
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                      {cells.map((c, idx) => {
                        const status = c.key ? statusByDateKey.get(c.key) : undefined;
                        return (
                          <div
                            key={`${c.key ?? 'empty'}-${idx}`}
                            className={`rounded-lg md:rounded-xl border-2 p-1.5 md:p-2 min-h-[48px] md:min-h-[60px] flex items-start justify-start transition-all ${getDayCellClass(status)}`}
                          >
                            {c.day ? (
                              <div className="w-full">
                                <div className="text-xs md:text-sm font-bold leading-none mb-1">{c.day}</div>
                                {status ? (
                                  <div className="text-[9px] md:text-[10px] font-semibold opacity-90">
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