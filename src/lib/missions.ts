// Mission, quiz, level + leaderboard helpers (localStorage-backed).
// Lives alongside src/lib/progress.ts and reuses its store for XP/streaks.

import { useEffect, useState, useCallback } from "react";

export type MissionCategory =
  | "prayer" | "reading" | "quiz" | "reflection" | "community" | "challenge";

export const CATEGORY_META: Record<MissionCategory, { label: string; emoji: string; xp: number; color: string }> = {
  prayer:     { label: "Oração",     emoji: "🙏", xp: 10, color: "oklch(0.65 0.15 30)" },
  reading:    { label: "Bíblia",     emoji: "📖", xp: 15, color: "oklch(0.55 0.12 250)" },
  quiz:       { label: "Quiz",       emoji: "❓", xp: 20, color: "oklch(0.65 0.18 310)" },
  reflection: { label: "Reflexão",   emoji: "✍️", xp: 10, color: "oklch(0.70 0.15 150)" },
  community:  { label: "Comunidade", emoji: "🤝", xp: 10, color: "oklch(0.70 0.15 60)" },
  challenge:  { label: "Desafio",    emoji: "🎯", xp: 15, color: "oklch(0.65 0.18 85)"  },
};

export const FULL_DAY_BONUS = 25;

export type Mission = {
  id: string;
  category: MissionCategory;
  title: string;
  detail?: string;
  xp: number;
};

export const WEEKLY_MISSIONS: Record<number, Mission[]> = {
  0: [
    { id: "sun-prayer",     category: "prayer",     xp: 10, title: "Oração da manhã (5 min)",      detail: "Encontre um lugar tranquilo e converse com Deus." },
    { id: "sun-reading",    category: "reading",    xp: 15, title: "Leia Salmo 23",                detail: "O Senhor é meu pastor, nada me faltará." },
    { id: "sun-quiz",       category: "quiz",       xp: 20, title: "Quiz: Salmo 23",               detail: "3 perguntas sobre a leitura de hoje." },
    { id: "sun-reflection", category: "reflection", xp: 10, title: "Reflexão: a guia de Deus",     detail: "O que a guia de Deus significa pra você?" },
  ],
  1: [
    { id: "mon-prayer",     category: "prayer",     xp: 10, title: "Ore por alguém que você ama",  detail: "Lembre dessa pessoa pelo nome." },
    { id: "mon-reading",    category: "reading",    xp: 15, title: "Leia Mateus 5:1–12",           detail: "As Bem-aventuranças de Jesus." },
    { id: "mon-quiz",       category: "quiz",       xp: 20, title: "Quiz: Bem-aventuranças",       detail: "3 perguntas sobre Mateus 5." },
    { id: "mon-community",  category: "community",  xp: 10, title: "Encoraje alguém da comunidade", detail: "Envie uma palavra boa pra um amigo." },
  ],
  2: [
    { id: "tue-prayer",     category: "prayer",     xp: 10, title: "Escreva uma oração de gratidão", detail: "Liste 3 coisas pelas quais você é grato." },
    { id: "tue-reading",    category: "reading",    xp: 15, title: "Leia Provérbios 3:1–10",       detail: "Confia no Senhor de todo o teu coração." },
    { id: "tue-quiz",       category: "quiz",       xp: 20, title: "Quiz: Provérbios 3",           detail: "3 perguntas sobre sabedoria." },
    { id: "tue-reflection", category: "reflection", xp: 10, title: "Reflexão: confiança",          detail: "Onde você precisa confiar mais em Deus?" },
  ],
  3: [
    { id: "wed-prayer",     category: "prayer",     xp: 10, title: "Oração de intercessão",        detail: "Ore pelo meio da semana de alguém." },
    { id: "wed-reading",    category: "reading",    xp: 15, title: "Leia João 15:1–17",            detail: "A Videira Verdadeira." },
    { id: "wed-quiz",       category: "quiz",       xp: 20, title: "Quiz: João 15",                detail: "3 perguntas sobre a Videira." },
    { id: "wed-challenge",  category: "challenge",  xp: 15, title: "Desafio: memorize João 15:5",  detail: "Repita até saber de cor." },
  ],
  4: [
    { id: "thu-prayer",     category: "prayer",     xp: 10, title: "Ore pela sua igreja",          detail: "Lembre dos líderes e amigos." },
    { id: "thu-reading",    category: "reading",    xp: 15, title: "Leia Romanos 8:28–39",         detail: "Nada nos separa do amor de Deus." },
    { id: "thu-quiz",       category: "quiz",       xp: 20, title: "Quiz: Romanos 8",              detail: "3 perguntas sobre a passagem." },
    { id: "thu-reflection", category: "reflection", xp: 10, title: "Reflexão: o amor de Deus",     detail: "Como isso te faz sentir?" },
  ],
  5: [
    { id: "fri-prayer",     category: "prayer",     xp: 10, title: "Oração de louvor",             detail: "Cante ou fale gratidão em voz alta." },
    { id: "fri-reading",    category: "reading",    xp: 15, title: "Leia Lucas 15:11–32",          detail: "A parábola do Filho Pródigo." },
    { id: "fri-quiz",       category: "quiz",       xp: 20, title: "Quiz: Filho Pródigo",          detail: "3 perguntas sobre a parábola." },
    { id: "fri-community",  category: "community",  xp: 10, title: "Compartilhe um aprendizado",   detail: "Conte a alguém o que aprendeu." },
  ],
  6: [
    { id: "sat-prayer",     category: "prayer",     xp: 10, title: "Oração de descanso",           detail: "Pause, respire e fale com Deus." },
    { id: "sat-reading",    category: "reading",    xp: 15, title: "Leia Filipenses 4:4–13",       detail: "Alegrai-vos sempre no Senhor." },
    { id: "sat-quiz",       category: "quiz",       xp: 20, title: "Quiz: Filipenses 4",           detail: "3 perguntas sobre alegria e paz." },
    { id: "sat-reflection", category: "reflection", xp: 15, title: "Revisão da semana",            detail: "Qual foi seu maior insight espiritual?" },
  ],
};

