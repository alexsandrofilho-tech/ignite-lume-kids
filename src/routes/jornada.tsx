import { createFileRoute, Link } from "@tanstack/react-router";
import { AppBottomNav } from "@/components/AppBottomNav";
import { JourneyExtras } from "@/components/AreaExtras";
import { ChevronRight, Star, Lock, Check, Dices, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  WEEKLY_MISSIONS,
  CATEGORY_META,
  useMissions,
  todayISO,
  type Mission,
  type MissionCategory,
  DAYS_PT_FULL,
} from "@/lib/missions";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/jornada")({
  head: () => ({
    meta: [
      { title: "Jornada — IGNIÇÃO" },
      { name: "description", content: "Acompanhe a jornada da Família Silva pelos 5 mundos da IGNIÇÃO." },
      { property: "og:title", content: "Jornada — IGNIÇÃO" },
      { property: "og:description", content: "Mapa de progresso, missões e conquistas das crianças." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

// ── Board game: 6 tiles, one per category ──
const BOARD: { face: number; category: MissionCategory; label: string }[] = [
  { face: 1, category: "prayer",     label: "Altar" },
  { face: 2, category: "reading",    label: "Biblioteca" },
  { face: 3, category: "quiz",       label: "Enigma" },
  { face: 4, category: "reflection", label: "Mirante" },
  { face: 5, category: "community",  label: "Praça" },
  { face: 6, category: "challenge",  label: "Arena" },
];

function weekKey(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday start
  x.setDate(x.getDate() - day);
  return x.toISOString().slice(0, 10);
}

const ROLL_KEY = "ignicao:jornada:weekRoll:v1";
type WeekRoll = { week: string; face: number };

function readRoll(): WeekRoll | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ROLL_KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as WeekRoll;
    return r.week === weekKey() ? r : null;
  } catch {
    return null;
  }
}
function writeRoll(face: number) {
  localStorage.setItem(ROLL_KEY, JSON.stringify({ week: weekKey(), face }));
}

function pickWeeklyMission(face: number): Mission {
  const category = BOARD.find((b) => b.face === face)!.category;
  // Search across the week for a mission of this category; fall back to any.
  for (let d = 0; d < 7; d++) {
    const found = WEEKLY_MISSIONS[d].find((m) => m.category === category);
    if (found) return found;
  }
  return WEEKLY_MISSIONS[0][0];
}

function DieFace({ face, rolling }: { face: number; rolling: boolean }) {
  // 3x3 pip layout
  const pip = (on: boolean, k: number) => (
    <span
      key={k}
      className={`size-2.5 rounded-full ${on ? "bg-stone-900" : "bg-transparent"}`}
      aria-hidden="true"
    />
  );
  const layouts: Record<number, boolean[]> = {
    1: [false, false, false, false, true, false, false, false, false],
    2: [true, false, false, false, false, false, false, false, true],
    3: [true, false, false, false, true, false, false, false, true],
    4: [true, false, true, false, false, false, true, false, true],
    5: [true, false, true, false, true, false, true, false, true],
    6: [true, false, true, true, false, true, true, false, true],
  };
  return (
    <div
      className={`size-24 rounded-2xl bg-white shadow-xl border-2 border-stone-200 grid grid-cols-3 grid-rows-3 gap-1 p-3 transition-transform ${
        rolling ? "animate-spin" : ""
      }`}
      aria-label={`Dado mostrando ${face}`}
      role="img"
    >
      {layouts[face].map((on, i) => pip(on, i))}
    </div>
  );
}

function WeeklyBoard() {
  const [roll, setRoll] = useState<WeekRoll | null>(null);
  const [face, setFace] = useState(1);
  const [rolling, setRolling] = useState(false);
  const { isDone, markDone } = useMissions();
  const { addXP } = useProgress();

  useEffect(() => {
    const r = readRoll();
    setRoll(r);
    if (r) setFace(r.face);
  }, []);

  const weeklyMission = useMemo(() => (roll ? pickWeeklyMission(roll.face) : null), [roll]);
  const today = todayISO();
  const done = weeklyMission ? isDone(today, weeklyMission.id) : false;

  function handleRoll() {
    if (rolling || roll) return;
    setRolling(true);
    let ticks = 0;
    const iv = setInterval(() => {
      setFace(1 + Math.floor(Math.random() * 6));
      ticks++;
      if (ticks >= 12) {
        clearInterval(iv);
        const final = 1 + Math.floor(Math.random() * 6);
        setFace(final);
        writeRoll(final);
        setRoll({ week: weekKey(), face: final });
        setRolling(false);
      }
    }, 80);
  }

  function handleComplete() {
    if (!weeklyMission || done) return;
    markDone(today, weeklyMission.id);
    addXP(weeklyMission.xp);
  }

  return (
    <section
      aria-label="Tabuleiro semanal"
      className="rounded-3xl bg-white border border-stone-100 p-5 shadow-lg mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ignition">Tabuleiro da Semana</p>
          <h2 className="font-display font-extrabold text-xl text-stone-900">Role o dado, ganhe sua missão</h2>
        </div>
        <Dices className="size-7 text-ignition" aria-hidden="true" />
      </div>

      {/* Board path */}
      <ol className="grid grid-cols-6 gap-2 mb-5" aria-label="Casas do tabuleiro">
        {BOARD.map((tile) => {
          const meta = CATEGORY_META[tile.category];
          const isHere = roll?.face === tile.face;
          return (
            <li
              key={tile.face}
              className={`relative rounded-2xl p-2 text-center border-2 transition-all ${
                isHere
                  ? "border-ignition bg-orange-50 scale-105 shadow-md"
                  : "border-stone-100 bg-stone-50"
              }`}
              aria-current={isHere ? "step" : undefined}
            >
              <div className="text-2xl leading-none" aria-hidden="true">{meta.emoji}</div>
              <p className="text-[9px] font-bold uppercase tracking-wide text-stone-500 mt-1 truncate">{tile.label}</p>
              {isHere && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-black bg-ignition text-white rounded-full px-1.5 py-0.5">
                  Você
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Die + action */}
      <div className="flex flex-col items-center gap-4">
        <DieFace face={face} rolling={rolling} />
        {!roll ? (
          <button
            onClick={handleRoll}
            disabled={rolling}
            className="bg-ignition text-white font-bold rounded-full px-6 py-3 shadow-md hover:scale-105 transition-transform disabled:opacity-60"
          >
            {rolling ? "Rolando..." : "Rolar o dado"}
          </button>
        ) : (
          <p className="text-xs text-stone-500 text-center">
            Você já rolou esta semana. Próxima rolagem na segunda-feira.
          </p>
        )}
      </div>

      {/* Mission of the week */}
      {weeklyMission && (
        <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ignition flex items-center gap-1">
            <Sparkles className="size-3" aria-hidden="true" /> Missão da semana
          </p>
          <p className="font-display font-extrabold text-stone-900 mt-1">{weeklyMission.title}</p>
          {weeklyMission.detail && <p className="text-sm text-stone-600 mt-1">{weeklyMission.detail}</p>}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
              <Star className="size-3 text-ignition" aria-hidden="true" /> +{weeklyMission.xp} XP
            </span>
            <button
              onClick={handleComplete}
              disabled={done}
              className={`text-xs font-bold rounded-full px-4 py-2 transition-all ${
                done
                  ? "bg-emerald-100 text-emerald-700 cursor-default"
                  : "bg-stone-900 text-white hover:scale-105"
              }`}
            >
              {done ? "Concluída ✓" : "Marcar concluída"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function DailyMissions() {
  const weekday = new Date().getDay();
  const today = todayISO();
  const list = WEEKLY_MISSIONS[weekday];
  const { isDone, markDone } = useMissions();
  const { addXP } = useProgress();

  return (
    <section aria-label="Missões diárias" className="mb-8">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display font-extrabold text-lg text-stone-900">Missões de hoje</h2>
        <p className="text-xs text-stone-500">{DAYS_PT_FULL[weekday]}</p>
      </div>
      <ul className="space-y-2">
        {list.map((m) => {
          const done = isDone(today, m.id);
          const meta = CATEGORY_META[m.category];
          return (
            <li
              key={m.id}
              className={`rounded-2xl border p-3 flex items-center gap-3 transition-all ${
                done ? "bg-emerald-50 border-emerald-200" : "bg-white border-stone-100"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">{meta.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-900 text-sm truncate">{m.title}</p>
                <p className="text-[11px] text-stone-500">{meta.label} · +{m.xp} XP</p>
              </div>
              <button
                onClick={() => {
                  if (done) return;
                  markDone(today, m.id);
                  addXP(m.xp);
                }}
                disabled={done}
                aria-label={done ? "Missão concluída" : `Marcar ${m.title} como concluída`}
                className={`size-8 rounded-full grid place-items-center transition-all ${
                  done ? "bg-emerald-500 text-white" : "bg-stone-100 text-stone-400 hover:bg-stone-200"
                }`}
              >
                <Check className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

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

        <WeeklyBoard />
        <DailyMissions />

        <h2 className="font-display font-extrabold text-lg text-stone-900 mb-3">Mapa de mundos</h2>
        <ol className="space-y-3">
          {stages.map((s, i) => {
            const isLocked = s.status === "locked";
            const inner = (
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
            );
            return (
              <li key={s.id}>
                {isLocked ? (
                  <div aria-disabled className="block bg-white border border-stone-100 rounded-3xl p-4 shadow-sm opacity-60 cursor-not-allowed">
                    {inner}
                  </div>
                ) : (
                  <Link to={s.to} className="block bg-white border border-stone-100 rounded-3xl p-4 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all">
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
        <JourneyExtras />
      </div>
      <AppBottomNav />
    </div>
  );
}