import { createFileRoute } from "@tanstack/react-router";
import { Play, Mic, Music2, Disc3, ChevronRight } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import louImg from "@/assets/char-louvaldo.png";

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
            Tocando agora
          </p>
          <h2 className="text-center font-display font-bold text-3xl mt-1">Sou Criança, Sou de Deus</h2>

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
            <button className="size-16 rounded-full bg-white text-[oklch(0.45_0.16_150)] grid place-items-center shadow-2xl active:scale-95 hover:scale-105 transition-transform">
              <Play className="size-7 fill-current ml-1" />
            </button>
            <button className="size-12 rounded-full bg-white/20 grid place-items-center hover:bg-white/30 transition">
              <Mic className="size-5" />
            </button>
          </div>
        </div>
      </section>

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
          { title: "Karaokê", desc: "Cante junto", color: "from-[oklch(0.85_0.20_140)] to-[oklch(0.55_0.18_150)]" },
          { title: "Bateria", desc: "Mantenha o ritmo", color: "from-[oklch(0.75_0.18_160)] to-[oklch(0.40_0.14_155)]" },
          { title: "Violão", desc: "Toque acordes", color: "from-[oklch(0.80_0.18_135)] to-[oklch(0.45_0.16_145)]" },
          { title: "Desafio Rítmico", desc: "+100 XP", color: "from-[oklch(0.70_0.20_155)] to-[oklch(0.35_0.12_150)]" },
        ].map((g) => (
          <button key={g.title} className={`rounded-3xl bg-gradient-to-br ${g.color} p-4 text-left border border-white/15 hover:scale-[1.02] transition-transform`}>
            <p className="font-display font-bold text-base leading-tight">{g.title}</p>
            <p className="text-xs text-white/80">{g.desc}</p>
            <ChevronRight className="size-5 mt-3 ml-auto" />
          </button>
        ))}
      </section>
    </CharWorld>
  );
}