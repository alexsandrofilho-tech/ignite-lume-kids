import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, ChevronRight, Sparkles, Trophy, Map as MapIcon } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import { LilaBottomNav } from "@/components/lila/BottomNav";
import lilaImg from "@/assets/char-lila.png";
import { useProgress } from "@/lib/progress";
import {
  WEEKLY_MISSIONS, CATEGORY_META, useMissions, todayISO, DAYS_PT_FULL,
  levelInfo,
} from "@/lib/missions";

export const Route = createFileRoute("/lila")({
  head: () => ({
    meta: [
      { title: "Lila — Missões & Bondade | IGNIÇÃO" },
      { name: "description", content: "Missões diárias, oração, leitura bíblica, quiz e ranking com Lila." },
    ],
  }),
  component: LilaHome,
});

function LilaHome() {
  const { progress, bumpStreak } = useProgress();
  const { isDone } = useMissions();
  const weekday = new Date().getDay();
  const date = todayISO();
  const missions = WEEKLY_MISSIONS[weekday];
  const featured = missions.find((m) => !isDone(date, m.id)) || missions[0];
  const meta = CATEGORY_META[featured.category];
  const streak = progress.streaks["lila:daily"]?.count || 0;
  const lvl = levelInfo(progress.xp);
  const doneCount = missions.filter((m) => isDone(date, m.id)).length;

  return (
    <CharWorld
      name="LILA"
      tagline="Missões · Bondade"
      ink="text-[oklch(0.22_0.04_55)]"
      surface="bg-gradient-to-b from-[oklch(0.93_0.04_70)] via-[oklch(0.86_0.06_60)] to-[oklch(0.72_0.08_55)]"
      backdrop={
        <>
          <div className="absolute -top-32 -left-20 size-[28rem] rounded-full bg-[oklch(0.78_0.10_55)] opacity-40 blur-3xl" />
          <div className="absolute top-40 -right-32 size-96 rounded-full bg-[oklch(0.88_0.08_90)] opacity-40 blur-3xl" />
        </>
      }
    >
      {/* Greeting */}
      <section className="px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[oklch(0.45_0.08_55)]">
          {DAYS_PT_FULL[weekday]}
        </p>
        <h2 className="font-display font-bold text-3xl leading-tight mt-1">
          Oi! Vamos espalhar bondade hoje?
        </h2>
      </section>

      {/* Streak + Level */}
      <section className="px-6 mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-[oklch(0.22_0.04_55)] text-[oklch(0.97_0.02_70)] p-4">
          <div className="flex items-center gap-2 text-[oklch(0.86_0.10_70)]">
            <Flame className="size-5 animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Sequência</p>
          </div>
          <p className="font-display font-bold text-3xl mt-1">{streak}<span className="text-base font-bold opacity-70 ml-1">dias</span></p>
        </div>
        <div className="rounded-3xl bg-white border border-[oklch(0.45_0.08_55)]/10 p-4">
          <div className="flex items-center gap-2 text-[oklch(0.45_0.08_55)]">
            <Sparkles className="size-5" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Nível</p>
          </div>
          <p className="font-display font-bold text-xl mt-1 leading-tight">{lvl.name}</p>
          <div className="h-1.5 rounded-full bg-[oklch(0.86_0.06_60)] mt-2 overflow-hidden">
            <div className="h-full bg-[oklch(0.55_0.10_55)]" style={{ width: `${lvl.progress}%` }} />
          </div>
          <p className="text-[10px] mt-1 text-[oklch(0.45_0.08_55)]/70 font-bold">{progress.xp} XP</p>
        </div>
      </section>

      {/* Featured mission */}
      <section className="px-6 mt-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.08_55)] mb-2">Missão em destaque</p>
        <Link
          to="/lila/jornada"
          className="block rounded-[2rem] bg-[oklch(0.45_0.08_55)] text-[oklch(0.97_0.02_70)] p-5 border-l-8 border-[oklch(0.86_0.10_70)] active:scale-[0.99] transition-transform"
        >
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-white/15 grid place-items-center text-2xl">{meta.emoji}</div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.86_0.10_70)]">
                {meta.label} · +{meta.xp} XP
              </p>
              <p className="font-display font-bold text-lg leading-tight mt-1">{featured.title}</p>
              <p className="text-xs opacity-80 mt-1">{featured.detail}</p>
            </div>
            <ChevronRight className="size-5 mt-3" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full bg-[oklch(0.86_0.10_70)]" style={{ width: `${(doneCount / 5) * 100}%` }} />
            </div>
            <span className="text-xs font-bold">{doneCount}/5 hoje</span>
          </div>
        </Link>
      </section>

      {/* Mini portal */}
      <section className="px-6 mt-5 grid grid-cols-2 gap-3">
        <Link to="/lila/jornada" className="rounded-3xl bg-[oklch(0.95_0.04_70)] border border-[oklch(0.45_0.08_55)]/10 p-4 hover:scale-[1.02] transition-transform">
          <MapIcon className="size-6 text-[oklch(0.45_0.08_55)]" />
          <p className="font-display font-bold text-base mt-2">Jornada da Semana</p>
          <p className="text-[11px] text-[oklch(0.40_0.04_55)]">Quadro de 7 dias</p>
        </Link>
        <Link to="/lila/ranking" className="rounded-3xl bg-[oklch(0.22_0.04_55)] text-[oklch(0.97_0.02_70)] p-4 hover:scale-[1.02] transition-transform">
          <Trophy className="size-6 text-[oklch(0.86_0.10_70)]" />
          <p className="font-display font-bold text-base mt-2">Ranking</p>
          <p className="text-[11px] opacity-70">Top desta semana</p>
        </Link>
      </section>

      {/* Mascot */}
      <section className="px-6 mt-6 pb-8">
        <div className="rounded-[2.5rem] bg-[oklch(0.98_0.02_70)] border border-[oklch(0.45_0.08_55)]/10 p-4 flex items-center gap-3">
          <img src={lilaImg} alt="Lila" width={1024} height={1024} className="w-20 drop-shadow animate-float-soft" />
          <p className="text-sm text-[oklch(0.40_0.04_55)] leading-snug">
            "Pequenos gestos, grande amor. Bora cumprir a missão de hoje?"
            <span className="block font-display font-bold text-[oklch(0.45_0.08_55)] mt-1">— Lila</span>
          </p>
        </div>
      </section>

      <button
        onClick={() => bumpStreak("lila:daily")}
        className="hidden"
        aria-hidden
      />

      <LilaBottomNav />
    </CharWorld>
  );
}
