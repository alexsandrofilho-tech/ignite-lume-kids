import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, GraduationCap, Trophy } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import { CHORDS, strumChord, pluckString, getCtx } from "@/lib/audio";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/louvaldo/violao")({
  head: () => ({
    meta: [
      { title: "Violão — Louvaldo | IGNIÇÃO" },
      { name: "description", content: "Aprenda violão com Louvaldo: acordes, dedilhado e mini-jogos." },
      { property: "og:title", content: "Violão — Louvaldo" },
      { property: "og:description", content: "Violão virtual interativo para crianças." },
    ],
  }),
  component: ViolaoPage,
});

type Mode = "play" | "learn" | "quiz";
const CHORD_KEYS = Object.keys(CHORDS);

function ViolaoPage() {
  const [mode, setMode] = useState<Mode>("play");
  const [chord, setChord] = useState<string>("G");
  const [strumming, setStrumming] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizCorrect, setQuizCorrect] = useState<string>("G");
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<"ok" | "no" | null>(null);
  const { progress, addXP, recordHighScore } = useProgress();

  const playChord = (key: string, down = true) => {
    getCtx();
    strumChord(CHORDS[key].pattern, down);
    setStrumming((s) => s + 1);
    setTimeout(() => setStrumming((s) => Math.max(0, s - 1)), 250);
  };

  const newQuiz = () => {
    const correct = CHORD_KEYS[Math.floor(Math.random() * CHORD_KEYS.length)];
    const wrongs = CHORD_KEYS.filter((c) => c !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    setQuizCorrect(correct);
    setQuizOptions([correct, ...wrongs].sort(() => Math.random() - 0.5));
    setQuizAnswer(null);
    setQuizFeedback(null);
    setTimeout(() => strumChord(CHORDS[correct].pattern), 200);
  };

  useEffect(() => {
    if (mode === "quiz" && quizOptions.length === 0) newQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const onQuizPick = (key: string) => {
    setQuizAnswer(key);
    if (key === quizCorrect) {
      setQuizFeedback("ok");
      setQuizScore((s) => s + 10);
      addXP(5, "louvaldo");
      setTimeout(newQuiz, 900);
    } else {
      setQuizFeedback("no");
      setTimeout(() => { setQuizFeedback(null); setQuizAnswer(null); }, 900);
    }
  };

  useEffect(() => {
    if (quizScore > 0) recordHighScore("violao:quiz", quizScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizScore]);

  const pattern = CHORDS[chord].pattern;
  const highQuiz = progress.highScores["violao:quiz"] || 0;

  return (
    <CharWorld
      name="VIOLÃO"
      tagline="Louvaldo · Acordes"
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
          {(["play", "learn", "quiz"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition ${
                mode === m ? "bg-white text-[oklch(0.45_0.16_150)]" : "text-white/70"
              }`}
            >
              {m === "play" ? "Tocar" : m === "learn" ? "Aprender" : "Quiz"}
            </button>
          ))}
        </div>
      </section>

      {mode !== "quiz" && (
        <>
          {/* Chord selector */}
          <section className="px-6 mt-4">
            <p className="text-[10px] uppercase tracking-widest text-white/70 mb-2">Acorde</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CHORD_KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => { setChord(k); playChord(k); }}
                  className={`flex-shrink-0 size-14 rounded-2xl font-display font-bold text-xl border-2 transition ${
                    chord === k
                      ? "bg-white text-[oklch(0.45_0.16_150)] border-white scale-105"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </section>

          {/* Chord diagram */}
          <section className="px-6 mt-4">
            <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur p-5">
              <div className="flex items-baseline justify-between">
                <p className="text-[10px] uppercase tracking-widest text-white/70">Diagrama</p>
                <p className="font-display font-bold text-4xl">{chord}</p>
              </div>
              <ChordDiagram pattern={pattern} />
            </div>
          </section>

          {/* Strings + strum */}
          <section className="px-6 mt-4">
            <div className="rounded-[2rem] bg-black/30 border border-white/15 p-5">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1, 0].map((s) => {
                  const fret = pattern[s];
                  const muted = fret < 0;
                  return (
                    <motion.button
                      key={s}
                      onClick={() => !muted && pluckString(s, fret)}
                      animate={{ x: strumming > 0 ? [0, 4, -4, 2, 0] : 0 }}
                      transition={{ duration: 0.25 }}
                      disabled={muted}
                      className={`w-full h-7 rounded-md flex items-center px-3 gap-3 ${
                        muted ? "bg-white/5 opacity-30" : "bg-gradient-to-r from-white/10 to-white/30 hover:from-white/20 hover:to-white/40"
                      }`}
                      aria-label={`Corda ${6 - s}`}
                    >
                      <span className="text-[10px] font-bold text-white/80 w-6">{["E", "A", "D", "G", "B", "e"][s]}</span>
                      <div className="flex-1 h-px bg-white/40" />
                      <span className="text-[10px] font-bold text-white/80 w-6 text-right">
                        {muted ? "×" : fret === 0 ? "○" : fret}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => playChord(chord, true)}
                  className="py-3 rounded-2xl bg-white text-[oklch(0.45_0.16_150)] font-display font-bold active:scale-95 transition"
                >
                  Strum ↓
                </button>
                <button
                  onClick={() => playChord(chord, false)}
                  className="py-3 rounded-2xl bg-white/10 text-white border border-white/20 font-display font-bold active:scale-95 transition"
                >
                  Strum ↑
                </button>
              </div>
            </div>
          </section>

          {mode === "learn" && (
            <section className="px-6 mt-4">
              <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur p-5">
                <div className="flex items-center gap-2 text-yellow-200 mb-2">
                  <GraduationCap className="size-5" />
                  <p className="font-display font-bold">Como tocar {chord}</p>
                </div>
                <p className="text-sm text-white/85">
                  Coloque os dedos nas casas indicadas no diagrama (○ = corda solta, × = não tocar).
                  Faça um strum suave de cima para baixo. Tente trocar entre <b>G</b>, <b>C</b> e <b>D</b> — essa é a base de muitas canções de adoração.
                </p>
                <p className="text-xs text-white/70 mt-3">Ritmo simples: ↓ ↓ ↑ · ↓ ↑</p>
              </div>
            </section>
          )}
        </>
      )}

      {mode === "quiz" && (
        <section className="px-6 mt-4 space-y-4">
          <div className="rounded-3xl bg-black/30 border border-white/15 backdrop-blur p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Trophy className="size-4" /> Recorde: {highQuiz}
              </div>
              <p className="font-display font-bold text-3xl mt-1">{quizScore}</p>
            </div>
            <button
              onClick={() => strumChord(CHORDS[quizCorrect].pattern)}
              className="size-14 rounded-2xl bg-white/20 grid place-items-center hover:bg-white/30 transition"
              aria-label="Ouvir novamente"
            >
              <Shuffle className="size-6" />
            </button>
          </div>

          <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur p-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/70">Qual acorde tocou?</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {quizOptions.map((opt) => {
                const isCorrect = quizFeedback && opt === quizCorrect;
                const isWrong = quizFeedback === "no" && opt === quizAnswer;
                return (
                  <button
                    key={opt}
                    onClick={() => !quizFeedback && onQuizPick(opt)}
                    className={`py-4 rounded-2xl font-display font-bold text-2xl border-2 transition ${
                      isCorrect ? "bg-yellow-300 text-emerald-900 border-yellow-300" :
                      isWrong ? "bg-red-500/80 text-white border-red-500" :
                      "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {quizFeedback && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center font-display font-bold text-lg ${
                  quizFeedback === "ok" ? "text-yellow-300" : "text-red-300"
                }`}
              >
                {quizFeedback === "ok" ? "Boa! +10" : `Era ${quizCorrect}`}
              </motion.p>
            )}
          </AnimatePresence>
        </section>
      )}
    </CharWorld>
  );
}

function ChordDiagram({ pattern }: { pattern: number[] }) {
  // 6 strings, 4 frets shown
  const frets = 4;
  return (
    <div className="mt-3 mx-auto w-fit">
      <div className="grid grid-cols-6 gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <div key={`top-${s}`} className="size-5 grid place-items-center text-[10px] text-white/70 font-bold">
            {pattern[s] < 0 ? "×" : pattern[s] === 0 ? "○" : ""}
          </div>
        ))}
      </div>
      <div className="border-t-2 border-white/60 mt-1" />
      <div className="relative w-fit">
        {Array.from({ length: frets }).map((_, f) => (
          <div key={f} className="grid grid-cols-6 gap-1.5 border-b border-white/30 h-7 items-center relative">
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="size-5 grid place-items-center">
                <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-white/20" style={{ left: `${(s + 0.5) * (100 / 6)}%` }} />
                {pattern[s] === f + 1 && (
                  <div className="relative size-5 rounded-full bg-yellow-300 text-emerald-900 grid place-items-center text-[10px] font-bold z-10">
                    {f + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}