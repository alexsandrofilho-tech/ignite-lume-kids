import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Brain, Puzzle, Trophy, Sparkles, ChevronRight } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import risoImg from "@/assets/char-risoleta.png";

export const Route = createFileRoute("/risoleta")({
  head: () => ({
    meta: [
      { title: "Risoleta — Discipulado & Aprendizado Bíblico | IGNIÇÃO" },
      { name: "description", content: "Escola Bíblica online com Risoleta: lições interativas, quizzes, jogos bíblicos e progressão de aprendizado." },
      { property: "og:title", content: "Risoleta — Aprendizado Bíblico" },
      { property: "og:description", content: "Escola bíblica interativa para crianças." },
    ],
  }),
  component: RisoletaPage,
});

function RisoletaPage() {
  return (
    <CharWorld
      name="RISOLETA"
      tagline="Discipulado · Aprender"
      ink="text-[oklch(0.25_0.06_310)]"
      surface="bg-gradient-to-br from-[oklch(0.93_0.12_92)] via-[oklch(0.85_0.12_320)] to-[oklch(0.70_0.16_310)]"
      backdrop={
        <>
          <div className="absolute -top-32 -left-20 size-[28rem] rounded-full bg-[oklch(0.92_0.18_92)] opacity-50 blur-3xl" />
          <div className="absolute top-60 -right-32 size-96 rounded-full bg-[oklch(0.75_0.18_310)] opacity-50 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[oklch(0.55_0.18_310)] to-transparent opacity-60" />
        </>
      }
    >
      {/* Adventure hero */}
      <section className="px-6 mt-2">
        <div className="relative rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/60 p-6 overflow-hidden">
          <img
            src={risoImg}
            alt="Risoleta"
            width={1024}
            height={1024}
            className="w-40 mx-auto drop-shadow-xl animate-float-soft"
          />
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[oklch(0.45_0.18_310)] mt-2">
            Aventura Bíblica
          </p>
          <h2 className="text-center font-display font-bold text-3xl mt-1">Fase 4 · O Mar Vermelho</h2>
          <div className="mt-4 max-w-xs mx-auto">
            <div className="h-3 rounded-full bg-white/60 overflow-hidden">
              <div className="h-full w-[75%] bg-gradient-to-r from-[oklch(0.85_0.17_92)] to-[oklch(0.65_0.20_310)] rounded-full" />
            </div>
            <p className="text-center text-[10px] font-bold mt-2 text-[oklch(0.40_0.10_310)]">75% concluído · 12 colecionáveis</p>
          </div>
          <button className="block mx-auto mt-5 bg-[oklch(0.30_0.10_310)] text-white font-display font-bold px-8 py-3 rounded-2xl shadow-xl active:scale-95 hover:scale-105 transition-transform">
            CONTINUAR LIÇÃO
          </button>
        </div>
      </section>

      {/* Lesson grid */}
      <section className="px-6 mt-6 grid grid-cols-2 gap-3">
        {[
          { Icon: BookOpen, t: "Lição de Hoje", d: "Davi e Golias", color: "bg-[oklch(0.92_0.18_92)] text-[oklch(0.30_0.10_310)]" },
          { Icon: Brain, t: "Quiz", d: "10 perguntas · +50 XP", color: "bg-[oklch(0.75_0.18_310)] text-white" },
          { Icon: Puzzle, t: "Jogo Bíblico", d: "Caça-versículos", color: "bg-[oklch(0.85_0.16_300)] text-[oklch(0.25_0.08_310)]" },
          { Icon: Trophy, t: "Conquistas", d: "12 medalhas", color: "bg-[oklch(0.95_0.14_92)] text-[oklch(0.30_0.10_310)]" },
        ].map(({ Icon, t, d, color }) => (
          <button key={t} className={`rounded-3xl ${color} p-4 text-left border border-white/40 hover:scale-[1.02] transition-transform shadow-lg shadow-[oklch(0.30_0.10_310)]/15`}>
            <div className="size-10 rounded-xl bg-white/60 grid place-items-center mb-3">
              <Icon className="size-5" strokeWidth={2.5} />
            </div>
            <p className="font-display font-bold text-base leading-tight">{t}</p>
            <p className="text-xs opacity-80">{d}</p>
          </button>
        ))}
      </section>

      {/* Learning path */}
      <section className="px-6 mt-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.30_0.10_310)] mb-3">Trilha de Discipulado</p>
        <div className="rounded-3xl bg-white/50 backdrop-blur border border-white/70 p-4">
          {[
            { t: "Quem é Jesus?", s: "Concluído", done: true },
            { t: "Criação do mundo", s: "Concluído", done: true },
            { t: "O Mar Vermelho", s: "Em andamento", current: true },
            { t: "O menino Samuel", s: "Bloqueado" },
          ].map((step, i) => (
            <div key={step.t} className="flex items-center gap-3 py-2.5 border-b border-[oklch(0.30_0.10_310)]/10 last:border-0">
              <div className={`size-9 rounded-full grid place-items-center font-display font-bold text-sm ${
                step.done
                  ? "bg-[oklch(0.65_0.18_150)] text-white"
                  : step.current
                  ? "bg-[oklch(0.85_0.17_92)] text-[oklch(0.30_0.10_310)] ring-4 ring-[oklch(0.85_0.17_92)]/30"
                  : "bg-white/70 text-[oklch(0.30_0.10_310)]/40"
              }`}>
                {step.done ? "✓" : i + 1}
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-sm">{step.t}</p>
                <p className="text-[11px] opacity-70">{step.s}</p>
              </div>
              {step.current && <Sparkles className="size-4 text-[oklch(0.55_0.20_92)]" />}
              <ChevronRight className="size-4 opacity-40" />
            </div>
          ))}
        </div>
      </section>
    </CharWorld>
  );
}