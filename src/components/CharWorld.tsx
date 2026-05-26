import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  name: string;
  tagline: string;
  /** tailwind bg utility for the page background (e.g. "bg-lume") */
  surface: string;
  /** tailwind text color for body text on the surface (e.g. "text-white") */
  ink?: string;
  /** decorative background layer placed behind content */
  backdrop?: ReactNode;
  children: ReactNode;
};

export function CharWorld({ name, tagline, surface, ink = "text-white", backdrop, children }: Props) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${surface} ${ink}`}>
      {backdrop}
      <div className="relative z-10 mx-auto max-w-xl pb-24">
        <header className="p-6 flex items-center justify-between">
          <Link
            to="/"
            className="size-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 transition-colors border border-white/20"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">{tagline}</p>
            <h1 className="font-display font-bold text-2xl tracking-tight">{name}</h1>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}