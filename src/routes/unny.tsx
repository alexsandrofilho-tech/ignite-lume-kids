import { createFileRoute } from "@tanstack/react-router";
import { QrCode, Calendar, Bell, ShieldCheck, Users, ChevronRight } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import { CharacterTabs } from "@/components/CharacterTabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import unnyImg from "@/assets/char-uni.png";

export const Route = createFileRoute("/unny")({
  head: () => ({
    meta: [
      { title: "Unny — Família & Comunhão | IGNIÇÃO" },
      { name: "description", content: "Conversas, atividades em família e lembretes pessoais com Unny." },
      { property: "og:title", content: "Unny — Família & Comunhão" },
      { property: "og:description", content: "Atividades e conversas para cultivar a fé em família." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UnnyPage,
});

function UnnyPage() {
  const [tab, setTab] = useState('overview');
  return (
    <CharWorld
      name="UNNY"
      tagline="Família · Comunhão"
      ink="text-[oklch(0.18_0.02_60)]"
      surface="bg-[oklch(0.97_0.04_92)]"
      backdrop={
        <>
          {/* honeycomb pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20px 20px, oklch(0.18 0.02 60) 2px, transparent 2px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[oklch(0.92_0.18_92)] to-transparent" />
        </>
      }
    >
      <CharacterTabs character="unny" value={tab} onValueChange={setTab}>
      {/* Family hero */}
      <section className="px-6 mt-2">
        <div className="rounded-[2.5rem] bg-[oklch(0.18_0.02_60)] text-[oklch(0.97_0.04_92)] p-6 relative overflow-hidden border-l-8 border-[oklch(0.85_0.17_92)]">
          <div className="absolute -bottom-8 -right-8 size-44 rounded-full bg-[oklch(0.85_0.17_92)] opacity-90" />
          <img
            src={unnyImg}
            alt="Unny"
            width={1024}
            height={1024}
            className="absolute -bottom-2 -right-2 w-36 drop-shadow-2xl animate-float-soft"
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[oklch(0.85_0.17_92)]">Nosso cantinho</p>
          <h2 className="font-display font-bold text-3xl leading-tight mt-1 max-w-[60%]">Painel da Família</h2>
          <p className="text-white/70 text-sm mt-2 max-w-[55%]">Momentos para estar perto.</p>
        </div>
      </section>

      {/* Big check-in */}
      <section className="px-6 mt-5">
        <Button variant="worldGhost" onClick={() => setTab("together")} className="h-auto whitespace-normal w-full rounded-[2rem] bg-[oklch(0.85_0.17_92)] text-[oklch(0.18_0.02_60)] p-5 flex items-center gap-4 shadow-lg shadow-[oklch(0.85_0.17_92)]/40 active:scale-[0.98] transition-transform border-b-4 border-[oklch(0.18_0.02_60)]">
          <div className="size-14 rounded-2xl bg-[oklch(0.18_0.02_60)] text-[oklch(0.85_0.17_92)] grid place-items-center flex-shrink-0">
            <QrCode className="size-7" strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest">Tempo em família</p>
            <p className="font-display font-bold text-xl leading-tight">Nosso próximo encontro</p>
          </div>
          <ChevronRight className="size-6" strokeWidth={2.5} />
        </Button>
      </section>

      {/* Children */}
      <section className="px-6 mt-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.35_0.02_60)] mb-3">Personagens de exemplo</p>
        <div className="space-y-2">
          {[
            { name: "Sofia", age: 7, room: "7 anos · perfil ilustrativo", in: true },
            { name: "Miguel", age: 4, room: "4 anos · perfil ilustrativo", in: false },
          ].map((k) => (
            <div key={k.name} className="rounded-2xl bg-white border border-[oklch(0.18_0.02_60)]/10 p-4 flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-[oklch(0.92_0.10_92)] grid place-items-center font-display font-bold text-[oklch(0.18_0.02_60)]">
                {k.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-base">{k.name} · {k.age}a</p>
                <p className="text-xs text-[oklch(0.40_0.02_60)]">{k.room}</p>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${k.in ? "bg-[oklch(0.85_0.17_92)] text-[oklch(0.18_0.02_60)]" : "bg-[oklch(0.18_0.02_60)] text-[oklch(0.85_0.17_92)]"}`}>
                {k.in ? "EXEMPLO" : "EXEMPLO"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-6 mt-6 grid grid-cols-2 gap-3">
        {[
          { Icon: Calendar, t: "Calendário", d: "Meus lembretes", tab: "reminders" },
          { Icon: Bell, t: "Conversar", d: "Uma carta para nós", tab: "conversation" },
          { Icon: ShieldCheck, t: "Juntos", d: "Nosso encontro", tab: "together" },
          { Icon: Users, t: "Comunhão", d: "Gestos em família", tab: "family" },
        ].map(({ Icon, t, d, tab: targetTab }) => (
          <Button variant="worldGhost" onClick={() => setTab(targetTab)} key={t} className="block h-auto whitespace-normal rounded-3xl bg-white border border-[oklch(0.18_0.02_60)]/10 p-4 text-left hover:shadow-md transition-shadow">
            <div className="size-10 rounded-xl bg-[oklch(0.85_0.17_92)] grid place-items-center mb-3">
              <Icon className="size-5 text-[oklch(0.18_0.02_60)]" strokeWidth={2.5} />
            </div>
            <p className="font-display font-bold text-base">{t}</p>
            <p className="text-xs text-[oklch(0.40_0.02_60)]">{d}</p>
          </Button>
        ))}
      </section>
      </CharacterTabs>
    </CharWorld>
  );
}