import { useEffect, useMemo, useState } from "react";
import { useProgress } from "@/lib/progress";

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function Win({ text, onAgain }: { text: string; onAgain: () => void }) {
  return (
    <div role="status" className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
      <p className="font-display font-extrabold text-stone-900">🎉 {text}</p>
      <button onClick={onAgain} className="mt-3 min-h-11 px-5 rounded-xl bg-ignition text-white font-bold">Jogar de novo</button>
    </div>
  );
}

/* 1. Memória bíblica */
const PAIRS = ["🕊️", "🌈", "🐟", "⛵", "🦁", "⭐"];
export function MemoryGame() {
  const { addXP } = useProgress();
  const [cards, setCards] = useState<string[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const reset = () => { setCards(shuffle([...PAIRS, ...PAIRS])); setOpen([]); setFound([]); setMoves(0); };
  useEffect(reset, []);
  const done = cards.length > 0 && found.length === PAIRS.length;
  useEffect(() => { if (done) addXP(25, "risoleta"); }, [done, addXP]);
  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || found.includes(cards[i])) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      if (cards[next[0]] === cards[next[1]]) { setFound((f) => [...f, cards[i]]); setOpen([]); }
      else setTimeout(() => setOpen([]), 700);
    }
  };
  return (
    <div>
      <p className="text-xs text-stone-500 mb-3">Encontre os pares: pomba, arco-íris, peixe, barco, leão e estrela. Jogadas: {moves}</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c, i) => {
          const shown = open.includes(i) || found.includes(c);
          return (
            <button key={i} onClick={() => flip(i)} aria-label={shown ? c : `Carta ${i + 1}`}
              className={`aspect-square rounded-2xl text-3xl grid place-items-center transition-all ${shown ? "bg-white border-2 border-amber-300 scale-100" : "bg-riso-lilac text-white hover:scale-105"}`}>
              {shown ? c : "?"}
            </button>
          );
        })}
      </div>
      {done && <Win text={`Você achou tudo em ${moves} jogadas! +25 XP`} onAgain={reset} />}
    </div>
  );
}

/* 2. Monte o versículo */
const VERSES = [
  { ref: "João 15:5", text: "Eu sou a videira, vós, as varas" },
  { ref: "Salmos 23:1", text: "O Senhor é o meu pastor; nada me faltará" },
  { ref: "Filipenses 4:13", text: "Posso todas as coisas naquele que me fortalece" },
  { ref: "Mateus 5:14", text: "Vós sois a luz do mundo" },
];
export function VerseBuilder() {
  const { addXP } = useProgress();
  const [idx, setIdx] = useState(0);
  const words = useMemo(() => VERSES[idx].text.split(" "), [idx]);
  const [pool, setPool] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);
  useEffect(() => { setPool(shuffle(words.map((w, i) => `${i}|${w}`))); setPicked([]); }, [words]);
  const correct = picked.length === words.length && picked.every((p, i) => p.split("|")[1] === words[i]);
  useEffect(() => { if (correct) addXP(15, "lume"); }, [correct, addXP]);
  const pick = (p: string) => {
    const pos = picked.length;
    if (p.split("|")[1] !== words[pos]) { setWrong(true); setTimeout(() => setWrong(false), 400); return; }
    setPicked([...picked, p]); setPool(pool.filter((x) => x !== p));
  };
  return (
    <div>
      <p className="text-xs text-stone-500 mb-2">Toque nas palavras na ordem certa — {VERSES[idx].ref} (ARC)</p>
      <div className={`min-h-16 rounded-2xl border-2 border-dashed p-3 flex flex-wrap gap-1.5 ${wrong ? "border-red-400 animate-shake" : "border-amber-300"}`}>
        {picked.map((p) => <span key={p} className="px-2 py-1 rounded-lg bg-lume text-white text-sm font-bold">{p.split("|")[1]}</span>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((p) => <button key={p} onClick={() => pick(p)} className="min-h-11 px-3 rounded-xl bg-white border border-stone-200 font-bold text-sm hover:bg-amber-50">{p.split("|")[1]}</button>)}
      </div>
      {correct && <Win text="Versículo completo! +15 XP" onAgain={() => setIdx((idx + 1) % VERSES.length)} />}
    </div>
  );
}

