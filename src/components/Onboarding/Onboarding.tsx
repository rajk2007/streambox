import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";

const KEY = "streambox_onboarded";

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<string[]>(["Movies", "Series"]);
  const [lang, setLang] = useState("Auto");
  const [hindiPriority, setHindiPriority] = useState(true);
  const [setupStep, setSetupStep] = useState(0);

  useEffect(() => {
    if (step !== 3) return;
    const steps = [0, 1, 2, 3];
    let i = 0;
    const t = setInterval(() => {
      i++;
      setSetupStep(i);
      if (i >= 3) {
        clearInterval(t);
        setTimeout(() => setStep(4), 500);
      }
    }, 700);
    return () => clearInterval(t);
  }, [step]);

  const finish = () => {
    localStorage.setItem(KEY, "1");
    navigate({ to: "/" });
  };

  const togglePref = (p: string) => setPrefs((cur) => cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]);

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pt-16 pb-8 animate-fade-in">
      <div className="flex gap-1 mb-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= step ? "#DC586D" : "#2A2A2A" }} />
        ))}
      </div>

      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-glow" style={{ background: "linear-gradient(135deg,#DC586D,#FB9590,#FFBB94)" }}>S</div>
          <h1 className="text-4xl font-black text-white mt-6">StreamBox</h1>
          <p className="text-muted-foreground mt-2">Stream Everything</p>
          <button onClick={() => setStep(1)} className="mt-12 w-full py-3.5 rounded-lg font-semibold text-white" style={{ background: "#DC586D" }}>Get Started</button>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-bold text-white">What do you enjoy?</h2>
          <p className="text-sm text-muted-foreground mt-1">Pick a few to personalize your feed.</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Movies", "Series", "Anime", "Cartoons", "Hindi", "English", "Japanese", "Bengali"].map((p) => {
              const on = prefs.includes(p);
              return (
                <button key={p} onClick={() => togglePref(p)} className="px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ background: on ? "#DC586D" : "transparent", color: on ? "#fff" : "#888", borderColor: on ? "#DC586D" : "#2A2A2A" }}>
                  {p}
                </button>
              );
            })}
          </div>
          <button onClick={() => setStep(2)} className="mt-auto w-full py-3.5 rounded-lg font-semibold text-white" style={{ background: "#DC586D" }}>Continue</button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-bold text-white">Preferred language?</h2>
          <p className="text-sm text-muted-foreground mt-1">We'll prioritize this for audio and subtitles.</p>
          <div className="grid grid-cols-2 gap-2 mt-6">
            {["Auto", "Hindi", "English", "Original"].map((l) => (
              <button key={l} onClick={() => setLang(l)} className="py-4 rounded-lg font-medium border"
                style={{ background: lang === l ? "rgba(220,88,109,0.15)" : "transparent", color: lang === l ? "#FB9590" : "#fff", borderColor: lang === l ? "#DC586D" : "#2A2A2A" }}>
                {l}
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
            <span className="text-sm text-white">Hindi priority</span>
            <button onClick={() => setHindiPriority((v) => !v)} className="w-11 h-6 rounded-full p-0.5" style={{ background: hindiPriority ? "#DC586D" : "#2A2A2A" }}>
              <div className="w-5 h-5 rounded-full bg-white" style={{ transform: hindiPriority ? "translateX(20px)" : "translateX(0)", transition: "transform 200ms" }} />
            </button>
          </div>
          <button onClick={() => setStep(3)} className="mt-auto w-full py-3.5 rounded-lg font-semibold text-white" style={{ background: "#DC586D" }}>Continue</button>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full border-4 border-border border-t-primary animate-spin" style={{ borderTopColor: "#DC586D" }} />
          <h2 className="text-xl font-bold text-white mt-6">Setting up your StreamBox…</h2>
          <ul className="mt-6 space-y-2 w-full max-w-xs">
            {["Repos", "Providers", "Metadata"].map((s, i) => (
              <li key={s} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <span className="text-sm text-white">{s}</span>
                {setupStep > i ? <Check size={18} color="#FB9590" /> : <span className="w-4 h-4 rounded-full border-2 border-border" />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(220,88,109,0.15)" }}>
            <Check size={36} color="#DC586D" />
          </div>
          <h2 className="text-3xl font-bold text-white mt-6">You're all set!</h2>
          <p className="text-muted-foreground mt-2">Time to lose yourself in great stories.</p>
          <button onClick={finish} className="mt-12 w-full py-3.5 rounded-lg font-semibold text-white" style={{ background: "#DC586D" }}>Start Streaming</button>
        </div>
      )}
    </div>
  );
}
