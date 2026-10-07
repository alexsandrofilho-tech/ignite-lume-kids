import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { BookOpen, Check, Heart, Music2, Pause, Play, Plus, RotateCcw, Save, Sparkles, Trash2, Trophy, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { characterContent, lessons, questions, reflections } from '@/lib/character-content';
import { useCharacterActivities } from '@/lib/use-character-activities';
import { useProgress, type CharKey } from '@/lib/progress';
import { CHORDS, strumChord, playDrum } from '@/lib/audio';

function dayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }

export function CharacterActivities({ character, tab }: { character: CharKey; tab: string }) {
  const activities = useCharacterActivities(character);
  const { progress, toggleFavorite } = useProgress();
  const content = characterContent[character];
  const count = activities.state.completed.filter(id => id.startsWith(`${character}:`)).length;
  if (tab === 'about') return <div className="space-y-6"><div className="flex items-center gap-4"><img src={content.image} alt={content.name} className="w-24 shrink-0" /><div><p className="world-eyebrow">Conheça {content.name}</p><h2 className="font-display text-2xl font-bold">{content.motto}</h2></div></div><p className="text-sm leading-relaxed">{content.description}</p><div className="flex flex-wrap gap-3">{content.values.map(value => <span key={value} className="flex items-center gap-2 text-sm font-bold"><Heart className="size-4 text-world-accent" />{value}</span>)}</div><div className="border-t border-world-border pt-5"><p className="world-eyebrow">Sua caminhada com {content.name}</p><div className="flex gap-6 mt-3"><span className="font-display text-xl">{progress.perChar[character]} XP</span><span className="font-display text-xl">{count} atividades</span></div></div></div>;
  if (tab === 'collection') return <div><h2 className="world-heading">Seu jardim de bondade</h2><p className="text-sm mb-5">Cada gesto deixa uma marca de carinho.</p><div className="grid grid-cols-2 gap-3">{[{ title: 'Primeiro gesto', min: 1 }, { title: 'Mãos que ajudam', min: 3 }, { title: 'Coração generoso', min: 5 }, { title: 'Jardim de amor', min: 10 }].map(badge => <div key={badge.title} className={`world-item text-center ${count < badge.min ? 'opacity-60' : ''}`}><Trophy className="size-8 mx-auto text-world-accent mb-2" /><h3 className="font-display font-bold">{badge.title}</h3><p className="text-xs mt-1">{count >= badge.min ? 'Conquistado!' : `${count}/${badge.min} atividades`}</p></div>)}</div><Button asChild variant="world" className="mt-5"><Link to="/lila/perfil"><Sparkles />Ver meu perfil</Link></Button></div>;
  if (character === 'lume' && tab === 'devotional') return <Devotional activities={activities} />;
  if (character === 'lume' && tab === 'prayer') return <NoteActivity activities={activities} id={`prayer:${dayKey()}`} title="Meu cantinho de oração" prompt="Pelo que você quer agradecer? Por quem deseja orar?" placeholder="Hoje quero agradecer por…" xp={20} />;
  if (character === 'lume' && tab === 'share') return <Checklist activities={activities} title="Espalhe sua luz" items={['Ore por um amigo', 'Compartilhe uma história de Jesus com a família', 'Convide alguém para brincar junto']} />;
  if (character === 'louvaldo' && tab === 'music') return <div><h2 className="world-heading">Gratidão em cada acorde</h2><p className="text-sm mb-5">Uma sequência de acordes para cada momento.</p>{[{ title: 'Manhã de alegria', chord: 'G' }, { title: 'Momento de gratidão', chord: 'C' }, { title: 'Oração tranquila', chord: 'Em' }].map(song => <div key={song.title} className="world-item flex items-center gap-3 mb-3"><Music2 className="size-5 shrink-0 text-world-accent" /><span className="flex-1 font-bold text-sm">{song.title}</span><Button variant="world" size="icon" aria-label={`Tocar acorde ${song.chord}`} onClick={() => strumChord(CHORDS[song.chord].pattern)}><Play /></Button><Button variant="worldGhost" size="icon" aria-label={`Favoritar ${song.title}`} aria-pressed={progress.favorites.includes(`practice:${song.title}`)} onClick={() => toggleFavorite(`practice:${song.title}`)}><Heart className={progress.favorites.includes(`practice:${song.title}`) ? 'fill-current' : ''} /></Button></div>)}<p className="text-xs opacity-75 mt-3">Acordes de prática · não são gravações de músicas.</p></div>;
  if (character === 'louvaldo' && tab === 'instruments') return <div><h2 className="world-heading">Sua banda começa aqui</h2><div className="space-y-4">{[{ title: 'Bateria', text: 'Explore o kit, acompanhe as notas e construa seu primeiro ritmo.', to: '/louvaldo/bateria' as const }, { title: 'Violão', text: 'Descubra as cordas, pratique acordes e experimente novas melodias.', to: '/louvaldo/violao' as const }].map(item => <div key={item.title} className="world-item"><Music2 className="size-7 text-world-accent mb-2" /><h3 className="font-display text-xl font-bold">{item.title}</h3><p className="text-sm my-3">{item.text}</p><Button variant="world" asChild><Link to={item.to}><Play />Tocar agora</Link></Button></div>)}</div></div>;
  if (character === 'louvaldo' && tab === 'rhythm') return <Rhythm activities={activities} />;
  if (character === 'risoleta' && tab === 'lessons') return <Lessons activities={activities} />;
  if (character === 'risoleta' && tab === 'quiz') return <Quiz activities={activities} />;
  if (character === 'risoleta' && tab === 'memory') return <Memory activities={activities} />;
  if (character === 'lila' && tab === 'kindness') return <Checklist activities={activities} title="Pequenos gestos, grande amor" items={['Ajude a organizar um espaço em casa', 'Agradeça a alguém que cuida de você', 'Escute um amigo com atenção', 'Compartilhe um brinquedo']} />;
  if (character === 'lila' && tab === 'journal') return <NoteActivity activities={activities} id={`journal:${dayKey()}`} title="Meu diário de bondade" prompt="Que gesto de carinho você viveu hoje? Como se sentiu?" placeholder="Hoje eu ajudei…" xp={10} />;
  if (character === 'unny' && tab === 'family') return <Checklist activities={activities} title="Tempo de qualidade em família" items={['Façam uma oração juntos', 'Cada pessoa conta uma coisa boa do dia', 'Leiam uma história bíblica em família', 'Preparem juntos um gesto de bondade']} />;
  if (character === 'unny' && tab === 'reading') return <div><h2 className="world-heading">Uma conversa que aproxima</h2><p className="world-eyebrow mb-3">Marcos 10:13–16 · Jesus acolhe as crianças</p><p className="text-sm leading-relaxed mb-5">Jesus recebeu as crianças com carinho. Ele mostrou que cada uma é importante e tem lugar perto dele. Em família, ninguém é pequeno demais para ser ouvido.</p><ol className="list-decimal pl-5 space-y-3 text-sm"><li>Quando você se sentiu acolhido nesta semana?</li><li>Como podemos ouvir uns aos outros com mais atenção?</li><li>Que gesto de carinho podemos fazer juntos?</li></ol><Completion activities={activities} id={`family-reading:${dayKey()}`} xp={20} label="Conversamos em família" /></div>;
  if (character === 'unny' && tab === 'reminders') return <Reminders activities={activities} />;
  return null;
}