/* 3. Caça às estrelas (reflexo) */
export function StarCatch() {
  const { addXP, recordHighScore, progress } = useProgress();
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const playing = time > 0;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    const m = setInterval(() => setPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 }), 900);
    return () => { clearInterval(t); clearInterval(m); };
  }, [playing]);
  useEffect(() => { if (time === 0 && score > 0) { recordHighScore("stars", score); addXP(Math.min(score, 30), "lila"); } }, [time]); // eslint-disable-line
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-stone-600 mb-2">
        <span>⏱️ {time}s</span><span>⭐ {score}</span><span>Recorde: {progress.highScores.stars ?? 0}</span>
      </div>
      <div className="relative h-64 rounded-3xl bg-gradient-to-b from-indigo-900 to-indigo-700 overflow-hidden">
        {playing ? (
          <button aria-label="Pegar estrela" onClick={() => { setScore((s) => s + 1); setPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 }); }}
            className="absolute size-14 -translate-x-1/2 -translate-y-1/2 text-4xl transition-all duration-300 hover:scale-110"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>⭐</button>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-center text-white p-4">
            <div>
              <p className="text-sm mb-3">"Brilhem como estrelas no mundo" — Filipenses 2:15</p>
              <button onClick={() => { setScore(0); setTime(20); }} className="min-h-11 px-5 rounded-xl bg-amber-400 text-stone-900 font-bold">{score ? "Jogar de novo" : "Começar (20s)"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 4. Quem sou eu? */
const WHO = [
  { clues: ["Construí um barco enorme", "Levei animais de dois em dois", "Vi um arco-íris"], answer: "Noé", options: ["Noé", "Pedro", "Davi"] },
  { clues: ["Era pastor de ovelhas", "Tocava harpa", "Venci um gigante"], answer: "Davi", options: ["Moisés", "Davi", "Jonas"] },
  { clues: ["Fui engolido por um grande peixe", "Fugi de uma missão", "Preguei em Nínive"], answer: "Jonas", options: ["Jonas", "Elias", "Paulo"] },
  { clues: ["Era pescador", "Andei sobre as águas", "Jesus me chamou de pedra"], answer: "Pedro", options: ["João", "Pedro", "Tomé"] },
  { clues: ["Fui colocado num cesto no rio", "Vi uma sarça ardente", "Abri o Mar Vermelho com Deus"], answer: "Moisés", options: ["Moisés", "José", "Abraão"] },
];
export function WhoAmI() {
  const { addXP } = useProgress();
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(1);
  const [result, setResult] = useState<string | null>(null);
  const q = WHO[i];
  const answer = (o: string) => {
    if (result) return;
    const ok = o === q.answer;
    setResult(ok ? `Acertou! Era ${q.answer}. +${(4 - shown) * 5} XP` : `Era ${q.answer}!`);
    if (ok) addXP((4 - shown) * 5, "risoleta");
  };
  const next = () => { setI((i + 1) % WHO.length); setShown(1); setResult(null); };
  return (
    <div>
      <ul className="space-y-2 mb-3">
        {q.clues.slice(0, shown).map((c, n) => <li key={c} className="rounded-xl bg-pink-50 border border-pink-100 px-3 py-2 text-sm">🔎 Pista {n + 1}: {c}</li>)}
      </ul>
      {shown < 3 && !result && <button onClick={() => setShown(shown + 1)} className="text-xs font-bold text-riso-lilac underline mb-3 min-h-11">Mostrar outra pista (vale menos XP)</button>}
      <div className="grid grid-cols-3 gap-2">
        {q.options.map((o) => <button key={o} onClick={() => answer(o)} className="min-h-11 rounded-xl bg-white border border-stone-200 font-bold hover:bg-pink-50">{o}</button>)}
      </div>
      {result && <Win text={result} onAgain={next} />}
    </div>
  );
}

/* 5. Roda da gratidão */
const PROMPTS = ["Agradeça por uma pessoa da sua família", "Faça um elogio para alguém hoje", "Cante uma música de louvor", "Ore por um amigo", "Ajude em uma tarefa de casa", "Desenhe algo que Deus criou", "Conte uma história da Bíblia para alguém", "Dê um abraço em quem você ama"];
export function GratitudeWheel() {
  const { addXP } = useProgress();
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const spin = () => {
    if (spinning) return;
    const k = Math.floor(Math.random() * PROMPTS.length);
    setSpinning(true); setResult(null);
    setAngle((a) => a + 1440 + (360 - (k * 360) / PROMPTS.length) - (a % 360));
    setTimeout(() => { setResult(PROMPTS[k]); setSpinning(false); }, 2200);
  };
  const colors = ["#f97316", "#22c55e", "#a855f7", "#eab308", "#ec4899", "#0ea5e9", "#b45309", "#14b8a6"];
  const bg = `conic-gradient(${colors.map((c, n) => `${c} ${(n * 100) / 8}% ${((n + 1) * 100) / 8}%`).join(",")})`;
  return (
    <div className="text-center">
      <div className="relative mx-auto size-56">
        <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10 text-2xl" aria-hidden>🔻</div>
        <div className="size-full rounded-full border-4 border-white shadow-xl transition-transform duration-[2200ms] ease-out"
          style={{ background: bg, transform: `rotate(${angle}deg)` }} aria-hidden />
      </div>
      <button onClick={spin} disabled={spinning} className="mt-4 min-h-11 px-6 rounded-xl bg-ignition text-white font-bold disabled:opacity-60">{spinning ? "Girando..." : "Girar a roda"}</button>
      {result && (
        <div role="status" className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="font-bold text-stone-900">{result}</p>
          <button onClick={() => { addXP(10, "lila"); setResult(null); }} className="mt-3 min-h-11 px-4 rounded-xl bg-lila text-white font-bold text-sm">Eu fiz! +10 XP</button>
        </div>
      )}
    </div>
  );
}

/* 6. Eco musical (Simon) */
const NOTES = [
  { e: "🥁", f: 196, c: "bg-lou" }, { e: "🎸", f: 262, c: "bg-lume" },
  { e: "🎹", f: 330, c: "bg-riso-lilac" }, { e: "🎺", f: 392, c: "bg-lila" },
];
function beep(f: number) {
  try {
    const ctx = new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value = f; o.type = "triangle"; g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.4);
  } catch { /* no audio */ }
}
export function MusicEcho() {
  const { addXP, recordHighScore, progress } = useProgress();
  const [seq, setSeq] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState<number | null>(null);
  const [msg, setMsg] = useState("Escute e repita a sequência de Louvaldo!");
  const play = (s: number[]) => {
    s.forEach((n, k) => setTimeout(() => { setLit(n); beep(NOTES[n].f); setTimeout(() => setLit(null), 350); }, 600 * k + 400));
  };
  const start = () => { const s = [Math.floor(Math.random() * 4)]; setSeq(s); setStep(0); setMsg("Sua vez!"); play(s); };
  const press = (n: number) => {
    if (!seq.length) return;
    beep(NOTES[n].f); setLit(n); setTimeout(() => setLit(null), 200);
    if (n !== seq[step]) { recordHighScore("echo", seq.length - 1); if (seq.length > 1) addXP((seq.length - 1) * 3, "louvaldo"); setMsg(`Fim! Você lembrou ${seq.length - 1} notas.`); setSeq([]); return; }
    if (step + 1 === seq.length) { const s = [...seq, Math.floor(Math.random() * 4)]; setSeq(s); setStep(0); setMsg(`Boa! Nível ${s.length}`); play(s); }
    else setStep(step + 1);
  };
  return (
    <div className="text-center">
      <p className="text-sm text-stone-600 mb-1">{msg}</p>
      <p className="text-xs text-stone-400 mb-3">Recorde: {progress.highScores.echo ?? 0}</p>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {NOTES.map((n, i) => (
          <button key={i} onClick={() => press(i)} aria-label={`Instrumento ${i + 1}`}
            className={`aspect-square rounded-3xl text-5xl ${n.c} transition-all ${lit === i ? "scale-110 brightness-125 ring-4 ring-white" : "opacity-80"}`}>{n.e}</button>
        ))}
      </div>
      {!seq.length && <button onClick={start} className="mt-4 min-h-11 px-6 rounded-xl bg-lou text-white font-bold">Começar</button>}
    </div>
  );
}
