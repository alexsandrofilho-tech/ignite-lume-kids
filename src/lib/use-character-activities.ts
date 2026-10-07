import { useCallback, useEffect, useState } from 'react';
import type { CharKey } from './progress';
import { useProgress } from './progress';

type ActivityState = { completed: string[]; notes: Record<string, string>; reminders: { id: string; title: string; date: string }[] };
const empty: ActivityState = { completed: [], notes: {}, reminders: [] };
const storageKey = 'ignicao:character-activities:v1';
function read(): ActivityState {
  try { const raw = localStorage.getItem(storageKey); return raw ? { ...empty, ...JSON.parse(raw) } : empty; } catch { return empty; }
}
export function useCharacterActivities(character: CharKey) {
  const [state, setState] = useState<ActivityState>(empty);
  const [ready, setReady] = useState(false);
  const { addXP, bumpStreak } = useProgress();
  useEffect(() => { const sync = () => setState(read()); sync(); setReady(true); window.addEventListener('ignicao:activities', sync); window.addEventListener('storage', sync); return () => { window.removeEventListener('ignicao:activities', sync); window.removeEventListener('storage', sync); }; }, []);
  const update = useCallback((change: (current: ActivityState) => ActivityState) => {
    const next = change(read()); localStorage.setItem(storageKey, JSON.stringify(next)); setState(next); window.dispatchEvent(new Event('ignicao:activities'));
  }, []);
  const complete = (id: string, xp = 20) => {
    const key = `${character}:${id}`;
    if (!ready || read().completed.includes(key)) return;
    update(current => ({ ...current, completed: [...current.completed, key] }));
    addXP(xp, character); bumpStreak(`${character}:activities`);
  };
  return { state, ready, complete, done: (id: string) => state.completed.includes(`${character}:${id}`), saveNote: (id: string, text: string) => update(current => ({ ...current, notes: { ...current.notes, [`${character}:${id}`]: text } })), update };
}