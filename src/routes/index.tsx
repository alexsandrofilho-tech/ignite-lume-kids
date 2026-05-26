import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, Home, Map as MapIcon, Play, Users, Heart, Sparkles, BookOpen } from "lucide-react";
import uniImg from "@/assets/char-uni.png";
import lumeImg from "@/assets/char-lume.png";
import risoImg from "@/assets/char-risoleta.png";
import louImg from "@/assets/char-louvaldo.png";
import lilaImg from "@/assets/char-lila.png";
import castHero from "@/assets/cast-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IGNIÇÃO — Ministério Infantil | Igreja da Cidade" },
      {
        name: "description",
        content:
          "IGNIÇÃO: ecossistema digital do ministério infantil da Igreja da Cidade. Discipulado, devocional, louvor e família em uma jornada cinematográfica e bilíngue.",
      },
      { property: "og:title", content: "IGNIÇÃO — Ministério Infantil" },
      {
        property: "og:description",
        content: "Discipulado, louvor e família em uma jornada cinematográfica para crianças.",
      },
    ],
  }),
  component: Index,
});

type Lang = "pt" | "en";

const t = {
  pt: {
    welcome: "Bem-vindo, Família Silva",
    checkin: "Check-in Rápido",
    portals: "Os 5 Mundos",
    todayDevo: "Devocional de Hoje",
    devoTitle: "Uma Conversa com Jesus",
    devoDesc: "Descubra o que Lume tem para te contar hoje sobre o amor.",
    start: "COMEÇAR",
    bibleAdv: "Aventura Bíblica",
    phase: "Fase 4: O Mar Vermelho",
    faithMission: "Missão de Fé",
    achievements: "Conquistas",
    collectibles: "12 Colecionáveis",
    nowPlaying: "Tocando agora",
    song: "Sou Criança, Sou de Deus",
    weeklyMission: "Missão da Semana",
    weeklyDesc: "Ajude um amiguinho e ganhe a estrela da bondade.",
    parents: "Painel dos Pais",
    parentsDesc: "Check-in, avisos e calendário",
    nav: { home: "Início", journey: "Jornada", play: "Play", family: "Família" },
    portalNames: {
      unny: "Família",
      lume: "Devocional",
      riso: "Aprender",
      lou: "Louvor",
      lila: "Servir",
    },
  },
  en: {
    welcome: "Welcome, Silva Family",
    checkin: "Quick Check-in",
    portals: "The 5 Worlds",
    todayDevo: "Today's Devotional",
    devoTitle: "A Talk with Jesus",
    devoDesc: "Discover what Lume has to share about love today.",
    start: "START",
    bibleAdv: "Bible Adventure",
    phase: "Level 4: The Red Sea",
    faithMission: "Faith Mission",
    achievements: "Achievements",
    collectibles: "12 Collectibles",
    nowPlaying: "Now playing",
    song: "I Am a Child of God",
    weeklyMission: "Weekly Mission",
    weeklyDesc: "Help a friend and earn the kindness star.",
    parents: "Parents Dashboard",
    parentsDesc: "Check-in, alerts & calendar",
    nav: { home: "Home", journey: "Journey", play: "Play", family: "Family" },
    portalNames: {
      unny: "Family",
      lume: "Devotional",
      riso: "Learn",
      lou: "Worship",
      lila: "Serve",
    },
  },
} as const;

