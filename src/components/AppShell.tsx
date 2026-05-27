import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, X } from "lucide-react";
import { BottomNav } from "./Navigation/BottomNav";

const HIDE_ON = ["/player", "/onboarding"];
const ONBOARD_KEY = "streambox_onboarded";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const hideNav = HIDE_ON.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(ONBOARD_KEY) && !pathname.startsWith("/onboarding")) {
      navigate({ to: "/onboarding" });
    }
  }, [pathname, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {pathname === "/" && <NotificationBell />}
      <div className={hideNav ? "" : "pb-20"}>{children}</div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

const initialNotifs = [
  { id: 1, title: "Repo Updated", body: "AnimeWorld repo synced — 124 new titles." },
  { id: 2, title: "New Episode", body: "One Piece E1080 is available." },
  { id: 3, title: "Recommended", body: "Because you watched Mirzapur — try Scam 1992." },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifs);
  return (
    <>
      <button
        aria-label="Notifications"
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"
      >
        <Bell size={18} color="#fff" />
        {items.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "#DC586D" }} />
        )}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 animate-fade-in" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute top-0 left-0 right-0 bg-surface border-b border-border p-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Repo Updates</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setItems([])} className="text-xs text-muted-foreground">Mark all read</button>
                <button onClick={() => setOpen(false)}><X size={18} color="#888" /></button>
              </div>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">You're all caught up.</p>
            ) : (
              <ul className="space-y-2">
                {items.slice(0, 3).map((n) => (
                  <li key={n.id} className="p-3 rounded-lg bg-card">
                    <p className="text-sm text-white font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export { Link };
