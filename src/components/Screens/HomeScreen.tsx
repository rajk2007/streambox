import { Hero } from "@/components/Hero";
import { Row } from "@/components/Row";
import { PosterCard } from "@/components/Cards/PosterCard";
import { WideCard } from "@/components/Cards/WideCard";
import { Link } from "@tanstack/react-router";
import {
  mockData, continueWatching, trending, newReleases, topRated,
  popularMovies, popularSeries, animePicks, regionalHits, genres,
} from "@/data/mockData";

export function HomeScreen() {
  const featured = mockData.find((m) => m.id === "dhurandhar") ?? mockData[0];
  return (
    <div className="animate-fade-in">
      <Hero item={featured} />

      <Row title="Continue Watching">
        {continueWatching.map((m) => <WideCard key={m.id} item={m} progress={m.progress} />)}
      </Row>

      <Row title="Trending Now">
        {trending.map((m, i) => <PosterCard key={m.id} item={m} rank={i + 1} />)}
      </Row>

      <Row title="Popular Movies">
        {popularMovies.map((m) => <PosterCard key={m.id} item={m} />)}
      </Row>

      <Row title="Popular Series">
        {popularSeries.map((m) => <WideCard key={m.id} item={m} />)}
      </Row>

      <Row title="Anime Picks">
        {animePicks.map((m) => <WideCard key={m.id} item={m} />)}
      </Row>

      <Row title="New Releases">
        {newReleases.map((m) => <PosterCard key={m.id} item={m} />)}
      </Row>

      <Row title="Top Rated">
        {topRated.map((m) => <PosterCard key={m.id} item={m} />)}
      </Row>

      <section className="mt-7">
        <div className="px-4 mb-3"><h2 className="text-lg font-bold text-white">Browse by Genre</h2></div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1">
          {genres.map((g) => (
            <Link key={g} to="/browse" search={{ cat: g } as never} className="shrink-0 px-4 py-2 rounded-full bg-card text-sm text-white border border-border">{g}</Link>
          ))}
        </div>
      </section>

      <Row title="Regional Hits">
        {regionalHits.map((m) => <PosterCard key={m.id} item={m} />)}
      </Row>

      <div className="h-10" />
    </div>
  );
}
