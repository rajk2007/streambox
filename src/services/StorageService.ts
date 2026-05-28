export interface WatchEntry {
  id: string;
  title: string;
  poster: string;
  progress: number;
  timestamp: number;
  type: 'movie' | 'series' | 'anime';
}

export const StorageService = {
  get<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(`streambox_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set(key: string, value: unknown): void {
    try { localStorage.setItem(`streambox_${key}`, JSON.stringify(value)); } catch {}
  },
  getWatchHistory(): WatchEntry[] { return this.get<WatchEntry[]>('watch_history', []); },
  addToHistory(entry: WatchEntry): void {
    const history = this.getWatchHistory();
    const filtered = history.filter(h => h.id !== entry.id);
    this.set('watch_history', [entry, ...filtered].slice(0, 50));
  },
  getWatchlist(): string[] { return this.get<string[]>('watchlist', []); },
  addToWatchlist(id: string): void {
    const list = this.getWatchlist();
    if (!list.includes(id)) this.set('watchlist', [...list, id]);
  },
  removeFromWatchlist(id: string): void {
    this.set('watchlist', this.getWatchlist().filter(i => i !== id));
  }
};
