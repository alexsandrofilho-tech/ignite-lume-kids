// Lightweight localStorage XP / favorites / streaks.
// Will be swapped for Supabase-backed in a follow-up turn.

import { useEffect, useState, useCallback } from "react";

const KEY = "ignicao:progress:v1";

export type CharKey = "lume" | "louvaldo" | "risoleta" | "lila" | "unny";

export type Progress = {
  xp: number;
  level: number;
  perChar: Record<CharKey, number>;
  favorites: string[];
  streaks: Record<string, { count: number; lastISO: string }>;
  unlocks: string[];
  highScores: Record<string, number>;
};

const empty: Progress = {
  xp: 0,
  level: 1,
  perChar: { lume: 0, louvaldo: 0, risoleta: 0, lila: 0, unny: 0 },
  favorites: [],
  streaks: {},
  unlocks: [],
  highScores: {},
};

function read(): Progress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function write(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("ignicao:progress"));
}

function levelFor(xp: number) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 50)) + 1);
}

export function useProgress() {
  const [p, setP] = useState<Progress>(empty);

  useEffect(() => {
    setP(read());
    const onChange = () => setP(read());
    window.addEventListener("ignicao:progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("ignicao:progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const addXP = useCallback((amount: number, char?: CharKey) => {
    const cur = read();
    cur.xp += amount;
    cur.level = levelFor(cur.xp);
    if (char) cur.perChar[char] = (cur.perChar[char] || 0) + amount;
    write(cur);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const cur = read();
    cur.favorites = cur.favorites.includes(id)
      ? cur.favorites.filter((f) => f !== id)
      : [...cur.favorites, id];
    write(cur);
  }, []);

  const recordHighScore = useCallback((key: string, score: number) => {
    const cur = read();
    if ((cur.highScores[key] || 0) < score) {
      cur.highScores[key] = score;
      write(cur);
    }
  }, []);

  const bumpStreak = useCallback((key: string) => {
    const cur = read();
    const todayISO = new Date().toISOString().slice(0, 10);
    const s = cur.streaks[key];
    if (!s) {
      cur.streaks[key] = { count: 1, lastISO: todayISO };
    } else if (s.lastISO === todayISO) {
      // already counted today
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      cur.streaks[key] = {
        count: s.lastISO === yesterday ? s.count + 1 : 1,
        lastISO: todayISO,
      };
    }
    write(cur);
  }, []);

  const unlock = useCallback((id: string) => {
    const cur = read();
    if (!cur.unlocks.includes(id)) {
      cur.unlocks.push(id);
      write(cur);
    }
  }, []);

  return { progress: p, addXP, toggleFavorite, recordHighScore, bumpStreak, unlock };
}