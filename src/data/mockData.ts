// Compatibility file to fix build errors after deleting original mockData.ts
export type ContentType = "movie" | "series" | "anime";

export interface MediaItem {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  year: string;
  description: string;
  genre: string[];
  type: ContentType;
  duration?: string;
  seasons?: number;
  episodes?: number;
  wideCard?: string;
  progress?: number;
}

export const mockData: MediaItem[] = [];
export const continueWatching: any[] = [];
export const trending: any[] = [];
export const newReleases: any[] = [];
export const topRated: any[] = [];
export const popularMovies: any[] = [];
export const popularSeries: any[] = [];
export const animePicks: any[] = [];
export const regionalHits: any[] = [];
export const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Anime", "Horror", "Thriller"];

export const getById = (id: string) => mockData.find(m => m.id === id);
export const searchContent = (query: string, filter: string) => [];
