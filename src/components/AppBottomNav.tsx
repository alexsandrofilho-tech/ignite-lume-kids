import { Link } from "@tanstack/react-router";
import { Home, Map as MapIcon, Play, Heart } from "lucide-react";

const items = [
  { to: "/", label: "Início", Icon: Home },
  { to: "/jornada", label: "Jornada", Icon: MapIcon },
  { to: "/play", label: "Play", Icon: Play },
  { to: "/familia", label: "Família", Icon: Heart },
] as const;

export function AppBottomNav() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-6 left-6 right-6 max-w-[calc(36rem-3rem)] mx-auto bg-stone-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl flex items-center justify-around p-2 border border-white/10 z-50"
    >
      {items.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: true }}
          aria-label={label}
          className="group flex flex-col items-center gap-1 flex-1 py-1 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ignition focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 min-h-11"
        >
          {({ isActive }) => (
            <>
              <span
                className={
                  isActive
                    ? "p-2 bg-ignition rounded-2xl text-white shadow-lg shadow-orange-900/40"
                    : "p-2 text-white opacity-60 group-hover:opacity-100 transition-opacity"
                }
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span
                className={`font-extrabold text-[9px] tracking-widest uppercase ${
                  isActive ? "text-ignition" : "text-white/70 group-hover:text-white"
                }`}
              >
                {label}
              </span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}