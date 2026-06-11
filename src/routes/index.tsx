import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Map as MapIcon, Play, Heart, ChevronRight, BookOpen, Sparkles, Users } from "lucide-react";
import uniImg from "@/assets/char-uni.png";
import lumeImg from "@/assets/char-lume.png";
import risoImg from "@/assets/char-risoleta.png";
import louImg from "@/assets/char-louvaldo.png";
import lilaImg from "@/assets/char-lila.png";
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
    ],
  }),
  component: Index,
});

type Lang = "pt" | "en";

const t = {
  pt: {
    heroTag: "Início",
    heroTitle: "IGNIÇÃO",
    heroSub: "Lume · Louvaldo · Lila · Unny · Risoleta",
    devo: "Devocional",
    devoSub: "Crescendo com a Palavra",
    bible: "Aventura Bíblica",
    bibleSub: "Explore novas histórias hoje!",
    play: "Jogar",
    louvor: "Louvor",
    louvorSub: "Solta o som!",
    mission: "Missão",
    missionSub: "Ajudar o próximo com amor",
    new: "NOVO",
    parents: "Painel dos Pais",
    parentsSub: "Gestão de tempo e conteúdos",
    nav: { home: "INÍCIO", journey: "JORNADA", play: "PLAY", family: "FAMÍLIA" },
  },
  en: {
    heroTag: "Home",
    heroTitle: "IGNIÇÃO",
    heroSub: "Lume · Louvaldo · Lila · Unny · Risoleta",
    devo: "Devotional",
    devoSub: "Growing with the Word",
    bible: "Bible Adventure",
    bibleSub: "Explore new stories today!",
    play: "Play",
    louvor: "Worship",
    louvorSub: "Turn it up!",
    mission: "Mission",
    missionSub: "Help others with love",
    new: "NEW",
    parents: "Parents Dashboard",
    parentsSub: "Time & content management",
    nav: { home: "HOME", journey: "JOURNEY", play: "PLAY", family: "FAMILY" },
  },
} as const;

