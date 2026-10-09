import { createFileRoute, Link } from "@tanstack/react-router";
import { AppBottomNav } from "@/components/AppBottomNav";
import { FamilyExtras } from "@/components/AreaExtras";
import { Calendar, Bell, CheckCircle2, Users, ChevronRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import uniImg from "@/assets/char-uni.png";

export const Route = createFileRoute("/familia")({
  head: () => ({
    meta: [
      { title: "Família — IGNIÇÃO" },
      { name: "description", content: "Painel dos pais: check-in, avisos, calendário e progresso dos filhos." },
      { property: "og:title", content: "Família — IGNIÇÃO" },
      { property: "og:description", content: "Tudo o que a família precisa para acompanhar a jornada das crianças." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FamiliaPage,
});

const kids = [
  { name: "Ana", age: 7, world: "Risoleta", progress: 75, color: "bg-riso-lilac" },
  { name: "Pedro", age: 5, world: "Lume", progress: 40, color: "bg-lume" },
] as const;

const events = [
  { day: "Dom", date: "22", title: "Culto Infantil", time: "09:30" },
  { day: "Qua", date: "25", title: "Devocional em Família", time: "19:00" },
  { day: "Sáb", date: "28", title: "Missão da Bondade", time: "15:00" },
] as const;

function FamiliaPage() {
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <div className="min-h-dvh text-stone-800 pb-32">
      <div className="mx-auto max-w-xl px-6 pt-8">
        <header className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ignition mb-1">IGNIÇÃO</p>
          <h1 className="font-display font-extrabold text-3xl leading-tight text-stone-900">Família Silva</h1>
          <p className="text-sm text-stone-500 mt-1">Acompanhe, celebre e participe da jornada.</p>
        </header>

        <section
          aria-labelledby="checkin-heading"
          className="rounded-[2rem] bg-[#1e293b] text-white p-5 shadow-xl mb-6 flex items-center gap-4"
        >
          <div className="size-14 rounded-2xl bg-ignition grid place-items-center shrink-0 overflow-hidden">
            <img src={uniImg} alt="" width={56} height={56} className="size-full object-contain p-1" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="checkin-heading" className="font-display font-extrabold text-base">Check-in Rápido</h2>
            <p className="text-[11px] text-slate-300">
              {checkedIn ? "Presença confirmada para domingo!" : "Confirme presença no culto de domingo."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCheckedIn((v) => !v)}
            aria-pressed={checkedIn}
            className={`font-display font-black text-[11px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors ${
              checkedIn ? "bg-emerald-500 text-white" : "bg-ignition text-white"
            }`}
          >
            {checkedIn ? "Feito" : "Confirmar"}
          </button>
        </section>

        <section aria-labelledby="kids-heading" className="mb-6">
          <h2 id="kids-heading" className="font-display font-extrabold text-lg text-stone-900 mb-3 flex items-center gap-2">
            <Users className="size-5 text-ignition" aria-hidden="true" /> Crianças
          </h2>
          <ul className="space-y-3">
            {kids.map((k) => (
              <li key={k.name} className="bg-white border border-stone-100 rounded-3xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-stone-900">
                      {k.name} <span className="text-stone-400 font-semibold text-xs">· {k.age} anos</span>
                    </p>
                    <p className="text-[11px] text-stone-500">Mundo atual: {k.world}</p>
                  </div>
                  <span className="text-xs font-black text-stone-700">{k.progress}%</span>
                </div>
                <div
                  className="h-2 bg-stone-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={k.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso de ${k.name}`}
                >
                  <div className={`h-full ${k.color} rounded-full`} style={{ width: `${k.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cal-heading" className="mb-6">
          <h2 id="cal-heading" className="font-display font-extrabold text-lg text-stone-900 mb-3 flex items-center gap-2">
            <Calendar className="size-5 text-ignition" aria-hidden="true" /> Próximos eventos
          </h2>
          <ul className="space-y-2">
            {events.map((e) => (
              <li key={e.title} className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="text-center shrink-0 w-14">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-ignition">{e.day}</p>
                  <p className="font-display font-black text-xl text-stone-900 leading-none">{e.date}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900 text-sm truncate">{e.title}</p>
                  <p className="text-[11px] text-stone-500">{e.time}</p>
                </div>
                <CheckCircle2 className="size-5 text-emerald-400 shrink-0" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="actions-heading">
          <h2 id="actions-heading" className="sr-only">Ações rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/unny" className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow min-h-11">
              <Bell className="size-5 text-ignition" aria-hidden="true" />
              <span className="font-bold text-sm text-stone-900">Avisos</span>
              <ChevronRight className="size-4 text-stone-300 ml-auto" aria-hidden="true" />
            </Link>
            <Link to="/unny" className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow min-h-11">
              <MessageCircle className="size-5 text-ignition" aria-hidden="true" />
              <span className="font-bold text-sm text-stone-900">Fale com o pastor</span>
              <ChevronRight className="size-4 text-stone-300 ml-auto" aria-hidden="true" />
            </Link>
          </div>
        </section>
        <FamilyExtras />
      </div>
      <AppBottomNav />
    </div>
  );
}