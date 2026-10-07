import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { CharWorld } from "@/components/CharWorld";
import { LilaBottomNav } from "@/components/lila/BottomNav";
import { useProgress } from "@/lib/progress";
import {
  WEEKLY_MISSIONS, CATEGORY_META, DAYS_PT, DAYS_PT_FULL,
  useMissions, isoForWeekday, todayISO, maybeGrantFullDayBonus, FULL_DAY_BONUS, dayXP,
} from "@/lib/missions";

export const Route = createFileRoute("/lila/jornada")({
  head: () => ({
    meta: [
      { title: "Jornada da Semana — Lila | IGNIÇÃO" },
      { name: "description", content: "Quadro de missões dos 7 dias da semana." },
      { property: "og:title", content: "Jornada da Semana — Lila | IGNIÇÃO" },
      { property: "og:description", content: "Quadro de missões dos 7 dias da semana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JornadaPage,
});

function JornadaPage() {
  const today = new Date().getDay();
  const [selected, setSelected] = useState(today);
  const { isDone, markDone } = useMissions();
  const { addXP, bumpStreak } = useProgress();
  const [toast, setToast] = useState<string | null>(null);

  const dateISO = isoForWeekday(selected);
  const isToday = selected === today && dateISO === todayISO();
  const missions = WEEKLY_MISSIONS[selected];
  const doneCount = missions.filter((m) => isDone(dateISO, m.id)).length;
  const locked = selected > today; // future days locked
  const totalXP = dayXP(selected);
  const [confetti, setConfetti] = useState(false);

  function complete(missionId: string, xp: number) {
    if (!isToday || isDone(dateISO, missionId)) return;
    markDone(dateISO, missionId);
    addXP(xp, "lila");
    bumpStreak("lila:daily");
    const granted = maybeGrantFullDayBonus(dateISO, selected, (n) => addXP(n, "lila"));
    setToast(granted ? `+${xp} XP · BÔNUS Dia Completo +${FULL_DAY_BONUS} XP!` : `+${xp} XP`);
    setTimeout(() => setToast(null), 2200);
    if (granted) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2500);
    }
  }

  return (
    <CharWorld
      name="JORNADA"
      tagline="Quadro semanal"
      ink="text-[oklch(0.22_0.04_55)]"
      surface="bg-gradient-to-b from-[oklch(0.93_0.04_70)] via-[oklch(0.86_0.06_60)] to-[oklch(0.72_0.08_55)]"
    >
      {/* Week selector */}
      <section className="px-6">
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS_PT.map((d, i) => {
            const isFuture = i > today;
            const dateForDay = isoForWeekday(i);
            const dayMissions = WEEKLY_MISSIONS[i];
            const completed = dayMissions.filter((m) => isDone(dateForDay, m.id)).length;
            const allDone = completed === dayMissions.length;
            return (
              <button
                key={d}
                onClick={() => setSelected(i)}
                disabled={isFuture}
                className={`relative flex flex-col items-center py-2 rounded-2xl text-xs font-bold transition-all ${
                  selected === i
                    ? "bg-[oklch(0.22_0.04_55)] text-[oklch(0.86_0.10_70)] scale-105 shadow-lg"
                    : isFuture
                    ? "bg-white/30 text-[oklch(0.45_0.08_55)]/40"
                    : allDone
                    ? "bg-[oklch(0.55_0.10_55)] text-white"
                    : "bg-white text-[oklch(0.45_0.08_55)]"
                }`}
              >
                <span className="text-[9px] tracking-widest opacity-80">{d}</span>
                <span className="font-display text-base mt-0.5">{new Date(dateForDay).getDate()}</span>
                {allDone && !isFuture && <Sparkles className="absolute -top-1 -right-1 size-3.5 text-[oklch(0.86_0.10_70)]" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Day header */}
      <section className="px-6 mt-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[oklch(0.45_0.08_55)]">
            {isToday ? "Hoje" : locked ? "Bloqueado" : "Visualização"}
          </p>
          <h2 className="font-display font-bold text-2xl">{DAYS_PT_FULL[selected]}</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.08_55)]/70">Progresso</p>
          <p className="font-display font-bold text-lg">{doneCount}/{missions.length} · +{totalXP} XP</p>
        </div>
      </section>

      {/* Missions */}
      <section className="px-6 mt-4 space-y-3">
        {missions.map((m, i) => {
          const meta = CATEGORY_META[m.category];
          const done = isDone(dateISO, m.id);
          const isQuiz = m.category === "quiz";
          return (
            <div
              key={m.id}
              className={`relative rounded-3xl p-4 border transition-all ${
                done
                  ? "bg-[oklch(0.55_0.10_55)]/10 border-[oklch(0.55_0.10_55)]/30"
                  : locked
                  ? "bg-white/40 border-[oklch(0.45_0.08_55)]/10 opacity-60"
                  : "bg-white border-[oklch(0.45_0.08_55)]/10 shadow-md shadow-[oklch(0.45_0.08_55)]/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="size-12 rounded-2xl grid place-items-center text-xl shrink-0"
                  style={{ background: `color-mix(in oklab, ${meta.color} 15%, white)` }}
                >
                  {meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] font-bold text-[oklch(0.45_0.08_55)]/60">·</span>
                    <span className="text-[10px] font-bold text-[oklch(0.45_0.08_55)]">+{meta.xp} XP</span>
                  </div>
                  <p className={`font-display font-bold text-base leading-tight mt-0.5 ${done ? "line-through opacity-70" : ""}`}>
                    {m.title}
                  </p>
                  {m.detail && <p className="text-[11px] text-[oklch(0.40_0.04_55)] mt-1">{m.detail}</p>}

                  {/* Action */}
                  <div className="mt-3">
                    {locked ? (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[oklch(0.45_0.08_55)]/60">
                        <Lock className="size-3.5" /> Disponível em breve
                      </div>
                    ) : done ? (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[oklch(0.55_0.10_55)]">
                        <CheckCircle2 className="size-3.5" /> Concluída
                      </div>
                    ) : isQuiz ? (
                      <Link
                        to="/lila/quiz"
                        className="inline-flex items-center text-xs font-display font-bold text-white bg-[oklch(0.45_0.08_55)] px-4 py-2 rounded-full active:scale-95 transition-transform"
                      >
                        Começar quiz
                      </Link>
                    ) : (
                      <button
                        onClick={() => complete(m.id, meta.xp)}
                        className="inline-flex items-center text-xs font-display font-bold text-white bg-[oklch(0.45_0.08_55)] px-4 py-2 rounded-full active:scale-95 transition-transform"
                      >
                        Marcar como feita
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Full day bonus banner */}
      {doneCount === missions.length && (
        <section className="px-6 mt-5">
          <div className="rounded-3xl bg-gradient-to-r from-[oklch(0.86_0.14_85)] to-[oklch(0.78_0.16_70)] text-[oklch(0.22_0.04_55)] p-4 text-center font-display font-bold">
            ✨ Dia Completo! +{FULL_DAY_BONUS} XP de bônus
          </div>
        </section>
      )}

      <div className="h-28" />

      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 size-2 rounded-sm animate-confetti-fall"
              style={{
                left: `${(i * 37) % 100}%`,
                background: i % 3 === 0 ? "oklch(0.86 0.14 85)" : i % 3 === 1 ? "oklch(0.65 0.18 310)" : "oklch(0.78 0.16 70)",
                animationDelay: `${(i % 10) * 80}ms`,
                transform: `rotate(${i * 23}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-28 inset-x-0 flex justify-center z-50 px-4 pointer-events-none">
          <div className="bg-[oklch(0.22_0.04_55)] text-[oklch(0.86_0.10_70)] px-5 py-3 rounded-2xl font-display font-bold shadow-2xl animate-fade-in">
            {toast}
          </div>
        </div>
      )}

      <LilaBottomNav />
    </CharWorld>
  );
}
