'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import { useDisclosures } from '@/hooks/useDisclosures';
import { DisclosureFeed } from '@/components/feed/DisclosureFeed';
import { CORP_CLASS_LABEL } from '@/types/dart';
import { daysAgoString } from '@/lib/utils';
import { use } from 'react';

interface CompanyPageProps {
  params: Promise<{ code: string }>;
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const { code } = use(params);
  const { watchlist, addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();
  const watched = isWatched(code);

  const { data, isLoading, isError } = useDisclosures({
    corp_code: code,
    bgn_de: daysAgoString(180),
    page_count: 100,
  });

  const disclosures = data?.list ?? [];
  const firstDisclosure = disclosures[0];
  const corpName = firstDisclosure?.corp_name ?? code;
  const corpCls = firstDisclosure?.corp_cls;

  function handleWatchlistToggle() {
    if (watched) {
      removeFromWatchlist(code);
    } else {
      addToWatchlist({
        corp_code: code,
        corp_name: corpName,
        corp_cls: corpCls ?? 'E',
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{corpName}</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-400">고유번호: {code}</span>
            {corpCls && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                {CORP_CLASS_LABEL[corpCls]}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleWatchlistToggle}
          disabled={!watched && watchlist.length >= 20}
          className={
            watched
              ? 'rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50'
              : 'rounded-lg border border-blue-200 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50'
          }
        >
          {watched ? '관심 종목 해제' : '관심 종목 추가'}
        </button>
      </div>

      <DisclosureFeed
        disclosures={disclosures}
        isLoading={isLoading}
        isError={isError}
        showCorpName={false}
      />
    </div>
  );
}
