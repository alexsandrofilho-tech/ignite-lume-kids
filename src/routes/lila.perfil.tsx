import { createFileRoute } from "@tanstack/react-router";
import { Flame, Award, Sparkles, BookOpen } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import { LilaBottomNav } from "@/components/lila/BottomNav";
import { useProgress } from "@/lib/progress";
import {
  WEEKLY_MISSIONS, useMissions, isoForWeekday, levelInfo, LEVELS, CATEGORY_META, isPerfectWeek,
} from "@/lib/missions";
import lilaImg from "@/assets/char-risoleta.png";

export const Route = createFileRoute("/lila/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Lila | IGNIÇÃO" },
      { name: "description", content: "Seu nível, conquistas e missões cumpridas." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const { progress } = useProgress();
  const { state } = useMissions();
  const lvl = levelInfo(progress.xp);
  const streak = progress.streaks["lila:daily"]?.count || 0;

  // Count completed in this week
  const weekly: { day: number; done: number; total: number }[] = [];
  let totalDone = 0;
  for (let d = 0; d < 7; d++) {
    const ms = WEEKLY_MISSIONS[d];
    const iso = isoForWeekday(d);
    const done = (state.completed[iso] || []).filter((id) => ms.some((m) => m.id === id)).length;
    weekly.push({ day: d, done, total: ms.length });
    totalDone += done;
  }

  const badges = [
    { id: "first-mission", label: "1ª Missão", icon: "🌱", unlocked: totalDone >= 1 },
    { id: "streak-3",      label: "3 Dias",   icon: "🔥", unlocked: streak >= 3 },
    { id: "shield",        label: "Escudo",   icon: "🛡️", unlocked: streak >= 7 },
    { id: "perfect-week",  label: "Semana Perfeita", icon: "🏆", unlocked: isPerfectWeek() },
    { id: "level-2",       label: "Discípulo",icon: "📖", unlocked: progress.xp >= 100 },
    { id: "level-3",       label: "Fiel",     icon: "⚔️", unlocked: progress.xp >= 300 },
    { id: "champ",         label: "Campeão",  icon: "👑", unlocked: progress.xp >= 1500 },
  ];

  return (
    <CharWorld
      name="PERFIL"
      tagline="Seu progresso"
      ink="text-[oklch(0.22_0.04_55)]"
      surface="bg-gradient-to-b from-[oklch(0.93_0.04_70)] via-[oklch(0.86_0.06_60)] to-[oklch(0.72_0.08_55)]"
    >
      {/* Hero */}
      <section className="px-6">
        <div className="rounded-[2rem] bg-[oklch(0.22_0.04_55)] text-[oklch(0.97_0.02_70)] p-5 flex items-center gap-4">
          <div className="size-20 rounded-3xl bg-[oklch(0.86_0.10_70)]/15 grid place-items-center overflow-hidden">
            <img src={lilaImg} alt="" className="w-16 drop-shadow" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[oklch(0.86_0.10_70)]">Nível {lvl.index + 1}</p>
            <p className="font-display font-bold text-2xl leading-tight">{lvl.name}</p>
            <div className="h-2 rounded-full bg-white/15 mt-2 overflow-hidden">
              <div className="h-full bg-[oklch(0.86_0.10_70)]" style={{ width: `${lvl.progress}%` }} />
            </div>
            <p className="text-[10px] mt-1 opacity-80 font-bold">
              {progress.xp} XP {lvl.next ? `· faltam ${lvl.next.min - progress.xp} para ${lvl.next.name}` : "· nível máximo"}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 mt-4 grid grid-cols-3 gap-2">
        <Stat icon={<Flame className="size-4 text-[oklch(0.65_0.20_30)]" />} label="Sequência" value={`${streak}d`} />
        <Stat icon={<Sparkles className="size-4 text-[oklch(0.65_0.18_310)]" />} label="XP total" value={String(progress.xp)} />
        <Stat icon={<BookOpen className="size-4 text-[oklch(0.55_0.12_250)]" />} label="Missões" value={String(totalDone)} />
      </section>

      {/* Levels track */}
      <section className="px-6 mt-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.08_55)] mb-2">Trilha de níveis</p>
        <div className="rounded-3xl bg-white/70 backdrop-blur border border-[oklch(0.45_0.08_55)]/10 p-3 flex items-center justify-between">
          {LEVELS.map((l, i) => {
            const reached = progress.xp >= l.min;
            return (
              <div key={l.name} className="flex flex-col items-center text-center flex-1">
                <div className={`size-9 rounded-2xl grid place-items-center font-display font-bold text-sm ${
                  reached ? "bg-[oklch(0.45_0.08_55)] text-[oklch(0.86_0.10_70)]" : "bg-[oklch(0.93_0.04_70)] text-[oklch(0.45_0.08_55)]/40"
                }`}>
                  {i + 1}
                </div>
                <p className={`text-[9px] font-bold mt-1 leading-tight ${reached ? "text-[oklch(0.22_0.04_55)]" : "text-[oklch(0.45_0.08_55)]/40"}`}>
                  {l.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges */}
      <section className="px-6 mt-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.08_55)] mb-2 flex items-center gap-1.5">
          <Award className="size-3.5" /> Conquistas
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`aspect-square rounded-3xl border flex flex-col items-center justify-center text-center p-2 ${
                b.unlocked
                  ? "bg-white border-[oklch(0.86_0.10_70)] shadow-md"
                  : "bg-white/40 border-[oklch(0.45_0.08_55)]/10 opacity-50"
              }`}
            >
              <div className={`text-3xl ${b.unlocked ? "" : "grayscale"}`}>{b.icon}</div>
              <p className="text-[10px] font-display font-bold mt-1">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="px-6 mt-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.08_55)] mb-2">Esta semana</p>
        <div className="rounded-3xl bg-white border border-[oklch(0.45_0.08_55)]/10 p-3 space-y-1.5">
          {weekly.map((w) => {
            const ms = WEEKLY_MISSIONS[w.day];
            const cats = ms.map((m) => CATEGORY_META[m.category].emoji).join(" ");
            return (
              <div key={w.day} className="flex items-center gap-3 py-1.5">
                <span className="text-xs font-display font-bold w-12 text-[oklch(0.45_0.08_55)]">
                  {["DOM","SEG","TER","QUA","QUI","SEX","SÁB"][w.day]}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[oklch(0.93_0.04_70)] overflow-hidden">
                  <div className="h-full bg-[oklch(0.55_0.10_55)]" style={{ width: `${(w.done / w.total) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-[oklch(0.40_0.04_55)] tabular-nums">{w.done}/{w.total}</span>
                <span className="text-xs opacity-60 hidden sm:inline">{cats}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-28" />
      <LilaBottomNav />
    </CharWorld>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white border border-[oklch(0.45_0.08_55)]/10 p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="font-display font-bold text-lg leading-none">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.08_55)]/70 mt-1">{label}</p>
    </div>
  );
}
