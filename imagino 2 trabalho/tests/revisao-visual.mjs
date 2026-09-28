// Revisão visual (CLAUDE.md, fase 5): screenshot de cada estado do jogo em 1920×1080 e 1366×768,
// e do painel do apresentador. Saída: tests/saida/. Uso: node tests/revisao-visual.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL_JOGO = pathToFileURL(path.join(RAIZ, 'dist/caso-clinico/index.html')).href;
const SAIDA = path.join(RAIZ, 'tests/saida');
fs.rmSync(SAIDA, { recursive: true, force: true });
fs.mkdirSync(SAIDA, { recursive: true });

// Roteiro de teclas: [nome do screenshot, teclas antes da foto]
const PASSOS = [
  ['01-capa', []], ['02-regras', ['ArrowRight']], ['03-fala-1', ['ArrowRight']], ['04-fala-2', ['ArrowRight']],
  ['05-fala-3', ['ArrowRight']], ['06-fala-4', ['ArrowRight']], ['07-menu', ['ArrowRight']],
  ['08-consequencia', ['1']], ['09-menu-tentada', ['ArrowRight']], ['10-consequencia-2', ['3']],
  ['11-menu-dica', ['ArrowRight']], ['12-resultado', ['2']], ['13-resultado-anotado', ['a']],
  ['14-revelacao', ['ArrowRight']], ['15-fechamento', ['ArrowRight']],
];

const nav = await chromium.launch();
for (const [w, h] of [[1920, 1080], [1366, 768]]) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h } });
  const pag = await ctx.newPage();
  await pag.goto(URL_JOGO);
  await pag.evaluate(() => document.fonts.ready);
  let popup = null;
  for (const [nome, teclas] of PASSOS) {
    for (const t of teclas) await pag.keyboard.press(t);
    await pag.waitForTimeout(700); // animações de entrada e de anotação
    await pag.screenshot({ path: path.join(SAIDA, `${w}x${h}-${nome}.png`) });
    if (w === 1920 && ['07-menu', '12-resultado', '06-fala-4'].includes(nome)) {
      if (!popup) {
        [popup] = await Promise.all([ctx.waitForEvent('page'), pag.keyboard.press('Shift+P')]);
        await popup.setViewportSize({ width: 1280, height: 800 });
        await popup.waitForSelector('#painel');
        await pag.bringToFront();
      }
      await popup.waitForTimeout(1200);
      await popup.screenshot({ path: path.join(SAIDA, `painel-${nome}.png`) });
    }
  }
  await ctx.close();
}
await nav.close();
console.log(`Screenshots em ${path.relative(RAIZ, SAIDA)}/:`, fs.readdirSync(SAIDA).length);
