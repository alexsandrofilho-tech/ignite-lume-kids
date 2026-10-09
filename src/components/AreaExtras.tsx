import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/progress";

const today = () => new Date().toISOString().slice(0, 10);
function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => { try { const r = localStorage.getItem(key); if (r) setV(JSON.parse(r)); } catch { /* ignore */ } }, [key]);
  const set = (n: T) => { setV(n); localStorage.setItem(key, JSON.stringify(n)); };
  return [v, set] as const;
}
const card = "rounded-3xl bg-white border border-stone-100 p-5 shadow-sm text-stone-800";

/* ---------- HOME ---------- */
const VERSES = [
  { t: "O Senhor é o meu pastor; nada me faltará.", r: "Salmos 23:1" },
  { t: "Vós sois a luz do mundo.", r: "Mateus 5:14" },
  { t: "Deus é amor.", r: "1 João 4:8" },
  { t: "Posso todas as coisas naquele que me fortalece.", r: "Filipenses 4:13" },
  { t: "Alegrai-vos sempre no Senhor.", r: "Filipenses 4:4" },
];
const QUESTIONS = [
  { q: "Qual história bíblica você mais gosta?", o: ["Davi e Golias", "Arca de Noé", "Jonas", "Daniel"] },
  { q: "Como você quer ajudar alguém hoje?", o: ["Dar um abraço", "Ajudar em casa", "Orar por alguém", "Dividir um lanche"] },
  { q: "Qual personagem é sua cara hoje?", o: ["Lume", "Louvaldo", "Risoleta", "Lila"] },
];
export function HomeExtras() {
  const { addXP } = useProgress();
  const [vi, setVi] = useState(0);
  const [chest, setChest] = useLocal<string>("ignicao:chest:v1", "");
  const [prize, setPrize] = useState<string | null>(null);
  const [vote, setVote] = useLocal<Record<string, string>>("ignicao:poll:v1", {});
  const day = Math.floor(Date.now() / 86400000);
  const q = QUESTIONS[day % QUESTIONS.length];
  const voted = vote[today()];
  const openChest = () => {
    const xp = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
    addXP(xp); setChest(today()); setPrize(`+${xp} XP e uma estrela dourada!`);
  };
  return (
    <section aria-label="Extras do dia" className="space-y-4 mt-6">
      <div className={card}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ignition">Versículo do dia</p>
        <p className="font-display font-extrabold text-lg mt-2">"{VERSES[vi].t}"</p>
        <p className="text-xs text-stone-500 mt-1">{VERSES[vi].r} · ARC</p>
        <div className="flex gap-1.5 mt-3">
          {VERSES.map((_, i) => <button key={i} aria-label={`Versículo ${i + 1}`} onClick={() => setVi(i)} className={`h-2.5 rounded-full transition-all ${i === vi ? "w-6 bg-ignition" : "w-2.5 bg-stone-200"}`} />)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`${card} text-center`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ignition">Baú diário</p>
          <button onClick={openChest} disabled={chest === today()} className="text-5xl my-2 hover:scale-110 transition-transform disabled:opacity-50" aria-label="Abrir baú">{chest === today() ? "📭" : "🎁"}</button>
          <p className="text-xs text-stone-500">{prize ?? (chest === today() ? "Volte amanhã!" : "Toque para abrir")}</p>
        </div>
        <Link to="/brincadeiras" className={`${card} text-center hover:-translate-y-0.5 transition-transform`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ignition">Brincar</p>
          <p className="text-5xl my-2">🎡</p>
          <p className="text-xs text-stone-500">6 jogos esperando você</p>
        </Link>
      </div>
      <div className={card}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ignition">Pergunta do dia</p>
        <p className="font-bold mt-1 mb-3">{q.q}</p>
        <div className="grid grid-cols-2 gap-2">
          {q.o.map((o) => (
            <button key={o} onClick={() => { if (!voted) { setVote({ ...vote, [today()]: o }); addXP(5); } }}
              className={`min-h-11 rounded-xl border text-sm font-bold ${voted === o ? "bg-ignition text-white border-ignition" : "bg-stone-50 border-stone-200"}`}>{o}</button>
          ))}
        </div>
        {voted && <p className="text-xs text-stone-500 mt-2">Obrigado por responder! +5 XP</p>}
      </div>
    </section>
  );
}

/* ---------- JOURNEY ---------- */
const BADGES = [
  { xp: 10, e: "🌱", n: "Primeiro passo" }, { xp: 50, e: "📖", n: "Leitor" }, { xp: 100, e: "🙏", n: "Orador" },
  { xp: 200, e: "🎵", n: "Adorador" }, { xp: 300, e: "🤝", n: "Servo" }, { xp: 500, e: "⚔️", n: "Guerreiro" },
  { xp: 750, e: "🔥", n: "Chama viva" }, { xp: 1000, e: "👑", n: "Campeão" },
];
export function JourneyExtras() {
  const { progress } = useProgress();
  const [goal, setGoal] = useLocal<number>("ignicao:weekgoal:v1", 100);
  const next = BADGES.find((b) => b.xp > progress.xp);
  const chars = [["lume", "Lume", "bg-lume"], ["louvaldo", "Louvaldo", "bg-lou"], ["risoleta", "Risoleta", "bg-riso-lilac"], ["lila", "Lila", "bg-lila"]] as const;
  const maxC = Math.max(1, ...chars.map(([k]) => progress.perChar[k] || 0));
  return (
    <section aria-label="Conquistas" className="space-y-4 mt-6">
      <div className={card}>
        <div className="flex justify-between items-center"><h2 className="font-display font-extrabold">Minhas medalhas</h2><span className="text-xs font-bold">⭐ {progress.xp} XP</span></div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          {BADGES.map((b) => { const got = progress.xp >= b.xp; return (
            <div key={b.n} className={`rounded-2xl p-2 text-center ${got ? "bg-amber-50 border border-amber-200" : "bg-stone-50 opacity-50 grayscale"}`}>
              <div className="text-2xl">{b.e}</div><p className="text-[10px] font-bold leading-tight">{b.n}</p><p className="text-[9px] text-stone-400">{b.xp} XP</p>
            </div>); })}
        </div>
        {next && <p className="text-xs text-stone-500 mt-3">Faltam {next.xp - progress.xp} XP para {next.e} {next.n}</p>}
      </div>
      <div className={card}>
        <h2 className="font-display font-extrabold mb-3">Mundos que mais visitei</h2>
        {chars.map(([k, n, c]) => (
          <div key={k} className="mb-2">
            <div className="flex justify-between text-xs font-bold"><span>{n}</span><span>{progress.perChar[k] || 0} XP</span></div>
            <div className="h-2.5 rounded-full bg-stone-100"><div className={`h-full rounded-full ${c}`} style={{ width: `${((progress.perChar[k] || 0) / maxC) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className={card}>
        <h2 className="font-display font-extrabold">Minha meta</h2>
        <p className="text-xs text-stone-500 mb-2">Escolha quanto XP quer alcançar</p>
        <div className="flex gap-2">{[50, 100, 200, 500].map((g) => <button key={g} onClick={() => setGoal(g)} className={`flex-1 min-h-11 rounded-xl text-sm font-bold border ${goal === g ? "bg-ignition text-white border-ignition" : "border-stone-200"}`}>{g}</button>)}</div>
        <div className="h-3 rounded-full bg-stone-100 mt-3"><div className="h-full rounded-full bg-ignition transition-all" style={{ width: `${Math.min(100, (progress.xp / goal) * 100)}%` }} /></div>
        <p className="text-xs mt-1 text-stone-500">{progress.xp >= goal ? "🎉 Meta alcançada!" : `${progress.xp}/${goal} XP`}</p>
      </div>
    </section>
  );
}

/* ---------- FAMILY ---------- */
const TALKS = ["Qual foi a melhor parte do seu dia?", "Quando você sentiu Deus perto de você?", "Por quem podemos orar esta semana?", "O que te deixa com medo e como Jesus ajuda?", "Qual atitude de bondade você viu hoje?", "Se você pudesse perguntar algo a Jesus, o que seria?", "Pelo que somos gratos como família?", "Como podemos ajudar um vizinho?"];
const CHALLENGES = ["Jantar sem celulares", "Ler um salmo juntos", "Orar antes de dormir", "Escrever um bilhete de carinho", "Fazer um passeio em família", "Cantar um louvor juntos"];
export function FamilyExtras() {
  const { addXP } = useProgress();
  const [ti, setTi] = useState(0);
  const [flip, setFlip] = useState(false);
  const [done, setDone] = useLocal<string[]>("ignicao:family-challenges:v1", []);
  const [prayers, setPrayers] = useLocal<{ t: string; ok: boolean }[]>("ignicao:family-prayers:v1", []);
  const [txt, setTxt] = useState("");
  return (
    <section aria-label="Atividades em família" className="space-y-4 mt-6">
      <div className={card}>
        <h2 className="font-display font-extrabold">Cartas de conversa</h2>
        <button onClick={() => { if (flip) setTi((ti + 1) % TALKS.length); setFlip(!flip); }}
          className={`mt-3 w-full min-h-32 rounded-2xl p-5 font-bold text-center transition-all ${flip ? "bg-amber-100 text-stone-900" : "bg-stone-900 text-amber-300"}`}>
          {flip ? TALKS[ti] : "🐝 Toque para virar a carta"}
        </button>
        <p className="text-xs text-stone-500 mt-2">Leia em voz alta e deixe cada um responder.</p>
      </div>
      <div className={card}>
        <div className="flex justify-between"><h2 className="font-display font-extrabold">Desafios da semana</h2><span className="text-xs font-bold">{done.length}/{CHALLENGES.length}</span></div>
        <ul className="mt-3 space-y-2">
          {CHALLENGES.map((c) => { const ok = done.includes(c); return (
            <li key={c}><button onClick={() => { if (!ok) { setDone([...done, c]); addXP(10, "unny"); } else setDone(done.filter((d) => d !== c)); }}
              className={`w-full min-h-11 flex items-center gap-3 rounded-xl px-3 text-sm text-left border ${ok ? "bg-amber-50 border-amber-200 line-through" : "border-stone-200"}`}>
              <span>{ok ? "✅" : "⬜"}</span>{c}</button></li>); })}
        </ul>
      </div>
      <div className={card}>
        <h2 className="font-display font-extrabold">Mural de oração da família</h2>
        <form className="flex gap-2 mt-3" onSubmit={(e) => { e.preventDefault(); if (txt.trim()) { setPrayers([{ t: txt.trim(), ok: false }, ...prayers]); setTxt(""); } }}>
          <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Pedido de oração..." aria-label="Novo pedido de oração" className="flex-1 min-h-11 rounded-xl border border-stone-200 px-3 text-sm" />
          <button className="min-h-11 px-4 rounded-xl bg-stone-900 text-amber-300 font-bold text-sm">Adicionar</button>
        </form>
        <ul className="mt-3 space-y-2">
          {prayers.map((p, i) => (
            <li key={i} className="flex items-center gap-2 text-sm rounded-xl bg-stone-50 px-3 py-2">
              <span className="flex-1">{p.ok ? "🙌 " : "🙏 "}{p.t}</span>
              <button onClick={() => setPrayers(prayers.map((x, j) => j === i ? { ...x, ok: !x.ok } : x))} className="text-xs font-bold text-ignition min-h-11">{p.ok ? "Respondida" : "Marcar respondida"}</button>
            </li>
          ))}
          {!prayers.length && <li className="text-xs text-stone-400">Nenhum pedido ainda. Fica salvo só neste aparelho.</li>}
        </ul>
      </div>
    </section>
  );
}
