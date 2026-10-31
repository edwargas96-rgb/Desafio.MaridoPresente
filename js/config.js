// Configurações editáveis do quiz.
window.MP = window.MP || {};

MP.config = {
  produto: 'Desafio Marido Presente',

  // Espaços de imagem. Coloque o arquivo em assets/img/ com o nome abaixo
  // (ou mude o "src"). Enquanto o arquivo não existir, aparece um espaço
  // tracejado indicando o nome e o tamanho sugerido.
  images: {
    hero:            { src: 'assets/img/hero.jpg',          ratio: '4 / 5',  label: 'Imagem de abertura' },
    resultado:       { src: 'assets/img/resultado.jpg',     ratio: '16 / 9', label: 'Imagem do resultado' },
    'jogo-buque':    { src: 'assets/img/jogo-buque.jpg',    ratio: '16 / 9', label: 'Banner do jogo do buquê' },
    'jogo-palavras': { src: 'assets/img/jogo-palavras.jpg', ratio: '16 / 9', label: 'Banner do jogo das palavras' },
    'jogo-bandeja':  { src: 'assets/img/jogo-bandeja.jpg',  ratio: '16 / 9', label: 'Banner do jogo da bandeja' },
    'jogo-memoria':  { src: 'assets/img/jogo-memoria.jpg',  ratio: '16 / 9', label: 'Banner do jogo da memória' },
  },

  // Final do quiz (ainda a definir). Enquanto for null, aparece um bloco
  // marcado como "a definir". Exemplo de uso:
  // finalCta: { titulo: '...', texto: '...', botao: 'Quero o guia', url: 'https://...' }
  finalCta: null,
};
