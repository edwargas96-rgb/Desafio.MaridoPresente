// Gera um HTML único (CSS e JS embutidos) para preview rápido.
// Uso: node tools/build-preview.mjs [saida.html]
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const saida = process.argv.slice(2).find((a) => !a.startsWith('--')) || join(raiz, 'dist', 'preview.html');
const ler = (p) => readFileSync(join(raiz, p), 'utf8');

let html = ler('index.html');
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, p) => `<style>\n${ler(p)}\n</style>`);
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, p) => `<script>\n${ler(p)}\n</script>`);

// --fragment: sem doctype/html/head/body (formato exigido pelo Artifact).
if (process.argv.includes('--fragment')) {
  const titulo = html.match(/<title>[^<]*<\/title>/)[0];
  const fonte = html.match(/<link href="https:\/\/fonts\.googleapis[^>]*>/)[0];
  const estilo = html.match(/<style>[\s\S]*?<\/style>/)[0];
  const corpo = html.match(/<body>([\s\S]*)<\/body>/)[1];
  html = `${titulo}\n<meta name="claude:viewport-fit-sides" content="cover">\n${fonte}\n${estilo}\n${corpo}`;
}

import { mkdirSync } from 'node:fs';
mkdirSync(dirname(saida), { recursive: true });
writeFileSync(saida, html);
console.log('preview gerado em', saida);
