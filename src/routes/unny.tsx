import { createFileRoute } from "@tanstack/react-router";
import { QrCode, Calendar, Bell, ShieldCheck, Users, ChevronRight } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import unnyImg from "@/assets/char-uni.png";

export const Route = createFileRoute("/unny")({
  head: () => ({
    meta: [
      { title: "Unny — Família & Check-in | IGNIÇÃO" },
      { name: "description", content: "Família, comunhão e segurança com Unny: check-in e check-out, calendário, painel dos pais e notificações." },
      { property: "og:title", content: "Unny — Família & Check-in" },
      { property: "og:description", content: "Família e check-in seguro do ministério infantil." },
    ],
  }),
  component: UnnyPage,
});

function UnnyPage() {
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
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[oklch(0.85_0.17_92)]">Família Silva</p>
          <h2 className="font-display font-bold text-3xl leading-tight mt-1 max-w-[60%]">Painel da Família</h2>
          <p className="text-white/70 text-sm mt-2 max-w-[55%]">Tudo organizado, seguro e prontinho.</p>
        </div>
      </section>

      {/* Big check-in */}
      <section className="px-6 mt-5">
        <button className="w-full rounded-[2rem] bg-[oklch(0.85_0.17_92)] text-[oklch(0.18_0.02_60)] p-5 flex items-center gap-4 shadow-lg shadow-[oklch(0.85_0.17_92)]/40 active:scale-[0.98] transition-transform border-b-4 border-[oklch(0.18_0.02_60)]">
          <div className="size-14 rounded-2xl bg-[oklch(0.18_0.02_60)] text-[oklch(0.85_0.17_92)] grid place-items-center flex-shrink-0">
            <QrCode className="size-7" strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest">Check-in rápido</p>
            <p className="font-display font-bold text-xl leading-tight">Escaneie o QR Code</p>
          </div>
          <ChevronRight className="size-6" strokeWidth={2.5} />
        </button>
      </section>

      {/* Children */}
      <section className="px-6 mt-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.35_0.02_60)] mb-3">Seus pequenos</p>
        <div className="space-y-2">
          {[
            { name: "Sofia", age: 7, room: "Sala Cores · Check-in OK", in: true },
            { name: "Miguel", age: 4, room: "Sala Sementinhas", in: false },
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
                {k.in ? "DENTRO" : "FAZER CHECK-IN"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-6 mt-6 grid grid-cols-2 gap-3">
        {[
          { Icon: Calendar, t: "Calendário", d: "Próximo: Sáb 16h" },
          { Icon: Bell, t: "Avisos", d: "2 novos" },
          { Icon: ShieldCheck, t: "Segurança", d: "Tudo certo" },
          { Icon: Users, t: "Comunhão", d: "Conecte famílias" },
        ].map(({ Icon, t, d }) => (
          <button key={t} className="rounded-3xl bg-white border border-[oklch(0.18_0.02_60)]/10 p-4 text-left hover:shadow-md transition-shadow">
            <div className="size-10 rounded-xl bg-[oklch(0.85_0.17_92)] grid place-items-center mb-3">
              <Icon className="size-5 text-[oklch(0.18_0.02_60)]" strokeWidth={2.5} />
            </div>
            <p className="font-display font-bold text-base">{t}</p>
            <p className="text-xs text-[oklch(0.40_0.02_60)]">{d}</p>
          </button>
        ))}
      </section>
    </CharWorld>
  );
}