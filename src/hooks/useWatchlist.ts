import { useEffect, useState, useCallback } from "react";

const KEY = "streambox_watchlist";
const DEFAULT_IDS = ["onepiece", "dhurandhar", "inception", "bb", "scam1992"];

function read(): string[] {
  if (typeof window === "undefined") return DEFAULT_IDS;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) {
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_IDS));
      return DEFAULT_IDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_IDS;
  } catch {
    return DEFAULT_IDS;
  }
}

const listeners = new Set<() => void>();

export function useWatchlist() {
  const [ids, setIds] = useState<string[]>(DEFAULT_IDS);

  useEffect(() => {
    setIds(read());
    const cb = () => setIds(read());
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);

  const persist = (next: string[]) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    listeners.forEach((l) => l());
  };

  const add = useCallback((id: string) => {
    const next = Array.from(new Set([id, ...read()]));
    persist(next);
  }, []);
  const remove = useCallback((id: string) => {
    persist(read().filter((x) => x !== id));
  }, []);
  const toggle = useCallback((id: string) => {
    const cur = read();
    persist(cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur]);
  }, []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, add, remove, toggle, has };
}
