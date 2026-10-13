import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Dices, Heart, Music2, Pause, Play, RotateCcw, Save, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useCharacterActivities } from '@/lib/use-character-activities';
import type { CharKey } from '@/lib/progress';
import { playHat, playKick, playSnare } from '@/lib/audio';
import { conversationCards, kindnessChoices, orderedStories, storyScenes, surpriseMissions, togetherPlans, truthQuestions } from '@/lib/world-adventures';

type Activities = ReturnType<typeof useCharacterActivities>;
function today() { const date = new Date(); return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; }

function Reward({ activities, id, xp = 25 }: { activities: Activities; id: string; xp?: number }) {
  return <div className="mt-5 border-t border-world-border pt-4"><Button variant="world" disabled={!activities.ready || activities.done(id)} onClick={() => activities.complete(id, xp)}><Trophy />{activities.done(id) ? 'Conquista guardada' : `Guardar conquista · +${xp} XP`}</Button><p role="status" className="text-sm mt-2">{activities.done(id) ? 'Seu progresso foi salvo neste dispositivo.' : 'Muito bem! Você chegou ao final.'}</p></div>;
}

export function WorldAdventures({ character, tab }: { character: CharKey; tab: string }) {
  const activities = useCharacterActivities(character);
  if (character === 'lume' && tab === 'stories') return <ChoiceStory character={character} activities={activities} scenes={storyScenes} title="A luz de uma amizade" id="story" />;
  if (character === 'lume' && tab === 'gratitude') return <Gratitude activities={activities} />;
  if (character === 'louvaldo' && tab === 'studio') return <Studio activities={activities} />;
  if (character === 'louvaldo' && tab === 'listen') return <SoundQuiz activities={activities} />;
  if (character === 'risoleta' && tab === 'sequence') return <Sequence activities={activities} />;
  if (character === 'risoleta' && tab === 'truth') return <Truth activities={activities} />;
  if (character === 'lila' && tab === 'missions') return <SurpriseMission activities={activities} />;
  if (character === 'lila' && tab === 'choices') return <ChoiceStory character={character} activities={activities} scenes={kindnessChoices} title="O que meu coração escolhe?" id="choices" />;
  if (character === 'unny' && tab === 'conversation') return <Conversation activities={activities} />;
  if (character === 'unny' && tab === 'together') return <Together activities={activities} />;
  return null;
}

function ChoiceStory({ character, activities, scenes, title, id }: { character: CharKey; activities: Activities; scenes: { title?: string; text: string; options: string[]; correct: number; response: string; reference?: string }[]; title: string; id: string }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const scene = scenes[step];
  return <div><h2 className="world-heading">{title}</h2><p className="world-eyebrow mb-4">{finished ? 'Uma nova descoberta!' : `Capítulo ${step + 1} de ${scenes.length}`}</p><progress className="world-progress mb-5" aria-label="Progresso da história" max={scenes.length} value={finished ? scenes.length : step} />{finished ? <><Heart className="size-12 text-world-accent" /><p className="font-display text-xl mt-4">Pequenas escolhas espalham amor.</p><Reward activities={activities} id={`${id}:${today()}`} /><Button variant="worldGhost" className="mt-3" onClick={() => { setStep(0); setAnswer(null); setFinished(false); }}><RotateCcw />Viver a história novamente</Button></> : <><h3 className="font-display text-xl mb-3">{scene.title}</h3><p className="text-sm leading-relaxed mb-5">{scene.text}</p><div className="space-y-3">{scene.options.map((option, index) => <Button key={option} variant="worldGhost" className={`w-full h-auto min-h-12 whitespace-normal text-left justify-start border border-world-border ${answer === index ? index === scene.correct ? 'world-correct' : 'world-incorrect' : ''}`} disabled={answer !== null} onClick={() => setAnswer(index)}>{option}</Button>)}</div>{answer !== null && <div role="status" className="mt-4"><p className="font-bold">{answer === scene.correct ? 'Uma escolha cheia de carinho!' : 'Vamos pensar em outra possibilidade.'}</p><p className="text-sm mt-2 leading-relaxed">{scene.response}</p>{scene.reference && <p className="world-eyebrow mt-3">{scene.reference} · reflexão original IGNIÇÃO</p>}<Button variant="world" className="mt-4" onClick={() => { if (answer !== scene.correct) { setAnswer(null); return; } if (step === scenes.length - 1) setFinished(true); else { setStep(step + 1); setAnswer(null); } }}><ChevronRight />{answer !== scene.correct ? 'Escolher novamente' : step === scenes.length - 1 ? 'Finalizar história' : 'Próximo capítulo'}</Button></div>}</>}</div>;
}

