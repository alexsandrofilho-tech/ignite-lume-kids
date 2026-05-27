## Goal
Expand the 4 character pages (Louvaldo, Lume, Risoleta, Lila) with deep interactivity and gamification — **without touching the existing visual design, colors, layout, or identity**. New features get embedded into the current sections or open as sub-pages that inherit each character's existing theme via `CharWorld`.

This is a very large scope (drum/guitar games, daily devotionals, dynamic quizzes, missions + leaderboard, auth, backend, PWA). I'll break it into phases so each shippable chunk is reviewable.

---

## Phase 1 — Foundation (backend + shared systems)
- Enable **Lovable Cloud** (Supabase) for: auth, profiles, XP/levels, streaks, favorites, mission progress, quiz scores, leaderboard, daily content cache.
- Tables: `profiles`, `user_progress` (xp, level, streak, character-scoped stats), `favorites`, `mission_completions`, `quiz_attempts`, `devotional_reads`, `leaderboard` (view).
- Simple auth (email/password + Google) with child-safe profile (display name + avatar pick, no email shown).
- Shared hooks: `useProfile`, `useXP`, `useStreak`, `useDailyContent(seed)` (deterministic daily picker by date, no server cron needed initially).
- Reusable `XPBadge`, `StreakFlame`, `RewardToast` components styled per-character via props (no global look change).

## Phase 2 — Louvaldo (Music)
- **In-page additions** (no redesign): Spotify button (link to Cia do Lume playlist URL — user to confirm exact URL), favorite-song heart, daily worship pick, sound-effect feedback on existing buttons.
- **`/louvaldo/bateria`** — virtual drum kit (kick/snare/hat/toms/cymbals) using WebAudio with synthesized samples, tap/keyboard input, hit animations (Framer Motion), Freestyle + Rhythm Challenge (follow falling notes), combo counter, scoring, 3 difficulty tiers, haptic (`navigator.vibrate`), unlockable kits.
- **`/louvaldo/violao`** — 6-string guitar with strum gesture, chord library (G, C, D, Em, Am, etc.), chord diagrams, finger-placement overlay, lesson mode, chord-recognition mini-game, progression tracker.
- Both games persist scores → `user_progress`.

## Phase 3 — Lume (Devotional)
- **`/lume/devocional`** — daily reflection page: today's verse + story + kid-friendly explanation + 2 reflection questions + audio narration (Web Speech API `speechSynthesis`), animated illustration slot, "marquei como lido" → streak++ + badge unlock, collectible card grid for past days.
- Content: bundled JSON of 60+ devotionals cycled by day-of-year (no external API needed).

## Phase 4 — Risoleta (Quiz)
- **`/risoleta/quiz`** — daily quiz (10 questions, deterministic by date), 3 age tiers (selectable), animated correct/wrong feedback, XP + treasure-box rewards, streak.
- **Mini-games** (sub-routes or modal): Memory matching (Bible pairs), True/False, Guess the character, Verse completion, Timed quiz event. Each is a small focused component sharing a `MiniGameShell`.

## Phase 5 — Lila (Missions + Leaderboard)
- **`/lila/missoes`** — daily mission (rotated by date) + weekly + monthly. Check-in flow, "I did it" confirmation, XP, badges, streak, avatar cosmetics unlock list.
- **`/lila/ranking`** — community leaderboard (weekly/monthly tabs) from Supabase view, anonymized display names + avatars, animated rank changes.
- Mission templates from the user's list (pray for a friend, share a verse, etc.).

## Phase 6 — Cross-cutting polish
- PWA manifest + service worker (installable, offline shell).
- Light/dark already handled by tokens; verify both modes on new pages.
- Accessibility pass: aria-labels on game controls, keyboard for drums/guitar, focus rings.
- Parent dashboard at `/familia/painel` (read-only summary of child progress) — reuses Unny's existing theme.

---

## Technical notes
- **No design changes** to existing pages — new features render inside current cards/sections or in new routes that reuse `CharWorld` with each character's existing palette.
- React + Tailwind + Framer Motion (already installed) + WebAudio (no extra deps) for sound. Add `framer-motion` if not present.
- Daily content = `dayOfYear` modulo content array — deterministic, no cron, works offline.
- Push notifications and seasonal events are noted but deferred to a later phase (require service worker + FCM/web-push setup).

---

## Questions before I start

1. **Scope per turn**: this is 4–6 phases of work. Do you want me to ship **Phase 1 + Phase 2 (Louvaldo full)** in this turn, then continue Lume/Risoleta/Lila in follow-up turns? Or do all 4 character expansions at a shallower depth in one turn?
2. **Spotify URL**: what's the exact "Cia do Lume" playlist / profile URL to link?
3. **Auth**: enable email/password + Google sign-in by default? (Required for leaderboard, XP persistence, parent dashboard.)
4. **Audio samples**: OK to use synthesized WebAudio sounds (no asset downloads, instant, works offline) for drums/guitar? Real recorded samples would need uploaded audio files.