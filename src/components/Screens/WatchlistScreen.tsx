import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Play, X, Heart } from "lucide-react";
import { mockData, type ContentType } from "@/data/mockData";
import { MediaImage } from "@/components/Cards/MediaImage";
import { useWatchlist } from "@/hooks/useWatchlist";

const TABS: { key: ContentType | "all"; label: string }[] = [
  { key: "all", label: "All" }, { key: "movie", label: "Movies" },
  { key: "series", label: "Series" }, { key: "anime", label: "Anime" },
];

export function WatchlistScreen() {
  const { ids, remove } = useWatchlist();
  const [tab, setTab] = useState<ContentType | "all">("all");

  const items = useMemo(() => {
    const list = ids.map((id) => mockData.find((m) => m.id === id)).filter(Boolean) as typeof mockData;
    return tab === "all" ? list : list.filter((m) => m.type === tab);
  }, [ids, tab]);

  return (
    <div className="px-4 pt-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-4">My Watchlist</h1>
      <div className="flex gap-2 mb-5">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className="px-4 py-1.5 rounded-full text-sm font-medium border"
              style={{ background: active ? "#DC586D" : "transparent", color: active ? "#fff" : "#888", borderColor: active ? "#DC586D" : "#2A2A2A" }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4"><Heart size={28} color="#DC586D" /></div>
          <p className="text-white font-medium">Your watchlist is empty</p>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Add titles you want to watch later.</p>
          <Link to="/browse" className="px-5 py-2.5 rounded-lg font-medium text-white" style={{ background: "#DC586D" }}>Browse</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((m) => {
            const inProgress = typeof m.progress === "number" && m.progress > 0 && m.progress < 1;
            return (
              <li key={m.id} className="relative flex gap-3 p-2 rounded-lg bg-surface border border-border">
                <Link to="/detail/$id" params={{ id: m.id }} className="shrink-0">
                  <MediaImage src={m.poster} alt={m.title} className="w-20 aspect-[2/3] rounded-md" />
                </Link>
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="text-sm font-semibold text-white line-clamp-1">{m.title}</h3>
                  <p className="text-xs text-muted-foreground">{m.year} · {m.type}</p>
                  {inProgress && (
                    <div className="mt-2 h-1 rounded-full overflow-hidden bg-card">
                      <div className="h-full" style={{ width: `${Math.round(m.progress! * 100)}%`, background: "#DC586D" }} />
                    </div>
                  )}
                  <Link to="/player/$id" params={{ id: m.id }}
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-md text-xs font-semibold text-white"
                    style={{ background: "#DC586D" }}>
                    <Play size={12} fill="#fff" /> {inProgress ? "Continue" : "Play"}
                  </Link>
                </div>
                <button onClick={() => remove(m.id)} aria-label="Remove" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                  <X size={14} color="#fff" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="h-10" />
    </div>
  );
}
