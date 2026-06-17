import { createFileRoute, Link } from "@tanstack/react-router";
import { AppBottomNav } from "@/components/AppBottomNav";
import { ChevronRight, Star, Lock, Check } from "lucide-react";

export const Route = createFileRoute("/jornada")({
  head: () => ({
    meta: [
      { title: "Jornada — IGNIÇÃO" },
      { name: "description", content: "Acompanhe a jornada da Família Silva pelos 5 mundos da IGNIÇÃO." },
      { property: "og:title", content: "Jornada — IGNIÇÃO" },
      { property: "og:description", content: "Mapa de progresso, missões e conquistas das crianças." },
    ],
  }),
  component: JornadaPage,
});

type Status = "done" | "current" | "locked";

const stages: { id: string; to: string; world: string; title: string; xp: number; status: Status; color: string }[] = [
  { id: "u", to: "/unny", world: "UNNY", title: "Boas-vindas à Família", xp: 100, status: "done", color: "bg-unny text-unny-ink" },
  { id: "l", to: "/lume", world: "LUME", title: "Uma Conversa com Jesus", xp: 80, status: "done", color: "bg-lume text-white" },
  { id: "r", to: "/risoleta", world: "RISOLETA", title: "O Mar Vermelho", xp: 50, status: "current", color: "bg-riso-lilac text-white" },
  { id: "lo", to: "/louvaldo", world: "LOUVALDO", title: "Cante com a Banda", xp: 60, status: "locked", color: "bg-lou text-white" },
  { id: "li", to: "/lila", world: "LILA", title: "Missão da Bondade", xp: 70, status: "locked", color: "bg-lila text-white" },
];

function JornadaPage() {
  const total = stages.length;
  const done = stages.filter((s) => s.status === "done").length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="min-h-dvh text-stone-800 pb-32">
      <div className="mx-auto max-w-xl px-6 pt-8">
        <header className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ignition mb-1">IGNIÇÃO</p>
          <h1 className="font-display font-extrabold text-3xl leading-tight text-stone-900">Sua Jornada</h1>
          <p className="text-sm text-stone-500 mt-1">Cada mundo, uma nova aventura de fé.</p>
        </header>

        <section
          aria-label="Progresso geral"
          className="rounded-3xl bg-gradient-to-br from-ignition to-[oklch(0.78_0.18_60)] text-white p-6 shadow-xl shadow-orange-200/60 mb-8"
        >
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Progresso</p>
              <p className="font-display font-extrabold text-4xl">{pct}%</p>
            </div>
            <p className="text-sm font-bold opacity-90">{done}/{total} mundos</p>
          </div>
          <div className="h-2 bg-white/25 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </section>

        <h2 className="font-display font-extrabold text-lg text-stone-900 mb-3">Mapa de mundos</h2>
        <ol className="space-y-3">
          {stages.map((s, i) => {
            const isLocked = s.status === "locked";
            const Wrapper: typeof Link | "div" = isLocked ? "div" : Link;
            const wrapperProps = isLocked
              ? { "aria-disabled": true, className: "opacity-50 cursor-not-allowed" }
              : ({ to: s.to, className: "hover:scale-[1.01] transition-transform" } as const);
            return (
              <li key={s.id}>
                {/* @ts-expect-error union of Link/div props */}
                <Wrapper {...wrapperProps} className={`block bg-white border border-stone-100 rounded-3xl p-4 shadow-sm ${isLocked ? "opacity-60" : "hover:shadow-lg"} transition-all`}>
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl grid place-items-center font-display font-black ${s.color}`} aria-hidden="true">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">{s.world}</p>
                      <p className="font-bold text-stone-900 truncate">{s.title}</p>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <Star className="size-3 text-ignition" aria-hidden="true" /> +{s.xp} XP
                      </p>
                    </div>
                    <span aria-label={s.status === "done" ? "Concluído" : s.status === "current" ? "Em andamento" : "Bloqueado"}>
                      {s.status === "done" && <Check className="size-5 text-emerald-500" />}
                      {s.status === "current" && <ChevronRight className="size-5 text-ignition" />}
                      {s.status === "locked" && <Lock className="size-5 text-stone-300" />}
                    </span>
                  </div>
                </Wrapper>
              </li>
            );
          })}
        </ol>
      </div>
      <AppBottomNav />
    </div>
  );
}