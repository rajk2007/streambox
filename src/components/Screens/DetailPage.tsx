import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Play, Plus, Check, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Row } from "@/components/Row";
import { PosterCard } from "@/components/Cards/PosterCard";
import { MediaImage } from "@/components/Cards/MediaImage";
import { StorageService } from "@/services/StorageService";
import { MetadataService, TMDBResult } from "@/services/MetadataService";

export function DetailPage({ id }: { id: string }) {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { has, toggle } = useWatchlist();
  const [tab, setTab] = useState<"overview" | "episodes">("overview");
  const [season, setSeason] = useState(1);

  useEffect(() => {
    // In a real app, we'd fetch by ID from TMDB. 
    // For now, we'll try to find it in trending/popular or just use a placeholder if not found.
    const fetchItem = async () => {
      setLoading(true);
      const trending = await MetadataService.getTrending();
      const found = trending.find(t => String(t.id) === id);
      
      if (found) {
        const mapped = {
          id: String(found.id),
          title: found.title || found.name || "",
          poster: MetadataService.getPosterUrl(found.poster_path),
          backdrop: MetadataService.getBackdropUrl(found.backdrop_path),
          rating: Number(found.vote_average.toFixed(1)),
          year: (found.release_date || found.first_air_date || "").split("-")[0],
          description: found.overview,
          genre: ["Action", "Adventure"], // Placeholder
          type: found.media_type || (found.title ? "movie" : "series"),
          duration: "2h 15m",
          seasons: 1
        };
        setItem(mapped);
        
        // Add to history
        StorageService.addToHistory({
          id: mapped.id,
          title: mapped.title,
          poster: mapped.poster,
          progress: 0,
          timestamp: Date.now(),
          type: mapped.type as any
        });
      }
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-white">Loading...</div>;

  if (!item) {
    return (
      <div className="p-6 text-center">
        <p className="text-white">Title not found.</p>
        <button onClick={() => navigate({ to: "/" })} className="mt-3 px-4 py-2 rounded-md text-white" style={{ background: "#DC586D" }}>Home</button>
      </div>
    );
  }

  const inList = has(item.id);
  const isSeries = item.type !== "movie";
  const eps = Array.from({ length: 10 }, (_, i) => ({
    n: i + 1,
    title: `Episode ${i + 1}`,
    dur: "24m",
    progress: 0,
  }));

  return (
    <div className="animate-fade-in pb-10">
      <div className="relative h-72">
        <img src={item.backdrop} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <button onClick={() => navigate({ to: "/" })} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
          <ArrowLeft size={18} color="#fff" />
        </button>
      </div>

      <div className="px-4 -mt-20 relative">
        <div className="flex gap-4">
          <div className="w-28 shrink-0 rounded-lg overflow-hidden shadow-card">
            <MediaImage src={item.poster} alt={item.title} className="aspect-[2/3] w-full" />
          </div>
          <div className="flex-1 pt-16">
            <h1 className="text-xl font-bold text-white">{item.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">{item.year} · {item.rating}★ · {item.type === "movie" ? item.duration : `${item.seasons} seasons`}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {item.genre.map((g: string) => <span key={g} className="text-[11px] px-2 py-0.5 rounded-full bg-card text-white border border-border">{g}</span>)}
        </div>

        <p className="text-sm text-white/85 mt-3 leading-relaxed">{item.description}</p>

        <div className="flex gap-2 mt-4">
          <Link to="/player/$id" params={{ id: item.id }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white" style={{ background: "#DC586D" }}>
            <Play size={16} fill="#fff" /> Play Now
          </Link>
          <button onClick={() => {
            toggle(item.id);
            if (!inList) StorageService.addToWatchlist(item.id);
            else StorageService.removeFromWatchlist(item.id);
          }} className="px-3 py-3 rounded-lg bg-card border border-border" aria-label="Watchlist">
            {inList ? <Check size={18} color="#FB9590" /> : <Plus size={18} color="#fff" />}
          </button>
          <button className="px-3 py-3 rounded-lg bg-card border border-border" aria-label="Download"><Download size={18} color="#fff" /></button>
        </div>

        {isSeries && (
          <div className="flex gap-2 mt-6 border-b border-border">
            {(["overview", "episodes"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className="pb-2 px-1 text-sm font-semibold capitalize transition-colors"
                style={{ color: tab === t ? "#fff" : "#888", borderBottom: tab === t ? "2px solid #DC586D" : "2px solid transparent" }}>
                {t}
              </button>
            ))}
          </div>
        )}

        {(!isSeries || tab === "overview") && (
          <>
            <section className="mt-6">
              <h3 className="text-sm font-semibold text-white mb-3">Cast</h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {["Aarav K", "Mira S", "Devansh R", "Priya N", "Karan M"].map((name, i) => (
                  <div key={name} className="shrink-0 w-16 text-center">
                    <div className="w-16 h-16 rounded-full" style={{ background: `linear-gradient(135deg,#DC586D,#FB9590,#FFBB94)`, filter: `hue-rotate(${i * 35}deg)` }} />
                    <p className="text-[11px] text-white mt-1.5 line-clamp-2">{name}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {isSeries && tab === "episodes" && (
          <section className="mt-5">
            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
              {Array.from({ length: item.seasons ?? 1 }, (_, i) => i + 1).map((s) => (
                <button key={s} onClick={() => setSeason(s)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{ background: season === s ? "#DC586D" : "transparent", color: season === s ? "#fff" : "#888", borderColor: season === s ? "#DC586D" : "#2A2A2A" }}>
                  Season {s}
                </button>
              ))}
            </div>
            <ul className="space-y-2">
              {eps.map((e) => (
                <li key={e.n} className="flex gap-3 p-2 rounded-lg bg-surface border border-border">
                  <div className="relative w-28 shrink-0">
                    <MediaImage src={`https://picsum.photos/seed/${item.id}e${e.n}/300/170`} alt={e.title} className="aspect-video rounded-md" />
                  </div>
                  <div className="flex-1 py-1">
                    <p className="text-sm text-white font-medium">{e.n}. {e.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{e.dur}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="h-10" />
    </div>
  );
}
