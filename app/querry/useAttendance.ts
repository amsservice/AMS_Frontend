'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/* =====================================================
   TYPES
===================================================== */

export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'not_marked';

export interface TeacherStudentItem {
  studentId: string;
  name: string;
  rollNo: number | null;
  status: AttendanceStatus;
}

export interface TeacherTodaySummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  presentPercentage: number;
}

export interface StudentMonthlySummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface StudentSessionItem {
  date: string;
  status: AttendanceStatus;
}

export interface TeacherAssignedClass {
  classId: string;
  name: string;
  section: string;
  sessionId: string;
}

/* =====================================================
   TEACHER QUERIES
===================================================== */

/* 🧑‍🏫 Teacher – student list with attendance (date-wise) */
export const useTeacherTodayStudents = (date: string) => {
  return useQuery<TeacherStudentItem[]>({
    queryKey: ['attendance', 'teacher', 'students', date],
    queryFn: async () => {
      const res = await apiFetch(
        `/api/attendance/student/today-students?date=${date}`
      );
      return res.data;
    }
  });
};

/* 🧑‍🏫 Teacher – today summary */
export const useTeacherTodaySummary = (date: string) => {
  return useQuery<TeacherTodaySummary>({
    queryKey: ['attendance', 'teacher', 'summary', date],
    queryFn: async () => {
      const res = await apiFetch(
        `/api/attendance/student/today-summary?date=${date}`
      );
      return res.data;
    }
  });
};

export const useTeacherAssignedClass = () => {
  return useQuery<TeacherAssignedClass>({
    queryKey: ['attendance', 'teacher', 'class'],
    queryFn: async () => {
      const res = await apiFetch('/api/attendance/teacher/my-class');
      return res.data;
    }
  });
};

export const useTeacherStudentMonthlyHistory = (
  studentId: string | null,
  year: number,
  month: number
) => {
  return useQuery<StudentSessionItem[]>({
    queryKey: ['attendance', 'teacher', 'student-monthly', studentId, year, month],
    queryFn: async () => {
      const res = await apiFetch(
        `/api/attendance/teacher/student-monthly-history?studentId=${studentId}&year=${year}&month=${month}`
      );
      return res.data;
    },
    enabled: Boolean(studentId && year && month)
  });
};

/* 🧑‍🏫 Teacher – mark attendance */
interface MarkAttendancePayload {
  date: string;
  students: {
    studentId: string;
    status: Exclude<AttendanceStatus, 'not_marked'>;
  }[];
}

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MarkAttendancePayload) => {
      return apiFetch('/api/attendance/student/mark', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'teacher', 'students', variables.date]
      });
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'teacher', 'summary', variables.date]
      });
    }
  });
};

/* =====================================================
   STUDENT QUERIES
===================================================== */

/* 👨‍🎓 Student – today status */
export const useStudentTodayStatus = () => {
  return useQuery<{ status: AttendanceStatus }>({
    queryKey: ['attendance', 'student', 'today'],
    queryFn: async () => {
      const res = await apiFetch(
        '/api/attendance/student/today'
      );
      return res.data;
    }
  });
};

/* 👨‍🎓 Student – monthly attendance */
export const useStudentMonthlyAttendance = (
  year: number,
  month: number
) => {
  return useQuery<StudentMonthlySummary>({
    queryKey: ['attendance', 'student', 'monthly', year, month],
    queryFn: async () => {
      const res = await apiFetch(
        `/api/attendance/student/monthly?year=${year}&month=${month}`
      );
      return res.data;
    },
    enabled: Boolean(year && month)
  });
};

/* 👨‍🎓 Student – session history */
export const useStudentSessionHistory = () => {
  return useQuery<StudentSessionItem[]>({
    queryKey: ['attendance', 'student', 'history'],
    queryFn: async () => {
      const res = await apiFetch(
        '/api/attendance/student/session-history'
      );
      return res.data;
    }
  });
};
