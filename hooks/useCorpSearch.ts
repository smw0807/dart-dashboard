import { useQuery } from '@tanstack/react-query';
import type { WatchlistItem } from '@/types/dart';

async function fetchCompanySearch(query: string): Promise<WatchlistItem[]> {
  const response = await fetch(`/api/companies?name=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('기업 검색에 실패했습니다.');
  return response.json();
}

export function useCorpSearch(query: string) {
  return useQuery({
    queryKey: ['corp-search', query],
    queryFn: () => fetchCompanySearch(query),
    staleTime: 1000 * 60 * 5,
    enabled: query.trim().length >= 1,
  });
}