function Gratitude({ activities }: { activities: Activities }) {
  const id = `gratitude:${today()}`;
  const [notes, setNotes] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);
  useEffect(() => { const raw = activities.state.notes[`lume:${id}`]; if (raw) { try { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setNotes(parsed); } catch { /* Ignore an invalid local note. */ } } }, [activities.state.notes, id]);
  return <div><h2 className="world-heading">Três faíscas de gratidão</h2><p className="text-sm mb-5">Que coisas boas aqueceram seu coração hoje?</p><div className="space-y-4">{['Uma pessoa', 'Um momento', 'Uma descoberta'].map((label, i) => <div key={label}><label htmlFor={`gratitude-${i}`} className="flex items-center gap-2 text-sm font-bold mb-2"><Sparkles className="size-4 text-world-accent" />{label}</label><input id={`gratitude-${i}`} className="world-input" maxLength={180} value={notes[i] ?? ''} onChange={e => { setNotes(current => current.map((note, index) => index === i ? e.target.value : note)); setSaved(false); }} /></div>)}</div><p className="text-xs mt-4">Somente neste dispositivo. Não inclua dados pessoais.</p><Button variant="world" className="mt-4" disabled={!activities.ready || notes.some(note => !note.trim())} onClick={() => { activities.saveNote(id, JSON.stringify(notes.map(note => note.trim()))); activities.complete(id, 20); setSaved(true); }}><Save />Guardar minhas faíscas</Button>{saved && <p role="status" className="font-bold text-sm mt-3">Gratidão guardada!</p>}</div>;
}

const sounds = [{ label: 'Bumbo', play: playKick }, { label: 'Caixa', play: playSnare }, { label: 'Chimbal', play: () => playHat() }];
function Studio({ activities }: { activities: Activities }) {
  const [pattern, setPattern] = useState<boolean[][]>(Array.from({ length: 3 }, () => Array(8).fill(false)));
  const [bpm, setBpm] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(-1);
  const [saved, setSaved] = useState(false);
  const patternRef = useRef(pattern);
  patternRef.current = pattern;
  useEffect(() => { const raw = activities.state.notes['louvaldo:studio-pattern']; if (raw) { try { const parsed = JSON.parse(raw); if (Array.isArray(parsed) && parsed.length === 3 && parsed.every(row => Array.isArray(row) && row.length === 8)) setPattern(parsed); } catch { /* Keep empty pattern. */ } } }, [activities.state.notes]);
  useEffect(() => { if (!playing) { setBeat(-1); return; } let index = 0; const pulse = () => { setBeat(index); patternRef.current.forEach((row, instrument) => { if (row[index]) sounds[instrument].play(); }); index = (index + 1) % 8; }; pulse(); const timer = setInterval(pulse, 60000 / bpm / 2); return () => clearInterval(timer); }, [playing, bpm]);
  const filled = pattern.flat().filter(Boolean).length;
  return <div><h2 className="world-heading">Meu estúdio de louvor</h2><p className="text-sm mb-5">Qual ritmo combina com sua alegria hoje?</p><div className="space-y-4">{sounds.map((sound, row) => <div key={sound.label}><p className="text-sm font-bold mb-2">{sound.label}</p><div className="grid grid-cols-8 gap-1">{pattern[row].map((active, column) => <Button key={column} variant={active ? 'world' : 'worldGhost'} aria-label={`${sound.label}, tempo ${column + 1}`} aria-pressed={active} className={`aspect-square p-0 h-auto border border-world-border ${beat === column ? 'ring-2 ring-world-accent' : ''}`} onClick={() => { setPattern(current => current.map((line, r) => line.map((value, c) => r === row && c === column ? !value : value))); setSaved(false); if (!active) sound.play(); }}>{active ? <Music2 /> : column + 1}</Button>)}</div></div>)}</div><label htmlFor="studio-bpm" className="block font-bold text-sm mt-5">Andamento · {bpm} BPM</label><input id="studio-bpm" type="range" min={60} max={160} step={10} value={bpm} onChange={e => setBpm(Number(e.target.value))} className="w-full my-3 accent-world-accent" /><div className="flex flex-wrap gap-3"><Button variant="world" disabled={!filled} onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}{playing ? 'Pausar ritmo' : 'Ouvir meu ritmo'}</Button><Button variant="worldGhost" disabled={!activities.ready || !filled} onClick={() => { activities.saveNote('studio-pattern', JSON.stringify(pattern)); activities.complete(`studio:${today()}`, 25); setSaved(true); }}><Save />Salvar ritmo</Button><Button variant="worldGhost" size="icon" aria-label="Limpar ritmo" onClick={() => { setPlaying(false); setPattern(Array.from({ length: 3 }, () => Array(8).fill(false))); setSaved(false); }}><RotateCcw /></Button></div><p role="status" className="text-sm mt-3">{saved ? 'Seu ritmo foi guardado!' : playing ? `Tempo ${beat + 1} de 8` : ''}</p></div>;
}

