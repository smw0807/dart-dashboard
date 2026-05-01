import { useState, useEffect, useCallback } from 'react';
import type { WatchlistItem } from '@/types/dart';

const STORAGE_KEY = 'dart_watchlist';
const MAX_ITEMS = 20;

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {
      // localStorage 접근 불가 환경 무시
    }
  }, []);

  const persist = useCallback((items: WatchlistItem[]) => {
    setWatchlist(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, []);

  const addToWatchlist = useCallback(
    (item: WatchlistItem) => {
      if (watchlist.length >= MAX_ITEMS) return false;
      if (watchlist.some((w) => w.corp_code === item.corp_code)) return false;
      persist([...watchlist, item]);
      return true;
    },
    [watchlist, persist]
  );

  const removeFromWatchlist = useCallback(
    (corp_code: string) => {
      persist(watchlist.filter((w) => w.corp_code !== corp_code));
    },
    [watchlist, persist]
  );

  const isWatched = useCallback(
    (corp_code: string) => watchlist.some((w) => w.corp_code === corp_code),
    [watchlist]
  );

  return { watchlist, addToWatchlist, removeFromWatchlist, isWatched };
}
