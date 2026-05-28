import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { MediaImage } from "@/components/Cards/MediaImage";
import { getRecentSearches, pushRecentSearch, useDebounce } from "@/hooks/useSearch";
import { MetadataService, TMDBResult } from "@/services/MetadataService";

const FILTERS: { key: string | "all"; label: string }[] = [
  { key: "all", label: "All" }, { key: "movie", label: "Movies" },
  { key: "tv", label: "Series" }, { key: "anime", label: "Anime" },
];

export function SearchScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string | "all">("all");
  const [recent, setRecent] = useState<string[]>([]);
  const [results, setResults] = useState<TMDBResult[]>([]);
  const [trending, setTrending] = useState<TMDBResult[]>([]);
  const debounced = useDebounce(query, 300);

  useEffect(() => { 
    setRecent(getRecentSearches());
    MetadataService.getTrending().then(data => setTrending(data.slice(0, 8)));
  }, []);

  useEffect(() => {
    if (debounced.trim().length >= 2) {
      MetadataService.search(debounced).then(setResults);
    } else {
      setResults([]);
    }
  }, [debounced]);

  const filteredResults = useMemo(() => {
    if (filter === "all") return results;
    return results.filter(r => r.media_type === filter);
  }, [results, filter]);

  const isSearching = debounced.trim().length >= 2;

  useEffect(() => {
    if (!isSearching) return;
    const t = setTimeout(() => { pushRecentSearch(debounced); setRecent(getRecentSearches()); }, 1200);
    return () => clearTimeout(t);
  }, [debounced, isSearching]);

  return (
    <div className="px-4 pt-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-4">Search</h1>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" color="#888" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Movies, series, anime…"
          className="w-full bg-card text-white placeholder:text-muted-foreground pl-10 pr-10 py-3 rounded-lg border border-border outline-none focus:border-primary"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={18} color="#888" />
          </button>
        )}
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
              style={{
                background: active ? "#DC586D" : "transparent",
                color: active ? "#fff" : "#888",
                borderColor: active ? "#DC586D" : "#2A2A2A",
              }}>{f.label}</button>
          );
        })}
      </div>

      {!isSearching && (
        <>
          {recent.length > 0 && (
            <section className="mt-6">
              <div className="flex items-center gap-2 mb-3"><Clock size={14} color="#888" /><h3 className="text-sm font-semibold text-white">Recent Searches</h3></div>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button key={r} onClick={() => setQuery(r)} className="px-3 py-1.5 text-xs rounded-full bg-card text-white border border-border">{r}</button>
                ))}
              </div>
            </section>
          )}
          <section className="mt-6">
            <div className="flex items-center gap-2 mb-3"><TrendingUp size={14} color="#FB9590" /><h3 className="text-sm font-semibold text-white">Trending Searches</h3></div>
            <ResultsGrid items={trending} />
          </section>
        </>
      )}

      {isSearching && filteredResults.length > 0 && (
        <section className="mt-6">
          <p className="text-xs text-muted-foreground mb-3">{filteredResults.length} result{filteredResults.length === 1 ? "" : "s"}</p>
          <ResultsGrid items={filteredResults} />
        </section>
      )}

      {isSearching && filteredResults.length === 0 && (
        <section className="mt-8">
          <p className="text-white font-medium">No results for "{debounced}"</p>
          <p className="text-sm text-muted-foreground mt-1">Try Trending instead</p>
          <div className="mt-4"><ResultsGrid items={trending.slice(0, 6)} /></div>
        </section>
      )}
      <div className="h-10" />
    </div>
  );
}

function ResultsGrid({ items }: { items: TMDBResult[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((m) => (
        <Link key={m.id} to="/detail/$id" params={{ id: String(m.id) }} className="block">
          <MediaImage src={MetadataService.getPosterUrl(m.poster_path)} alt={m.title || m.name || ""} className="aspect-[2/3] w-full rounded-lg" />
          <p className="text-xs text-white font-medium mt-1.5 line-clamp-1">{m.title || m.name}</p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{(m.release_date || m.first_air_date || "").split("-")[0]}</span>
            <span className="text-[10px] px-1 py-0.5 rounded uppercase" style={{ background: "#222", color: "#FB9590" }}>{m.media_type}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
