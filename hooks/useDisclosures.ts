import { useQuery } from '@tanstack/react-query';
import type { DartApiResponse, SearchParams } from '@/types/dart';

async function fetchDisclosures(params: SearchParams): Promise<DartApiResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) query.set(k, String(v));
  });

  const res = await fetch(`/api/disclosures?${query}`);
  if (!res.ok) throw new Error('공시 데이터를 불러오는 데 실패했습니다.');
  return res.json();
}

export function useDisclosures(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: ['disclosures', params],
    queryFn: () => fetchDisclosures(params),
    staleTime: 1000 * 60 * 5, // 5분
    enabled,
  });
}
