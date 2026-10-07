import lume from '@/assets/char-lume.png';
import louvaldo from '@/assets/char-louvaldo.png';
import risoleta from '@/assets/char-lila.png';
import lila from '@/assets/char-risoleta.png';
import unny from '@/assets/char-uni.png';
import type { CharKey } from '@/lib/progress';

export const characterContent: Record<CharKey, { name: string; image: string; motto: string; description: string; values: string[]; tabs: { id: string; label: string }[] }> = {
  lume: { name: 'Lume', image: lume, motto: 'Uma pequena luz pode iluminar um grande caminho.', description: 'Com Lume, a fé cresce nas conversas com Jesus, na descoberta da Bíblia e no amor que compartilhamos. Cada dia é uma oportunidade de levar esperança a alguém.', values: ['Esperança', 'Coragem', 'Fé'], tabs: [{ id: 'devotional', label: 'Devocional' }, { id: 'prayer', label: 'Oração' }, { id: 'share', label: 'Espalhar luz' }] },
  louvaldo: { name: 'Louvaldo', image: louvaldo, motto: 'Todo coração tem um ritmo de gratidão.', description: 'Com Louvaldo, o louvor ganha ritmo, melodia e alegria. Explore sons, pratique com os instrumentos e descubra como a música pode se tornar uma oração.', values: ['Alegria', 'Gratidão', 'Adoração'], tabs: [{ id: 'music', label: 'Músicas' }, { id: 'instruments', label: 'Instrumentos' }, { id: 'rhythm', label: 'Ritmo' }] },
  risoleta: { name: 'Risoleta', image: risoleta, motto: 'Cada descoberta faz nossa fé crescer.', description: 'Com Risoleta, as histórias da Bíblia viram descobertas. Pergunte, pense, jogue e encontre atitudes de Jesus para levar para a vida de todos os dias.', values: ['Curiosidade', 'Sabedoria', 'Aprendizado'], tabs: [{ id: 'lessons', label: 'Lições' }, { id: 'quiz', label: 'Quiz' }, { id: 'memory', label: 'Memória' }] },
  lila: { name: 'Lila', image: lila, motto: 'Pequenos gestos, grande amor.', description: 'Com Lila, aprender sobre amor também significa colocá-lo em prática. Ajudar em casa, ouvir um amigo e agradecer são pequenas missões que fazem a diferença.', values: ['Bondade', 'Serviço', 'Generosidade'], tabs: [{ id: 'kindness', label: 'Bondade' }, { id: 'journal', label: 'Meu diário' }, { id: 'collection', label: 'Conquistas' }] },
  unny: { name: 'Unny', image: unny, motto: 'Juntos, a nossa família floresce.', description: 'Com Unny, a família encontra tempo para estar perto, conversar e cuidar. Cultive momentos de comunhão e prepare o coração para viver a fé em família.', values: ['Cuidado', 'Comunhão', 'Família'], tabs: [{ id: 'family', label: 'Em família' }, { id: 'reading', label: 'Conversar' }, { id: 'reminders', label: 'Lembretes' }] },
};

export const reflections = [
  { title: 'Uma conversa com Jesus', reference: 'Mateus 6:6', passage: 'Jesus ensina que podemos conversar com o Pai em um lugar tranquilo.', story: 'Depois de um dia cheio, uma criança separou um momento de silêncio. Não precisava de palavras difíceis: contou a Deus o que a alegrava e o que a preocupava.', question: 'O que você gostaria de contar a Jesus hoje?', action: 'Reserve um momento tranquilo e converse com Deus sobre seu dia.' },
  { title: 'Luz no caminho', reference: 'Mateus 5:16', passage: 'Jesus nos convida a deixar nossa luz brilhar por meio de boas atitudes.', story: 'Na escola, um colega estava sozinho. Um convite para brincar transformou a tarde dele. Às vezes, a luz aparece em um gesto bem pequeno.', question: 'Quem pode receber um gesto de carinho seu hoje?', action: 'Convide alguém para participar de uma brincadeira ou conversa.' },
  { title: 'Cuidado que acolhe', reference: 'Lucas 10:30–37', passage: 'Na parábola do bom samaritano, Jesus mostra o amor que cuida de quem precisa.', story: 'Um viajante ferido recebeu ajuda de alguém que parou para cuidar. Amar o próximo não é apenas falar: é perceber e agir com bondade.', question: 'Como você pode ajudar sem colocar sua segurança em risco?', action: 'Peça ajuda a um adulto de confiança quando alguém precisar de cuidado.' },
];

export const lessons = [
  { title: 'Davi e Golias', reference: '1 Samuel 17', text: 'Davi era jovem, mas confiava em Deus. Ele enfrentou um grande desafio sem tentar ser igual aos outros. A história nos lembra que coragem não depende do nosso tamanho.', question: 'Qual pequeno passo de coragem você pode dar hoje?' },
  { title: 'O Mar Vermelho', reference: 'Êxodo 14', text: 'Quando o povo ficou entre o mar e o exército, parecia não haver caminho. Deus abriu uma passagem e Moisés guiou o povo. Podemos pedir ajuda quando não sabemos o que fazer.', question: 'Com quem você conversa quando sente medo?' },
  { title: 'O menino Samuel', reference: '1 Samuel 3', text: 'Samuel ouviu seu nome durante a noite e aprendeu com Eli a responder a Deus. Ouvir com atenção e aprender com pessoas de confiança faz parte do crescimento.', question: 'Como você pode ouvir melhor alguém da sua família?' },
];

export const questions = [
  { question: 'Quem construiu a arca?', options: ['Noé', 'Moisés', 'Davi'], correct: 0, explanation: 'Noé construiu a arca. Leia Gênesis 6.' },
  { question: 'Quem enfrentou Golias?', options: ['Samuel', 'Davi', 'Jonas'], correct: 1, explanation: 'Davi confiou em Deus ao enfrentar Golias. 1 Samuel 17.' },
  { question: 'O que Jesus ensina sobre o próximo?', options: ['Ignorá-lo', 'Competir sempre', 'Amá-lo'], correct: 2, explanation: 'Jesus nos ensina a amar o próximo. Mateus 22:39.' },
  { question: 'Quem guiou o povo pelo Mar Vermelho?', options: ['Moisés', 'Noé', 'Pedro'], correct: 0, explanation: 'Moisés guiou o povo. Êxodo 14.' },
  { question: 'Quem ajudou o viajante ferido?', options: ['Um rei', 'O bom samaritano', 'Um soldado'], correct: 1, explanation: 'O samaritano parou para cuidar. Lucas 10:30–37.' },
];