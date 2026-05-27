import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Play, Plus, Check, Download } from "lucide-react";
import { useState } from "react";
import { getById, mockData, type MediaItem } from "@/data/mockData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Row } from "@/components/Row";
import { PosterCard } from "@/components/Cards/PosterCard";
import { MediaImage } from "@/components/Cards/MediaImage";

export function DetailPage({ id }: { id: string }) {
  const item = getById(id);
  const navigate = useNavigate();
  const { has, toggle } = useWatchlist();
  const [tab, setTab] = useState<"overview" | "episodes">("overview");
  const [season, setSeason] = useState(1);

  if (!item) {
    return (
      <div className="p-6 text-center">
        <p className="text-white">Title not found.</p>
        <button onClick={() => navigate({ to: "/" })} className="mt-3 px-4 py-2 rounded-md text-white" style={{ background: "#DC586D" }}>Home</button>
      </div>
    );
  }

  const inList = has(item.id);
  const moreLikeThis = mockData.filter((m) => m.id !== item.id && m.genre.some((g) => item.genre.includes(g))).slice(0, 10);
  const isSeries = item.type !== "movie";
  const epCount = item.episodes ?? 10;
  const eps = Array.from({ length: Math.min(epCount, 10) }, (_, i) => ({
    n: i + 1,
    title: `Episode ${i + 1}`,
    dur: "24m",
    progress: i < 2 ? 1 : i === 2 ? 0.3 : 0,
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
          {item.genre.map((g) => <span key={g} className="text-[11px] px-2 py-0.5 rounded-full bg-card text-white border border-border">{g}</span>)}
        </div>

        <p className="text-sm text-white/85 mt-3 leading-relaxed">{item.description}</p>

        <div className="flex gap-2 mt-4">
          <Link to="/player/$id" params={{ id: item.id }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white" style={{ background: "#DC586D" }}>
            <Play size={16} fill="#fff" /> Play Now
          </Link>
          <button onClick={() => toggle(item.id)} className="px-3 py-3 rounded-lg bg-card border border-border" aria-label="Watchlist">
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

            <section className="mt-6">
              <h3 className="text-sm font-semibold text-white mb-3">Source</h3>
              <div className="flex gap-2">
                {["Auto", "Manual", "Smart"].map((s, i) => (
                  <button key={s} className="flex-1 py-2 rounded-md text-xs font-medium border"
                    style={{ background: i === 0 ? "rgba(220,88,109,0.15)" : "transparent", borderColor: i === 0 ? "#DC586D" : "#2A2A2A", color: i === 0 ? "#FB9590" : "#888" }}>
                    {s}
                  </button>
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
                    {e.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                        <div className="h-full" style={{ width: `${e.progress * 100}%`, background: "#DC586D" }} />
                      </div>
                    )}
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

      {(!isSeries || tab === "overview") && moreLikeThis.length > 0 && (
        <Row title="More Like This">
          {moreLikeThis.map((m) => <PosterCard key={m.id} item={m as MediaItem} />)}
        </Row>
      )}
    </div>
  );
}
