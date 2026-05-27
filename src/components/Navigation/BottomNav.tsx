import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, LayoutGrid, Heart, Settings } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/browse", label: "Browse", icon: LayoutGrid },
  { to: "/watchlist", label: "List", icon: Heart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <Icon size={22} color={active ? "#DC586D" : "#888888"} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium" style={{ color: active ? "#DC586D" : "#888888" }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
