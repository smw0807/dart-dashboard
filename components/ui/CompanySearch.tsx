'use client';

import { useState, useRef, useEffect } from 'react';
import { useCorpSearch } from '@/hooks/useCorpSearch';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { WatchlistItem } from '@/types/dart';

export function CompanySearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isLoading } = useCorpSearch(debouncedQuery);
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

  function handleAddCompany(item: WatchlistItem) {
    addToWatchlist(item);
    setQuery('');
    setIsOpen(false);
  }

  const isAtLimit = watchlist.length >= 20;

  return (
    <div ref={containerRef} className="relative mb-3">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => query && setIsOpen(true)}
        placeholder="기업명 검색 후 추가..."
        className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none"
      />
      {isOpen && query.trim() && (
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
