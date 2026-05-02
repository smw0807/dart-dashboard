'use client';

import { useState, useRef, useEffect } from 'react';
import { useCorpSearch } from '@/hooks/useCorpSearch';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { WatchlistItem } from '@/types/dart';

export function CompanySearch() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [], isLoading } = useCorpSearch(submittedQuery);
  const { addToWatchlist, isWatched, watchlist } = useWatchlist();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSubmittedQuery(trimmed);
    setIsOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleAddCompany(item: WatchlistItem) {
    addToWatchlist(item);
    setQuery('');
    setSubmittedQuery('');
    setIsOpen(false);
  }

  const isAtLimit = watchlist.length >= 20;

  return (
    <div ref={containerRef} className="relative mb-3">
      <div className="flex gap-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="기업명 검색..."
          className="min-w-0 flex-1 rounded border border-gray-200 px-3 py-1.5 text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="shrink-0 rounded border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          검색
        </button>
      </div>
      {isOpen && submittedQuery && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded border border-gray-200 bg-white shadow-lg">
          {isLoading && (
            <div className="px-3 py-2 text-xs text-gray-400">검색 중...</div>
          )}
          {!isLoading && results.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-400">검색 결과가 없습니다.</div>
          )}
          {isAtLimit && (
            <div className="border-b border-amber-100 bg-amber-50 px-3 py-1.5 text-xs text-amber-600">
              관심 종목이 최대(20개)에 도달했습니다.
            </div>
          )}
          {results.map((item) => {
            const watched = isWatched(item.corp_code);
            const disabled = watched || isAtLimit;
            return (
              <button
                key={item.corp_code}
                onClick={() => !disabled && handleAddCompany(item)}
                disabled={disabled}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:cursor-default disabled:opacity-50"
              >
                <span className="truncate">{item.corp_name}</span>
                <span className="ml-2 shrink-0 text-xs text-gray-400">
                  {watched ? '추가됨' : '+ 추가'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