type Activities = ReturnType<typeof useCharacterActivities>;
function Completion({ activities, id, xp, label = 'Concluir atividade' }: { activities: Activities; id: string; xp: number; label?: string }) {
  const done = activities.done(id);
  return <div className="mt-5"><Button variant="world" disabled={!activities.ready || done} onClick={() => activities.complete(id, xp)}>{done ? <Check /> : <Sparkles />}{done ? 'Concluído' : label}{!done && ` · +${xp} XP`}</Button>{done && <p role="status" className="text-sm font-bold mt-2">Muito bem! Seu gesto faz a diferença.</p>}</div>;
}
function Checklist({ activities, title, items }: { activities: Activities; title: string; items: string[] }) {
  return <div><h2 className="world-heading">{title}</h2><div className="space-y-3">{items.map((item, i) => { const id = `${title}:${i}:${dayKey()}`; const done = activities.done(id); return <div key={item} className="world-item flex items-center gap-3"><Heart className="size-5 text-world-accent shrink-0" /><span className="flex-1 text-sm font-bold">{item}</span><Button variant="world" size="icon" disabled={!activities.ready || done} aria-label={`${done ? 'Concluído' : 'Concluir'}: ${item}`} onClick={() => activities.complete(id, 10)}><Check /></Button></div>; })}</div><p className="text-xs opacity-80 mt-4">+10 XP por gesto · novas oportunidades a cada dia</p></div>;
}
function NoteActivity({ activities, id, title, prompt, placeholder, xp }: { activities: Activities; id: string; title: string; prompt: string; placeholder: string; xp: number }) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => { setText(activities.state.notes[`${id.startsWith('journal') ? 'lila' : 'lume'}:${id}`] || ''); }, [activities.state.notes, id]);
  return <div><h2 className="world-heading">{title}</h2><label htmlFor="world-note" className="block text-sm mb-3">{prompt}</label><textarea id="world-note" className="world-input min-h-36" maxLength={1200} value={text} onChange={e => { setText(e.target.value); setSaved(false); }} placeholder={placeholder} /><p className="text-xs opacity-75 mt-2">Seu texto fica somente neste dispositivo. Não escreva dados pessoais.</p><Button variant="world" className="mt-4" disabled={!activities.ready || !text.trim()} onClick={() => { activities.saveNote(id, text.trim()); activities.complete(id, xp); setSaved(true); }}><Save />Salvar reflexão</Button>{saved && <p role="status" className="text-sm font-bold mt-3">Salvo com carinho{activities.done(id) ? '.' : ` · +${xp} XP!`}</p>}</div>;
}
function Devotional({ activities }: { activities: Activities }) {
  const [day, setDay] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [audioMessage, setAudioMessage] = useState('');
  useEffect(() => { setDay(Math.floor(Date.now() / 86400000) % reflections.length); return () => { window.speechSynthesis?.cancel(); }; }, []);
  const reflection = reflections[day];
  function narrate() {
    if (!('speechSynthesis' in window)) { setAudioMessage('Narração indisponível neste navegador.'); return; }
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const speech = new SpeechSynthesisUtterance(`${reflection.title}. ${reflection.passage} ${reflection.story} ${reflection.question}`);
    speech.lang = 'pt-BR'; speech.onend = () => setSpeaking(false); speech.onerror = () => { setSpeaking(false); setAudioMessage('Não foi possível iniciar a narração.'); }; setSpeaking(true); window.speechSynthesis.speak(speech);
  }
  return <article><p className="world-eyebrow">Reflexão do dia · {reflection.reference}</p><h2 className="world-heading mt-2">{reflection.title}</h2><p className="world-item font-display text-lg mb-5">{reflection.passage}</p><p className="text-sm leading-relaxed">{reflection.story}</p><h3 className="font-bold mt-5 mb-2">Vamos pensar?</h3><p className="text-sm">{reflection.question}</p><p className="mt-4 text-sm font-bold">{reflection.action}</p><Button variant="worldGhost" className="mt-4" onClick={narrate}>{speaking ? <Pause /> : <Volume2 />}{speaking ? 'Parar narração' : 'Ouvir reflexão'}</Button>{audioMessage && <p role="status" className="text-sm mt-2">{audioMessage}</p>}<Completion activities={activities} id={`devotional:${dayKey()}`} xp={30} label="Li e refleti" /></article>;
}
function Lessons({ activities }: { activities: Activities }) {
  const [selected, setSelected] = useState(0);
  const lesson = lessons[selected];
  return <div><h2 className="world-heading">Descobertas da Bíblia</h2><div className="flex flex-wrap gap-2 mb-5">{lessons.map((item, index) => <Button key={item.title} variant={index === selected ? 'world' : 'worldGhost'} aria-pressed={index === selected} onClick={() => setSelected(index)}>{item.title}</Button>)}</div><article><p className="world-eyebrow">{lesson.reference}</p><h3 className="font-display text-2xl font-bold mt-2 mb-3">{lesson.title}</h3><p className="text-sm leading-relaxed">{lesson.text}</p><p className="font-bold text-sm mt-5">{lesson.question}</p><Completion activities={activities} id={`lesson:${selected}`} xp={20} label="Aprendi esta lição" /></article></div>;
}
function Quiz({ activities }: { activities: Activities }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];
  function reset() { setIndex(0); setAnswer(null); setScore(0); setFinished(false); }
  if (finished) return <div className="text-center py-6"><Trophy className="size-12 mx-auto text-world-accent" /><h2 className="world-heading mt-4">Muito bem, explorador!</h2><p className="font-display text-3xl">{score}/{questions.length}</p><p className="text-sm my-4">Cada pergunta é uma nova descoberta.</p><Completion activities={activities} id={`quiz:${dayKey()}`} xp={score * 5} label="Guardar resultado" /><Button variant="worldGhost" className="mt-3" onClick={reset}><RotateCcw />Jogar novamente</Button></div>;
  return <div><p className="world-eyebrow">Pergunta {index + 1} de {questions.length}</p><progress aria-label="Progresso do quiz" className="world-progress my-4" max={questions.length} value={index} /><h2 className="world-heading">{question.question}</h2><div className="space-y-3">{question.options.map((option, optionIndex) => <Button key={option} variant="worldGhost" className={`w-full justify-start h-auto min-h-12 whitespace-normal text-left border border-world-border ${answer !== null && optionIndex === question.correct ? 'world-correct' : answer === optionIndex ? 'world-incorrect' : ''}`} disabled={answer !== null} onClick={() => { setAnswer(optionIndex); if (optionIndex === question.correct) setScore(value => value + 1); }}>{option}</Button>)}</div>{answer !== null && <div role="status" className="mt-5"><p className="font-bold">{answer === question.correct ? 'Isso mesmo!' : 'Vamos aprender juntos!'}</p><p className="text-sm mt-2">{question.explanation}</p><Button variant="world" className="mt-4" onClick={() => { if (index + 1 === questions.length) setFinished(true); else { setIndex(value => value + 1); setAnswer(null); } }}>{index + 1 === questions.length ? 'Ver resultado' : 'Próxima pergunta'}</Button></div>}</div>;
}
const pairs = ['Arca', 'Coração', 'Bíblia', 'Estrela'];
function Memory({ activities }: { activities: Activities }) {
  const [cards, setCards] = useState([0, 2, 1, 3, 2, 0, 3, 1]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  useEffect(() => { if (open.length !== 2) return; const [a, b] = open; if (cards[a] === cards[b]) { setMatched(current => [...current, cards[a]]); setOpen([]); return; } const timeout = setTimeout(() => setOpen([]), 900); return () => clearTimeout(timeout); }, [open, cards]);
  return <div><h2 className="world-heading">Memória das descobertas</h2><p className="text-sm mb-4">{matched.length}/4 pares · {moves} tentativas</p><div className="grid grid-cols-4 gap-2">{cards.map((pair, index) => { const visible = open.includes(index) || matched.includes(pair); return <Button key={index} variant={visible ? 'world' : 'worldGhost'} className="aspect-square h-auto p-1 text-xs whitespace-normal border border-world-border" aria-label={visible ? `${pairs[pair]}, carta ${index + 1}` : `Virar carta ${index + 1}`} disabled={visible || open.length === 2} onClick={() => { setOpen(current => [...current, index]); if (open.length === 1) setMoves(value => value + 1); }}>{visible ? pairs[pair] : <Sparkles className="size-6" />}</Button>; })}</div>{matched.length === 4 && <Completion activities={activities} id={`memory:${dayKey()}`} xp={20} label="Guardar conquista" />}<Button variant="worldGhost" className="mt-4" onClick={() => { setOpen([]); setMatched([]); setMoves(0); setCards(current => [...current].sort(() => Math.random() - 0.5)); }}><RotateCcw />Embaralhar</Button></div>;
}
function Rhythm({ activities }: { activities: Activities }) {
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [hits, setHits] = useState(0);
  const [feedback, setFeedback] = useState('');
  const tick = useRef(0);
  useEffect(() => { if (!running) return; function pulse() { tick.current = performance.now(); setBeat(value => value + 1); playDrum('hat'); } pulse(); const timer = setInterval(pulse, 750); return () => clearInterval(timer); }, [running]);
  function tap() { playDrum('snare'); const elapsed = (performance.now() - tick.current) % 750; if (Math.min(elapsed, 750 - elapsed) < 180) { setHits(value => value + 1); setFeedback('No ritmo!'); } else setFeedback('Quase! Escute a próxima batida.'); }
  return <div><h2 className="world-heading">Sinta a pulsação</h2><p className="text-sm mb-5">Um pulso constante, como passos caminhando juntos.</p><div className="flex gap-3 justify-center mb-5">{[0, 1, 2, 3].map(index => <div key={index} className={`size-10 rounded-full grid place-items-center border border-world-border ${running && beat % 4 === index ? 'bg-world-accent text-world-on-accent' : ''}`}>{index + 1}</div>)}</div><div className="flex flex-wrap gap-3 justify-center"><Button variant="worldGhost" onClick={() => { setRunning(value => !value); setFeedback(''); }}>{running ? <Pause /> : <Play />}{running ? 'Pausar' : 'Começar · 80 BPM'}</Button><Button variant="world" className="min-h-14" disabled={!running} onClick={tap}><Music2 />Minha batida</Button></div><p role="status" className="text-center min-h-6 mt-4 font-bold text-sm">{feedback}</p><p className="text-center text-sm">{hits} acertos · meta: 8</p>{hits >= 8 && <Completion activities={activities} id={`rhythm:${dayKey()}`} xp={20} label="Guardar meu ritmo" />}</div>;
}
function Reminders({ activities }: { activities: Activities }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [saved, setSaved] = useState(false);
  return <div><h2 className="world-heading">Momentos para lembrar</h2><form className="space-y-3" onSubmit={e => { e.preventDefault(); if (!title.trim() || !date) return; activities.update(current => ({ ...current, reminders: [...current.reminders, { id: crypto.randomUUID(), title: title.trim(), date }] })); setTitle(''); setDate(''); setSaved(true); }}><label className="block text-sm font-bold" htmlFor="reminder-title">Momento em família</label><input id="reminder-title" className="world-input" required maxLength={80} value={title} onChange={e => setTitle(e.target.value)} placeholder="Leitura em família" /><label className="block text-sm font-bold" htmlFor="reminder-date">Dia e horário</label><input id="reminder-date" type="datetime-local" required className="world-input" value={date} onChange={e => setDate(e.target.value)} /><Button variant="world" disabled={!activities.ready} type="submit"><Plus />Adicionar lembrete</Button></form>{saved && <p role="status" className="text-sm mt-3">Lembrete salvo.</p>}<p className="text-xs mt-3 opacity-75">Agenda pessoal neste dispositivo · sem notificações automáticas.</p><div className="space-y-3 mt-5">{activities.state.reminders.length === 0 && <p className="text-sm">Nenhum momento agendado ainda.</p>}{activities.state.reminders.map(item => <div className="world-item flex items-center gap-3" key={item.id}><div className="flex-1 min-w-0"><p className="font-bold text-sm break-words">{item.title}</p><p className="text-xs mt-1">{new Date(item.date).toLocaleString('pt-BR')}</p></div><Button variant="worldGhost" size="icon" aria-label={`Excluir ${item.title}`} onClick={() => activities.update(current => ({ ...current, reminders: current.reminders.filter(reminder => reminder.id !== item.id) }))}><Trash2 /></Button></div>)}</div></div>;
}