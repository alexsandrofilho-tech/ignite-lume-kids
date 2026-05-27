// Lightweight WebAudio synth for drum kit + guitar chords.
// No external samples — works offline, instant.

let ctx: AudioContext | null = null;
export function getCtx(): AudioContext {
  if (!ctx) {
    const Ctor = (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function haptic(ms = 12) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
}

// ---------- DRUM SYNTHS ----------

function envGain(c: AudioContext, peak: number, attack: number, decay: number, when: number) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(peak, when + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, when + attack + decay);
  return g;
}

export function playKick() {
  const c = getCtx();
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = envGain(c, 1.0, 0.005, 0.45, t);
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.18);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + 0.5);
  haptic(18);
}

function noiseBuffer(c: AudioContext, dur: number) {
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function playSnare() {
  const c = getCtx();
  const t = c.currentTime;
  // noise body
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 0.3);
  const bp = c.createBiquadFilter();
  bp.type = "highpass"; bp.frequency.value = 1500;
  const g = envGain(c, 0.7, 0.005, 0.18, t);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t); src.stop(t + 0.3);
  // tone
  const o = c.createOscillator();
  const og = envGain(c, 0.3, 0.001, 0.12, t);
  o.frequency.value = 220;
  o.connect(og).connect(c.destination);
  o.start(t); o.stop(t + 0.15);
  haptic(14);
}

export function playHat(open = false) {
  const c = getCtx();
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, open ? 0.3 : 0.08);
  const hp = c.createBiquadFilter();
  hp.type = "highpass"; hp.frequency.value = 7000;
  const g = envGain(c, 0.35, 0.002, open ? 0.25 : 0.06, t);
  src.connect(hp).connect(g).connect(c.destination);
  src.start(t); src.stop(t + 0.35);
  haptic(8);
}

export function playTom(freq = 180) {
  const c = getCtx();
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = envGain(c, 0.8, 0.005, 0.35, t);
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.25);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + 0.4);
  haptic(14);
}

export function playCrash() {
  const c = getCtx();
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 1.2);
  const hp = c.createBiquadFilter();
  hp.type = "highpass"; hp.frequency.value = 4000;
  const g = envGain(c, 0.5, 0.005, 1.0, t);
  src.connect(hp).connect(g).connect(c.destination);
  src.start(t); src.stop(t + 1.2);
  haptic(20);
}

// ---------- GUITAR (Karplus-Strong-ish plucked string) ----------

function pluck(c: AudioContext, freq: number, when: number, dur = 1.4, gain = 0.4) {
  const sampleRate = c.sampleRate;
  const length = Math.floor(sampleRate * dur);
  const buf = c.createBuffer(1, length, sampleRate);
  const data = buf.getChannelData(0);
  const period = Math.max(2, Math.floor(sampleRate / freq));
  // initial noise burst
  for (let i = 0; i < period; i++) data[i] = Math.random() * 2 - 1;
  // simple averaging filter (Karplus-Strong)
  const decay = 0.996;
  for (let i = period; i < length; i++) {
    data[i] = (data[i - period] + data[i - period - 1]) * 0.5 * decay;
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(g).connect(c.destination);
  src.start(when);
  src.stop(when + dur);
}

// String frequencies (E A D G B e standard tuning)
const STRING_FREQS = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];

/** Strum a chord by string-fret pattern. Pattern length 6, -1 = mute. */
export function strumChord(pattern: number[], down = true, speed = 18) {
  const c = getCtx();
  const now = c.currentTime;
  const order = down ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];
  order.forEach((s, i) => {
    const fret = pattern[s];
    if (fret < 0) return;
    const f = STRING_FREQS[s] * Math.pow(2, fret / 12);
    pluck(c, f, now + (i / speed) * 0.1);
  });
  haptic(10);
}

export function pluckString(stringIdx: number, fret = 0) {
  const c = getCtx();
  const f = STRING_FREQS[stringIdx] * Math.pow(2, fret / 12);
  pluck(c, f, c.currentTime);
  haptic(6);
}

// Chord library: [E A D G B e]
export const CHORDS: Record<string, { pattern: number[]; name: string }> = {
  G:  { name: "G",  pattern: [3, 2, 0, 0, 0, 3] },
  C:  { name: "C",  pattern: [-1, 3, 2, 0, 1, 0] },
  D:  { name: "D",  pattern: [-1, -1, 0, 2, 3, 2] },
  Em: { name: "Em", pattern: [0, 2, 2, 0, 0, 0] },
  Am: { name: "Am", pattern: [-1, 0, 2, 2, 1, 0] },
  E:  { name: "E",  pattern: [0, 2, 2, 1, 0, 0] },
  A:  { name: "A",  pattern: [-1, 0, 2, 2, 2, 0] },
  Dm: { name: "Dm", pattern: [-1, -1, 0, 2, 3, 1] },
};

// Simple beat sound used by rhythm game (metronome tick)
export function playTick(high = false) {
  const c = getCtx();
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = envGain(c, 0.25, 0.001, 0.05, t);
  o.frequency.value = high ? 1600 : 900;
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + 0.08);
}