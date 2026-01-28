'use client';

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/* =====================================================
   TYPES & INTERFACES
===================================================== */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface StaffListItem {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles?: StaffRole[];
  currentClass?: {
    classId: string;
    className: string;
    section: string;
  };
}

export interface PaginatedStaffListResponse {
  items: StaffListItem[];
  total: number;
  page: number;
  limit: number;
}

type StaffRole = "teacher" | "coordinator";


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
  roles: StaffRole[];
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
   POST /api/staff
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
      roles: StaffRole[];
      sessionId: string;
    }) =>
      apiFetch('/api/staff', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['active-teachers'] });
    }
  });
};

export const useBulkDeactivateTeachers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch('/api/staff/bulk-deactivate', {
        method: 'POST',
        body: JSON.stringify({ ids })
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
   PRINCIPAL: REACTIVATE TEACHER
   PUT /api/staff/:id/reactivate
===================================================== */
export const useReactivateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/staff/${id}/activate`, {
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
   POST /api/staff/bulk-upload
===================================================== */

export const useBulkUploadTeachers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { file: File; sessionId: string; role?: StaffRole }) => {
      const formData = new FormData();
      formData.append('csvFile', payload.file);
      if (payload.sessionId) formData.append('sessionId', payload.sessionId);
      if (payload.role) formData.append('role', payload.role);

      return apiFetch('/api/staff/bulk-upload', {
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
   GET /api/staff
===================================================== */
export const useTeachers = () =>
  useQuery({
    queryKey: ['teachers'],
    queryFn: () => apiFetch('/api/staff'),
    staleTime: 1000 * 30,
    select: (data: any) => {
      if (!Array.isArray(data)) return [];
      return data.map((s: any) => ({
        ...s,
        id: String(s?.id || s?._id || '')
      }));
    }
  });

export const useInfiniteTeachers = (
  params?: {
    limit?: number;
    q?: string;
    isActive?: boolean;
  }
) => {
  const limit = typeof params?.limit === 'number' && Number.isFinite(params.limit) ? Math.min(params.limit, 200) : 50;
  const q = typeof params?.q === 'string' ? params.q : '';
  const isActive = typeof params?.isActive === 'boolean' ? params.isActive : undefined;

  return useInfiniteQuery<PaginatedStaffListResponse>({
    queryKey: ['teachers', { limit, q, isActive }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : 1;
      const sp = new URLSearchParams();
      sp.set('page', String(page));
      sp.set('limit', String(limit));
      if (q) sp.set('q', q);
      if (typeof isActive === 'boolean') sp.set('isActive', String(isActive));

      const resp: any = await apiFetch(`/api/staff?${sp.toString()}`);

      const normalizeItems = (list: any[]) =>
        list
          .map((s: any) => ({
            ...s,
            id: String(s?.id || s?._id || '')
          }))
          .filter((s: any) => s.id);

      if (Array.isArray(resp)) {
        return {
          items: normalizeItems(resp),
          total: resp.length,
          page,
          limit
        };
      }

      const items = Array.isArray(resp?.items) ? resp.items : [];
      return {
        items: normalizeItems(items),
        total: typeof resp?.total === 'number' ? resp.total : items.length,
        page: typeof resp?.page === 'number' ? resp.page : page,
        limit: typeof resp?.limit === 'number' ? resp.limit : limit
      };
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    staleTime: 1000 * 30
  });
};

/* =====================================================
   PRINCIPAL: UPDATE TEACHER
   PUT /api/staff/:id
===================================================== */
export const useUpdateTeacher = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      apiFetch(`/api/staff/${id}`, {
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
   DELETE /api/staff/:id
===================================================== */
export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/staff/${id}/deactivate`, {
        method: 'PUT'
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
   POST /api/staff/:id/assign-class
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
      apiFetch(`/api/staff/${data.teacherId}/assign-class`, {
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
   GET /api/staff/me
===================================================== */
export const useMyTeacherProfile = () =>
  useQuery({
    queryKey: ['teacher-me'],
    queryFn: () => apiFetch('/api/staff/me')
  });

/* =====================================================
   TEACHER: FULL PROFILE
   GET /api/staff/me/full
===================================================== */
export const useMyTeacherFullProfile = () =>
  useQuery<ApiResponse<TeacherFullProfile>>({
    queryKey: ['teacher-me-full'],
    queryFn: () => apiFetch('/api/staff/me/full')
  });

/* =====================================================
   PRINCIPAL: GET ANY TEACHER FULL PROFILE
   GET /api/staff/:id/full
===================================================== */
export const useTeacherFullProfile = (teacherId: string) =>
  useQuery<ApiResponse<TeacherFullProfile>>({
    queryKey: ['teacher-full', teacherId],
    queryFn: () => apiFetch(`/api/staff/${teacherId}/full`),
    enabled: !!teacherId
  });

/* =====================================================
   TEACHER: UPDATE OWN PROFILE
   PUT /api/staff/me
===================================================== */
export const useUpdateMyTeacherProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) =>
      apiFetch('/api/staff/me', {
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
   PUT /api/staff/me/password
===================================================== */
export const useChangeTeacherPassword = () =>
  useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
    }) =>
      apiFetch('/api/staff/me/password', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
  });

/* =====================================================
   PRINCIPAL DASHBOARD: ACTIVE TEACHER COUNT
   GET /api/staff/active-teachers
===================================================== */
export const useActiveTeacherCount = () =>
  useQuery({
    queryKey: ['active-teachers'],
    queryFn: () => apiFetch('/api/staff/active-teachers')
  });

/* =====================================================
   PRINCIPAL: SWAP TEACHERS BETWEEN CLASSES
   PUT /api/staff/swap-classes
===================================================== */
export const useSwapTeacherClasses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      sessionId: string;

      staffAId: string;
      classAId: string;
      classAName: string;
      sectionA: string;

      staffBId: string;
      classBId: string;
      classBName: string;
      sectionB: string;
    }) =>
      apiFetch('/api/staff/swap-classes', {
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
   PUT /api/staff/:id/profile
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
      roles?: StaffRole[];
    }) =>
      apiFetch(`/api/staff/${teacherId}/profile`, {
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

