import { createFileRoute } from "@tanstack/react-router";
import { HandHeart, Leaf, Users, Gift, CheckCircle2, ChevronRight } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import lilaImg from "@/assets/char-lila.png";

export const Route = createFileRoute("/lila")({
  head: () => ({
    meta: [
      { title: "Lila — Serviço & Bondade | IGNIÇÃO" },
      { name: "description", content: "Aprenda a servir com Lila: missões de bondade, atividades de ajuda e participação no ministério." },
      { property: "og:title", content: "Lila — Serviço & Bondade" },
      { property: "og:description", content: "Missões de bondade e serviço para crianças." },
    ],
  }),
  component: LilaPage,
});

function LilaPage() {
  return (
    <CharWorld
      name="LILA"
      tagline="Serviço · Bondade"
      ink="text-[oklch(0.22_0.04_55)]"
      surface="bg-gradient-to-b from-[oklch(0.93_0.04_70)] via-[oklch(0.86_0.06_60)] to-[oklch(0.72_0.08_55)]"
      backdrop={
        <>
          <div className="absolute -top-32 -left-20 size-[28rem] rounded-full bg-[oklch(0.78_0.10_55)] opacity-40 blur-3xl" />
          <div className="absolute top-40 -right-32 size-96 rounded-full bg-[oklch(0.88_0.08_90)] opacity-40 blur-3xl" />
          <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[oklch(0.55_0.10_55)] to-transparent opacity-60" />
        </>
      }
    >
      {/* Hero */}
      <section className="px-6 mt-2">
        <div className="relative rounded-[2.5rem] bg-[oklch(0.98_0.02_70)] border border-[oklch(0.45_0.08_55)]/10 p-6 shadow-xl shadow-[oklch(0.45_0.08_55)]/20">
          <img
            src={lilaImg}
            alt="Lila"
            width={1024}
            height={1024}
            className="w-40 mx-auto drop-shadow-xl animate-float-soft"
          />
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[oklch(0.45_0.08_55)] mt-2">
            Coração que serve
          </p>
          <h2 className="text-center font-display font-bold text-3xl mt-1">Pequenos gestos, grande amor</h2>
          <p className="text-center text-[oklch(0.40_0.04_55)] text-sm mt-2 max-w-xs mx-auto">
            Lila tem uma missão pra você hoje. Vamos espalhar bondade?
          </p>
        </div>
      </section>

      {/* Weekly mission */}
      <section className="px-6 mt-6">
        <div className="rounded-[2rem] bg-[oklch(0.45_0.08_55)] text-[oklch(0.97_0.02_70)] p-5 border-l-8 border-[oklch(0.78_0.10_55)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.86_0.08_60)]">Missão da Semana</p>
          <p className="font-display font-bold text-xl leading-tight mt-1">Ajude alguém da sua família</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full w-1/3 bg-[oklch(0.86_0.10_70)] rounded-full" />
            </div>
            <span className="text-xs font-bold">1 / 3</span>
          </div>
        </div>
      </section>

      {/* Acts of kindness */}
      <section className="px-6 mt-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.08_55)] mb-3">Atos de Bondade</p>
        <div className="space-y-2">
          {[
            { Icon: CheckCircle2, t: "Organizei meus brinquedos", d: "Hoje · +10 XP", done: true },
            { Icon: Leaf, t: "Reguei uma planta", d: "Ontem · +10 XP", done: true },
            { Icon: HandHeart, t: "Convidei um amigo pra orar", d: "+25 XP" },
            { Icon: Gift, t: "Doei algo que amo", d: "+40 XP" },
          ].map(({ Icon, t, d, done }) => (
            <div
              key={t}
              className={`rounded-2xl p-4 flex items-center gap-3 border ${
                done
                  ? "bg-[oklch(0.55_0.10_55)]/10 border-[oklch(0.55_0.10_55)]/20"
                  : "bg-white border-[oklch(0.45_0.08_55)]/10"
              }`}
            >
              <div className={`size-10 rounded-xl grid place-items-center ${done ? "bg-[oklch(0.55_0.10_55)] text-white" : "bg-[oklch(0.90_0.06_60)] text-[oklch(0.45_0.08_55)]"}`}>
                <Icon className="size-5" />
              </div>
              <div className="flex-1">
                <p className={`font-display font-bold text-sm ${done ? "line-through opacity-70" : ""}`}>{t}</p>
                <p className="text-[11px] text-[oklch(0.40_0.04_55)]">{d}</p>
              </div>
              <ChevronRight className="size-4 text-[oklch(0.45_0.08_55)]/50" />
            </div>
          ))}
        </div>
      </section>

      {/* Ministry */}
      <section className="px-6 mt-6">
        <button className="w-full rounded-3xl bg-white border border-[oklch(0.45_0.08_55)]/10 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="size-12 rounded-2xl bg-[oklch(0.78_0.10_55)]/30 grid place-items-center">
            <Users className="size-6 text-[oklch(0.45_0.08_55)]" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-display font-bold text-base">Participar do Ministério</p>
            <p className="text-xs text-[oklch(0.40_0.04_55)]">Encontre uma equipe para servir</p>
          </div>
          <ChevronRight className="size-5 text-[oklch(0.45_0.08_55)]" />
        </button>
      </section>
    </CharWorld>
  );
}