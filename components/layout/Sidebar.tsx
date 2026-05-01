'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import { CORP_CLASS_LABEL } from '@/types/dart';
import { CompanySearch } from '@/components/ui/CompanySearch';
import Link from 'next/link';

export function Sidebar() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">관심 종목</h2>
        <span className="text-xs text-gray-400">{watchlist.length}/20</span>
      </div>

      <CompanySearch />

      {watchlist.length === 0 ? (
        <p className="text-xs text-gray-400">기업명을 검색해서 추가하세요.</p>
      ) : (
        <ul className="flex flex-col gap-0.5 overflow-y-auto">
          {watchlist.map((item) => (
            <li
              key={item.corp_code}
              className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-gray-50"
            >
              <Link
                href={`/company/${item.corp_code}`}
                className="flex-1 truncate text-sm text-gray-800 hover:text-blue-600"
              >
                <span className="mr-1 text-xs text-gray-400">
                  [{CORP_CLASS_LABEL[item.corp_cls]}]
                </span>
                {item.corp_name}
              </Link>
              <button
                onClick={() => removeFromWatchlist(item.corp_code)}
                className="ml-1 shrink-0 text-gray-300 hover:text-red-400"
                aria-label={`${item.corp_name} 삭제`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
