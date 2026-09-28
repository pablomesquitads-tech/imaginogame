// Fase 7 — PDF do caminho ideal (contingência: abre sem o HTML, em qualquer PC da sala).
// Percorre só as condutas corretas; nas cenas com anotação entra a versão limpa e a anotada.
// Uso: node tests/pdf-contingencia.mjs [index.html] [saida.pdf]
//      (padrão: dist/caso-clinico/index.html → dist/contingencia/caminho-ideal.pdf)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { percorrer } from './percurso.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const alvo = path.resolve(RAIZ, process.argv[2] || 'dist/caso-clinico/index.html');
const saida = path.resolve(RAIZ, process.argv[3] || 'dist/contingencia/caminho-ideal.pdf');
fs.mkdirSync(path.dirname(saida), { recursive: true });

const nav = await chromium.launch();
const pag = await nav.newPage({ viewport: { width: 1920, height: 1080 } });
await pag.goto(pathToFileURL(alvo).href);
await pag.evaluate(() => document.fonts.ready);
const titulo = await pag.title();
const fotos = [];
await percorrer(pag, {
  modo: 'ideal',
  foto: async () => { await pag.waitForTimeout(650); fotos.push((await pag.screenshot({ type: 'jpeg', quality: 88 })).toString('base64')); },
});
const doc = await nav.newPage();
await doc.setContent(`<!doctype html><html><head><meta charset="utf-8"><title>${titulo}</title>
  <style>@page{size:1920px 1080px;margin:0}body{margin:0}img{display:block;width:1920px;height:1080px;page-break-after:always}</style></head>
  <body>${fotos.map((f) => `<img src="data:image/jpeg;base64,${f}">`).join('')}</body></html>`);
await doc.pdf({ path: saida, width: '1920px', height: '1080px', printBackground: true });
await nav.close();
console.log(`PDF: ${path.relative(RAIZ, saida)} · ${fotos.length} páginas · ${(fs.statSync(saida).size / 1024 / 1024).toFixed(1)} MB`);
