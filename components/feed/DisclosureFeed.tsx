'use client';

import { useState } from 'react';
import type { Disclosure } from '@/types/dart';
import { DisclosureCard } from './DisclosureCard';

interface DisclosureFeedProps {
  disclosures: Disclosure[];
  isLoading: boolean;
  isError: boolean;
  showCorpName?: boolean;
}

const ITEMS_PER_PAGE = 30;

export function DisclosureFeed({
  disclosures,
  isLoading,
  isError,
  showCorpName = true,
}: DisclosureFeedProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
              <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
        공시 데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (disclosures.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">
        조건에 맞는 공시가 없습니다.
      </div>
    );
  }

  const visibleDisclosures = disclosures.slice(0, visibleCount);
  const hasMore = disclosures.length > visibleCount;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4">
      <div className="flex items-center border-b border-gray-100 py-3">
        <span className="text-xs text-gray-500">
          총 {disclosures.length}건 중 {visibleDisclosures.length}건 표시
        </span>
      </div>
      {visibleDisclosures.map((disclosure) => (
        <DisclosureCard
          key={disclosure.rcept_no}
          disclosure={disclosure}
          showCorpName={showCorpName}
        />
      ))}
      {hasMore && (
        <div className="py-4 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            더 보기 ({disclosures.length - visibleCount}건 남음)
          </button>
        </div>
      )}
    </div>
  );
}
