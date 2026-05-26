import { createFileRoute } from "@tanstack/react-router";
import { Flame, BookOpen, Heart, Compass, Sparkles, ChevronRight } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import lumeImg from "@/assets/char-lume.png";

export const Route = createFileRoute("/lume")({
  head: () => ({
    meta: [
      { title: "Lume — Devocional & Evangelismo | IGNIÇÃO" },
      { name: "description", content: "Acenda sua jornada de fé com Lume: devocionais diários, leitura bíblica, desafios de oração e missões de evangelismo." },
      { property: "og:title", content: "Lume — Devocional & Evangelismo" },
      { property: "og:description", content: "Devocionais, leitura bíblica e missões de fé para crianças." },
    ],
  }),
  component: LumePage,
});

function LumePage() {
  return (
    <CharWorld
      name="LUME"
      tagline="Evangelismo · Devocional"
      surface="bg-gradient-to-b from-[oklch(0.78_0.18_55)] via-[oklch(0.68_0.22_45)] to-[oklch(0.52_0.21_35)]"
      backdrop={
        <>
          <div className="absolute -top-40 -right-32 size-[28rem] rounded-full bg-[oklch(0.92_0.16_85)] opacity-40 blur-3xl" />
          <div className="absolute top-40 -left-32 size-96 rounded-full bg-[oklch(0.72_0.22_30)] opacity-50 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[oklch(0.40_0.18_30)] to-transparent" />
        </>
      }
    >
      {/* Hero */}
      <section className="px-6 mt-2">
        <div className="relative rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 p-6 overflow-hidden">
          <div className="absolute -top-10 -right-10 size-48 rounded-full bg-[oklch(0.95_0.18_85)] blur-2xl opacity-60" />
          <img
            src={lumeImg}
            alt="Lume"
            width={1024}
            height={1024}
            className="relative w-40 mx-auto drop-shadow-2xl animate-float-soft"
          />
          <p className="relative text-center mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">
            Devocional de Hoje
          </p>
          <h2 className="relative text-center font-display font-bold text-3xl leading-tight mt-1">
            Uma Conversa com Jesus
          </h2>
          <p className="relative text-center text-white/85 text-sm mt-2 max-w-xs mx-auto">
            Acenda sua chama hoje. Lume vai te guiar por uma história que aquece o coração.
          </p>
          <button className="relative block mx-auto mt-5 bg-white text-[oklch(0.55_0.21_38)] font-display font-bold px-8 py-3 rounded-2xl shadow-xl active:scale-95 hover:scale-105 transition-transform">
            COMEÇAR DEVOCIONAL
          </button>
        </div>
      </section>

      {/* Spiritual Journey progress */}
      <section className="px-6 mt-6">
        <div className="rounded-3xl bg-white/10 backdrop-blur border border-white/15 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Jornada Espiritual</p>
            <span className="text-xs font-bold">Dia 12 · 🔥 streak</span>
          </div>
          <div className="h-3 rounded-full bg-black/20 overflow-hidden">
            <div className="h-full w-[60%] bg-gradient-to-r from-[oklch(0.92_0.16_85)] to-white rounded-full" />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-white/70">
            <span>Faísca</span><span>Chama</span><span>Fogueira</span><span>Farol</span>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 mt-6 grid grid-cols-2 gap-3">
        {[
          { Icon: BookOpen, title: "Leitura Bíblica", desc: "Plano em 21 dias", xp: "+30 XP" },
          { Icon: Heart, title: "Oração", desc: "Desafio do silêncio", xp: "+20 XP" },
          { Icon: Compass, title: "Evangelismo", desc: "Missão amigo novo", xp: "+50 XP" },
          { Icon: Sparkles, title: "Histórias", desc: "Faísca de fé", xp: "+15 XP" },
        ].map(({ Icon, title, desc, xp }) => (
          <button
            key={title}
            className="text-left rounded-3xl bg-white/10 backdrop-blur border border-white/15 p-4 hover:bg-white/20 transition-colors"
          >
            <div className="size-10 rounded-xl bg-white/90 grid place-items-center mb-3">
              <Icon className="size-5 text-[oklch(0.55_0.21_38)]" strokeWidth={2.5} />
            </div>
            <p className="font-display font-bold text-base leading-tight">{title}</p>
            <p className="text-xs text-white/70">{desc}</p>
            <p className="text-[10px] font-bold mt-2 text-[oklch(0.95_0.16_85)]">{xp}</p>
          </button>
        ))}
      </section>

      {/* Featured mission */}
      <section className="px-6 mt-6">
        <button className="w-full rounded-[2rem] bg-[oklch(0.32_0.12_30)] border border-white/15 p-5 flex items-center gap-4 text-left hover:bg-[oklch(0.38_0.14_30)] transition-colors">
          <div className="size-14 rounded-2xl bg-[oklch(0.92_0.16_85)] grid place-items-center text-[oklch(0.45_0.18_30)] flex-shrink-0">
            <Flame className="size-7" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.92_0.16_85)]">Missão da Semana</p>
            <p className="font-display font-bold text-lg leading-tight">Acenda a fé de um amigo</p>
            <p className="text-xs text-white/60">Conte a história de Jesus para alguém</p>
          </div>
          <ChevronRight className="size-5" />
        </button>
      </section>
    </CharWorld>
  );
}