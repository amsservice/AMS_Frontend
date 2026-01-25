'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/* =====================================================
   TYPES & INTERFACES
===================================================== */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface TeacherHistory {
  sessionId: {
    _id: string;
    name: string;
  };
  classId: {
    _id: string;
    name: string;
    section: string;
  };
  className: string;
  section: string;
  isActive: boolean;
}

export interface TeacherFullProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  highestQualification?: string;
  experienceYears?: number;
  address?: string;

  isActive: boolean;
  leftAt?: string;

  schoolId: {
    _id: string;
    name: string;
  };

  history: TeacherHistory[];

  createdAt: string;
  updatedAt: string;
}

/* =====================================================
   PRINCIPAL: CREATE TEACHER
   POST /api/teacher
===================================================== */
export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      dob: string;
      gender: 'male' | 'female' | 'other';
      highestQualification?: string;
      experienceYears?: number;
      address?: string;
    }) =>
      apiFetch('/api/teacher', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['active-teachers'] });
    }
  });
};

/* =====================================================
   PRINCIPAL: REACTIVATE TEACHER
   PUT /api/teacher/:id/reactivate
===================================================== */
export const useReactivateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/teacher/${id}/reactivate`, {
        method: 'PUT'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['active-teachers'] });
    }
  });
};


/* =====================================================
   PRINCIPAL: BULK UPLOAD TEACHERS
   POST /api/teacher/bulk-upload
===================================================== */

export const useBulkUploadTeachers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { file: File }) => {
      const formData = new FormData();
      formData.append('csvFile', payload.file);

      return apiFetch('/api/teacher/bulk-upload', {
        method: 'POST',
        body: formData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['active-teachers'] });
    }
  });
};

/* =====================================================
   PRINCIPAL: LIST TEACHERS
   GET /api/teacher
===================================================== */
export const useTeachers = () =>
  useQuery({
    queryKey: ['teachers'],
    queryFn: () => apiFetch('/api/teacher')
  });

/* =====================================================
   PRINCIPAL: UPDATE TEACHER
   PUT /api/teacher/:id
===================================================== */
export const useUpdateTeacher = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch(`/api/teacher/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-full', id] });
    }
  });
};

/* =====================================================
   PRINCIPAL: DELETE TEACHER
   DELETE /api/teacher/:id
===================================================== */
export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/teacher/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['active-teachers'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });
};

/* =====================================================
   PRINCIPAL: ASSIGN CLASS TO TEACHER
   POST /api/teacher/:id/assign-class
===================================================== */
export const useAssignClassToTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      teacherId: string;
      sessionId: string;
      classId: string;
      className: string;
      section: string;
    }) =>
      apiFetch(`/api/teacher/${data.teacherId}/assign-class`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-full'] });
    }
  });
};

/* =====================================================
   TEACHER: BASIC PROFILE
   GET /api/teacher/me
===================================================== */
export const useMyTeacherProfile = () =>
  useQuery({
    queryKey: ['teacher-me'],
    queryFn: () => apiFetch('/api/teacher/me')
  });

/* =====================================================
   TEACHER: FULL PROFILE
   GET /api/teacher/me/full
===================================================== */
export const useMyTeacherFullProfile = () =>
  useQuery<ApiResponse<TeacherFullProfile>>({
    queryKey: ['teacher-me-full'],
    queryFn: () => apiFetch('/api/teacher/me/full')
  });

/* =====================================================
   PRINCIPAL: GET ANY TEACHER FULL PROFILE
   GET /api/teacher/:id/full
===================================================== */
export const useTeacherFullProfile = (teacherId: string) =>
  useQuery<ApiResponse<TeacherFullProfile>>({
    queryKey: ['teacher-full', teacherId],
    queryFn: () => apiFetch(`/api/teacher/${teacherId}/full`),
    enabled: !!teacherId
  });

/* =====================================================
   TEACHER: UPDATE OWN PROFILE
   PUT /api/teacher/me
===================================================== */
export const useUpdateMyTeacherProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) =>
      apiFetch('/api/teacher/me', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-me'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-me-full'] });
    }
  });
};

/* =====================================================
   TEACHER: CHANGE PASSWORD
   PUT /api/teacher/me/password
===================================================== */
export const useChangeTeacherPassword = () =>
  useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
    }) =>
      apiFetch('/api/teacher/me/password', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  });

/* =====================================================
   PRINCIPAL DASHBOARD: ACTIVE TEACHER COUNT
   GET /api/teacher/active-teachers
===================================================== */
export const useActiveTeacherCount = () =>
  useQuery({
    queryKey: ['active-teachers'],
    queryFn: () => apiFetch('/api/teacher/active-teachers')
  });

/* =====================================================
   PRINCIPAL: SWAP TEACHERS BETWEEN CLASSES
   PUT /api/teacher/swap-classes
===================================================== */
export const useSwapTeacherClasses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      sessionId: string;

      teacherAId: string;
      classAId: string;
      classAName: string;
      sectionA: string;

      teacherBId: string;
      classBId: string;
      classBName: string;
      sectionB: string;
    }) =>
      apiFetch('/api/teacher/swap-classes', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-full'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['active-teachers'] });
    }
  });
};

/* =====================================================
   PRINCIPAL: UPDATE TEACHER PROFILE
   PUT /api/teacher/:id/profile
===================================================== */
export const useUpdateTeacherProfileByPrincipal = (teacherId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      phone?: string;
      email?: string;
      dob?: string;
      gender?: 'male' | 'female' | 'other';
      highestQualification?: string;
      experienceYears?: number;
      address?: string;
    }) =>
      apiFetch(`/api/teacher/${teacherId}/profile`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    onSuccess: () => {
      // refresh teacher list
      queryClient.invalidateQueries({ queryKey: ['teachers'] });

      // refresh this teacher full profile
      queryClient.invalidateQueries({
        queryKey: ['teacher-full', teacherId]
      });
    }
  });
};

