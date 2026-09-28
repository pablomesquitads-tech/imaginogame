// Revisão visual (CLAUDE.md, fase 5): screenshot de cada estado em 1920×1080 e 1366×768,
// com um desvio por menu, e do painel do apresentador.
// Uso: node tests/revisao-visual.mjs [caminho do index.html]   (padrão: dist/caso-clinico/index.html)
// Saída: tests/saida/<pasta do build>/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { percorrer } from './percurso.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const alvo = path.resolve(RAIZ, process.argv[2] || 'dist/caso-clinico/index.html');
const rotulo = path.relative(path.join(RAIZ, 'dist'), path.dirname(alvo)).replace(/[\\/]/g, '-');
const SAIDA = path.join(RAIZ, 'tests/saida', rotulo);
fs.rmSync(SAIDA, { recursive: true, force: true });
fs.mkdirSync(SAIDA, { recursive: true });

const nav = await chromium.launch();
for (const [w, h] of [[1920, 1080], [1366, 768]]) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h } });
  const pag = await ctx.newPage();
  const erros = [];
  pag.on('pageerror', (e) => erros.push(e.message));
  await pag.goto(pathToFileURL(alvo).href);
  await pag.evaluate(() => document.fonts.ready);
  let painel = null;
  if (w === 1920) {
    [painel] = await Promise.all([ctx.waitForEvent('page'), pag.keyboard.press('Shift+P')]);
    await painel.setViewportSize({ width: 1280, height: 800 });
    await pag.bringToFront();
  }
  const total = await percorrer(pag, {
    modo: 'revisao',
    foto: async (nome) => {
      await pag.waitForTimeout(650);
      await pag.screenshot({ path: path.join(SAIDA, `${w}x${h}-${nome}.png`) });
      if (painel && /menu|fala-1$|resultado/.test(nome) && !nome.endsWith('-anotado')) {
        await painel.waitForTimeout(300);
        await painel.screenshot({ path: path.join(SAIDA, `painel-${nome}.png`) });
      }
    },
  });
  if (erros.length) console.log(`Erros de JS em ${w}x${h}:`, erros);
  console.log(`${w}x${h}: ${total} estados`);
  await ctx.close();
}
await nav.close();
console.log(`Screenshots em ${path.relative(RAIZ, SAIDA)}/`);