function SoundQuiz({ activities }: { activities: Activities }) {
  const [round, setRound] = useState(0);
  const [heard, setHeard] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const sequence = [0, 2, 1, 2, 0];
  if (round === sequence.length) return <div><h2 className="world-heading">Ouvidos atentos!</h2><p className="font-display text-3xl">{score}/5 sons reconhecidos</p><Reward activities={activities} id={`listen:${today()}`} xp={score * 5} /><Button variant="worldGhost" className="mt-3" onClick={() => { setRound(0); setAnswer(null); setScore(0); setHeard(false); }}><RotateCcw />Jogar novamente</Button></div>;
  return <div><h2 className="world-heading">Qual é o som?</h2><p className="world-eyebrow mb-5">Som {round + 1} de 5</p><Button variant="world" className="min-h-14 mb-5" onClick={() => { sounds[sequence[round]].play(); setHeard(true); }}><Play />Ouvir som misterioso</Button><div className="grid grid-cols-3 gap-2">{sounds.map((sound, index) => <Button key={sound.label} variant="worldGhost" className="min-h-12" disabled={!heard || answer !== null} onClick={() => { setAnswer(index); if (index === sequence[round]) setScore(score + 1); }}>{sound.label}</Button>)}</div>{answer !== null && <div role="status" className="mt-5"><p className="font-bold">{answer === sequence[round] ? 'Isso mesmo!' : 'Esse som é o ' + sounds[sequence[round]].label + '.'}</p><Button variant="world" className="mt-3" onClick={() => { setRound(round + 1); setAnswer(null); setHeard(false); }}><ChevronRight />{round === 4 ? 'Ver resultado' : 'Próximo som'}</Button></div>}</div>;
}

function Sequence({ activities }: { activities: Activities }) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [feedback, setFeedback] = useState('');
  const story = orderedStories[storyIndex];
  return <div><h2 className="world-heading">História em ordem</h2><div className="flex flex-wrap gap-2 mb-5">{orderedStories.map((item, i) => <Button key={item.title} variant={i === storyIndex ? 'world' : 'worldGhost'} onClick={() => { setStoryIndex(i); setOrder([]); setFeedback(''); }}>{item.title}</Button>)}</div><p className="world-eyebrow mb-3">{story.reference}</p><ol className="space-y-2 mb-5">{[0, 1, 2, 3].map(i => <li key={i} className="border-b border-world-border py-3 text-sm min-h-12"><span className="font-bold mr-2">{i + 1}.</span>{order[i] !== undefined ? story.steps[order[i]] : '…'}</li>)}</ol><div className="space-y-2">{[2, 0, 3, 1].map(index => <Button key={index} variant="worldGhost" className="w-full min-h-12 h-auto whitespace-normal justify-start text-left" disabled={order.includes(index) || order.length === 4} onClick={() => { if (index === order.length) { setOrder([...order, index]); setFeedback('Isso! A história continua.'); } else setFeedback('Esse momento vem depois. Qual aconteceu primeiro?'); }}>{story.steps[index]}</Button>)}</div><p role="status" className="text-sm font-bold mt-3">{feedback}</p>{order.length === 4 && <Reward activities={activities} id={`sequence:${storyIndex}:${today()}`} />}<Button variant="worldGhost" className="mt-3" onClick={() => { setOrder([]); setFeedback(''); }}><RotateCcw />Recomeçar</Button></div>;
}

function Truth({ activities }: { activities: Activities }) {
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  if (round === truthQuestions.length) return <div><h2 className="world-heading">Descobertas concluídas!</h2><p className="font-display text-3xl">{score}/{truthQuestions.length}</p><Reward activities={activities} id={`truth:${today()}`} xp={score * 5} /><Button variant="worldGhost" className="mt-3" onClick={() => { setRound(0); setScore(0); setAnswer(null); }}><RotateCcw />Tentar novamente</Button></div>;
  const item = truthQuestions[round];
  return <div><h2 className="world-heading">Verdade ou não?</h2><p className="world-eyebrow mb-4">Descoberta {round + 1} de {truthQuestions.length}</p><p className="font-display text-xl mb-5">{item.text}</p><div className="grid grid-cols-2 gap-3">{[true, false].map(value => <Button key={String(value)} variant="worldGhost" className="min-h-14" disabled={answer !== null} onClick={() => { setAnswer(value); if (value === item.answer) setScore(score + 1); }}>{value ? 'Verdade' : 'Não é verdade'}</Button>)}</div>{answer !== null && <div role="status" className="mt-5"><p className="font-bold">{answer === item.answer ? 'Boa descoberta!' : 'Agora você sabe!'}</p><p className="text-sm my-3">{item.explanation}</p><Button variant="world" onClick={() => { setRound(round + 1); setAnswer(null); }}><ChevronRight />{round === truthQuestions.length - 1 ? 'Ver resultado' : 'Próxima descoberta'}</Button></div>}</div>;
}

