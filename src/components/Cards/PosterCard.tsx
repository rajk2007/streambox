import { Link } from "@tanstack/react-router";
import type { MediaItem } from "@/data/mockData";
import { MediaImage, RatingBadge } from "./MediaImage";

export function PosterCard({ item, rank, showRating = true }: { item: MediaItem; rank?: number; showRating?: boolean }) {
  return (
    <Link to="/detail/$id" params={{ id: item.id }} className="block w-32 shrink-0 group">
      <div className="relative">
        {rank !== undefined && (
          <div className="absolute -left-2 -top-1 z-20 text-5xl font-black text-white text-shadow-strong leading-none" style={{ WebkitTextStroke: "1px #DC586D" }}>
            {rank}
          </div>
        )}
        <div className="relative rounded-lg overflow-hidden shadow-card">
          <MediaImage src={item.poster} alt={item.title} className="aspect-[2/3] w-full" />
          {showRating && <RatingBadge rating={item.rating} />}
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-white line-clamp-1">{item.title}</h3>
        <p className="text-xs text-muted-foreground">{item.year}</p>
      </div>
    </Link>
  );
}
