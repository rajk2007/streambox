import { useEffect, useState } from "react";
import { mockData, type MediaItem, type ContentType } from "@/data/mockData";

const RECENT_KEY = "streambox_recent_searches";

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function pushRecentSearch(q: string) {
  if (!q.trim()) return;
  const cur = getRecentSearches().filter((x) => x.toLowerCase() !== q.toLowerCase());
  const next = [q, ...cur].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function useDebounce<T>(value: T, delay = 300): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function searchContent(query: string, filter: ContentType | "all" = "all"): MediaItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return mockData.filter((m) => {
    if (filter !== "all" && m.type !== filter) return false;
    return m.title.toLowerCase().includes(q) || m.genre.some((g) => g.toLowerCase().includes(q));
  });
}
