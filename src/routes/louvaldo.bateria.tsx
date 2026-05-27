import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Trophy, Zap, Music2 } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import {
  playKick, playSnare, playHat, playTom, playCrash, playTick, getCtx,
} from "@/lib/audio";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/louvaldo/bateria")({
  head: () => ({
    meta: [
      { title: "Bateria — Louvaldo | IGNIÇÃO" },
      { name: "description", content: "Toque bateria com Louvaldo: kit virtual, freestyle e desafio rítmico." },
      { property: "og:title", content: "Bateria — Louvaldo" },
      { property: "og:description", content: "Kit de bateria interativo para crianças." },
    ],
  }),
  component: BateriaPage,
});

type Pad = {
  id: string;
  label: string;
  key: string;
  color: string;
  size: string;
  play: () => void;
};

const PADS: Pad[] = [
  { id: "crash", label: "Crash", key: "1", color: "from-yellow-200 to-yellow-400", size: "size-24",  play: playCrash },
  { id: "hat",   label: "Hi-Hat", key: "2", color: "from-zinc-200 to-zinc-400",   size: "size-20",  play: () => playHat(false) },
  { id: "open",  label: "Open",   key: "3", color: "from-zinc-100 to-zinc-300",   size: "size-20",  play: () => playHat(true) },
  { id: "tom1",  label: "Tom 1",  key: "4", color: "from-lime-200 to-lime-500",   size: "size-24",  play: () => playTom(220) },
  { id: "tom2",  label: "Tom 2",  key: "5", color: "from-emerald-200 to-emerald-500", size: "size-24", play: () => playTom(160) },
  { id: "snare", label: "Snare",  key: "S", color: "from-white to-zinc-200",       size: "size-28",  play: playSnare },
  { id: "kick",  label: "Kick",   key: "_", color: "from-emerald-300 to-emerald-700", size: "size-32", play: playKick },
];

const KEY_MAP: Record<string, string> = {
  "1": "crash", "2": "hat", "3": "open", "4": "tom1", "5": "tom2",
  s: "snare", S: "snare", " ": "kick",
};

type Mode = "freestyle" | "rhythm" | "lesson";
type Note = { id: number; pad: string; time: number };

const PATTERNS: Record<string, Note[]> = {
  easy: [
    { id: 1, pad: "kick", time: 0 }, { id: 2, pad: "hat", time: 0.5 },
    { id: 3, pad: "snare", time: 1 }, { id: 4, pad: "hat", time: 1.5 },
  ],
  medium: [
    { id: 1, pad: "kick", time: 0 }, { id: 2, pad: "hat", time: 0.25 },
    { id: 3, pad: "kick", time: 0.5 }, { id: 4, pad: "snare", time: 1 },
    { id: 5, pad: "hat", time: 1.25 }, { id: 6, pad: "kick", time: 1.5 },
    { id: 7, pad: "snare", time: 1.75 },
  ],
  hard: [
    { id: 1, pad: "kick", time: 0 }, { id: 2, pad: "hat", time: 0.25 },
    { id: 3, pad: "snare", time: 0.5 }, { id: 4, pad: "hat", time: 0.75 },
    { id: 5, pad: "kick", time: 1 }, { id: 6, pad: "kick", time: 1.25 },
    { id: 7, pad: "snare", time: 1.5 }, { id: 8, pad: "crash", time: 1.75 },
  ],
};

