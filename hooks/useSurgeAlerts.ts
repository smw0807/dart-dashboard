import { useQueries } from '@tanstack/react-query';
import type { DartApiResponse, Disclosure, SurgeAlert, WatchlistItem } from '@/types/dart';
import { daysAgoString } from '@/lib/utils';

const SURGE_WINDOW_DAYS = 37; // 최근 7일 + 비교 기간 30일
const SURGE_THRESHOLD = 3;
const MIN_RECENT_COUNT = 3; // 저빈도 기업의 노이즈 알림 방지

async function fetchSurgeData(corpCode: string): Promise<Disclosure[]> {
  const params = new URLSearchParams({
    corp_code: corpCode,
    bgn_de: daysAgoString(SURGE_WINDOW_DAYS),
    page_count: '100',
  });
  const response = await fetch(`/api/disclosures?${params}`);
  if (!response.ok) return [];
  const data: DartApiResponse = await response.json();
  return data.list ?? [];
}

function calculateSurgeAlert(
  item: WatchlistItem,
  disclosures: Disclosure[],
): SurgeAlert | null {
  const sevenDaysAgo = daysAgoString(7);
  const thirtySevenDaysAgo = daysAgoString(SURGE_WINDOW_DAYS);

  const recent7 = disclosures.filter((d) => d.rcept_dt >= sevenDaysAgo).length;
  const prior30 = disclosures.filter(
    (d) => d.rcept_dt >= thirtySevenDaysAgo && d.rcept_dt < sevenDaysAgo,
  ).length;

  // 30일 데이터를 7일 단위로 정규화하여 공정한 비교
  const prev30avg = (prior30 / 30) * 7;

  if (recent7 < MIN_RECENT_COUNT || prev30avg === 0) return null;

  const ratio = recent7 / prev30avg;
  if (ratio < SURGE_THRESHOLD) return null;

  return { corp_code: item.corp_code, corp_name: item.corp_name, recent7, prev30avg, ratio };
}

export function useSurgeAlerts(watchlist: WatchlistItem[]): SurgeAlert[] {
  const results = useQueries({
    queries: watchlist.map((item) => ({
      queryKey: ['surge', item.corp_code, daysAgoString(SURGE_WINDOW_DAYS)],
      queryFn: () => fetchSurgeData(item.corp_code),
      staleTime: 1000 * 60 * 5,
      enabled: watchlist.length > 0,
    })),
  });

  return results
    .map((result, index) => {
      if (!result.data) return null;
      return calculateSurgeAlert(watchlist[index], result.data);
    })
    .filter((alert): alert is SurgeAlert => alert !== null);
}
