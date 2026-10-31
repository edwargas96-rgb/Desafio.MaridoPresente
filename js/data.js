// Perguntas, feedbacks e textos. Tom: homem pra homem, direto, sem sermão.
// Placeholders: {ela} / {Ela} = nome dela; {frase} = o que o encantou nela.
window.MP = window.MP || {};

MP.levels = [
  { xp: 0,   nome: 'Piloto automático' },
  { xp: 40,  nome: 'Acordando' },
  { xp: 100, nome: 'Em campo' },
  { xp: 170, nome: 'Presente' },
  { xp: 250, nome: 'Marido do ano' },
];

// Feedbacks genéricos, sorteados sem repetir.
MP.generic = {
  good: [
    'Isso aí. Pouco homem responde assim.',
    'Ponto pra você. Agora não relaxa.',
    'Boa. Saber é fácil. Difícil é manter.',
    'Isso ela percebe. Continua.',
  ],
  mid: [
    'Meio termo. Meio termo não segura casamento.',
    'Dá pra melhorar, e você sabe disso.',
    'Nem bom, nem ruim. Só que ela sente a diferença.',
    'Tá no limite. Mais um tempo assim e vira colega de casa.',
  ],
  bad: [
    'Dói ler. Imagina pra quem vive isso.',
    'Aqui é onde a maioria tropeça. Você não é exceção.',
    'Ela já percebeu. Só parou de comentar.',
    'Sem enrolação: isso aí está te custando caro.',
    'Anota essa. Ela vai voltar no final.',
  ],
  neutral: [
    'Anotado.',
    'Beleza. Isso entra no seu diagnóstico.',
    'Segue, que a coisa vai esquentar.',
    'Guardei. Próxima.',
  ],
};

// Feedbacks dos joguinhos.
MP.gameFb = {
  bouquet: {
    good: ['Buquê cheio. Agora responde: quando foi a última vez que você fez isso de verdade?', 'Ficou bonito. Na vida real, flor sem atenção no dia a dia é só enfeite.'],
    mid:  ['Buquê meio ralo. Ela percebe quando é feito com pressa.', 'Dá pra entregar. Mas dava pra ter capricho.'],
    bad:  ['Pegou espinho e deixou flor pra trás. Na vida real é igual: pressa e ela leva a picada.', 'Buquê quase vazio. Foi assim que ela se sentiu nos últimos meses.'],
  },
  words: {
    good: ['Você sabe o que aproxima. O desafio é fazer isso quando está cansado.', 'Mão rápida pro que presta. Agora leva isso pra dentro de casa.'],
    mid:  ['Acertou umas, errou outras. Em casa também é assim, né?', 'Metade do jogo você foi bem. A outra metade é onde ela sente.'],
    bad:  ['Pegou justamente o que afasta. Reflexo é treino, e o seu está treinado errado.', 'Se no jogo já é difícil escolher o que aproxima, imagina às 22h depois de um dia ruim.'],
  },
  tray: {
    good: ['Bandeja pronta e com bilhete. O bilhete é o que ela vai guardar, não o café.', 'Montou certo. Agora o difícil: levar de verdade, e não só uma vez.'],
    mid:  ['Faltou capricho. Café sem detalhe é só café.', 'Quase. O detalhe é o que faz ela lembrar que você pensou nela.'],
    bad:  ['Celular na bandeja? Foi mal, mas é assim que ela se sente: competindo com a tela.', 'Bandeja torta. Gesto sem pensar nela vira obrigação, e ela sabe a diferença.'],
  },
  memory: {
    good: ['Memória afiada. Dá pra lembrar do que ela gosta, só falta usar.', 'Rápido. Imagina se essa atenção fosse todo dia.'],
    mid:  ['Foi no meio. Lembra de algumas coisas dela, esquece de outras.', 'Demorou, mas achou. Em casa, ela espera menos.'],
    bad:  ['Errou bastante. Ela não precisa que você seja perfeito, precisa que você lembre.', 'Esqueceu onde estava cada coisa. Ela também esquece de te pedir.'],
  },
};

