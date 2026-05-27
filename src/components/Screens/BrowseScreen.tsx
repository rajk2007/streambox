import { useMemo, useState, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { mockData } from "@/data/mockData";
import { PosterCard } from "@/components/Cards/PosterCard";

const CATEGORIES = [
  { key: "Movies", filter: (m: typeof mockData[number]) => m.type === "movie" },
  { key: "Series", filter: (m: typeof mockData[number]) => m.type === "series" },
  { key: "Anime", filter: (m: typeof mockData[number]) => m.type === "anime" },
  { key: "Cartoons", filter: (m: typeof mockData[number]) => m.type === "anime" && m.rating < 8.5 },
  { key: "Hindi", filter: (m: typeof mockData[number]) => m.language === "hindi" },
  { key: "Bengali", filter: (m: typeof mockData[number]) => m.language === "bengali" },
  { key: "Japanese", filter: (m: typeof mockData[number]) => m.language === "japanese" },
  { key: "Trending", filter: (m: typeof mockData[number]) => !!m.isTrending },
  { key: "Top Rated", filter: (m: typeof mockData[number]) => !!m.isTopRated },
  { key: "New Releases", filter: (m: typeof mockData[number]) => !!m.isNew },
] as const;

export function BrowseScreen() {
  const search = useSearch({ strict: false }) as { cat?: string };
  const [active, setActive] = useState<string>(CATEGORIES[0].key);

  useEffect(() => {
    if (search.cat) {
      const found = CATEGORIES.find((c) => c.key.toLowerCase() === search.cat!.toLowerCase());
      if (found) setActive(found.key);
    }
  }, [search.cat]);

  const items = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.key === active)!;
    return mockData.filter(cat.filter);
  }, [active]);

  return (
    <div className="flex animate-fade-in pt-4" style={{ minHeight: "calc(100vh - 5rem)" }}>
      <aside className="w-28 shrink-0 border-r border-border">
        {CATEGORIES.map((c) => {
          const isActive = c.key === active;
          const count = mockData.filter(c.filter).length;
          return (
            <button key={c.key} onClick={() => setActive(c.key)}
              className="w-full text-left px-3 py-3.5 transition-colors"
              style={{
                background: isActive ? "rgba(220,88,109,0.12)" : "transparent",
                borderLeft: isActive ? "3px solid #DC586D" : "3px solid transparent",
              }}>
              <div className="text-[13px] font-medium" style={{ color: isActive ? "#fff" : "#888" }}>{c.key}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{count} titles</div>
            </button>
          );
        })}
      </aside>
      <div className="flex-1 px-3 py-4">
        <h2 className="text-xl font-bold text-white mb-3 px-1">{active}</h2>
        <div className="grid grid-cols-2 gap-3">
          {items.map((m) => <PosterCard key={m.id} item={m} />)}
        </div>
      </div>
    </div>
  );
}