export function dayXP(weekday: number) {
  return WEEKLY_MISSIONS[weekday].reduce((s, m) => s + m.xp, 0);
}

export type QuizQuestion = { q: string; options: string[]; correct: number };

export const DAILY_QUIZ: Record<number, QuizQuestion[]> = {
  0: [
    { q: "Como começa o Salmo 23?", options: ["O Senhor é meu pastor", "Bem-aventurado o homem", "No princípio criou Deus"], correct: 0 },
    { q: "Por onde Deus me guia?", options: ["Por caminhos difíceis", "Por águas tranquilas", "Pelo deserto"], correct: 1 },
    { q: "O que me seguirá todos os dias da minha vida?", options: ["Tristeza", "Bondade e misericórdia", "Medo"], correct: 1 },
  ],
  1: [
    { q: "Quem disse as Bem-aventuranças?", options: ["Pedro", "Jesus", "Moisés"], correct: 1 },
    { q: "Bem-aventurados os que choram, porque...", options: ["Verão a Deus", "Serão consolados", "Herdarão a terra"], correct: 1 },
    { q: "Você é a ___ do mundo.", options: ["Luz", "Água", "Chave"], correct: 0 },
  ],
  2: [
    { q: "Em quem devemos confiar de todo o coração?", options: ["Em nós mesmos", "No Senhor", "Nos amigos"], correct: 1 },
    { q: "Em que NÃO devemos nos estribar?", options: ["Em nossa inteligência", "Na família", "Na igreja"], correct: 0 },
    { q: "A quem reconhecer em todos os nossos caminhos?", options: ["O mundo", "A Ele (Deus)", "Os reis"], correct: 1 },
  ],
  3: [
    { q: "Porque Deus amou o mundo de tal maneira que...", options: ["Deu o seu Filho", "Criou o sol", "Enviou os anjos"], correct: 0 },
    { q: "Para que todo aquele que nele crê...", options: ["Tenha dinheiro", "Não pereça mas tenha a vida eterna", "Seja famoso"], correct: 1 },
    { q: "Quem disse 'é necessário nascer de novo'?", options: ["Paulo", "Jesus", "Nicodemos"], correct: 1 },
  ],
  4: [
    { q: "Quem habita no esconderijo do Altíssimo?", options: ["Os reis", "Aquele que confia em Deus", "Os profetas"], correct: 1 },
    { q: "Deus é o nosso ___ e fortaleza.", options: ["Refúgio", "Rei", "Pai"], correct: 0 },
    { q: "Mil cairão ao teu lado, mas...", options: ["A ti não chegará", "Você também cairá", "Não saberás"], correct: 0 },
  ],
  5: [
    { q: "O amor é ___ e benigno.", options: ["Forte", "Sofredor (paciente)", "Rápido"], correct: 1 },
    { q: "O amor nunca...", options: ["Falha", "Volta", "Cresce"], correct: 0 },
    { q: "Permanecem fé, esperança e ___.", options: ["Paz", "Amor", "Alegria"], correct: 1 },
  ],
  6: [
    { q: "Alegrai-vos sempre em...", options: ["Vocês mesmos", "No Senhor", "Nas festas"], correct: 1 },
    { q: "A paz de Deus excede todo o...", options: ["Entendimento", "Coração", "Tempo"], correct: 0 },
    { q: "Tudo posso naquele que me...", options: ["Ama", "Fortalece", "Vê"], correct: 1 },
  ],
};