MP.questions = {
  nome: {
    tipo: 'texto',
    texto: 'Qual o nome da mulher que você quer reconquistar?',
    dica: 'Só o primeiro nome. A gente vai usar ele daqui pra frente.',
    placeholder: 'Nome dela',
    fb: [
      '{Ela}. Guarda esse nome. Ele vai aparecer bastante daqui pra frente.',
      'Ok, {ela}. Daqui em diante não tem mais "minha esposa": tem {ela}.',
      '{Ela}. Fica a pergunta: faz quanto tempo que você não fala esse nome com carinho?',
    ],
  },
  tempo: {
    tipo: 'escolha',
    texto: 'Há quanto tempo vocês estão juntos?',
    opcoes: [
      { t: 'Menos de 2 anos', fb: ['Pouco tempo ainda. Dá pra consertar antes de virar hábito.'] },
      { t: 'De 2 a 5 anos', fb: ['Fase em que a rotina começa a engolir. Reconhece?'] },
      { t: 'De 5 a 10 anos', fb: ['Aqui é onde a maioria começa a se tratar como sócio.'] },
      { t: 'De 10 a 20 anos', fb: ['Dez anos ou mais não é pouca coisa. Jogar isso fora sai caro.'] },
      { t: 'Mais de 20 anos', fb: ['Mais de 20 anos. Muita história pra deixar morrer no silêncio.'] },
    ],
  },
  filhos: {
    tipo: 'escolha',
    texto: 'Tem filho em casa?',
    opcoes: [
      { t: 'Sim, pequenos', fb: ['Filho pequeno consome tudo. E o casal vira o último da fila. Normal, mas perigoso.'] },
      { t: 'Sim, já grandes ou adolescentes', fb: ['Eles estão vendo tudo. O exemplo que você dá é aula.'] },
      { t: 'Já saíram de casa', fb: ['Casa vazia. Agora só sobram vocês dois. Ninguém mais pra se esconder atrás.'] },
      { t: 'Não temos filhos', fb: ['Sem filho no meio, não tem desculpa: a relação é só de vocês dois.'] },
    ],
  },
  afasta: {
    tipo: 'escolha',
    texto: 'O que você mais sente que afasta vocês dois?',
    dica: 'Escolhe a que mais pesa. Sem pensar muito.',
    opcoes: [
      { t: 'Rotina e celular. Cada um no seu mundo', tag: 'rotina', fb: ['Dois na mesma casa e cada um numa tela. Clássico, e fatal.'] },
      { t: 'A gente quase não conversa', tag: 'conversa', fb: ['Quando acaba a conversa, acaba o casal. Só sobra a logística.'] },
      { t: 'Dinheiro, trabalho, pressão', tag: 'pressao', fb: ['Pressão de fora vira briga dentro. Normal. Só que ela não é seu inimigo.'] },
      { t: 'A família dela ou a minha', tag: 'familia', fb: ['Terceiros mandando na relação. Isso a gente resolve com acordo, não com briga.'] },
      { t: 'Ela parou de pedir e eu nem percebi', tag: 'desistiu', fb: ['Essa é a mais honesta. E a mais séria: quando ela para de pedir, não é paz, é desistência.'] },
      { t: 'Nem sei dizer', tag: 'naosei', fb: ['Não saber já é a resposta. Quem não enxerga o problema não conserta.'] },
    ],
  },
  encantou: {
    tipo: 'escolha',
    texto: 'O que nela te encantou desde o início?',
    dica: 'Fala a real. A próxima pergunta depende dessa.',
    opcoes: [
      { t: 'O sorriso dela', frase: 'o sorriso dela' },
      { t: 'O jeito de rir', frase: 'o jeito que ela ri' },
      { t: 'A força dela', frase: 'a força dela' },
      { t: 'A inteligência', frase: 'a inteligência dela' },
      { t: 'O cuidado com as pessoas', frase: 'o jeito que ela cuida dos outros' },
      { t: 'O jeito de olhar pra mim', frase: 'o jeito que ela te olhava' },
      { t: 'Outra coisa', frase: 'aquilo que te encantou nela' },
    ],
    fb: [
      'Boa. Guarda isso aí. A próxima pergunta é a que dói.',
      'Anotado. Agora vem a parte que ninguém gosta de responder.',
      'Foi isso que te prendeu. Vamos ver se ela sabe disso.',
    ],
  },
  elogio: {
    tipo: 'escolha',
    cat: 'Atenção',
    texto: 'Quando foi a última vez que você falou pra {ela} sobre {frase}?',
    dica: 'Falar de verdade, pra ela. Pensar não conta.',
    opcoes: [
      { t: 'Hoje ou essa semana', s: 3 },
      { t: 'Neste mês', s: 2 },
      { t: 'Faz alguns meses', s: 1 },
      { t: 'Mais de um ano', s: 0 },
      { t: 'Nunca falei, só pensei', s: 0 },
    ],
    fb: {
      good: ['Quem elogia o que ama de verdade segura casamento. Mantém.'],
      mid:  ['Fala de vez em quando. Ela sabe a diferença entre elogio e conta paga.'],
      bad: [
        'Você se encantou e guardou pra você. Ela não lê mente.',
        'Sentir e não falar é, pra ela, a mesma coisa que não sentir.',
        'Isso que te prendeu nela, ela ficou anos sem ouvir. Pensa nisso.',
      ],
    },
  },
  gesto: {
    tipo: 'escolha',
    cat: 'Iniciativa',
    texto: 'Quando foi a última vez que você fez algo por {ela} sem ela precisar pedir?',
    opcoes: [
      { t: 'Essa semana', s: 3 },
      { t: 'Neste mês', s: 2 },
      { t: 'Não lembro', s: 1 },
      { t: 'Ela sempre tem que pedir', s: 0 },
    ],
    fb: {
      good: ['Iniciativa. É isso que ela chama de "presença". Mantém.'],
      mid:  ['Faz, mas de vez em quando. Ela conta o tempo entre uma e outra.'],
      bad: [
        'Se ela precisa pedir, você virou tarefa na lista dela, e não parceiro.',
        'Cada pedido que ela faz cansa mais do que o gesto que você deixa de fazer.',
      ],
    },
  },
  escuta: {
    tipo: 'escolha',
    cat: 'Atenção',
    texto: 'Quando {ela} conta como foi o dia dela, você normalmente…',
    opcoes: [
      { t: 'Largo o celular e escuto de verdade', s: 3 },
      { t: 'Escuto, mas já estou pensando em outra coisa', s: 2 },
      { t: 'Dou um "aham" e sigo o que eu estava fazendo', s: 1 },
      { t: 'Ela nem conta mais', s: 0 },
    ],
    fb: {
      good: ['Escutar é o gesto mais barato e mais raro. Você já faz.'],
      mid:  ['Ouvido presente, cabeça longe. Ela percebe pelo olhar.'],
      bad: [
        '"Aham" não é conversa. Ela percebeu faz tempo.',
        'Quando ela para de contar, não é por falta de assunto. É por falta de plateia.',
      ],
    },
  },
  saida: {
    tipo: 'escolha',
    cat: 'Iniciativa',
    texto: 'Última vez que vocês saíram só os dois, sem filho, sem parente e sem celular na mesa?',
    opcoes: [
      { t: 'No último mês', s: 3 },
      { t: 'De 3 a 6 meses atrás', s: 2 },
      { t: 'Mais de um ano', s: 1 },
      { t: 'Nem lembro', s: 0 },
    ],
    fb: {
      good: ['Casal que sai junto ainda tem o que dizer um pro outro.'],
      mid:  ['Meses sem sair. O casal vai virando só pai e mãe.'],
      bad: [
        'Nem lembrar já é diagnóstico.',
        'Um ano sem sair é um ano tratando ela como colega de moradia.',
      ],
    },
  },
  quefazer: {
    tipo: 'escolha',
    cat: 'Comunicação',
    texto: 'Quantas vezes você já disse pra {ela}: "o que você quer que eu faça?"',
    dica: 'Sem mentir. Ela lembra de cada uma.',
    opcoes: [
      { t: 'Nunca falei', s: 3 },
      { t: 'Uma ou duas vezes', s: 2 },
      { t: 'Várias vezes', s: 1 },
      { t: 'É minha frase favorita', s: 0 },
    ],
    fb: {
      good: ['Ótimo. Essa frase é o atalho pra ela desistir.'],
      mid:  ['Essa frase sai fácil, mas pesa. Ela explicou uma vez, e ouviu isso de volta.'],
      bad: [
        'Essa frase faz mulher desistir. Ela explica uma vez, duas, três. Na quarta, para.',
        'Ela não quer manual. Quer que você enxergue sozinho.',
        'Esse "o que você quer que eu faça" é a maior prova de que ela falou e você não ouviu.',
      ],
    },
  },
  reacao: {
    tipo: 'escolha',
    texto: 'Quando você tenta fazer algo legal, como {ela} reage?',
    opcoes: [
      { t: 'Se emociona ou agradece', fb: ['Boa. Ela ainda está aberta. Aproveita essa janela.'] },
      { t: 'Agradece, mas seca', fb: ['Educada, mas distante. Dá pra reverter, só que não em um dia.'] },
      { t: 'Desconfia ou faz piada', fb: ['Compreensível. Depois de muito tempo sem gesto, um gesto isolado não paga a dívida. Constância paga.'] },
      { t: 'Nem percebe', fb: ['Ela não percebe porque desligou o radar. Reativar leva tempo e repetição.'] },
    ],
  },
  tentou: {
    tipo: 'escolha',
    texto: 'O que você já tentou até aqui?',
    opcoes: [
      { t: 'Conversar, mas acaba em briga', fb: ['Conversa sem método vira discussão. Falta o roteiro.'] },
      { t: 'Presente ou dinheiro pra compensar', fb: ['Presente não paga atenção que faltou. Ela sente a compra.'] },
      { t: 'Ficar quieto esperando passar', fb: ['Silêncio não é paz. É combustível.'] },
      { t: 'Procurei ajuda (igreja, terapia, conselho)', fb: ['Procurar ajuda é coragem. Falta transformar em rotina diária em casa.'] },
      { t: 'Nada ainda. Estou aqui agora', fb: ['Pelo menos você chegou. Já é mais do que muito homem faz.'] },
    ],
  },
  pedido: {
    tipo: 'escolha',
    cat: 'Iniciativa',
    texto: 'Quando {ela} te pede uma coisa simples (ajuda, atenção, um tempo seu), você faz na hora?',
    opcoes: [
      { t: 'Na hora, sempre', s: 3 },
      { t: 'Faço, mas demoro ou reclamo', s: 2 },
      { t: 'Esqueço', s: 1 },
      { t: 'Ela nem pede mais', s: 0 },
    ],
    fb: {
      good: ['Quem responde na hora ainda é o parceiro dela.'],
      mid:  ['Demorar e reclamar anula o gesto. Ela fica com a reclamação, não com a ajuda.'],
      bad: [
        'Esse é o pior sinal. Quando ela para de pedir, não é paz, é desistência.',
        '"Esqueço" quer dizer "ela não é prioridade". Ela entende assim.',
      ],
    },
  },
  nota: {
    tipo: 'escala',
    texto: 'De 0 a 10: o quanto você quer salvar esse casamento?',
    dica: 'Sem fazer pose. O diagnóstico depende disso.',
    fb: {
      low:  ['Se é menos que 5, por que você está aqui? Seja honesto, é pra você mesmo.'],
      mid:  ['Meio termo na vontade dá meio termo no resultado.'],
      high: ['Vontade tem. Agora falta método e constância.'],
    },
  },
  compromisso: {
    tipo: 'escolha',
    texto: 'Última: você topa 30 dias de esforço de verdade, sem esperar resposta dela logo de cara?',
    dica: 'Ela pode demorar pra reagir. É assim mesmo.',
    opcoes: [
      { t: 'Topo. Os 30 dias inteiros', tag: 'topo', fb: ['Era essa resposta que eu esperava. Agora vem o diagnóstico.'] },
      { t: 'Topo, se ela também fizer a parte dela', tag: 'condicional', fb: ['Condicional. Justo, mas lembra: alguém precisa dar o primeiro passo, e é você.'] },
      { t: 'Preciso pensar', tag: 'duvida', fb: ['Pensar é válido. Só que dúvida demais é o que deixou chegar até aqui.'] },
    ],
  },
};

