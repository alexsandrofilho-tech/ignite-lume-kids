import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Check, Copy, ExternalLink, Highlighter, Pause, Save, Type, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reflections } from '@/lib/character-content';
import { useCharacterActivities } from '@/lib/use-character-activities';
import { useProgress } from '@/lib/progress';

type Activities = ReturnType<typeof useCharacterActivities>;
const passages = [
  { number: 6, link: 'MAT.6.6', text: 'Quando você orar, procure um lugar reservado e converse com seu Pai. Ele vê o que acontece em segredo e cuida de você.' },
  { number: 16, link: 'MAT.5.16', text: 'Deixem a luz de vocês brilhar diante das pessoas. Ao verem suas boas atitudes, elas poderão glorificar o Pai que está nos céus.' },
  { number: 27, link: 'LUK.10.27', text: 'Ame o Senhor, seu Deus, com todo o coração, toda a alma, toda a força e todo o entendimento; e ame seu próximo como a si mesmo.' },
];

export function DevotionalReader({ activities }: { activities: Activities }) {
  const [today, setToday] = useState(0);
  const [selected, setSelected] = useState(0);
  const [large, setLarge] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const { progress, toggleFavorite } = useProgress();
  useEffect(() => {
    const d = new Date();
    const index = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000) % reflections.length;
    setToday(index); setSelected(index);
    return () => { window.speechSynthesis?.cancel(); };
  }, []);
  const reflection = reflections[selected];
  const passage = passages[selected];
  const id = `devotional-reading:${selected}`;
  const favoriteId = `verse:lume:${passage.link}`;
  const highlightId = `highlight:lume:${passage.link}`;
  const saved = progress.favorites.includes(favoriteId);
  const highlighted = progress.favorites.includes(highlightId);
  const verseReference = selected === 2 ? 'Lucas 10:27' : reflection.reference;
  useEffect(() => { setNote(activities.state.notes[`lume:${id}`] || ''); }, [activities.state.notes, id]);
  function change(index: number) { window.speechSynthesis?.cancel(); setSpeaking(false); setMessage(''); setSelected(index); }
  function narrate() {
    if (!('speechSynthesis' in window)) { setMessage('A narração não está disponível neste navegador.'); return; }
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const speech = new SpeechSynthesisUtterance(`${reflection.title}. ${verseReference}. Paráfrase. ${passage.text} ${reflection.story} ${reflection.question} ${reflection.action}`);
    speech.lang = 'pt-BR'; speech.rate = 0.9;
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => { setSpeaking(false); setMessage('Não foi possível reproduzir a narração.'); };
    window.speechSynthesis.cancel(); setSpeaking(true); window.speechSynthesis.speak(speech);
  }
  async function copyVerse() {
    try { await navigator.clipboard.writeText(`${passage.text}\n${verseReference} — paráfrase educativa IGNIÇÃO`); setMessage('Passagem copiada.'); }
    catch { setMessage('Não foi possível copiar. Você pode selecionar o texto da passagem.'); }
  }
  return <article className="space-y-6">
    <header>
      <p className="world-eyebrow">{selected === today ? 'Reflexão de hoje' : 'Biblioteca de reflexões'} · {selected + 1} de {reflections.length}</p>
      <h2 className="world-heading mt-2 mb-2">{reflection.title}</h2>
      <p className="text-xs opacity-85">Reflexão original IGNIÇÃO · leitura com Lume</p>
    </header>

    <section className="verse-reader" aria-label="Leitura da passagem bíblica">
      <div className="flex items-center justify-between gap-3 border-b border-reader-border pb-4">
        <div><h3 className="font-bold text-base">{verseReference}</h3><p className="text-xs text-reader-muted mt-1">Paráfrase educativa · não é uma tradução bíblica</p></div>
        <Button variant="ghost" size="icon" aria-label="Aumentar texto" title="Aumentar texto" aria-pressed={large} onClick={() => setLarge(value => !value)}><Type /></Button>
      </div>
      <p className={`verse-text my-6 ${large ? 'verse-text-large' : ''} ${highlighted ? 'verse-highlight' : ''}`}><sup className="text-xs font-sans font-bold mr-2 text-reader-muted">{passage.number}</sup>{passage.text}</p>
      <div className="flex flex-wrap gap-2 border-t border-reader-border pt-3" aria-label="Ações da passagem">
        <Button variant="ghost" size="icon" aria-label="Destacar passagem" title="Destacar passagem" aria-pressed={highlighted} onClick={() => toggleFavorite(highlightId)}><Highlighter className={highlighted ? 'fill-current' : ''} /></Button>
        <Button variant="ghost" size="icon" aria-label="Salvar passagem" title="Salvar passagem" aria-pressed={saved} onClick={() => toggleFavorite(favoriteId)}><Bookmark className={saved ? 'fill-current' : ''} /></Button>
        <Button variant="ghost" size="icon" aria-label="Copiar passagem" title="Copiar passagem" onClick={copyVerse}><Copy /></Button>
        <Button variant="ghost" size="icon" aria-label={speaking ? 'Parar narração' : 'Ouvir reflexão'} title={speaking ? 'Parar narração' : 'Ouvir reflexão'} onClick={narrate}>{speaking ? <Pause /> : <Volume2 />}</Button>
        <Button variant="link" asChild className="ml-auto px-1 text-reader-ink text-xs"><a href={`https://www.bible.com/pt/bible/compare/${passage.link}`} target="_blank" rel="noopener noreferrer">Ler na Bíblia<ExternalLink /></a></Button>
      </div>
    </section>

    <section><h3 className="font-display text-xl font-bold mb-3">Uma história para o coração</h3><p className="text-sm leading-relaxed">{reflection.story}</p></section>
    <section><h3 className="font-display text-xl font-bold mb-3">Vamos refletir juntos?</h3><p className="text-sm leading-relaxed">{reflection.question}</p><p className="text-sm leading-relaxed mt-3">Como esse ensinamento pode aparecer nas suas atitudes em casa, na escola ou com seus amigos?</p></section>
    <section className="border-l-4 border-world-accent pl-4"><h3 className="font-bold mb-2">Um pequeno passo hoje</h3><p className="text-sm leading-relaxed">{reflection.action}</p></section>
    <section><h3 className="font-display text-xl font-bold mb-3">Uma oração simples</h3><p className="text-sm leading-relaxed">Jesus, obrigado por caminhar comigo. Ajuda-me a entender sua Palavra e a viver com amor. Mostra-me como cuidar das pessoas ao meu redor. Amém.</p></section>

    <section><label htmlFor="devotional-reflection" className="block font-bold mb-3">Minha reflexão</label><textarea id="devotional-reflection" className="world-input min-h-32" value={note} maxLength={1200} placeholder="Hoje eu aprendi…" onChange={event => setNote(event.target.value)} /><p className="text-xs opacity-80 mt-2">Salvo apenas neste dispositivo. Não escreva dados pessoais.</p><Button variant="worldGhost" className="mt-3" disabled={!activities.ready || !note.trim()} onClick={() => { activities.saveNote(id, note.trim()); setMessage('Sua reflexão foi salva.'); }}><Save />Salvar reflexão</Button></section>
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="world" disabled={!activities.ready || activities.done(id)} onClick={() => { activities.complete(id, 30); setMessage('Leitura concluída! +30 XP.'); }}><Check />{activities.done(id) ? 'Leitura concluída' : 'Li e refleti · +30 XP'}</Button>
      {selected !== today && <Button variant="worldGhost" onClick={() => change(today)}>Voltar para hoje</Button>}
    </div>
    <p role="status" aria-live="polite" className="text-sm min-h-5">{message}</p>
    <nav className="flex items-center justify-between border-t border-world-border pt-4" aria-label="Navegação entre reflexões"><Button variant="worldGhost" disabled={selected === 0} onClick={() => change(selected - 1)}><ArrowLeft />Anterior</Button><Button variant="worldGhost" disabled={selected === reflections.length - 1} onClick={() => change(selected + 1)}>Próxima<ArrowRight /></Button></nav>
  </article>;
}