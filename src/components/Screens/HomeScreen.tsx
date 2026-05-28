import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Row } from "@/components/Row";
import { PosterCard } from "@/components/Cards/PosterCard";
import { WideCard } from "@/components/Cards/WideCard";
import { Link } from "@tanstack/react-router";
import { MetadataService, TMDBResult } from "@/services/MetadataService";
import { RepoSetupService } from "@/services/RepoSetupService";
import { StorageService } from "@/services/StorageService";

const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Anime", "Horror", "Thriller"];

export function HomeScreen() {
  const [trending, setTrending] = useState<TMDBResult[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBResult[]>([]);
  const [popularSeries, setPopularSeries] = useState<TMDBResult[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Silent initialization
    RepoSetupService.initializeApp();

    // Fetch TMDB data
    MetadataService.getTrending().then(setTrending);
    MetadataService.getPopularMovies().then(setPopularMovies);
    MetadataService.getPopularSeries().then(setPopularSeries);
    setHistory(StorageService.getWatchHistory());
  }, []);

  const featured = trending[0];

  const mapToMediaItem = (m: TMDBResult) => ({
    id: String(m.id),
    title: m.title || m.name || "",
    poster: MetadataService.getPosterUrl(m.poster_path),
    backdrop: MetadataService.getBackdropUrl(m.backdrop_path),
    rating: Number(m.vote_average.toFixed(1)),
    year: (m.release_date || m.first_air_date || "").split("-")[0],
    description: m.overview,
    genre: [], // Genres need separate mapping if needed
    type: m.media_type || (m.title ? "movie" : "series")
  });

  return (
    <div className="animate-fade-in">
      {featured && <Hero item={mapToMediaItem(featured) as any} />}

      {history.length > 0 && (
        <Row title="Continue Watching">
          {history.map((m) => <WideCard key={m.id} item={m as any} progress={m.progress} />)}
        </Row>
      )}

      <Row title="Trending Now">
        {trending.map((m, i) => <PosterCard key={m.id} item={mapToMediaItem(m) as any} rank={i + 1} />)}
      </Row>

      <Row title="Popular Movies">
        {popularMovies.map((m) => <PosterCard key={m.id} item={mapToMediaItem(m) as any} />)}
      </Row>

      <Row title="Popular Series">
        {popularSeries.map((m) => <WideCard key={m.id} item={mapToMediaItem(m) as any} />)}
      </Row>

      <section className="mt-7">
        <div className="px-4 mb-3"><h2 className="text-lg font-bold text-white">Browse by Genre</h2></div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1">
          {genres.map((g) => (
            <Link key={g} to="/browse" search={{ cat: g } as never} className="shrink-0 px-4 py-2 rounded-full bg-card text-sm text-white border border-border">{g}</Link>
          ))}
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}
