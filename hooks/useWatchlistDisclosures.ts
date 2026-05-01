import { useQueries } from '@tanstack/react-query';
import type { DartApiResponse, Disclosure, FeedFilters, WatchlistItem } from '@/types/dart';
import { daysAgoString } from '@/lib/utils';

async function fetchDisclosuresByCorpCode(
  corpCode: string,
  filters: FeedFilters,
): Promise<Disclosure[]> {
  const params = new URLSearchParams({ corp_code: corpCode });
  params.set('bgn_de', filters.bgn_de || daysAgoString(90));
  if (filters.end_de) params.set('end_de', filters.end_de);
  if (filters.pblntf_ty) params.set('pblntf_ty', filters.pblntf_ty);
  if (filters.last_reprt_at) params.set('last_reprt_at', filters.last_reprt_at);
  params.set('page_count', '100');

  const response = await fetch(`/api/disclosures?${params}`);
  if (!response.ok) throw new Error('공시 데이터를 불러오는 데 실패했습니다.');
  const data: DartApiResponse = await response.json();
  return data.list ?? [];
}

export function useWatchlistDisclosures(
  watchlist: WatchlistItem[],
  filters: FeedFilters,
) {
  const results = useQueries({
    queries: watchlist.map((item) => ({
      queryKey: ['disclosures', item.corp_code, filters],
      queryFn: () => fetchDisclosuresByCorpCode(item.corp_code, filters),
      staleTime: 1000 * 60 * 5,
      enabled: watchlist.length > 0,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const disclosures = results
    .flatMap((r) => r.data ?? [])
    .sort(
      (a, b) =>
        b.rcept_dt.localeCompare(a.rcept_dt) || b.rcept_no.localeCompare(a.rcept_no),
    );

  return { disclosures, isLoading, isError };
}
