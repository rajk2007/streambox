import { useState } from "react";

export function MediaImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-card ${className ?? ""}`}>
      {!err ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErr(true)}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-card p-2">
          <span className="text-xs text-muted-foreground text-center line-clamp-3">{alt}</span>
        </div>
      )}
    </div>
  );
}

export function RatingBadge({ rating }: { rating: number }) {
  return (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="#FB9590"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      <span className="text-[10px] font-semibold" style={{ color: "#FB9590" }}>{rating.toFixed(1)}</span>
    </div>
  );
}