function Index() {
  const [lang, setLang] = useState<Lang>("pt");
  const c = t[lang];

  const portals = [
    { to: "/unny",     img: uniImg,  label: "UNNY",     tint: "bg-unny/15",       ring: "border-unny/30",       dot: "bg-unny",      glow: "shadow-[0_0_18px_oklch(0.88_0.19_95/0.45)]" },
    { to: "/lume",     img: lumeImg, label: "LUME",     tint: "bg-lume/10",       ring: "border-lume/30",       dot: "bg-lume",      glow: "shadow-[0_0_18px_oklch(0.74_0.21_45/0.45)]" },
    { to: "/risoleta", img: risoImg, label: "RISOLETA", tint: "bg-riso-lilac/10", ring: "border-riso-lilac/30", dot: "bg-riso-lilac", glow: "shadow-[0_0_18px_oklch(0.70_0.19_315/0.45)]" },
    { to: "/louvaldo", img: louImg,  label: "LOUVALDO", tint: "bg-lou/10",        ring: "border-lou/30",        dot: "bg-lou",       glow: "shadow-[0_0_18px_oklch(0.72_0.21_150/0.45)]" },
    { to: "/lila",     img: lilaImg, label: "LILA",     tint: "bg-lila/10",       ring: "border-lila/30",       dot: "bg-lila",      glow: "shadow-[0_0_18px_oklch(0.58_0.16_35/0.45)]" },
  ] as const;

  return (
    <div className="min-h-screen w-full flex justify-center px-3 py-4 sm:py-8" style={{ backgroundColor: "#fdf2f0" }}>
      <div className="w-full max-w-[460px] bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(255,107,53,0.18)] border-[10px] border-white overflow-hidden flex flex-col relative">
        {/* Header */}
        <header className="px-6 pt-7 pb-3 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <img
            src={ciaLogo.url}
            alt="Cia do Lume"
            width={140}
            height={56}
            className="h-10 w-auto object-contain"
          />
          <button
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            className="flex bg-stone-100 p-1 rounded-full"
            aria-label="Toggle language"
          >
            <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${lang === "pt" ? "bg-white text-ignition shadow-sm" : "text-stone-400"}`}>PT</span>
            <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${lang === "en" ? "bg-white text-ignition shadow-sm" : "text-stone-400"}`}>EN</span>
          </button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 px-5 pb-36 pt-2 space-y-5">
          {/* Hero gradient with cast */}
          <section className="relative h-64 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#6c5ce7] via-[#e84393] to-[#ff6b35] p-6 flex flex-col justify-end shadow-xl shadow-orange-200/60">
            <div className="absolute -right-6 -top-6 w-56 h-56 bg-white/20 blur-3xl rounded-full" />
            <img
              src={castHero.url}
              alt="Lume, Louvaldo, Lila, Unny e Risoleta"
              width={512}
              height={512}
              className="absolute right-[-32px] top-2 h-[78%] w-auto object-contain drop-shadow-2xl animate-float-soft"
            />
            <div className="relative z-10 max-w-[60%]">
              <span className="text-[10px] font-bold text-white/85 tracking-[0.25em] uppercase mb-1 block">{c.heroTag}</span>
              <h1 className="font-display font-extrabold text-[2.6rem] text-white leading-none mb-2 tracking-tight">{c.heroTitle}</h1>
              <p className="text-[11px] text-white/90 font-medium leading-tight">{c.heroSub}</p>
            </div>
          </section>

          {/* Character portals */}
          <section className="flex justify-between items-start pt-1">
            {portals.map((p) => (
              <Link key={p.label} to={p.to} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 rounded-2xl ${p.tint} border-2 ${p.ring} flex items-center justify-center transition-transform group-hover:-translate-y-1`}>
                  <div className="w-9 h-9 rounded-xl bg-white grid place-items-center overflow-hidden">
                    <img src={p.img} alt={p.label} width={36} height={36} className="w-full h-full object-contain p-0.5" loading="lazy" />
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-stone-500 tracking-tight">{p.label}</span>
              </Link>
            ))}
          </section>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Devocional (wide) */}
            <Link to="/lume" className="col-span-2 bg-[#ff6b35]/[0.06] rounded-[2.5rem] p-6 border border-[#ff6b35]/15 flex justify-between items-center hover:scale-[1.01] transition-transform">
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#ff6b35]">{c.devo}</h3>
                <p className="text-xs text-stone-500 mt-1 font-medium">{c.devoSub}</p>
              </div>
              <div className="w-12 h-12 bg-[#ff6b35] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <BookOpen className="w-6 h-6" strokeWidth={2.5} />
              </div>
            </Link>

            {/* Aventura Bíblica (tall) */}
            <Link to="/risoleta" className="col-span-1 row-span-2 bg-gradient-to-br from-[#6c5ce7] to-[#8b7ef0] rounded-[2.5rem] p-6 flex flex-col justify-between text-white overflow-hidden relative hover:scale-[1.02] transition-transform shadow-lg shadow-indigo-200/60">
              <div className="relative z-10">
                <h3 className="font-display font-extrabold text-xl leading-tight">{c.bible}</h3>
                <p className="text-[11px] opacity-85 mt-2 font-medium">{c.bibleSub}</p>
              </div>
              <img src={risoImg} alt="Risoleta" width={140} height={140} className="absolute -bottom-2 -right-2 w-32 h-32 object-contain animate-float-soft" loading="lazy" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
              <div className="mt-auto relative z-10">
                <span className="inline-block bg-white text-[#6c5ce7] font-bold text-[10px] px-4 py-2 rounded-full uppercase tracking-wider shadow-md">
                  {c.play}
                </span>
              </div>
            </Link>

            {/* Louvor */}
            <Link to="/louvaldo" className="col-span-1 bg-[#e84393]/[0.06] rounded-[2.5rem] p-5 border border-[#e84393]/15 hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 bg-[#e84393] rounded-full flex items-center justify-center text-white mb-3 shadow-md shadow-pink-200">
                <Play className="w-5 h-5 ml-0.5 fill-current" />
              </div>
              <h3 className="font-display font-extrabold text-base text-[#e84393]">{c.louvor}</h3>
              <p className="text-[10px] text-stone-500 font-medium mt-0.5">{c.louvorSub}</p>
            </Link>

            {/* Missão */}
            <Link to="/lila" className="col-span-1 bg-[#f7931e]/[0.1] rounded-[2.5rem] p-5 border border-[#f7931e]/25 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start">
                <h3 className="font-display font-extrabold text-base text-[#f7931e]">{c.mission}</h3>
                <span className="bg-[#f7931e] text-[8px] text-white font-bold px-2 py-0.5 rounded-full tracking-wider">{c.new}</span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium mt-2 leading-snug">{c.missionSub}</p>
              <div className="flex items-center gap-1 mt-3">
                <Sparkles className="w-3 h-3 text-[#f7931e]" />
                <div className="flex-1 h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-[#f7931e] rounded-full" />
                </div>
              </div>
            </Link>

            {/* Painel dos Pais */}
            <Link to="/unny" className="col-span-2 bg-stone-50 rounded-[2.5rem] p-5 flex items-center gap-4 border border-stone-100 hover:bg-stone-100/60 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-stone-900 flex items-center justify-center text-white">
                <Users className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-stone-800">{c.parents}</h3>
                <p className="text-[10px] text-stone-400 font-medium">{c.parentsSub}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-300" />
            </Link>
          </div>
        </main>

        {/* Bottom nav */}
        <nav className="absolute bottom-5 left-5 right-5 h-[68px] bg-stone-900/95 backdrop-blur-lg rounded-[2rem] flex items-center justify-around px-3 border border-white/10 shadow-2xl shadow-black/30 z-30">
          {[
            { Icon: Home, label: c.nav.home, active: true },
            { Icon: MapIcon, label: c.nav.journey },
            { Icon: Play, label: c.nav.play },
            { Icon: Heart, label: c.nav.family },
          ].map(({ Icon, label, active }, i) => (
            <button key={i} className={`flex flex-col items-center gap-1 flex-1 py-1 ${active ? "" : "opacity-40 hover:opacity-100 transition-opacity"}`}>
              {active ? (
                <div className="p-2 rounded-xl bg-[#ff6b35] text-white shadow-lg shadow-orange-900/40">
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <Icon className="w-5 h-5 text-white" />
              )}
              <span className={`text-[9px] font-bold tracking-wider ${active ? "text-[#ff6b35]" : "text-white"}`}>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
