import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function usePricePreview(
  planId: string,
  enteredStudents: number,
  futureStudents?: number
) {
  return useQuery({
    queryKey: ['price-preview', planId, enteredStudents, futureStudents],
    queryFn: async () => {
      const data = await apiFetch('/subscriptions/price-preview', {
        method: 'POST',
        body: JSON.stringify({
          planId,
          enteredStudents,
          futureStudents
        })
      });
      return data;
    },
    enabled: Boolean(planId && enteredStudents),
    staleTime: 5 * 60 * 1000,
  });
}