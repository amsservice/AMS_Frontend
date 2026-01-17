'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/* =====================================================
   TYPES
===================================================== */

export interface StudentHistory {
  sessionId: string;
  classId: string;
  className: string;
  section: string;
  rollNo: number;
  isActive: boolean;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  admissionNo: string;
  fatherName: string;
  motherName: string;
  parentsPhone: string;
  status: 'active' | 'inactive' | 'left';
  history: StudentHistory[];
}

/* =====================================================
   TEACHER: LIST STUDENTS
   GET /api/students
===================================================== */
export const useStudents = () =>
  useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: () => apiFetch('/api/student/my-students')
  });

/* =====================================================
   TEACHER: ADD STUDENT
   POST /api/students
===================================================== */
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch('/api/student', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

/* =====================================================
   TEACHER: UPDATE STUDENT
   PUT /api/students/:id
===================================================== */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiFetch(`/api/student/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

/* =====================================================
   STUDENT: MY PROFILE
   GET /api/students/me
===================================================== */
export const useMyStudentProfile = () =>
  useQuery<Student>({
    queryKey: ['student', 'me'],
    queryFn: () => apiFetch('/api/student/me')
  });


  /* =====================================================
   TEACHER / PRINCIPAL: BULK UPLOAD STUDENTS
   POST /api/students/bulk-upload
===================================================== */
interface BulkUploadPayload {
  file: File;
  classId?: string;
  className?: string;
  section?: string;
  sessionId?: string;
}

export const useBulkUploadStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BulkUploadPayload) => {
      const formData = new FormData();

      // MUST match multer.single('csvFile')
      formData.append('csvFile', payload.file);

      if (payload.classId) formData.append('classId', payload.classId);
      if (payload.className) formData.append('className', payload.className);
      if (payload.section) formData.append('section', payload.section);
      if (payload.sessionId) formData.append('sessionId', payload.sessionId);

      return apiFetch('/api/student/bulk-upload', {
        method: 'POST',
        body: formData
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};
