'use client';

import { useMemo } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useWatchlistDisclosures } from '@/hooks/useWatchlistDisclosures';
import { useChartData } from '@/hooks/useChartData';
import { HeatmapCalendar } from '@/components/charts/HeatmapCalendar';
import { DonutChart } from '@/components/charts/DonutChart';
import { DisclosureBarChart } from '@/components/charts/DisclosureBarChart';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { daysAgoString } from '@/lib/utils';
import type { FeedFilters } from '@/types/dart';

export default function ChartsPage() {
  const { watchlist } = useWatchlist();

  const filters = useMemo<FeedFilters>(
    () => ({
      pblntf_ty: '',
      bgn_de: daysAgoString(90),
      end_de: '',
      last_reprt_at: '',
    }),
    [],
  );

  const { disclosures, isLoading } = useWatchlistDisclosures(watchlist, filters);
  const chartData = useChartData(disclosures);

  if (watchlist.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-2xl">📊</p>
        <p className="text-lg font-medium text-gray-700">관심 종목을 추가하면 차트가 표시됩니다</p>
        <p className="text-sm text-gray-400">사이드바에서 기업을 검색해 추가하세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">공시 트렌드 시각화</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">공시 발생 캘린더 (최근 90일)</h2>
          {isLoading ? (
            <div className="h-20 animate-pulse rounded bg-gray-100" />
          ) : (
            <HeatmapCalendar data={chartData.heatmap} />
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">공시 유형 분포</h2>
          {isLoading ? (
            <div className="h-48 animate-pulse rounded bg-gray-100" />
          ) : (
            <DonutChart data={chartData.donut} />
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">기업별 공시 빈도</h2>
          {isLoading ? (
            <div className="h-48 animate-pulse rounded bg-gray-100" />
          ) : (
            <DisclosureBarChart data={chartData.bars} />
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">공시 흐름 타임라인</h2>
          {isLoading ? (
            <div className="h-48 animate-pulse rounded bg-gray-100" />
          ) : (
            <TimelineChart data={chartData.timeline} />
          )}
        </div>
      </div>
    </div>
  );
}
