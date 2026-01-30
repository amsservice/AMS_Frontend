

'use client';

import { useEffect, useState, useMemo } from 'react';
import { Calendar, CheckCircle, XCircle, Users, Save, Edit2, Search, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { useStudents } from '@/app/querry/useStudent';
import {
  useTeacherTodayStudents,
  useMarkAttendance,
  type AttendanceStatus,
  useTeacherTodaySummary
} from '@/app/querry/useAttendance';

type MarkStatus = Exclude<AttendanceStatus, 'not_marked'>;

export default function TeacherAttendancePage() {
  const { data: students = [], isLoading } = useStudents();

  /* ===============================
     DATE STATE
  =============================== */
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Get today's date for comparison
  const today = new Date().toISOString().split('T')[0];

  const {
    data: todayAttendance = [],
    isLoading: attendanceLoading
  } = useTeacherTodayStudents(date);

  const { mutateAsync, isPending } = useMarkAttendance();

  const [attendance, setAttendance] = useState<
    Record<string, MarkStatus>
  >({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: summary,
    isLoading: summaryLoading
  } = useTeacherTodaySummary(date);

  /* ===============================
     CHECK IF ATTENDANCE ALREADY SUBMITTED
  =============================== */
  useEffect(() => {
    // Check if all students have attendance marked
    const allMarked = students.length > 0 &&
      students.every(s => todayAttendance.some(a => a.studentId === s._id && a.status !== 'not_marked'));
    setIsSubmitted(allMarked);
  }, [todayAttendance, students]);

  /* ===============================
     SYNC ATTENDANCE
  =============================== */
  useEffect(() => {
    const map: Record<string, MarkStatus> = {};

    todayAttendance.forEach((a) => {
      if (a.status !== 'not_marked') {
        map[a.studentId] = a.status;
      }
    });

    setAttendance(map);
  }, [todayAttendance, date]);

  /* ===============================
     FILTERED STUDENTS (SEARCH)
  =============================== */
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;

    const query = searchQuery.toLowerCase().trim();
    return students.filter(s => {
      const name = s.name?.toLowerCase() || '';
      const rollNo = s.history?.find(h => h.isActive)?.rollNo?.toString() || '';
      return name.includes(query) || rollNo.includes(query);
    });
  }, [students, searchQuery]);

  /* ===============================
     TOGGLE ATTENDANCE
  =============================== */
  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => {
      const current = prev[studentId];
      let next: MarkStatus;

      if (!current || current === 'absent') {
        next = 'present';
      } else {
        next = 'absent';
      }

      return { ...prev, [studentId]: next };
    });
  };

  /* ===============================
     BULK ACTIONS
  =============================== */
  const markAllPresent = () => {
    const map: Record<string, MarkStatus> = {};
    students.forEach((s) => {
      map[s._id] = 'present';
    });
    setAttendance(map);
    toast.success('All students marked present');
  };

  const markAllAbsent = () => {
    const map: Record<string, MarkStatus> = {};
    students.forEach((s) => {
      map[s._id] = 'absent';
    });
    setAttendance(map);
    toast.success('All students marked absent');
  };

  /* ===============================
     SUBMIT / EDIT
  =============================== */
  const submitAttendance = async () => {
    if (!students.length) {
      toast.error('No students found');
      return;
    }

    const payload = students.map((s) => ({
      studentId: s._id,
      status: attendance[s._id] ?? 'absent'
    }));

    await mutateAsync({
      date,
      students: payload
    });

    setIsSubmitted(true);
    toast.success(isSubmitted ? 'Attendance updated successfully' : 'Attendance saved successfully');
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    toast.info('You can now edit the attendance');
  };

  /* ===============================
     CALCULATE SUMMARY
  =============================== */
  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;
  const leftCount = students.length - presentCount - absentCount;
  const attendanceProgress = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  if (isLoading || attendanceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading attendance…</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 min-h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900 shadow-2xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                Take Attendance 📋
              </h1>
              <p className="mt-2 text-sm sm:text-base text-purple-100 font-medium">
                Tap card once for present, twice for absent
              </p>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-purple-200/50">
              <Calendar className="w-5 h-5 text-purple-600" />
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-purple-900 font-semibold outline-none cursor-pointer"
              />

            </div>
          </div>
        </div>
      </header>

      {/* Progress Cards  */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/30 my-4 mx-3">
        {/* Progress Header */}
        {/* <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Attendance Progress</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceProgress}%</span>
              </div> */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Attendance Progress</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceProgress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-1.5 bg-gray-700/30 dark:bg-gray-700/50 rounded-full overflow-hidden mb-3">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-cyan-500 dark:from-cyan-400 dark:to-cyan-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${attendanceProgress}%` }}
          />
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Total */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/30 dark:to-cyan-800/20 border border-cyan-200/50 dark:border-cyan-700/30 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-10 h-10 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-lg flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{students.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total</div>
          </div>

          {/* Present */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 border border-green-200/50 dark:border-green-700/30 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{presentCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Present</div>
          </div>

          {/* Absent */}
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 border border-red-200/50 dark:border-red-700/30 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-10 h-10 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center mb-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{absentCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Absent</div>
          </div>

          {/* Pending */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200/50 dark:border-amber-700/30 rounded-xl p-3 flex flex-col items-center justify-center">
            <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{leftCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Pending</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or roll number..."
              className="w-full pl-12 pr-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-purple-200/50 dark:border-purple-700/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all shadow-lg backdrop-blur-sm"
            />
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              disabled={isSubmitted}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4" />
              <span>All Present</span>
            </button>

            <button
              onClick={markAllAbsent}
              disabled={isSubmitted}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-semibold hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="h-4 w-4" />
              <span>All Absent</span>
            </button>
          </div>

          {/* Students List */}
          <div className="bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-2xl border border-purple-200/50 dark:border-purple-700/30 overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-purple-200/50 dark:border-purple-700/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Student List
                {searchQuery && (
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({filteredStudents.length} results)
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tap once for present, tap again for absent
              </p>
            </div>

            {/* Students */}
            <div className="divide-y divide-purple-200/50 dark:divide-purple-700/30 max-h-[500px] overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No students found
                </div>
              ) : (
                filteredStudents.map((s) => {
                  const active = s.history?.find((h) => h.isActive);
                  const status = attendance[s._id];
                  const isPresent = status === 'present';
                  const isAbsent = status === 'absent';

                  return (
                    <button
                      key={s._id}
                      onClick={() => {
                        if (isSubmitted) return;
                        toggleAttendance(s._id);
                      }}
                      disabled={isSubmitted}
                      className={`w-full flex items-center gap-3 p-4 transition-all duration-200 ${isPresent
                          ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                          : isAbsent
                            ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                            : 'bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700/50'
                        } ${isSubmitted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                    >
                      {/* Roll Number Badge */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0 ${isPresent
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : isAbsent
                              ? 'bg-gradient-to-br from-red-500 to-rose-600'
                              : 'bg-gradient-to-br from-purple-500 to-blue-600'
                          }`}
                      >
                        {active?.rollNo || '?'}
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                          {s.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Roll #{active?.rollNo}
                        </p>
                      </div>

                      {/* Status Icons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className={`p-2 rounded-lg transition-all duration-200 ${isPresent
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                            }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </div>

                        <div
                          className={`p-2 rounded-lg transition-all duration-200 ${isAbsent
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                            }`}
                        >
                          <XCircle className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isSubmitted ? (
              <>
                <button
                  onClick={submitAttendance}
                  disabled={isPending || leftCount > 0}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-6 w-6" />
                  <span>{isPending ? 'Saving…' : 'Save Attendance'}</span>
                </button>

                {leftCount > 0 && (
                  <p className="text-center text-sm text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ Please mark attendance for all {leftCount} remaining student{leftCount !== 1 ? 's' : ''}
                  </p>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-lg font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  <Edit2 className="h-6 w-6" />
                  <span>Edit Attendance</span>
                </button>

                {!isSubmitted && (
                  <button
                    onClick={submitAttendance}
                    disabled={isPending || leftCount > 0}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl text-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-6 w-6" />
                    <span>{isPending ? 'Updating…' : 'Resubmit Attendance'}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}