



import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { HolidayCategory } from '@/lib/holiday.constants';

/* ================= TYPES ================= */

export interface Holiday {
  _id: string;
  name: string;

  startDate: string;          // ISO string (required)
  endDate?: string | null;    // optional (long vacations)

  description?: string;
  category: HolidayCategory;
}

/* ================= PAYLOADS ================= */

export type CreateHolidayPayload = {
  name: string;
  startDate: string;
  endDate?: string;
  description?: string;
  category: HolidayCategory;
};

export type UpdateHolidayPayload = Partial<CreateHolidayPayload>;

/* ================= QUERIES ================= */

/* GET ALL HOLIDAYS */
export const useHolidays = () =>
  useQuery<Holiday[]>({
    queryKey: ['holidays'],
    queryFn: () => apiFetch('/api/holidays')
  });

/* ================= MUTATIONS ================= */

/* CREATE HOLIDAY */
export const useCreateHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHolidayPayload) =>
      apiFetch('/api/holidays', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          endDate: data.endDate || undefined // normalize
        })
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['holidays'] });
    }
  });
};

/* UPDATE HOLIDAY */
export const useUpdateHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: UpdateHolidayPayload;
    }) =>
      apiFetch(`/api/holidays/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          endDate: data.endDate ?? undefined // null → undefined
        })
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['holidays'] });
    }
  });
};

/* DELETE HOLIDAY */
export const useDeleteHoliday = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/holidays/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['holidays'] });
    }
  });
};
