import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, Crown } from "lucide-react";
import { CharWorld } from "@/components/CharWorld";
import { LilaBottomNav } from "@/components/lila/BottomNav";
import { useProgress } from "@/lib/progress";
import { leaderboard } from "@/lib/missions";

export const Route = createFileRoute("/lila/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking — Lila | IGNIÇÃO" },
      { name: "description", content: "Top da semana no ministério infantil." },
      { property: "og:title", content: "Ranking — Lila | IGNIÇÃO" },
      { property: "og:description", content: "Top da semana no ministério infantil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RankingPage,
});

function RankingPage() {
  const { progress } = useProgress();
  const [tab, setTab] = useState<"week" | "all">("week");
  const rows = leaderboard(progress.xp);
  const myIdx = rows.findIndex((r) => r.you);

  return (
    <CharWorld
      name="RANKING"
      tagline="Top da semana"
      ink="text-[oklch(0.22_0.04_55)]"
      surface="bg-gradient-to-b from-[oklch(0.93_0.04_70)] via-[oklch(0.86_0.06_60)] to-[oklch(0.72_0.08_55)]"
    >
      {/* Tabs */}
      <section className="px-6">
        <div className="bg-[oklch(0.22_0.04_55)] rounded-2xl p-1 flex gap-1">
          {(["week", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-display font-bold rounded-xl transition-colors ${
                tab === t ? "bg-[oklch(0.86_0.10_70)] text-[oklch(0.22_0.04_55)]" : "text-[oklch(0.86_0.06_70)]/60"
              }`}
            >
              {t === "week" ? "Esta semana" : "Geral"}
            </button>
          ))}
        </div>
      </section>

      {/* Podium */}
      <section className="px-6 mt-6">
        <div className="grid grid-cols-3 gap-2 items-end">
          {[1, 0, 2].map((rank) => {
            const r = rows[rank];
            const heights = ["h-20", "h-28", "h-16"];
            const colors = [
              "bg-[oklch(0.78_0.08_60)]",            // silver
              "bg-[oklch(0.86_0.14_85)]",            // gold
              "bg-[oklch(0.65_0.12_45)]",            // bronze
            ];
            const order = rank === 0 ? 1 : rank === 1 ? 0 : 2;
            return (
              <div key={rank} className="flex flex-col items-center">
                {rank === 0 && <Crown className="size-5 text-[oklch(0.55_0.18_85)] mb-1" />}
                <div className={`size-14 rounded-full grid place-items-center text-2xl bg-white shadow-lg border-2 ${r.you ? "border-[oklch(0.45_0.08_55)]" : "border-white"}`}>
                  {r.avatar}
                </div>
                <p className="text-xs font-display font-bold mt-1 truncate w-full text-center">{r.name}</p>
                <p className="text-[10px] text-[oklch(0.40_0.04_55)]">{r.xp} XP</p>
                <div className={`${heights[order]} w-full ${colors[order]} mt-2 rounded-t-2xl grid place-items-center font-display font-bold text-2xl text-[oklch(0.22_0.04_55)]`}>
                  {rank + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* List */}
      <section className="px-6 mt-6">
        <div className="rounded-3xl bg-white/70 backdrop-blur border border-[oklch(0.45_0.08_55)]/10 overflow-hidden">
          {rows.slice(3).map((r, i) => {
            const rank = i + 4;
            return (
              <div
                key={r.name}
                className={`flex items-center gap-3 px-4 py-3 border-b border-[oklch(0.45_0.08_55)]/10 last:border-0 ${
                  r.you ? "bg-[oklch(0.45_0.08_55)] text-[oklch(0.97_0.02_70)]" : ""
                }`}
              >
                <span className={`size-7 rounded-full grid place-items-center text-xs font-display font-bold ${r.you ? "bg-[oklch(0.86_0.10_70)] text-[oklch(0.22_0.04_55)]" : "bg-[oklch(0.93_0.04_70)] text-[oklch(0.45_0.08_55)]"}`}>
                  {rank}
                </span>
                <span className="text-xl">{r.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm truncate">{r.name}{r.you && " · você"}</p>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${r.you ? "text-[oklch(0.86_0.10_70)]" : "text-[oklch(0.45_0.08_55)]/70"}`}>{r.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-base">{r.xp}</p>
                  <p className="text-[10px] opacity-70">XP</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-[11px] text-[oklch(0.45_0.08_55)]/70 mt-3 font-bold">
          <Trophy className="inline size-3.5 mr-1" /> Sua posição: #{myIdx + 1}
        </p>
      </section>

      <div className="h-28" />
      <LilaBottomNav />
    </CharWorld>
  );
}
