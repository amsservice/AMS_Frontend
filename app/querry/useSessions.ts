'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/* =====================================================
   📅 Get Sessions (GET /api/sessions)
   ===================================================== */
export const useSessions = () =>
  useQuery({
    queryKey: ['sessions'],
    queryFn: () => apiFetch('/api/session'),
  });

/* =====================================================
   ➕ Create Session (POST /api/sessions)
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
   ✏️ Update Session (PUT /api/sessions/:id)
   ===================================================== */
export const useUpdateSession = (id: number | string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      startDate?: string;
      endDate?: string;
      isActive?: boolean;
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