function SurpriseMission({ activities }: { activities: Activities }) {
  const key = `surprise:${today()}`;
  const stored = activities.state.notes[`lila:${key}`];
  const selected = stored !== undefined ? Number(stored) : null;
  const [open, setOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const mission = selected !== null ? surpriseMissions[selected] : undefined;
  function roll() { setRolling(true); timer.current = setTimeout(() => { activities.saveNote(key, String(Math.floor(Math.random() * surpriseMissions.length))); setRolling(false); setOpen(true); }, 750); }
  return <div><h2 className="world-heading">Uma surpresa de bondade</h2><Dices className={`size-16 text-world-accent mx-auto my-6 ${rolling ? 'animate-pulse' : ''}`} /><p className="text-center text-sm mb-5">{mission ? mission.title : 'Que gesto de carinho espera por você hoje?'}</p><div className="flex justify-center"><Button variant="world" disabled={!activities.ready || rolling} onClick={mission ? () => setOpen(true) : roll}><Dices />{rolling ? 'Sorteando…' : mission ? 'Abrir minha missão' : 'Sortear missão de hoje'}</Button></div><Dialog open={open} onOpenChange={setOpen}><DialogContent className="world-lila bg-world-panel text-world-ink border-world-border w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto"><DialogTitle className="font-display text-2xl pr-6">{mission?.title ?? 'Missão do dia'}</DialogTitle><DialogDescription className="text-world-ink">{mission?.text}</DialogDescription>{mission && <><div className="space-y-3">{mission.steps.map((step, i) => { const id = `${key}:step:${i}`; return <label key={step} className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" className="size-5 accent-world-accent" checked={activities.done(id)} disabled={!activities.ready || activities.done(id)} onChange={() => activities.complete(id, 5)} />{step}</label>; })}</div>{mission.steps.every((_, i) => activities.done(`${key}:step:${i}`)) && <Reward activities={activities} id={`${key}:reward`} xp={15} />}</>}</DialogContent></Dialog></div>;
}

function Conversation({ activities }: { activities: Activities }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [spoken, setSpoken] = useState<number[]>([]);
  const question = conversationCards[index];
  return <div><h2 className="world-heading">Nossa roda de conversa</h2><p className="text-sm mb-5">Cada voz da família tem um lugar especial.</p><Button variant="worldGhost" className="w-full min-h-44 h-auto whitespace-normal text-center px-6 font-display text-xl border border-world-border" aria-label={revealed ? question : 'Revelar pergunta'} onClick={() => setRevealed(!revealed)}>{revealed ? question : <><Heart />Uma pergunta para nós</>}</Button><p className="world-eyebrow mt-4">Carta {index + 1} de {conversationCards.length} · {spoken.length} conversas</p><div className="flex flex-wrap gap-3 mt-4"><Button variant="world" disabled={!revealed || spoken.includes(index)} onClick={() => setSpoken(current => [...current, index])}><Check />Conversamos</Button><Button variant="worldGhost" onClick={() => { setIndex((index + 1) % conversationCards.length); setRevealed(false); }}><ChevronRight />Próxima carta</Button></div>{spoken.length >= 3 && <Reward activities={activities} id={`conversation:${today()}`} xp={20} />}</div>;
}

function Together({ activities }: { activities: Activities }) {
  const [selected, setSelected] = useState(0);
  const plan = togetherPlans[selected];
  return <div><h2 className="world-heading">Um encontro só nosso</h2><div className="flex flex-wrap gap-2 mb-5">{togetherPlans.map((item, i) => <Button key={item.title} variant={i === selected ? 'world' : 'worldGhost'} onClick={() => setSelected(i)}>{item.title}</Button>)}</div><h3 className="font-display text-xl mb-4">{plan.title}</h3><div className="space-y-4">{plan.steps.map((step, index) => { const id = `together:${selected}:${index}:${today()}`; return <label key={step} className="flex gap-3 items-start text-sm leading-relaxed"><input type="checkbox" className="size-5 shrink-0 accent-world-accent" checked={activities.done(id)} disabled={!activities.ready || activities.done(id)} onChange={() => activities.complete(id, 5)} /><span>{step}</span></label>; })}</div>{plan.steps.every((_, i) => activities.done(`together:${selected}:${i}:${today()}`)) && <Reward activities={activities} id={`together:${selected}:reward:${today()}`} xp={10} />}</div>;
}