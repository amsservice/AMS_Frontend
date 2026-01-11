import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { HolidayCategory } from '@/lib/holiday.constants';

export interface Holiday {
  _id: string;
  name: string;
  date: string;
  description?: string;
  category: HolidayCategory;
}

/* GET */
export const useHolidays = () =>
  useQuery<Holiday[]>({
    queryKey: ['holidays'],
    queryFn: () => apiFetch('/api/holidays')
  });

/* CREATE */
export const useCreateHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Holiday, '_id'>) =>
      apiFetch('/api/holidays', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['holidays'] })
  });
};

/* UPDATE */
export const useUpdateHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: string;
      data: Partial<Holiday>;
    }) =>
      apiFetch(`/api/holidays/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['holidays'] })
  });
};

/* DELETE */
export const useDeleteHoliday = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/holidays/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['holidays'] })
  });
};
