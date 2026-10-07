import { createFileRoute, Link } from "@tanstack/react-router";
import { AppBottomNav } from "@/components/AppBottomNav";
import { Play as PlayIcon, Music, Gamepad2, BookOpen, Sparkles } from "lucide-react";
import lumeImg from "@/assets/char-lume.png";
import louImg from "@/assets/char-louvaldo.png";
import risoImg from "@/assets/char-lila.png";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play — IGNIÇÃO" },
      { name: "description", content: "Jogos, músicas e histórias bíblicas interativas para a criançada." },
      { property: "og:title", content: "Play — IGNIÇÃO" },
      { property: "og:description", content: "Diversão com propósito: música, quiz e aventuras bíblicas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayPage,
});

const songs = [
  { title: "Sou Criança, Sou de Deus", artist: "Cia do Lume", to: "/louvaldo" },
  { title: "A Luz que Não se Apaga", artist: "Cia do Lume", to: "/louvaldo" },
  { title: "Bondade em Ação", artist: "Cia do Lume", to: "/louvaldo/violao" },
] as const;

const games = [
  { title: "Quiz Bíblico", desc: "Teste seu conhecimento", to: "/lila/quiz", Icon: BookOpen, color: "bg-riso-lilac" },
  { title: "Bateria do Louvaldo", desc: "Sinta o ritmo", to: "/louvaldo/bateria", Icon: Music, color: "bg-lou" },
  { title: "Violão do Louvaldo", desc: "Aprenda acordes", to: "/louvaldo/violao", Icon: Sparkles, color: "bg-ignition" },
  { title: "Missão da Bondade", desc: "Ganhe estrelas servindo", to: "/lila/jornada", Icon: Gamepad2, color: "bg-lila" },
] as const;

function PlayPage() {
  return (
    <div className="min-h-dvh text-stone-800 pb-32">
      <div className="mx-auto max-w-xl px-6 pt-8">
        <header className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ignition mb-1">IGNIÇÃO</p>
          <h1 className="font-display font-extrabold text-3xl leading-tight text-stone-900">Play</h1>
          <p className="text-sm text-stone-500 mt-1">Música, jogos e histórias para brincar com propósito.</p>
        </header>

        <Link
          to="/lume"
          className="block relative bg-gradient-to-br from-lume to-[oklch(0.78_0.18_60)] rounded-[2.5rem] p-6 text-white overflow-hidden shadow-2xl shadow-orange-200/60 mb-6 hover:scale-[1.01] transition-transform"
        >
          <div className="absolute -right-2 -bottom-2 size-32 opacity-30">
            <img src={lumeImg} alt="" width={128} height={128} className="size-full object-contain" />
          </div>
          <div className="relative max-w-[65%]">
            <span className="inline-block bg-white/20 backdrop-blur-md text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
              Em destaque
            </span>
            <h2 className="text-2xl font-display font-extrabold leading-tight mb-3">História com o Lume</h2>
            <span className="inline-flex items-center gap-2 bg-white text-ignition font-display font-black px-5 py-2 rounded-2xl text-xs uppercase tracking-wider shadow-lg">
              <PlayIcon className="size-4 fill-current" aria-hidden="true" /> Assistir
            </span>
          </div>
        </Link>

        <section aria-labelledby="songs-heading" className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 id="songs-heading" className="font-display font-extrabold text-lg text-stone-900">Músicas</h2>
            <Link to="/louvaldo" className="text-xs font-bold text-lou hover:underline">Ver todas</Link>
          </div>
          <ul className="space-y-2">
            {songs.map((s) => (
              <li key={s.title}>
                <Link
                  to={s.to}
                  className="flex items-center gap-3 bg-white border border-stone-100 rounded-2xl p-3 hover:shadow-md transition-shadow min-h-11"
                >
                  <div className="size-12 rounded-xl bg-emerald-50 grid place-items-center shrink-0 overflow-hidden">
                    <img src={louImg} alt="" width={48} height={48} className="size-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 text-sm truncate">{s.title}</p>
                    <p className="text-[11px] text-stone-500 truncate">{s.artist}</p>
                  </div>
                  <span aria-label={`Tocar ${s.title}`} className="size-10 bg-lou rounded-full grid place-items-center text-white shadow shrink-0">
                    <PlayIcon className="size-4 fill-current ml-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="games-heading">
          <h2 id="games-heading" className="font-display font-extrabold text-lg text-stone-900 mb-3">Jogos</h2>
          <div className="grid grid-cols-2 gap-3">
            {games.map((g) => (
              <Link
                key={g.title}
                to={g.to}
                className="bg-white border border-stone-100 rounded-3xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className={`size-10 rounded-2xl ${g.color} text-white grid place-items-center mb-3 shadow-md`}>
                  <g.Icon className="size-5" aria-hidden="true" />
                </div>
                <p className="font-bold text-stone-900 text-sm leading-tight">{g.title}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">{g.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 opacity-90" aria-hidden="true">
            <img src={risoImg} alt="" className="size-12 object-contain mx-auto animate-float-soft" />
            <img src={lumeImg} alt="" className="size-12 object-contain mx-auto animate-float-soft" style={{ animationDelay: "0.3s" }} />
            <img src={louImg} alt="" className="size-12 object-contain mx-auto animate-float-soft" style={{ animationDelay: "0.6s" }} />
          </div>
        </section>
      </div>
      <AppBottomNav />
    </div>
  );
}