const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids: number[];
}

export const MetadataService = {
  async search(query: string): Promise<TMDBResult[]> {
    if (!TMDB_KEY || query.length < 2) return [];
    try {
      const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('TMDB Failed');
      const data = await res.json();
      return data.results || [];
    } catch { return []; }
  },

  async getTrending(type: 'movie'|'tv'|'all' = 'all'): Promise<TMDBResult[]> {
    if (!TMDB_KEY) return [];
    try {
      const res = await fetch(`${TMDB_BASE}/trending/${type}/week?api_key=${TMDB_KEY}`);
      if (!res.ok) throw new Error('TMDB Failed');
      const data = await res.json();
      return data.results || [];
    } catch { return []; }
  },

  async getPopularMovies(): Promise<TMDBResult[]> {
    if (!TMDB_KEY) return [];
    try {
      const res = await fetch(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}`);
      if (!res.ok) throw new Error('TMDB Failed');
      const data = await res.json();
      return data.results || [];
    } catch { return []; }
  },

  async getPopularSeries(): Promise<TMDBResult[]> {
    if (!TMDB_KEY) return [];
    try {
      const res = await fetch(`${TMDB_BASE}/tv/popular?api_key=${TMDB_KEY}`);
      if (!res.ok) throw new Error('TMDB Failed');
      const data = await res.json();
      return data.results || [];
    } catch { return []; }
  },

  getPosterUrl(path: string): string {
    if (!path) return 'https://picsum.photos/seed/fallback/300/450';
    return `${IMG_BASE}${path}`;
  },

  getBackdropUrl(path: string): string {
    if (!path) return 'https://picsum.photos/seed/fallbackb/800/450';
    return `https://image.tmdb.org/t/p/w1280${path}`;
  }
};
