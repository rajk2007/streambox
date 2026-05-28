import { Link } from "@tanstack/react-router";
import type { MediaItem } from "@/data/mockData";
import { MediaImage, RatingBadge } from "./MediaImage";

export function WideCard({ item, progress, showMeta = true }: { item: MediaItem; progress?: number; showMeta?: boolean }) {
  return (
    <Link to="/detail/$id" params={{ id: item.id }} className="block w-64 shrink-0">
      <div className="relative rounded-lg overflow-hidden shadow-card">
        <MediaImage src={item.wideCard || item.backdrop || item.poster} alt={item.title} className="aspect-video w-full" />
        <RatingBadge rating={item.rating} />
        {typeof progress === "number" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
            <div className="h-full" style={{ width: `${Math.round(progress * 100)}%`, background: "#DC586D" }} />
          </div>
        )}
      </div>
      {showMeta && (
        <div className="mt-2 px-0.5">
          <h3 className="text-sm font-medium text-white line-clamp-1">{item.title}</h3>
          <p className="text-xs text-muted-foreground">
            {item.type === "movie" ? item.duration : `${item.episodes} eps · S${item.seasons}`}
          </p>
        </div>
      )}
    </Link>
  );
}
