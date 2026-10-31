# Desafio Marido Presente: quiz gamificado

Quiz para homens que querem reconquistar a esposa. Português do Brasil, tom informal e direto, sem sermão.

- 15 perguntas, 4 joguinhos (colher flores pro buquê, palavras que aproximam ou afastam, montar o café da manhã, memória)
- XP, níveis, sequência (🔥) e feedbacks aleatórios a cada resposta
- Resultado com índice de presença, barras por categoria e leitura do que mais afasta o casal
- Sem dependências nem build: HTML, CSS e JS puros

## Rodar

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`. Também funciona abrindo `index.html` direto.

## Onde editar

| O quê | Arquivo |
|---|---|
| Perguntas, opções, feedbacks, textos do resultado | `js/data.js` |
| Regras e pontuação dos joguinhos | `js/games.js` |
| Imagens e final do quiz (`finalCta`) | `js/config.js` |
| Visual | `css/style.css` |

Imagens: veja `assets/img/README.md`.

## Final do quiz

Ainda a definir. Enquanto `finalCta` estiver `null` em `js/config.js`, a tela de resultado mostra um bloco marcado "a definir".

## Preview em arquivo único

```bash
node tools/build-preview.mjs
```

Gera `dist/preview.html` com CSS e JS embutidos.
