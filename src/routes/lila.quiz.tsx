import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useState } from "react";
import { CharWorld } from "@/components/CharWorld";
import { LilaBottomNav } from "@/components/lila/BottomNav";
import { useProgress } from "@/lib/progress";
import {
  DAILY_QUIZ, WEEKLY_MISSIONS, useMissions, todayISO, CATEGORY_META,
  maybeGrantFullDayBonus, FULL_DAY_BONUS,
} from "@/lib/missions";

export const Route = createFileRoute("/lila/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz Diário — Lila | IGNIÇÃO" },
      { name: "description", content: "Quiz bíblico de 3 perguntas baseado na leitura de hoje." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const weekday = new Date().getDay();
  const dateISO = todayISO();
  const questions = DAILY_QUIZ[weekday];
  const quizMission = WEEKLY_MISSIONS[weekday].find((m) => m.category === "quiz")!;

  const { isDone, markDone } = useMissions();
  const { addXP, bumpStreak } = useProgress();
  const alreadyDone = isDone(dateISO, quizMission.id);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bonusGranted, setBonusGranted] = useState(false);

  const q = questions[step];

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setScore((s) => s + 1);
  }
  function next() {
    if (step + 1 < questions.length) {
      setStep(step + 1);
      setPicked(null);
    } else {
      const finalScore = score; // already updated by choose
      setFinished(true);
      if (!alreadyDone) {
        markDone(dateISO, quizMission.id);
        const reward = CATEGORY_META.quiz.xp;
        addXP(reward, "lila");
        bumpStreak("lila:daily");
        const granted = maybeGrantFullDayBonus(dateISO, weekday, (n) => addXP(n, "lila"));
        setBonusGranted(granted);
      }
      void finalScore;
    }
  }
  function restart() {
    setStep(0); setPicked(null); setScore(0); setFinished(false);
  }

  return (
    <CharWorld
      name="QUIZ DIÁRIO"
      tagline="3 perguntas"
      ink="text-[oklch(0.22_0.04_55)]"
      surface="bg-gradient-to-b from-[oklch(0.93_0.04_70)] via-[oklch(0.86_0.06_60)] to-[oklch(0.72_0.08_55)]"
    >
      <section className="px-6">
        <div className="rounded-2xl bg-white border border-[oklch(0.45_0.08_55)]/10 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.08_55)]">Leitura de hoje</p>
          <p className="font-display font-bold text-lg leading-tight">{quizMission.title.replace("Quiz: ", "")}</p>
        </div>
      </section>

      {!finished ? (
        <section className="px-6 mt-5">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 rounded-full bg-white/60 overflow-hidden">
              <div className="h-full bg-[oklch(0.45_0.08_55)] transition-all" style={{ width: `${((step) / questions.length) * 100}%` }} />
            </div>
            <span className="text-xs font-bold text-[oklch(0.45_0.08_55)]">{step + 1}/{questions.length}</span>
          </div>

          <div className="rounded-[2rem] bg-[oklch(0.22_0.04_55)] text-[oklch(0.97_0.02_70)] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.86_0.10_70)]">Pergunta {step + 1}</p>
            <p className="font-display font-bold text-xl leading-tight mt-1">{q.q}</p>

            <div className="mt-5 space-y-2">
              {q.options.map((opt, i) => {
                const isPicked = picked === i;
                const isRight = i === q.correct;
                const showState = picked !== null;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    className={`w-full text-left p-3.5 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all ${
                      !showState
                        ? "bg-white/10 hover:bg-white/20 text-white"
                        : isRight
                        ? "bg-[oklch(0.65_0.18_150)] text-white"
                        : isPicked
                        ? "bg-[oklch(0.60_0.20_25)] text-white"
                        : "bg-white/5 text-white/50"
                    }`}
                  >
                    <span className="size-7 rounded-full bg-white/15 grid place-items-center text-xs font-display">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showState && isRight && <CheckCircle2 className="size-5" />}
                    {showState && isPicked && !isRight && <XCircle className="size-5" />}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <button
                onClick={next}
                className="mt-4 w-full bg-[oklch(0.86_0.10_70)] text-[oklch(0.22_0.04_55)] font-display font-bold py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {step + 1 < questions.length ? "Próxima" : "Ver resultado"}
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className="px-6 mt-5">
          <div className="rounded-[2rem] bg-white border border-[oklch(0.45_0.08_55)]/10 p-6 text-center">
            <div className="text-5xl mb-2">{score === 3 ? "🎉" : score >= 2 ? "🌟" : "💪"}</div>
            <p className="font-display font-bold text-3xl">{score}/{questions.length}</p>
            <p className="text-sm text-[oklch(0.40_0.04_55)] mt-1">
              {score === 3 ? "Perfeito! Você arrasou!" : score >= 2 ? "Mandou bem!" : "Continue estudando, você consegue!"}
            </p>
            {!alreadyDone && (
              <div className="mt-4 inline-block bg-[oklch(0.45_0.08_55)] text-[oklch(0.86_0.10_70)] px-5 py-2 rounded-full text-sm font-display font-bold">
                +{CATEGORY_META.quiz.xp} XP {bonusGranted && `· Bônus +${FULL_DAY_BONUS} XP`}
              </div>
            )}
            <div className="mt-5 flex gap-2">
              <button
                onClick={restart}
                className="flex-1 bg-[oklch(0.95_0.04_70)] text-[oklch(0.22_0.04_55)] font-bold py-3 rounded-2xl flex items-center justify-center gap-2"
              >
                <RotateCcw className="size-4" /> Refazer
              </button>
              <Link
                to="/lila/jornada"
                className="flex-1 bg-[oklch(0.45_0.08_55)] text-white font-bold py-3 rounded-2xl flex items-center justify-center"
              >
                Voltar à Jornada
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="h-28" />
      <LilaBottomNav />
    </CharWorld>
  );
}