export const LEVELS = [
  { name: "Sementinha",  min: 0 },
  { name: "Discípulo",   min: 100 },
  { name: "Fiel",        min: 300 },
  { name: "Guerreiro",   min: 700 },
  { name: "Campeão",     min: 1500 },
];

export function levelInfo(xp: number) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i;
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const progress = next ? Math.round(((xp - current.min) / (next.min - current.min)) * 100) : 100;
  return { index: idx, name: current.name, current, next, progress };
}

// ── Missions state (per-day completion) ──
const M_KEY = "ignicao:lila:missions:v1";

type MissionsState = {
  completed: Record<string, string[]>;
  fullDayBonus: string[];
};

function readM(): MissionsState {
  if (typeof window === "undefined") return { completed: {}, fullDayBonus: [] };
  try {
    const raw = localStorage.getItem(M_KEY);
    return raw ? { completed: {}, fullDayBonus: [], ...JSON.parse(raw) } : { completed: {}, fullDayBonus: [] };
  } catch {
    return { completed: {}, fullDayBonus: [] };
  }
}
function writeM(s: MissionsState) {
  localStorage.setItem(M_KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("ignicao:missions"));
}

export function todayISO(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function isoForWeekday(weekday: number) {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() + (weekday - day));
  return todayISO(d);
}

export function useMissions() {
  const [state, setState] = useState<MissionsState>({ completed: {}, fullDayBonus: [] });

  useEffect(() => {
    setState(readM());
    const on = () => setState(readM());
    window.addEventListener("ignicao:missions", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("ignicao:missions", on);
      window.removeEventListener("storage", on);
    };
  }, []);

  const isDone = useCallback(
    (dateISO: string, missionId: string) => (state.completed[dateISO] || []).includes(missionId),
    [state],
  );

  const markDone = useCallback((dateISO: string, missionId: string) => {
    const cur = readM();
    const list = cur.completed[dateISO] || [];
    if (list.includes(missionId)) return;
    cur.completed[dateISO] = [...list, missionId];
    writeM(cur);
  }, []);

  return { state, isDone, markDone };
}

export function isFullDayComplete(dateISO: string, weekday: number) {
  const cur = readM();
  const done = cur.completed[dateISO] || [];
  const ids = WEEKLY_MISSIONS[weekday].map((m) => m.id);
  return ids.every((id) => done.includes(id));
}

export function isPerfectWeek() {
  for (let d = 0; d < 7; d++) {
    if (!isFullDayComplete(isoForWeekday(d), d)) return false;
  }
  return true;
}

export function maybeGrantFullDayBonus(dateISO: string, weekday: number, addXP: (n: number) => void) {
  const cur = readM();
  if (cur.fullDayBonus.includes(dateISO)) return false;
  if (!isFullDayComplete(dateISO, weekday)) return false;
  cur.fullDayBonus.push(dateISO);
  writeM(cur);
  addXP(FULL_DAY_BONUS);
  return true;
}

// ── Leaderboard ──
export type LBRow = { name: string; avatar: string; level: string; xp: number };

const MOCK_LB: LBRow[] = [
  { name: "Aninha", avatar: "🦊", level: "Guerreiro",  xp: 820 },
  { name: "Pedro",  avatar: "🦁", level: "Fiel",       xp: 615 },
  { name: "Júlia",  avatar: "🐼", level: "Fiel",       xp: 540 },
  { name: "Davi",   avatar: "🦉", level: "Discípulo",  xp: 410 },
  { name: "Sara",   avatar: "🐯", level: "Discípulo",  xp: 380 },
  { name: "Lucas",  avatar: "🐨", level: "Discípulo",  xp: 305 },
  { name: "Mia",    avatar: "🦄", level: "Sementinha", xp: 240 },
  { name: "Téo",    avatar: "🐸", level: "Sementinha", xp: 180 },
  { name: "Bia",    avatar: "🐰", level: "Sementinha", xp: 95 },
];

export function leaderboard(youXP: number): (LBRow & { you?: boolean })[] {
  const you: LBRow & { you: boolean } = {
    name: "Você",
    avatar: "🌟",
    level: levelInfo(youXP).name,
    xp: youXP,
    you: true,
  };
  return [...MOCK_LB, you].sort((a, b) => b.xp - a.xp);
}

export const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const DAYS_PT_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
