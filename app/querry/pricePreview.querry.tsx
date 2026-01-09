// import { useQuery } from '@tanstack/react-query';
// import { apiFetch } from '@/lib/api';

// export function usePricePreview(
//   planId: string,
//   enteredStudents: number,
//   futureStudents?: number
// ) {
//   return useQuery({
//     queryKey: ['price-preview', planId, enteredStudents, futureStudents],
//     queryFn: async () => {
//       const data = await apiFetch('/api/subscription/price-preview', {
//         method: 'POST',
//         body: JSON.stringify({
//           planId,
//           enteredStudents,
//           futureStudents
//         })
//       });
//       return data;
//     },
//     enabled: Boolean(planId && enteredStudents),
//     staleTime: 5 * 60 * 1000,
//   });
// }
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface PricePreviewData {
  billableStudents: number;
  totalPrice: number;
  difference: number;
}

interface PricePreviewPayload {
  planId: string;
  enteredStudents: number;
  futureStudents?: number;
}

export function usePricePreview(
  planId: string,
  enteredStudents: number,
  futureStudents?: number
): UseQueryResult<PricePreviewData, Error> {
  return useQuery<PricePreviewData, Error>({
    queryKey: ['price-preview', planId, enteredStudents, futureStudents],

    queryFn: async () => {
      if (!planId || enteredStudents <= 0) {
        throw new Error('Invalid price preview parameters');
      }

      const payload: PricePreviewPayload = {
        planId,
        enteredStudents,
      };

      if (typeof futureStudents === 'number' && futureStudents > 0) {
        payload.futureStudents = futureStudents;
      }

      return apiFetch('/api/subscription/price-preview', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    enabled: !!planId && enteredStudents > 0,

    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
