

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/* =====================================================
   📅 GET SESSIONS
   GET /api/session
===================================================== */
export const useSessions = () =>
  useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await apiFetch('/api/session');
      return res.data; // ✅ FIX (ARRAY)
    },
  });

/* =====================================================
   ➕ CREATE SESSION
===================================================== */
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      startDate: string;
      endDate: string;
    }) =>
      apiFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

/* =====================================================
   ✏️ UPDATE SESSION
===================================================== */
export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        startDate?: string;
        endDate?: string;
        isActive?: boolean;
      };
    }) =>
      apiFetch(`/api/session/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

/* =====================================================
   🗑️ DELETE SESSION
===================================================== */
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/session/${id}`, {
        method: 'DELETE',
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};