function BateriaPage() {
  const [hit, setHit] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<Mode>("freestyle");
  const [difficulty, setDifficulty] = useState<keyof typeof PATTERNS>("easy");
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [feedback, setFeedback] = useState<{ id: number; text: string; ok: boolean } | null>(null);
  const expectedRef = useRef<{ pad: string; time: number; id: number } | null>(null);
  const startRef = useRef<number>(0);
  const { progress, addXP, recordHighScore } = useProgress();

  const triggerPad = useCallback((padId: string) => {
    const pad = PADS.find((p) => p.id === padId);
    if (!pad) return;
    pad.play();
    setHit((h) => ({ ...h, [padId]: (h[padId] || 0) + 1 }));
    setTimeout(() => setHit((h) => ({ ...h, [padId]: Math.max(0, (h[padId] || 1) - 1) })), 120);

    if (mode === "rhythm" && running && expectedRef.current) {
      const exp = expectedRef.current;
      const now = (performance.now() - startRef.current) / 1000;
      const delta = Math.abs(now - exp.time);
      if (exp.pad === padId && delta < 0.25) {
        const points = delta < 0.08 ? 100 : delta < 0.15 ? 60 : 30;
        setScore((s) => s + points * (1 + combo * 0.05));
        setCombo((c) => {
          const nc = c + 1;
          setBestCombo((b) => Math.max(b, nc));
          return nc;
        });
        setFeedback({ id: exp.id, text: delta < 0.08 ? "PERFEITO!" : delta < 0.15 ? "BOM!" : "OK", ok: true });
        expectedRef.current = null;
      } else {
        setCombo(0);
        setFeedback({ id: Date.now(), text: "ERROU", ok: false });
      }
      setTimeout(() => setFeedback(null), 400);
    }
  }, [mode, running, combo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const padId = KEY_MAP[e.key];
      if (padId) { e.preventDefault(); triggerPad(padId); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggerPad]);

  const [scheduled, setScheduled] = useState<Note[]>([]);
  useEffect(() => {
    if (!running || mode !== "rhythm") return;
    getCtx();
    const pattern = PATTERNS[difficulty];
    const loops = 4;
    const loopLen = pattern[pattern.length - 1].time + 0.5;
    startRef.current = performance.now();
    setScore(0); setCombo(0); setBestCombo(0); setScheduled([]);

    const allNotes: Note[] = [];
    for (let l = 0; l < loops; l++) {
      pattern.forEach((n) => allNotes.push({ ...n, id: n.id + l * 100, time: n.time + l * loopLen }));
    }
    setScheduled(allNotes);

    const timers: number[] = [];
    allNotes.forEach((n) => {
      timers.push(window.setTimeout(() => playTick(false), Math.max(0, (n.time - 0.3) * 1000)));
      timers.push(window.setTimeout(() => { expectedRef.current = { pad: n.pad, time: n.time, id: n.id }; }, n.time * 1000));
      timers.push(window.setTimeout(() => {
        if (expectedRef.current?.id === n.id) { expectedRef.current = null; setCombo(0); }
      }, (n.time + 0.25) * 1000));
    });
    timers.push(window.setTimeout(() => setRunning(false), (allNotes[allNotes.length - 1].time + 0.5) * 1000));
    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode, difficulty]);

  useEffect(() => {
    if (!running && score > 0 && mode === "rhythm") {
      const final = Math.round(score);
      addXP(Math.floor(final / 10), "louvaldo");
      recordHighScore(`bateria:${difficulty}`, final);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const high = progress.highScores[`bateria:${difficulty}`] || 0;

  return (
    <CharWorld
      name="BATERIA"
      tagline="Louvaldo · Ritmo"
      surface="bg-gradient-to-b from-[oklch(0.78_0.18_150)] via-[oklch(0.55_0.18_150)] to-[oklch(0.30_0.10_155)]"
      backdrop={
        <>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[36rem] rounded-full bg-[oklch(0.85_0.20_140)] opacity-30 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/40 to-transparent" />
        </>
      }
    >
      <section className="px-6 mt-2">
        <div className="flex gap-2 p-1 bg-black/30 rounded-2xl border border-white/15">
          {(["freestyle", "rhythm", "lesson"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setRunning(false); }}
              className={`flex-1 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition ${
                mode === m ? "bg-white text-[oklch(0.45_0.16_150)]" : "text-white/70 hover:text-white"
              }`}
            >
              {m === "freestyle" ? "Livre" : m === "rhythm" ? "Desafio" : "Lição"}
            </button>
          ))}
        </div>
      </section>

      {mode === "rhythm" && (
        <section className="px-6 mt-4">
          <div className="rounded-3xl bg-black/30 border border-white/15 backdrop-blur p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Trophy className="size-4" /> Recorde: {high}
              </div>
              <p className="font-display font-bold text-3xl mt-1">{Math.round(score)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/70">Combo</p>
              <p className="font-display font-bold text-2xl flex items-center gap-1 justify-end">
                <Zap className="size-5 text-yellow-300" /> x{combo}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {(Object.keys(PATTERNS) as (keyof typeof PATTERNS)[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border transition ${
                  difficulty === d ? "bg-white text-[oklch(0.45_0.16_150)] border-white" : "border-white/20 text-white/70"
                }`}
              >
                {d === "easy" ? "Fácil" : d === "medium" ? "Médio" : "Difícil"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setRunning((r) => !r)}
            className="w-full mt-3 py-3 rounded-2xl bg-white text-[oklch(0.45_0.16_150)] font-display font-bold flex items-center justify-center gap-2 active:scale-95 transition"
          >
            {running ? <><Square className="size-5 fill-current" /> Parar</> : <><Play className="size-5 fill-current" /> Começar Desafio</>}
          </button>
        </section>
      )}

      {mode === "lesson" && (
        <section className="px-6 mt-4">
          <div className="rounded-3xl bg-white/10 backdrop-blur border border-white/15 p-5 space-y-3">
            <div className="flex items-center gap-2 text-yellow-200">
              <Music2 className="size-5" />
              <p className="font-display font-bold">Lição 1 · Pulso básico</p>
            </div>
            <p className="text-sm text-white/85">
              O <b>kick</b> (espaço) é o tempo forte. O <b>snare</b> (S) responde no contratempo.
              O <b>hi-hat</b> (2) mantém a contagem.
            </p>
            <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
              <li>1 · Crash &nbsp; 2 · Hi-Hat &nbsp; 3 · Hi-Hat aberto</li>
              <li>4 · Tom 1 &nbsp; 5 · Tom 2</li>
              <li>S · Caixa &nbsp; Espaço · Bumbo</li>
            </ul>
          </div>
        </section>
      )}

      {mode === "rhythm" && running && (
        <section className="px-6 mt-3 overflow-hidden">
          <div className="relative h-16 rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
            {scheduled.map((n) => (
              <NoteBlob key={n.id} note={n} startRef={startRef} />
            ))}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/50" />
          </div>
        </section>
      )}

      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-display font-bold text-lg z-50 ${
              feedback.ok ? "bg-yellow-300 text-emerald-900" : "bg-red-500/80 text-white"
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="px-6 mt-6">
        <div className="rounded-[2rem] bg-black/30 border border-white/15 p-5">
          <div className="flex flex-wrap justify-center gap-3">
            {PADS.filter((p) => p.id !== "kick" && p.id !== "snare").map((pad) => (
              <PadButton key={pad.id} pad={pad} hits={hit[pad.id] || 0} onPress={triggerPad} />
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-5">
            {PADS.filter((p) => p.id === "snare").map((pad) => (
              <PadButton key={pad.id} pad={pad} hits={hit[pad.id] || 0} onPress={triggerPad} />
            ))}
            {PADS.filter((p) => p.id === "kick").map((pad) => (
              <PadButton key={pad.id} pad={pad} hits={hit[pad.id] || 0} onPress={triggerPad} />
            ))}
          </div>
          <p className="text-center text-[10px] text-white/60 mt-4 uppercase tracking-widest">
            Melhor combo: {bestCombo} · Teclado: 1 2 3 4 5 S espaço
          </p>
        </div>
      </section>
    </CharWorld>
  );
}

function PadButton({ pad, hits, onPress }: { pad: Pad; hits: number; onPress: (id: string) => void }) {
  return (
    <motion.button
      onPointerDown={(e: React.PointerEvent) => { e.preventDefault(); onPress(pad.id); }}
      animate={{ scale: hits > 0 ? 0.9 : 1, boxShadow: hits > 0 ? "0 0 30px rgba(255,255,255,0.6)" : "0 0 0px rgba(255,255,255,0)" }}
      transition={{ duration: 0.1 }}
      className={`${pad.size} rounded-full bg-gradient-to-br ${pad.color} border-2 border-white/30 grid place-items-center text-zinc-800 font-display font-bold shadow-xl select-none touch-none`}
      aria-label={pad.label}
    >
      <span className="text-xs">{pad.label}</span>
      <span className="text-[10px] opacity-60">{pad.key}</span>
    </motion.button>
  );
}

function NoteBlob({ note, startRef }: { note: Note; startRef: React.MutableRefObject<number> }) {
  const [pct, setPct] = useState(100);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = (performance.now() - startRef.current) / 1000;
      const t = note.time - now;
      const p = Math.max(-10, Math.min(110, 50 - (t / 1.5) * 50));
      setPct(p);
      if (t > -0.5) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [note.time, startRef]);
  const color =
    note.pad === "kick" ? "bg-emerald-400" :
    note.pad === "snare" ? "bg-white" :
    note.pad === "crash" ? "bg-yellow-300" : "bg-lime-300";
  if (pct < -5 || pct > 105) return null;
  return (
    <div
      className={`absolute top-1/2 size-6 rounded-full ${color} shadow-lg`}
      style={{ left: `${pct}%`, transform: `translate(-50%, -50%)` }}
    />
  );
}