// Ordem do fluxo: 15 perguntas e 4 joguinhos.
MP.sequence = [
  { k: 'q', id: 'nome' },
  { k: 'q', id: 'tempo' },
  { k: 'q', id: 'filhos' },
  { k: 'q', id: 'afasta' },
  { k: 'q', id: 'encantou' },
  { k: 'q', id: 'elogio' },
  { k: 'g', id: 'bouquet' },
  { k: 'q', id: 'gesto' },
  { k: 'q', id: 'escuta' },
  { k: 'q', id: 'saida' },
  { k: 'g', id: 'words' },
  { k: 'q', id: 'quefazer' },
  { k: 'q', id: 'reacao' },
  { k: 'q', id: 'tentou' },
  { k: 'g', id: 'tray' },
  { k: 'q', id: 'pedido' },
  { k: 'g', id: 'memory' },
  { k: 'q', id: 'nota' },
  { k: 'q', id: 'compromisso' },
];

// Resultado
MP.perfis = [
  { ate: 35, nome: 'Piloto automático', texto: 'Você ama, mas a rotina está falando mais alto. {Ela} provavelmente já parou de esperar algo de você. A boa notícia: quem parou de esperar ainda pode voltar a notar, se você der motivo.' },
  { ate: 65, nome: 'Meio presente', texto: 'Você está presente em alguns momentos e ausente em outros. {Ela} vive nessa gangorra e isso cansa. Dá pra virar o jogo, mas precisa de constância, e não de um gesto isolado.' },
  { ate: 101, nome: 'Tem base', texto: 'Você tem boa base. O que falta é método e constância pra {ela} voltar a sentir que é vista. O caminho está mais curto do que parece.' },
];

MP.afastaTexto = {
  rotina: 'Rotina e tela no meio. A distância entre vocês é feita de pequenas ausências diárias.',
  conversa: 'Falta de conversa de verdade. Sobrou só logística, e relação vive de assunto.',
  pressao: 'Pressão de fora está descontando em casa. Ela virou o alvo errado.',
  familia: 'Terceiros pesando na relação. Falta um acordo de casal pra proteger vocês dois.',
  desistiu: 'Ela parou de pedir. Isso é o sinal mais forte de desistência, e também o mais reversível se você agir logo.',
  naosei: 'Você nem sabe nomear o problema. O primeiro passo é enxergar, e você acabou de fazer isso.',
};

MP.compromissoTexto = {
  topo: 'Você disse que topa os 30 dias inteiros. É isso que muda o jogo.',
  condicional: 'Você topa se ela fizer a parte dela. O primeiro passo precisa ser seu, sem esperar.',
  duvida: 'Você ainda está na dúvida. Entende: dúvida demais é o que deixa o casamento esfriar.',
};
