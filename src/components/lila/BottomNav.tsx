import { Link } from "@tanstack/react-router";
import { Home, Map, Trophy, User } from "lucide-react";

const items = [
  { to: "/lila",          label: "Início",      Icon: Home },
  { to: "/lila/jornada",  label: "Jornada",     Icon: Map },
  { to: "/lila/ranking",  label: "Ranking",     Icon: Trophy },
  { to: "/lila/perfil",   label: "Perfil",      Icon: User },
] as const;

export function LilaBottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 pt-2 pointer-events-none">
      <div className="mx-auto max-w-xl pointer-events-auto rounded-2xl bg-[oklch(0.22_0.04_55)] text-[oklch(0.97_0.02_70)] shadow-2xl shadow-black/30 border border-[oklch(0.86_0.10_70)]/20 flex justify-between px-2 py-2">
        {items.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl text-[10px] font-bold tracking-wide text-[oklch(0.86_0.06_70)]/70 data-[status=active]:text-[oklch(0.86_0.10_70)] data-[status=active]:bg-[oklch(0.86_0.10_70)]/10 transition-colors"
          >
            <Icon className="size-5" strokeWidth={2.2} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
