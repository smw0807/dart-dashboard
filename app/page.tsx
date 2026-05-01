'use client';

import { useState } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useWatchlistDisclosures } from '@/hooks/useWatchlistDisclosures';
import { useSurgeAlerts } from '@/hooks/useSurgeAlerts';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { FilterPanel } from '@/components/ui/FilterPanel';
import { DisclosureFeed } from '@/components/feed/DisclosureFeed';
import type { FeedFilters } from '@/types/dart';
import { daysAgoString } from '@/lib/utils';

const initialFilters: FeedFilters = {
  pblntf_ty: '',
  bgn_de: daysAgoString(90),
  end_de: '',
  last_reprt_at: '',
};

export default function DashboardPage() {
  const { watchlist } = useWatchlist();
  const [filters, setFilters] = useState<FeedFilters>(initialFilters);
  const { disclosures, isLoading, isError } = useWatchlistDisclosures(watchlist, filters);
  const surgeAlerts = useSurgeAlerts(watchlist);

  if (watchlist.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-2xl">📋</p>
        <p className="text-lg font-medium text-gray-700">관심 종목을 추가해보세요</p>
        <p className="text-sm text-gray-400">
          왼쪽 사이드바에서 기업명을 검색하면 공시 피드가 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AlertBanner alerts={surgeAlerts} />
      <FilterPanel filters={filters} onChange={setFilters} />
      <DisclosureFeed
        disclosures={disclosures}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
