'use client';

import { useMemo } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useWatchlistDisclosures } from '@/hooks/useWatchlistDisclosures';
import { useChartData } from '@/hooks/useChartData';
import { HeatmapCalendar } from '@/components/charts/HeatmapCalendar';
import { DonutChart } from '@/components/charts/DonutChart';
import { DisclosureBarChart } from '@/components/charts/DisclosureBarChart';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { ChartCard } from '@/components/charts/ChartCard';
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
        <ChartCard title="공시 발생 캘린더 (최근 90일)" isLoading={isLoading} skeletonHeight="h-20">
          <HeatmapCalendar data={chartData.heatmap} />
        </ChartCard>

        <ChartCard title="공시 유형 분포" isLoading={isLoading}>
          <DonutChart data={chartData.donut} />
        </ChartCard>

        <ChartCard title="기업별 공시 빈도" isLoading={isLoading}>
          <DisclosureBarChart data={chartData.bars} />
        </ChartCard>

        <ChartCard title="공시 흐름 타임라인" isLoading={isLoading}>
          <TimelineChart data={chartData.timeline} />
        </ChartCard>
      </div>
    </div>
  );
}
