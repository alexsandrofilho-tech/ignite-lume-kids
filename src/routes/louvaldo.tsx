import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Music2, Disc3, ChevronRight, Heart, ExternalLink } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import louImg from "@/assets/char-louvaldo.png";
import { useProgress } from "@/lib/progress";
import { strumChord, CHORDS } from "@/lib/audio";

const SPOTIFY_URL = "https://open.spotify.com/search/Cia%20do%20Lume";
const DAILY_SONGS = [
  "Sou Criança, Sou de Deus",
  "Deus Cuida de Mim",
  "Eu Navegarei",
  "Aprendi com Jesus",
  "Faz Chover",
  "Filho do Céu",
  "Coração Valente",
];

export const Route = createFileRoute("/louvaldo")({
  head: () => ({
    meta: [
      { title: "Louvaldo — Louvor & Adoração | IGNIÇÃO" },
      { name: "description", content: "Cante, toque e celebre com Louvaldo: música de louvor, mini-jogos de instrumentos, karaokê e desafios de ritmo." },
      { property: "og:title", content: "Louvaldo — Louvor & Adoração" },
      { property: "og:description", content: "Música, karaokê e ritmo para o ministério infantil." },
    ],
  }),
  component: LouvaldoPage,
});

function LouvaldoPage() {
  const { progress, toggleFavorite } = useProgress();
  const todayIdx = new Date().getDate() % DAILY_SONGS.length;
  const dailySong = DAILY_SONGS[todayIdx];
  const isFav = (id: string) => progress.favorites.includes(id);

  return (
    <CharWorld
      name="LOUVALDO"
      tagline="Louvor · Adoração"
      surface="bg-gradient-to-b from-[oklch(0.78_0.18_150)] via-[oklch(0.55_0.18_150)] to-[oklch(0.30_0.10_155)]"
      backdrop={
        <>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[36rem] rounded-full bg-[oklch(0.85_0.20_140)] opacity-30 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/40 to-transparent" />
          {/* spotlight beams */}
          <div className="absolute top-0 left-10 w-40 h-[120vh] bg-gradient-to-b from-white/15 to-transparent rotate-12 blur-2xl" />
          <div className="absolute top-0 right-10 w-40 h-[120vh] bg-gradient-to-b from-white/15 to-transparent -rotate-12 blur-2xl" />
        </>
      }
    >
      {/* Stage */}
      <section className="px-6 mt-2">
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/20 bg-black/20 backdrop-blur p-6">
          <img
            src={louImg}
            alt="Louvaldo"
            width={1024}
            height={1024}
            className="w-40 mx-auto drop-shadow-2xl animate-float-soft"
          />
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 mt-2">
            Música do dia
          </p>
          <h2 className="text-center font-display font-bold text-3xl mt-1">{dailySong}</h2>

          {/* Equalizer */}
          <div className="flex justify-center items-end gap-1.5 mt-5 h-12">
            {[8, 14, 22, 32, 44, 32, 22, 14, 8, 14, 28, 36, 22, 14, 8].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-[oklch(0.85_0.20_140)] to-white rounded-full animate-bounce"
                style={{ height: `${h}px`, animationDelay: `${i * 70}ms`, animationDuration: "0.9s" }}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-5">
            <button className="size-12 rounded-full bg-white/20 grid place-items-center hover:bg-white/30 transition">
              <Disc3 className="size-5" />
            </button>
            <button
              onClick={() => strumChord(CHORDS.G.pattern)}
              className="size-16 rounded-full bg-white text-[oklch(0.45_0.16_150)] grid place-items-center shadow-2xl active:scale-95 hover:scale-105 transition-transform"
              aria-label="Tocar prévia"
            >
              <Play className="size-7 fill-current ml-1" />
            </button>
            <button
              onClick={() => toggleFavorite(`song:${dailySong}`)}
              aria-label="Favoritar"
              className={`size-12 rounded-full grid place-items-center transition ${
                isFav(`song:${dailySong}`)
                  ? "bg-yellow-300 text-emerald-900"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <Heart className={`size-5 ${isFav(`song:${dailySong}`) ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Spotify CTA */}
      <section className="px-6 mt-4">
        <a
          href={SPOTIFY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-3xl bg-[#1DB954] text-white p-4 flex items-center gap-3 hover:scale-[1.01] active:scale-95 transition-transform shadow-xl"
        >
          <div className="size-12 rounded-2xl bg-white/20 grid place-items-center">
            <Music2 className="size-6" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-base leading-tight">Cia do Lume no Spotify</p>
            <p className="text-xs text-white/80">Abrir playlist oficial</p>
          </div>
          <ExternalLink className="size-5" />
        </a>
      </section>

      {/* Favorites */}
      {progress.favorites.length > 0 && (
        <section className="px-6 mt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-3">
            Suas favoritas ({progress.favorites.length})
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {progress.favorites.map((f) => (
              <div key={f} className="flex-shrink-0 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-xs font-bold flex items-center gap-2">
                <Heart className="size-3 fill-current text-yellow-300" />
                {f.replace("song:", "")}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Playlists */}
      <section className="px-6 mt-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-3">Playlists do Show</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {["Top Adoração", "Louvor Kids", "Histórias Cantadas", "Acústicos"].map((p, i) => (
            <button
              key={p}
              className="flex-shrink-0 w-40 h-40 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 p-4 flex flex-col justify-between text-left hover:from-white/30 transition"
            >
              <Music2 className="size-7 text-white" />
              <div>
                <p className="font-display font-bold text-base leading-tight">{p}</p>
                <p className="text-[10px] text-white/70">{(i + 1) * 6} faixas</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Mini-games */}
      <section className="px-6 mt-6 grid grid-cols-2 gap-3">
        {[
          { title: "Bateria", desc: "Kit virtual · ritmo", to: "/louvaldo/bateria", color: "from-[oklch(0.75_0.18_160)] to-[oklch(0.40_0.14_155)]" },
          { title: "Violão", desc: "Acordes & quiz", to: "/louvaldo/violao", color: "from-[oklch(0.80_0.18_135)] to-[oklch(0.45_0.16_145)]" },
          { title: "Karaokê", desc: "Em breve", to: "/louvaldo", color: "from-[oklch(0.85_0.20_140)] to-[oklch(0.55_0.18_150)]" },
          { title: "Desafio Rítmico", desc: "Bateria · Difícil", to: "/louvaldo/bateria", color: "from-[oklch(0.70_0.20_155)] to-[oklch(0.35_0.12_150)]" },
        ].map((g) => (
          <Link
            to={g.to}
            key={g.title}
            className={`rounded-3xl bg-gradient-to-br ${g.color} p-4 text-left border border-white/15 hover:scale-[1.02] transition-transform block`}
          >
            <p className="font-display font-bold text-base leading-tight">{g.title}</p>
            <p className="text-xs text-white/80">{g.desc}</p>
            <ChevronRight className="size-5 mt-3 ml-auto" />
          </Link>
        ))}
      </section>

      {progress.perChar.louvaldo > 0 && (
        <section className="px-6 mt-6">
          <div className="rounded-2xl bg-white/10 border border-white/15 p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/70">Seu progresso</p>
              <p className="font-display font-bold text-2xl">{progress.perChar.louvaldo} XP</p>
            </div>
            <div className="size-12 rounded-2xl bg-yellow-300/20 grid place-items-center">
              <Music2 className="size-5 text-yellow-200" />
            </div>
          </div>
        </section>
      )}
    </CharWorld>
  );
}