function Index() {
  const [lang, setLang] = useState<Lang>("pt");
  const [active, setActive] = useState<"unny" | "lume" | "riso" | "lou" | "lila">("lume");
  const c = t[lang];

  const portals = [
    { id: "unny", to: "/unny", bg: "bg-unny", text: "text-unny-ink", shadow: "shadow-unny/40", img: uniImg, label: "UNNY", theme: c.portalNames.unny },
    { id: "lume", to: "/lume", bg: "bg-lume", text: "text-lume", shadow: "shadow-lume/40", img: lumeImg, label: "LUME", theme: c.portalNames.lume },
    { id: "riso", to: "/risoleta", bg: "bg-riso-lilac", text: "text-riso-lilac", shadow: "shadow-riso-lilac/40", img: risoImg, label: "RISOLETA", theme: c.portalNames.riso },
    { id: "lou", to: "/louvaldo", bg: "bg-lou", text: "text-lou", shadow: "shadow-lou/40", img: louImg, label: "LOUVALDO", theme: c.portalNames.lou },
    { id: "lila", to: "/lila", bg: "bg-lila", text: "text-lila", shadow: "shadow-lila/40", img: lilaImg, label: "LILA", theme: c.portalNames.lila },
  ] as const;

  return (
    <div className="min-h-screen bg-warm-bg text-stone-800 pb-32">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-ignition rounded-2xl rotate-3 shadow-lg shadow-ignition/30 flex items-center justify-center">
              <span className="font-display font-bold text-white text-2xl tracking-tight">I!</span>
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-stone-900">
              IGNIÇÃO
            </h1>
          </div>
          <button
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            className="bg-white/80 backdrop-blur-sm border border-stone-200 px-4 py-2 rounded-full text-xs font-bold tracking-widest text-stone-500 hover:shadow-md transition-shadow"
            aria-label="Toggle language"
          >
            <span className={lang === "pt" ? "text-ignition" : ""}>PT</span>
            <span className="mx-1 text-stone-300">|</span>
            <span className={lang === "en" ? "text-ignition" : ""}>EN</span>
          </button>
        </header>

        {/* Cast Hero */}
        <section className="px-6 mb-6">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-300/50 border border-white aspect-square">
            <img
              src={castHero}
              alt="Lume, Louvaldo, Lila, Unny e Risoleta"
              width={1024}
              height={1024}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">IGNIÇÃO</p>
              <h2 className="font-display font-bold text-2xl leading-tight drop-shadow-lg">
                Lume · Louvaldo · Lila · Unny · Risoleta
              </h2>
            </div>
          </div>
        </section>

        {/* Family Desk / Check-in */}
        <section className="px-6 mb-6">
          <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-stone-200/50 flex items-center gap-4 border border-stone-100">
            <div className="size-16 rounded-2xl bg-stone-50 outline outline-1 -outline-offset-1 outline-black/5 grid place-items-center flex-shrink-0 overflow-hidden">
              <img src={uniImg} alt="Unny" width={64} height={64} className="size-14 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest truncate">
                {c.welcome}
              </p>
              <h2 className="text-xl font-display font-bold text-stone-900">{c.checkin}</h2>
            </div>
            <button className="size-12 bg-ignition/10 rounded-full flex items-center justify-center hover:bg-ignition/20 transition-colors">
              <QrCode className="size-6 text-ignition" strokeWidth={2.5} />
            </button>
          </div>
        </section>

        {/* 5 Character Portals */}
        <p className="px-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
          {c.portals}
        </p>
        <nav className="px-6 flex gap-3 overflow-x-auto no-scrollbar mb-8">
          {portals.map((p) => {
            const isActive = active === p.id;
            return (
              <Link
                key={p.id}
                to={p.to}
                onMouseEnter={() => setActive(p.id)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div
                  className={`size-16 rounded-2xl flex items-center justify-center transition-all overflow-hidden ${p.bg} ${p.shadow} shadow-xl group-hover:-translate-y-1 ${
                    isActive ? "ring-4 ring-white ring-offset-2 ring-offset-warm-bg scale-105" : ""
                  }`}
                >
                  <img
                    src={p.img}
                    alt={p.label}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="size-full object-contain p-1 animate-float-soft"
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${p.text}`}
                >
                  {p.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Main content cards */}
        <main className="px-6 space-y-6">
          {/* Devotional (LUME) */}
          <Link to="/lume" className="block relative bg-gradient-to-br from-lume to-[oklch(0.55_0.22_35)] rounded-[2.5rem] p-6 text-white overflow-hidden shadow-2xl shadow-lume/30 hover:scale-[1.01] transition-transform">
            <div className="absolute -top-4 -right-4 size-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 max-w-[60%]">
              <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {c.todayDevo}
              </span>
              <h3 className="text-3xl font-display font-bold mt-4 mb-2 leading-tight">
                {c.devoTitle}
              </h3>
              <p className="text-white/80 text-sm mb-6">{c.devoDesc}</p>
              <span className="inline-block bg-white text-lume font-display font-bold px-8 py-3 rounded-2xl shadow-lg">
                {c.start}
              </span>
            </div>
            <img
              src={lumeImg}
              alt="Lume"
              width={220}
              height={220}
              loading="lazy"
              className="absolute -bottom-4 -right-4 size-52 object-contain drop-shadow-2xl animate-float-soft"
            />
          </Link>

          {/* Bible Adventure (RISOLETA) */}
          <Link to="/risoleta" className="block bg-white border border-stone-100 rounded-[2.5rem] p-6 shadow-xl shadow-stone-200/50 hover:shadow-2xl transition-shadow">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h4 className="font-display font-bold text-2xl text-stone-900">{c.bibleAdv}</h4>
                <p className="text-stone-400 text-sm">{c.phase}</p>
              </div>
              <div className="size-14 rounded-full border-4 border-riso-lilac flex items-center justify-center text-riso-lilac font-display font-bold">
                75%
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-riso/15 p-4 rounded-3xl border border-riso/20 hover:shadow-md transition-shadow cursor-pointer">
                <div className="size-12 bg-white rounded-xl mb-3 shadow-sm flex items-center justify-center">
                  <BookOpen className="size-6 text-riso-lilac" />
                </div>
                <span className="text-xs font-bold text-stone-900 block">{c.faithMission}</span>
                <span className="text-[10px] text-stone-400">+50 XP</span>
              </div>
              <div className="bg-riso-lilac/10 p-4 rounded-3xl border border-riso-lilac/20 hover:shadow-md transition-shadow cursor-pointer">
                <div className="size-12 bg-white rounded-xl mb-3 shadow-sm flex items-center justify-center">
                  <Sparkles className="size-6 text-ignition" />
                </div>
                <span className="text-xs font-bold text-stone-900 block">{c.achievements}</span>
                <span className="text-[10px] text-stone-400">{c.collectibles}</span>
              </div>
            </div>
          </Link>

          {/* Worship (LOUVALDO) */}
          <Link to="/louvaldo" className="bg-lou/10 border border-lou/20 rounded-[2.5rem] p-5 flex items-center gap-5 hover:bg-lou/15 transition-colors">
            <div className="size-20 bg-lou rounded-[2rem] shadow-lg shadow-lou/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={louImg} alt="Louvaldo" width={80} height={80} className="size-full object-contain p-1" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lou font-bold text-[10px] uppercase tracking-widest">{c.nowPlaying}</p>
              <h4 className="text-stone-900 font-display font-bold text-lg leading-tight truncate">
                {c.song}
              </h4>
              <div className="flex gap-1 mt-2 items-end h-5">
                <div className="w-1 h-3 bg-lou rounded-full animate-bounce" />
                <div className="w-1 h-5 bg-lou rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-1 h-2 bg-lou rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-4 bg-lou rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                <div className="w-1 h-3 bg-lou rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
            <span className="size-12 bg-lou rounded-full flex items-center justify-center text-white shadow-lg">
              <Play className="size-5 fill-current ml-0.5" />
            </span>
          </Link>

          {/* Weekly Mission (LILA) */}
          <Link to="/lila" className="bg-gradient-to-br from-lila/20 to-lila/5 border border-lila/30 rounded-[2.5rem] p-6 flex items-center gap-4 hover:from-lila/30 transition-colors">
            <img src={lilaImg} alt="Lila" width={80} height={80} className="size-20 object-contain flex-shrink-0 animate-float-soft" loading="lazy" />
            <div className="flex-1">
              <p className="text-lila font-bold text-[10px] uppercase tracking-widest mb-1">
                {c.weeklyMission}
              </p>
              <p className="text-stone-900 font-display font-bold text-base leading-tight mb-2">
                {c.weeklyDesc}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-lila/15 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-lila rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-lila">1/3</span>
              </div>
            </div>
          </Link>

          {/* Parents Hub (UNNY) */}
          <Link to="/unny" className="bg-unny-ink rounded-[2.5rem] p-5 flex items-center gap-4 shadow-2xl shadow-unny-ink/30 border-l-8 border-unny hover:bg-stone-800 transition-colors">
            <div className="size-12 bg-unny rounded-2xl flex items-center justify-center flex-shrink-0">
              <Users className="size-6 text-unny-ink" strokeWidth={2.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-display font-bold text-base">{c.parents}</p>
              <p className="text-unny/80 text-xs">{c.parentsDesc}</p>
            </div>
            <div className="text-unny font-display font-bold text-2xl">→</div>
          </Link>
        </main>

        {/* Bottom Nav */}
        <div className="fixed bottom-6 left-6 right-6 max-w-[calc(36rem-3rem)] mx-auto h-20 bg-stone-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex items-center justify-around px-4 border border-white/10">
          {[
            { Icon: Home, label: c.nav.home, active: true },
            { Icon: MapIcon, label: c.nav.journey },
            { Icon: Play, label: c.nav.play },
            { Icon: Heart, label: c.nav.family },
          ].map(({ Icon, label, active: isOn }, i) => (
            <button key={i} className={`flex flex-col items-center gap-1 ${isOn ? "text-white" : "text-stone-500"}`}>
              <Icon className="size-5" />
              <span className="font-bold text-[9px] tracking-tight uppercase">{label}</span>
              {isOn && <div className="size-1 bg-ignition rounded-full" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
