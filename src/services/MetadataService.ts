const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
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

const MOCK_TITLES = [
  'One Piece', 'Naruto Shippuden', 'Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen',
  'Inception', 'Interstellar', 'The Dark Knight', 'Dune', 'Oppenheimer',
  'Breaking Bad', 'Stranger Things', 'The Last of Us', 'Money Heist', 'Wednesday',
  'Sacred Games', 'Mirzapur', 'Scam 1992', 'Panchayat', 'Family Man',
];

function buildMock(kind: 'movie' | 'tv' | 'all'): TMDBResult[] {
  return MOCK_TITLES.map((title, i) => {
    const isTv = kind === 'tv' || (kind === 'all' && i % 2 === 1);
    return {
      id: i + 1,
      title: isTv ? undefined : title,
      name: isTv ? title : undefined,
      poster_path: '',
      backdrop_path: '',
      vote_average: 7 + (i % 30) / 10,
      overview: `${title} — an acclaimed ${isTv ? 'series' : 'film'} you'll love.`,
      release_date: isTv ? undefined : `20${10 + (i % 14)}-01-01`,
      first_air_date: isTv ? `20${10 + (i % 14)}-01-01` : undefined,
      media_type: isTv ? 'tv' : 'movie',
      genre_ids: [],
    };
  });
}

async function safeFetch(url: string, fallback: TMDBResult[]): Promise<TMDBResult[]> {
  if (!TMDB_KEY) return fallback;
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data.results || fallback;
  } catch {
    return fallback;
  }
}

export const MetadataService = {
  search(query: string): Promise<TMDBResult[]> {
    if (query.length < 2) return Promise.resolve([]);
    const fallback = buildMock('all').filter(m =>
      (m.title || m.name || '').toLowerCase().includes(query.toLowerCase())
    );
    return safeFetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`, fallback);
  },

  getTrending(type: 'movie' | 'tv' | 'all' = 'all'): Promise<TMDBResult[]> {
    return safeFetch(`${TMDB_BASE}/trending/${type}/week?api_key=${TMDB_KEY}`, buildMock(type));
  },

  getPopularMovies(): Promise<TMDBResult[]> {
    return safeFetch(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}`, buildMock('movie'));
  },

  getPopularSeries(): Promise<TMDBResult[]> {
    return safeFetch(`${TMDB_BASE}/tv/popular?api_key=${TMDB_KEY}`, buildMock('tv'));
  },

  getPosterUrl(path: string): string {
    if (!path) return `https://picsum.photos/seed/${Math.random().toString(36).slice(2, 8)}/300/450`;
    return `${IMG_BASE}${path}`;
  },

  getBackdropUrl(path: string): string {
    if (!path) return `https://picsum.photos/seed/${Math.random().toString(36).slice(2, 8)}/800/450`;
    return `https://image.tmdb.org/t/p/w1280${path}`;
  },
};
