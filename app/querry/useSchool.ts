'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

/* ===============================
   TYPES
=============================== */

export interface School {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  pincode?: string;

  principal: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;

  subscription: {
  planId: '1Y' | '2Y' | '3Y';
  billableStudents: number;
  paidAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'grace' | 'expired';
}


  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SchoolResponse {
  school: School;
}

/* ===============================
   GET MY SCHOOL
   GET /school/me
=============================== */
export const useMySchool = (enabled = true) =>
  useQuery({
    queryKey: ['school', 'me'],
    queryFn: async (): Promise<SchoolResponse> =>
      apiFetch('/api/school/me'),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

/* ===============================
   UPDATE MY SCHOOL
   PUT /school/me
=============================== */

interface UpdateSchoolPayload {
  name?: string;
  phone?: string;
  address?: string;
  pincode?: string;
}

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSchoolPayload) =>
      apiFetch('/api/school/me', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['school', 'me']
      });
    }
  });
};
