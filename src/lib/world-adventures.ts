import type { CharKey } from './progress';

export const adventureTabs: Record<CharKey, { id: string; label: string }[]> = {
  lume: [{ id: 'stories', label: 'Histórias' }, { id: 'gratitude', label: 'Gratidão' }],
  louvaldo: [{ id: 'studio', label: 'Meu estúdio' }, { id: 'listen', label: 'Qual é o som?' }],
  risoleta: [{ id: 'sequence', label: 'História em ordem' }, { id: 'truth', label: 'Verdade ou não?' }],
  lila: [{ id: 'missions', label: 'Missão surpresa' }, { id: 'choices', label: 'Escolhas do bem' }],
  unny: [{ id: 'conversation', label: 'Roda de conversa' }, { id: 'together', label: 'Juntos' }],
};

export const storyScenes = [
  { title: 'Um lugar na brincadeira', text: 'Na hora de brincar, Lume percebe um colega sozinho. O que ele pode fazer?', options: ['Convidar o colega para brincar', 'Fingir que não viu'], correct: 0, response: 'Um convite pode iluminar o dia de alguém. Jesus nos ensina a amar o próximo.', reference: 'Mateus 22:39' },
  { title: 'Coragem para falar', text: 'O colega conta que está triste. Como Lume pode acolhê-lo?', options: ['Dizer que tristeza é bobagem', 'Ouvir com carinho e procurar um adulto de confiança'], correct: 1, response: 'Ouvir é um gesto de amor. Um adulto de confiança pode ajudar quando alguém está triste.', reference: 'Romanos 12:15' },
  { title: 'Luz que se espalha', text: 'Antes de ir embora, Lume quer demonstrar carinho. Qual gesto escolher?', options: ['Perguntar se ele quer brincar amanhã', 'Prometer guardar qualquer segredo, mesmo perigoso'], correct: 0, response: 'A amizade cresce em pequenos gestos. Segredos que dão medo devem ser contados a um adulto de confiança.', reference: 'Mateus 5:16' },
];

export const orderedStories = [
  { title: 'Noé e a arca', reference: 'Gênesis 6–8', steps: ['Noé constrói a arca', 'Os animais entram na arca', 'A chuva cai e as águas sobem', 'Noé vê o arco-íris'] },
  { title: 'Davi e Golias', reference: '1 Samuel 17', steps: ['Davi leva comida aos irmãos', 'Davi ouve o desafio de Golias', 'Davi escolhe cinco pedras', 'Davi vence o desafio'] },
  { title: 'O bom samaritano', reference: 'Lucas 10:30–37', steps: ['Um viajante é ferido', 'Algumas pessoas passam sem ajudar', 'O samaritano cuida do viajante', 'O viajante é levado a uma hospedaria'] },
];

export const truthQuestions = [
  { text: 'Jesus acolheu as crianças.', answer: true, explanation: 'Sim! Jesus recebeu as crianças com carinho. Marcos 10:13–16.' },
  { text: 'Jonas construiu a arca.', answer: false, explanation: 'Foi Noé quem construiu a arca. Gênesis 6:13–22.' },
  { text: 'Davi era rei quando enfrentou Golias.', answer: false, explanation: 'Davi ainda era jovem e cuidava de ovelhas. 1 Samuel 17.' },
  { text: 'O bom samaritano parou para ajudar.', answer: true, explanation: 'Ele cuidou de quem precisava. Lucas 10:33–35.' },
];

export const kindnessChoices = [
  { text: 'Um amigo deixou os lápis caírem. O que você faz?', options: ['Ajudo a recolher', 'Rio e vou embora'], correct: 0, response: 'Ajudar torna um momento difícil mais leve.' },
  { text: 'Você quer ajudar fora de casa. Qual é o próximo passo?', options: ['Saio sozinho', 'Combino com um adulto de confiança'], correct: 1, response: 'Fazer o bem também significa cuidar da sua segurança.' },
  { text: 'Duas pessoas querem o mesmo brinquedo. Como resolver?', options: ['Combinar turnos para brincar', 'Tomar o brinquedo'], correct: 0, response: 'Conversar e compartilhar abre espaço para todo mundo.' },
];

export const surpriseMissions = [
  { title: 'Bilhete de carinho', text: 'Escreva ou desenhe um agradecimento para alguém da sua família.', steps: ['Escolhi para quem agradecer', 'Preparei um bilhete ou desenho', 'Entreguei com carinho'] },
  { title: 'Mãos que ajudam', text: 'Combine com um adulto uma tarefa segura para ajudar em casa.', steps: ['Combinei a tarefa com um adulto', 'Ajudei com atenção', 'Organizei o que usei'] },
  { title: 'Amizade que acolhe', text: 'Na próxima brincadeira, convide alguém que ainda não está participando.', steps: ['Percebi quem estava sozinho', 'Fiz um convite gentil', 'Brincamos respeitando uns aos outros'] },
  { title: 'Cuidado com a criação', text: 'Com um adulto, cuide de uma planta ou organize materiais para reciclar.', steps: ['Escolhemos um cuidado seguro', 'Cuidamos juntos', 'Deixamos tudo organizado'] },
];

export const conversationCards = [
  'Se o seu dia fosse uma cor, qual seria? Por quê?',
  'Qual foi a coisa mais engraçada que aconteceu hoje?',
  'Em que momento você precisou de ajuda?',
  'Por quem nossa família pode orar hoje?',
  'Que gesto de carinho você recebeu nesta semana?',
  'O que você gostaria de fazer junto com a família?',
];

export const togetherPlans = [
  { title: 'Piquenique de gratidão', steps: ['Escolher um cantinho seguro em casa', 'Preparar um lanche juntos', 'Cada pessoa conta um motivo de gratidão', 'Organizar o espaço juntos'] },
  { title: 'Teatro em família', steps: ['Escolher uma história bíblica', 'Distribuir os personagens', 'Representar a história sem pressa', 'Conversar sobre o que aprenderam'] },
  { title: 'Noite do cuidado', steps: ['Cada pessoa conta como se sente', 'Ouvir sem interromper', 'Fazer uma oração juntos', 'Combinar um gesto de carinho para amanhã'] },
];