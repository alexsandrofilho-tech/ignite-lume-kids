import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Users, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import { AppBottomNav } from "@/components/AppBottomNav";
import { HomeExtras } from "@/components/AreaExtras";
import uniImg from "@/assets/char-uni.png";
import lumeImg from "@/assets/char-lume.png";
import risoImg from "@/assets/char-lila.png";
import louImg from "@/assets/char-louvaldo.png";
import lilaImg from "@/assets/char-risoleta.png";
import castHero from "@/assets/cast-hero.png.asset.json";
import ciaLogo from "@/assets/cia-do-lume.png.asset.json";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: castHero.url },
      { name: "twitter:image", content: castHero.url },
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
    <div className="min-h-screen text-stone-800 pb-32">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <img
            src={ciaLogo.url}
            alt="Cia do Lume"
            width={160}
            height={88}
            className="h-14 w-auto object-contain drop-shadow-sm"
          />
          <button
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            className="bg-stone-100 p-1 rounded-full text-[10px] font-bold tracking-widest text-stone-400 flex items-center"
            aria-label="Toggle language"
          >
            <span className={`px-3 py-1 rounded-full ${lang === "pt" ? "bg-white text-ignition shadow-sm" : ""}`}>PT</span>
            <span className={`px-3 py-1 rounded-full ${lang === "en" ? "bg-white text-ignition shadow-sm" : ""}`}>EN</span>
          </button>
        </header>

        {/* Cast Hero */}
        <section className="px-6 mb-6">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-200/60 border-4 border-white aspect-square">
            <img
              src={castHero.url}
              alt="Lume, Louvaldo, Lila, Unny e Risoleta"
              width={1024}
              height={1024}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ignition mb-1">IGNIÇÃO</p>
              <h2 className="font-display font-extrabold text-xl leading-tight drop-shadow-lg">
                Lume · Louvaldo · Lila · Unny · Risoleta
              </h2>
            </div>
          </div>
        </section>

        {/* 5 Character Portals */}
        <p className="px-6 font-display text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">
          {c.portals}
        </p>
        <nav className="px-6 flex gap-4 overflow-x-auto no-scrollbar mb-8">
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
                  className={`size-16 rounded-2xl p-1 flex items-center justify-center transition-all ${p.bg} ${p.shadow} shadow-lg group-hover:-translate-y-1 ${
                    isActive ? "ring-4 ring-white scale-110" : ""
                  }`}
                >
                  <div className="size-full rounded-xl bg-white/95 grid place-items-center overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.label}
                      width={64}
                      height={64}
                      loading="lazy"
                      className="size-full object-contain p-1 animate-float-soft"
                    />
                  </div>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-widest ${isActive ? p.text : "text-stone-400"}`}
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
          <Link to="/lume" className="block relative bg-gradient-to-br from-[oklch(0.74_0.21_45)] to-[oklch(0.78_0.18_60)] rounded-[3rem] p-8 text-white overflow-hidden shadow-2xl shadow-orange-300/40 hover:scale-[1.01] transition-transform">
            <div className="absolute -right-4 -bottom-4 size-44 opacity-30">
              <img src={lumeImg} alt="" width={176} height={176} className="size-full object-contain" />
            </div>
            <div className="relative z-10 max-w-[65%]">
              <span className="inline-block bg-white/20 backdrop-blur-md text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                {c.todayDevo}
              </span>
              <h3 className="text-3xl font-display font-extrabold mb-3 leading-[1.05]">
                {c.devoTitle}
              </h3>
              <p className="text-white/90 text-sm mb-6 max-w-[200px]">{c.devoDesc}</p>
              <span className="inline-block bg-white text-ignition font-display font-black px-8 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg">
                {c.start}
              </span>
            </div>
          </Link>

          {/* Bible Adventure (RISOLETA) */}
          <Link to="/risoleta" className="block bg-white border border-stone-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-display font-extrabold text-lg text-stone-900">{c.bibleAdv}</h4>
                <p className="text-stone-400 text-xs font-semibold">{c.phase}</p>
              </div>
              <div className="size-14 rounded-full border-4 border-riso-lilac/10 flex items-center justify-center relative">
                <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="oklch(0.70 0.19 315)" strokeWidth="4" strokeDasharray="150.8" strokeDashoffset="37.7" strokeLinecap="round" />
                </svg>
                <span className="text-[11px] font-black text-riso-lilac">75%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100/60">
                <div className="size-8 rounded-xl bg-ignition/10 mb-2 flex items-center justify-center">
                  <BookOpen className="size-4 text-ignition" strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-bold text-stone-900 block">{c.faithMission}</span>
                <span className="text-[10px] font-bold text-ignition">+50 XP</span>
              </div>
              <div className="bg-purple-50 p-4 rounded-3xl border border-purple-100/60">
                <div className="size-8 rounded-xl bg-riso-lilac/10 mb-2 flex items-center justify-center">
                  <Sparkles className="size-4 text-riso-lilac" strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-bold text-stone-900 block">{c.achievements}</span>
                <span className="text-[10px] font-bold text-riso-lilac">{c.collectibles}</span>
              </div>
            </div>
          </Link>

          {/* Worship (LOUVALDO) */}
          <Link to="/louvaldo" className="bg-emerald-50 rounded-[2rem] p-3 flex items-center gap-4 hover:bg-emerald-100/70 transition-colors">
            <div className="size-14 bg-lou rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={louImg} alt="Louvaldo" width={56} height={56} className="size-full object-contain p-0.5" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lou font-extrabold text-[9px] uppercase tracking-widest">{c.nowPlaying}</p>
              <h4 className="text-stone-900 font-bold text-xs leading-tight truncate">
                {c.song}
              </h4>
              <div className="flex gap-0.5 mt-1.5 items-end h-4">
                <div className="w-1 h-3 bg-lou rounded-full animate-pulse" />
                <div className="w-1 h-4 bg-lou rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-2 bg-lou rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
            <span className="size-12 bg-lou rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Play className="size-5 fill-current ml-0.5" />
            </span>
          </Link>

          {/* Weekly Mission (LILA) */}
          <Link to="/lila" className="bg-white border border-amber-100 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm hover:shadow-lg transition-shadow">
            <div className="size-14 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <img src={lilaImg} alt="Lila" width={48} height={48} className="size-12 object-contain animate-float-soft" loading="lazy" />
            </div>
            <div className="flex-1">
              <span className="text-lila font-extrabold text-[9px] uppercase tracking-widest">
                {c.weeklyMission}
              </span>
              <p className="text-stone-700 font-bold text-[11px] leading-tight mt-1">
                {c.weeklyDesc}
              </p>
              <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2.5 overflow-hidden">
                <div className="h-full w-1/3 bg-lila rounded-full" />
              </div>
            </div>
            <div className="text-[11px] font-black text-stone-300">1/3</div>
          </Link>

          {/* Parents Hub (UNNY) */}
          <Link to="/unny" className="bg-[#1e293b] rounded-[2.5rem] p-5 flex items-center gap-4 shadow-xl hover:scale-[0.99] transition-transform">
            <div className="size-12 bg-ignition rounded-2xl flex items-center justify-center flex-shrink-0 text-white">
              <Users className="size-6" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-display font-extrabold text-sm">{c.parents}</p>
              <p className="text-slate-400 text-[10px]">{c.parentsDesc}</p>
            </div>
            <ChevronRight className="size-5 text-slate-500 ml-auto" />
          </Link>
          <HomeExtras />
        </main>

      </div>
      <AppBottomNav />
    </div>
  );
}
