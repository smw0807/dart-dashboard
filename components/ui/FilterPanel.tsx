'use client';

import type { DisclosureType, FeedFilters } from '@/types/dart';
import { DISCLOSURE_TYPE_LABEL, DISCLOSURE_TYPE_COLOR } from '@/types/dart';
import { cn, daysAgoString } from '@/lib/utils';

interface FilterPanelProps {
  filters: FeedFilters;
  onChange: (filters: FeedFilters) => void;
}

const DISCLOSURE_TYPES: DisclosureType[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function toInputDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return '';
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

function fromInputDate(value: string): string {
  return value.replace(/-/g, '');
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function setFilter<K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function resetFilters() {
    onChange({ pblntf_ty: '', bgn_de: daysAgoString(90), end_de: '', last_reprt_at: '' });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
      {/* 공시 유형 필터 */}
      <div className="flex flex-wrap gap-1">
        {DISCLOSURE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter('pblntf_ty', filters.pblntf_ty === type ? '' : type)}
            className={cn(
              'rounded px-2 py-0.5 text-xs font-medium transition-opacity',
              DISCLOSURE_TYPE_COLOR[type],
              filters.pblntf_ty && filters.pblntf_ty !== type ? 'opacity-30' : 'opacity-100',
            )}
          >
            {DISCLOSURE_TYPE_LABEL[type]}
          </button>
        ))}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        {/* 날짜 범위 */}
        <div className="flex items-center gap-1">
          <input
            type="date"
            value={toInputDate(filters.bgn_de)}
            onChange={(e) => setFilter('bgn_de', fromInputDate(e.target.value))}
            className="rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none"
          />
          <span className="text-xs text-gray-400">~</span>
          <input
            type="date"
            value={toInputDate(filters.end_de)}
            onChange={(e) => setFilter('end_de', fromInputDate(e.target.value))}
            className="rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none"
          />
        </div>

        {/* 최종보고서 토글 */}
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={filters.last_reprt_at === 'Y'}
            onChange={(e) => setFilter('last_reprt_at', e.target.checked ? 'Y' : '')}
            className="rounded"
          />
          최종보고서만
        </label>

        <button
          onClick={resetFilters}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
