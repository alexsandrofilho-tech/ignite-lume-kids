import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { MemoryGame, VerseBuilder, StarCatch, WhoAmI, GratitudeWheel, MusicEcho } from "@/components/play/MiniGames";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/brincadeiras")({
  head: () => ({
    meta: [
      { title: "Brincadeiras — IGNIÇÃO" },
      { name: "description", content: "Seis brincadeiras bíblicas: memória, versículos, estrelas, quem sou eu, roda da gratidão e eco musical." },
      { property: "og:title", content: "Brincadeiras — IGNIÇÃO" },
      { property: "og:description", content: "Jogos bíblicos interativos com a Cia do Lume." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const GAMES = [
  { id: "memory", title: "Memória Bíblica", emoji: "🃏", who: "Risoleta", C: MemoryGame },
  { id: "verse", title: "Monte o Versículo", emoji: "📜", who: "Lume", C: VerseBuilder },
  { id: "stars", title: "Caça às Estrelas", emoji: "⭐", who: "Lila", C: StarCatch },
  { id: "who", title: "Quem Sou Eu?", emoji: "🔎", who: "Risoleta", C: WhoAmI },
  { id: "wheel", title: "Roda da Gratidão", emoji: "🎡", who: "Lila", C: GratitudeWheel },
  { id: "echo", title: "Eco Musical", emoji: "🎵", who: "Louvaldo", C: MusicEcho },
];

function Page() {
  const [active, setActive] = useState(GAMES[0].id);
  const { progress } = useProgress();
  const game = GAMES.find((g) => g.id === active)!;
  return (
    <div className="min-h-dvh text-stone-800 pb-32">
      <div className="mx-auto max-w-xl px-6 pt-8">
        <Link to="/play" className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 min-h-11"><ArrowLeft className="size-4" /> Play</Link>
        <header className="mb-5 flex items-end justify-between">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-stone-900">Brincadeiras</h1>
            <p className="text-sm text-stone-500">Escolha uma janela e divirta-se!</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold">⭐ {progress.xp} XP</span>
        </header>
        <div role="tablist" aria-label="Brincadeiras" className="grid grid-cols-3 gap-2 mb-5">
          {GAMES.map((g) => (
            <button key={g.id} role="tab" aria-selected={active === g.id} onClick={() => setActive(g.id)}
              className={`rounded-2xl p-3 text-center border transition-all min-h-11 ${active === g.id ? "bg-white border-ignition shadow-lg -translate-y-0.5" : "bg-white/70 border-stone-100"}`}>
              <div className="text-2xl">{g.emoji}</div>
              <p className="text-[11px] font-bold leading-tight mt-1">{g.title}</p>
            </button>
          ))}
        </div>
        <section role="tabpanel" className="bg-white rounded-3xl border border-stone-100 p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ignition">com {game.who}</p>
          <h2 className="font-display font-extrabold text-xl mb-3">{game.emoji} {game.title}</h2>
          <game.C key={game.id} />
        </section>
      </div>
      <AppBottomNav />
    </div>
  );
}
