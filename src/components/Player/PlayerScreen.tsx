import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft, Cast, Play, Pause, Maximize2, Sun, Volume2,
  Subtitles, Settings as SettingsIcon, Gauge, MonitorSmartphone, Headphones, ListVideo, PictureInPicture2, X,
} from "lucide-react";
import { getById } from "@/data/mockData";

type Half = "left" | "right" | null;

export function PlayerScreen({ id }: { id: string }) {
  const navigate = useNavigate();
  const item = getById(id);

  const [playing, setPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0.2);
  const [brightness, setBrightness] = useState(0.7);
  const [volume, setVolume] = useState(0.6);
  const [showBright, setShowBright] = useState(false);
  const [showVol, setShowVol] = useState(false);
  const [seekHint, setSeekHint] = useState<{ side: "left" | "right"; t: number } | null>(null);
  const [speed, setSpeed] = useState(1);
  const [speedBadge, setSpeedBadge] = useState(false);
  const [sheet, setSheet] = useState<null | "audio" | "subs" | "quality" | "speed" | "settings" | "episodes">(null);

  const halfRef = useRef<Half>(null);
  const startY = useRef(0);
  const startX = useRef(0);
  const startVal = useRef(0);
  const moved = useRef(false);
  const lastTap = useRef(0);
  const lastTapX = useRef(0);
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ctrlTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const scheduleHideControls = () => {
    if (ctrlTimer.current) clearTimeout(ctrlTimer.current);
    ctrlTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => { scheduleHideControls(); return () => { if (ctrlTimer.current) clearTimeout(ctrlTimer.current); }; }, []);

  const fadeBright = () => {
    if (brightTimer.current) clearTimeout(brightTimer.current);
    brightTimer.current = setTimeout(() => setShowBright(false), 1500);
  };
  const fadeVol = () => {
    if (volTimer.current) clearTimeout(volTimer.current);
    volTimer.current = setTimeout(() => setShowVol(false), 1500);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = t.clientX - rect.left;
    halfRef.current = x < rect.width / 2 ? "left" : "right";
    startX.current = t.clientX;
    startY.current = t.clientY;
    startVal.current = halfRef.current === "left" ? brightness : volume;
    moved.current = false;
    if (longPress.current) clearTimeout(longPress.current);
    longPress.current = setTimeout(() => {
      if (!moved.current) { setSpeed(2); setSpeedBadge(true); }
    }, 500);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || !halfRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - startX.current;
    const dy = startY.current - t.clientY;
    if (Math.abs(dy) < 8 && Math.abs(dx) < 8) return;
    if (Math.abs(dy) <= Math.abs(dx) * 1.5) return; // need predominantly vertical
    moved.current = true;
    if (longPress.current) { clearTimeout(longPress.current); longPress.current = null; }
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const delta = dy / rect.height; // up positive
    const next = Math.max(0, Math.min(1, startVal.current + delta));
    if (halfRef.current === "left") {
      setBrightness(next); setShowBright(true); fadeBright();
    } else {
      setVolume(next); setShowVol(true); fadeVol();
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (longPress.current) { clearTimeout(longPress.current); longPress.current = null; }
    if (speed === 2) { setSpeed(1); setTimeout(() => setSpeedBadge(false), 300); }
    if (!moved.current) {
      // tap or double-tap
      const now = Date.now();
      const t = e.changedTouches[0];
      const rect = stageRef.current?.getBoundingClientRect();
      const x = rect ? t.clientX - rect.left : 0;
      const side: "left" | "right" = rect && x < rect.width / 2 ? "left" : "right";
      if (now - lastTap.current < 280 && Math.abs(x - lastTapX.current) < 60) {
        // double-tap seek
        setProgress((p) => Math.max(0, Math.min(1, p + (side === "left" ? -0.02 : 0.02))));
        setSeekHint({ side, t: side === "left" ? -10 : 10 });
        setTimeout(() => setSeekHint(null), 600);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
        lastTapX.current = x;
        setShowControls((s) => !s);
        scheduleHideControls();
      }
    }
    halfRef.current = null;
  };

  if (!item) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Not found</div>;
  const isSeries = item.type !== "movie";
  const total = 60 * 45;
  const cur = Math.floor(progress * total);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Smart action: priority - skip intro early, next ep at end, skip credits last min
  let smart: null | "intro" | "next" | "credits" = null;
  if (progress < 0.1) smart = "intro";
  else if (isSeries && progress > 0.95) smart = "next";
  else if (progress > 0.97) smart = "credits";

  return (
    <div className="fixed inset-0 bg-black text-white select-none overflow-hidden" style={{ touchAction: "none" }}>
      <div
        ref={stageRef}
        className="absolute inset-0"
        style={{ filter: `brightness(${0.4 + brightness * 0.8})` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img src={item.backdrop} alt="" className="w-full h-full object-cover opacity-50" />
      </div>

      {/* Brightness overlay (left) */}
      {showBright && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 px-3 py-4 rounded-2xl bg-black/70 backdrop-blur-md animate-fade-in pointer-events-none">
          <Sun size={20} color="#FFBB94" />
          <div className="w-1.5 h-32 bg-white/20 rounded-full overflow-hidden flex flex-col-reverse">
            <div className="w-full" style={{ height: `${brightness * 100}%`, background: "#FFBB94" }} />
          </div>
          <span className="text-xs font-semibold">{Math.round(brightness * 100)}%</span>
        </div>
      )}
      {/* Volume overlay (right) */}
      {showVol && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 px-3 py-4 rounded-2xl bg-black/70 backdrop-blur-md animate-fade-in pointer-events-none">
          <Volume2 size={20} color="#FB9590" />
          <div className="w-1.5 h-32 bg-white/20 rounded-full overflow-hidden flex flex-col-reverse">
            <div className="w-full" style={{ height: `${volume * 100}%`, background: "#FB9590" }} />
          </div>
          <span className="text-xs font-semibold">{Math.round(volume * 100)}%</span>
        </div>
      )}
      {/* Seek hint */}
      {seekHint && (
        <div className={`absolute top-1/2 -translate-y-1/2 ${seekHint.side === "left" ? "left-10" : "right-10"} z-30 px-4 py-2 rounded-full bg-black/70 text-sm font-semibold animate-fade-in pointer-events-none`}>
          {seekHint.t > 0 ? "+" : ""}{seekHint.t}s
        </div>
      )}
      {/* Speed badge */}
      {speedBadge && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full text-sm font-bold pointer-events-none" style={{ background: "#DC586D" }}>
          2× Speed
        </div>
      )}

      {/* Controls overlay */}
      {showControls && (
        <div className="absolute inset-0 z-20 pointer-events-none animate-fade-in">
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
            <button onClick={() => navigate({ to: "/detail/$id", params: { id } })} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold line-clamp-1">{item.title}</p>
              <p className="text-[11px] text-white/60">S1 · E3 · {item.year}</p>
            </div>
            {isSeries && (
              <button onClick={() => setSheet("episodes")} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"><ListVideo size={18} /></button>
            )}
            <button className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"><PictureInPicture2 size={16} /></button>
            <button className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"><Cast size={16} /></button>
          </div>

          {/* Center play */}
          <button onClick={() => setPlaying((p) => !p)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-black/50 backdrop-blur flex items-center justify-center pointer-events-auto">
            {playing ? <Pause size={32} fill="#fff" /> : <Play size={32} fill="#fff" />}
          </button>

          {/* Smart action */}
          {smart && (
            <button className="absolute bottom-32 right-4 px-4 py-2 rounded-full font-semibold text-sm text-white pointer-events-auto shadow-glow" style={{ background: "#DC586D" }}>
              {smart === "intro" ? "Skip Intro" : smart === "next" ? "Next Episode" : "Skip Credits"}
            </button>
          )}

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] text-white/80 w-10 text-right">{fmt(cur)}</span>
              <input type="range" min={0} max={1000} value={Math.round(progress * 1000)} onChange={(e) => setProgress(+e.target.value / 1000)} className="flex-1 accent-[#DC586D]" />
              <span className="text-[11px] text-white/80 w-10">{fmt(total)}</span>
              <button><Maximize2 size={16} /></button>
            </div>
            <div className="flex items-center justify-between gap-1 mt-1">
              {[
                { k: "audio" as const, Icon: Headphones, label: "Audio" },
                { k: "subs" as const, Icon: Subtitles, label: "Subs" },
                { k: "quality" as const, Icon: MonitorSmartphone, label: "HD" },
                { k: "speed" as const, Icon: Gauge, label: `${speed}×` },
                { k: "settings" as const, Icon: SettingsIcon, label: "More" },
              ].map(({ k, Icon, label }) => (
                <button key={k} onClick={() => setSheet(k)} className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-md">
                  <Icon size={18} />
                  <span className="text-[10px] text-white/80">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {sheet && <BottomSheet sheet={sheet} onClose={() => setSheet(null)} item={item} setSpeed={setSpeed} />}
    </div>
  );
}

function BottomSheet({ sheet, onClose, item, setSpeed }: { sheet: string; onClose: () => void; item: ReturnType<typeof getById>; setSpeed: (n: number) => void }) {
  const titles: Record<string, string> = { audio: "Audio", subs: "Subtitles", quality: "Quality", speed: "Playback Speed", settings: "Player Settings", episodes: "Episodes" };
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 animate-fade-in" />
      <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl border-t border-border p-4 max-h-[70vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{titles[sheet]}</h3>
          <button onClick={onClose}><X size={20} color="#888" /></button>
        </div>
        {sheet === "audio" && <Choices options={["Hindi (Default)", "English", "Original", "Japanese"]} />}
        {sheet === "subs" && <Choices options={["Off", "English", "Hindi", "Hinglish", "Japanese"]} />}
        {sheet === "quality" && <Choices options={["Auto", "4K", "1080p", "720p", "480p"]} />}
        {sheet === "speed" && <Choices options={["0.5×", "0.75×", "1×", "1.25×", "1.5×", "2×"]} defaultSelected="1×" onSelect={(o) => setSpeed(parseFloat(o))} />}
        {sheet === "settings" && (
          <div className="space-y-2 text-sm text-white">
            {["Auto-play next", "Skip intro", "Skip credits", "Volume boost", "Stereo mix"].map((s) => (
              <div key={s} className="flex justify-between items-center py-2.5 border-b border-border">
                <span>{s}</span><span className="text-xs text-muted-foreground">On</span>
              </div>
            ))}
          </div>
        )}
        {sheet === "episodes" && item && <EpisodeList item={item} />}
      </div>
    </div>
  );
}

function Choices({ options, defaultSelected, onSelect }: { options: string[]; defaultSelected?: string; onSelect?: (o: string) => void }) {
  const [sel, setSel] = useState(defaultSelected ?? options[0]);
  return (
    <ul className="space-y-1">
      {options.map((o) => (
        <li key={o}>
          <button onClick={() => { setSel(o); onSelect?.(o); }} className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm" style={{ background: sel === o ? "rgba(220,88,109,0.15)" : "transparent", color: sel === o ? "#FB9590" : "#fff" }}>
            <span>{o}</span>
            {sel === o && <span className="w-2 h-2 rounded-full" style={{ background: "#DC586D" }} />}
          </button>
        </li>
      ))}
    </ul>
  );
}

function EpisodeList({ item }: { item: NonNullable<ReturnType<typeof getById>> }) {
  const [season, setSeason] = useState(1);
  const eps = Array.from({ length: Math.min(item.episodes ?? 10, 12) }, (_, i) => i + 1);
  return (
    <>
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {Array.from({ length: item.seasons ?? 1 }, (_, i) => i + 1).map((s) => (
          <button key={s} onClick={() => setSeason(s)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{ background: season === s ? "#DC586D" : "transparent", color: season === s ? "#fff" : "#888", borderColor: season === s ? "#DC586D" : "#2A2A2A" }}>
            S{s}
          </button>
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {eps.map((n) => {
          const current = n === 3;
          return (
            <li key={n} className="rounded-lg overflow-hidden border" style={{ borderColor: current ? "#DC586D" : "#2A2A2A" }}>
              <div className="relative">
                <img src={`https://picsum.photos/seed/${item.id}s${season}e${n}/300/170`} alt="" className="aspect-video w-full object-cover" />
                {n <= 2 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60"><div className="h-full w-full" style={{ background: "#DC586D" }} /></div>}
              </div>
              <div className="p-2"><p className="text-xs text-white font-medium">E{n}</p><p className="text-[10px] text-muted-foreground">24m</p></div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
