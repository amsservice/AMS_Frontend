



'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/* ============================
   TYPES
============================ */

interface TotalClassCount {
  totalClasses: number;
}

interface CreateClassPayload {
  name: string;
  section: string;
}

interface UpdateClassPayload {
  name?: string;
  section?: string;
  teacherId?: string | null;
}

/* =====================================================
   📚 Get Classes (GET /api/class)
===================================================== */
export const useClasses = () =>
  useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const data = await apiFetch('/api/class');
      return Array.isArray(data) ? data : (data as any)?.data ?? [];
    }
  });




/* =====================================================
   ➕ Create Class (POST /api/class)
===================================================== */
export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassPayload) =>
      apiFetch('/api/class', {
        method: 'POST',
        body: JSON.stringify(data)
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });
};

export const useBulkDeactivateClasses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch('/api/class/bulk-deactivate', {
        method: 'POST',
        body: JSON.stringify({ ids })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });
};

/* =====================================================
   ✏️ Update Class (PUT /api/class/:id)
===================================================== */
export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: UpdateClassPayload;
    }) =>
      apiFetch(`/api/class/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
};

/* =====================================================
   🗑️ Delete Class (DELETE /api/class/:id)
===================================================== */
export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/class/${id}`, {
        method: 'DELETE'
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });
};

/* =====================================================
   📊 Total Classes Count (Dashboard)
===================================================== */
export const useTotalClasses = () =>
  useQuery<TotalClassCount>({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiFetch('/api/class/totalclass')
  });
