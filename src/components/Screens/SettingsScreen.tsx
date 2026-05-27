import { useState } from "react";
import { ChevronRight, RefreshCw } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-xs uppercase tracking-wider text-muted-foreground px-4 mb-2 font-semibold">{title}</h2>
      <div className="bg-surface border-y border-border divide-y divide-border">{children}</div>
    </section>
  );
}
function Row({ label, value, onClick }: { label: string; value?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3.5 text-left">
      <span className="text-sm text-white">{label}</span>
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {value}<ChevronRight size={16} color="#888" />
      </span>
    </button>
  );
}
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm text-white">{label}</span>
      <button onClick={() => onChange(!value)} className="w-11 h-6 rounded-full p-0.5 transition-colors" style={{ background: value ? "#DC586D" : "#2A2A2A" }}>
        <div className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: value ? "translateX(20px)" : "translateX(0)" }} />
      </button>
    </div>
  );
}

export function SettingsScreen() {
  const [lang, setLang] = useState("Auto");
  const [hindiPriority, setHindiPriority] = useState(true);
  const [maturity, setMaturity] = useState(false);
  const [audioLang, setAudioLang] = useState("Hindi");
  const [volBoost, setVolBoost] = useState(true);
  const [subLang, setSubLang] = useState("English");
  const [fontSize, setFontSize] = useState(16);
  const [subStyle, setSubStyle] = useState("Default");
  const [autoplay, setAutoplay] = useState(true);
  const [skipIntro, setSkipIntro] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  const repos = [
    { name: "AnimeWorld", updated: "2h ago" },
    { name: "DesiFlix", updated: "5h ago" },
    { name: "CinemaHub", updated: "1d ago" },
    { name: "BongoStream", updated: "3d ago" },
  ];

  return (
    <div className="pt-6 pb-10 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-5 px-4">Settings</h1>

      <section className="mx-4 p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: "linear-gradient(135deg,#DC586D,#FB9590)" }}>G</div>
        <div className="flex-1">
          <p className="text-white font-semibold">Guest User</p>
          <p className="text-xs text-muted-foreground">Sign in for sync</p>
        </div>
        <button className="px-3 py-1.5 rounded-md text-xs font-medium text-white" style={{ background: "#DC586D" }}>Sign in</button>
      </section>

      <Section title="Preferences">
        <Row label="Language preference" value={lang} onClick={() => setLang(lang === "Auto" ? "Hindi" : lang === "Hindi" ? "English" : lang === "English" ? "Original" : "Auto")} />
        <Toggle label="Hindi priority" value={hindiPriority} onChange={setHindiPriority} />
        <Toggle label="Mature content" value={maturity} onChange={setMaturity} />
      </Section>

      <Section title="Audio">
        <Row label="Default audio language" value={audioLang} onClick={() => setAudioLang(audioLang === "Hindi" ? "English" : "Hindi")} />
        <Toggle label="Volume boost (up to 200%)" value={volBoost} onChange={setVolBoost} />
      </Section>

      <Section title="Subtitles">
        <Row label="Default subtitle language" value={subLang} onClick={() => setSubLang(subLang === "English" ? "Hindi" : "English")} />
        <div className="px-4 py-3.5">
          <div className="flex justify-between mb-2"><span className="text-sm text-white">Font size</span><span className="text-sm text-muted-foreground">{fontSize}px</span></div>
          <input type="range" min={12} max={24} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-[#DC586D]" />
        </div>
        <Row label="Style" value={subStyle} onClick={() => setSubStyle(subStyle === "Default" ? "Outlined" : "Default")} />
      </Section>

      <Section title="App">
        <Toggle label="Auto-play next episode" value={autoplay} onChange={setAutoplay} />
        <Toggle label="Skip intro automatically" value={skipIntro} onChange={setSkipIntro} />
        <Toggle label="Data saver" value={dataSaver} onChange={setDataSaver} />
        <Toggle label="Dark mode" value={true} onChange={() => {}} />
      </Section>

      <Section title="Repository">
        {repos.map((r) => (
          <div key={r.name} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm text-white">{r.name}</p>
              <p className="text-xs text-muted-foreground">Updated {r.updated}</p>
            </div>
            <button className="w-8 h-8 rounded-full bg-card flex items-center justify-center"><RefreshCw size={14} color="#FB9590" /></button>
          </div>
        ))}
      </Section>

      <Section title="About">
        <Row label="App version" value="1.0.0" />
        <Row label="Credits" />
      </Section>
    </div>
  );
}
