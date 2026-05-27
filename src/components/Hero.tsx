import { Link } from "@tanstack/react-router";
import { Play, Plus, Check } from "lucide-react";
import type { MediaItem } from "@/data/mockData";
import { useWatchlist } from "@/hooks/useWatchlist";

export function Hero({ item }: { item: MediaItem }) {
  const { has, toggle } = useWatchlist();
  const inList = has(item.id);
  return (
    <div className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
      <img src={item.backdrop} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: "#DC586D", color: "#fff" }}>FEATURED</span>
          <span className="text-xs text-white/80">{item.year} · {item.rating} ★</span>
        </div>
        <h1 className="text-4xl font-black text-white leading-tight text-shadow-strong">{item.title}</h1>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {item.genre.slice(0, 3).map((g) => (
            <span key={g} className="text-[11px] px-2.5 py-1 rounded-full bg-white/15 text-white backdrop-blur-sm">{g}</span>
          ))}
        </div>
        <p className="text-sm text-white/80 mt-3 line-clamp-2">{item.description}</p>
        <div className="flex gap-2 mt-5">
          <Link to="/player/$id" params={{ id: item.id }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white" style={{ background: "#DC586D" }}>
            <Play size={18} fill="#fff" /> Play Now
          </Link>
          <button onClick={() => toggle(item.id)} className="px-4 py-3 rounded-lg bg-white/15 text-white backdrop-blur-sm flex items-center gap-2 font-medium">
            {inList ? <Check size={18} /> : <Plus size={18} />}
            <span className="text-sm">{inList ? "Added" : "Watchlist"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
