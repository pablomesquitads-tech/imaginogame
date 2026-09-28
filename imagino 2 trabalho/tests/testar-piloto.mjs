// Teste de aceitação do piloto (CLAUDE.md, fase 1), em Chromium via file://.
// Pré-requisito: node build/build.mjs --piloto. Uso: node tests/testar-piloto.mjs
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL_JOGO = pathToFileURL(path.join(RAIZ, 'dist/caso-clinico/index.html')).href;

let falhas = 0;
const ok = (cond, msg) => { console.log(`${cond ? '  ✓' : '  ✗'} ${msg}`); if (!cond) falhas++; };
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1920, height: 1080 } });
const externas = [];
ctx.on('request', (r) => { if (!/^(file|data|about|blob):/.test(r.url())) externas.push(r.url()); });
const erros = [];
const pag = await ctx.newPage();
pag.on('pageerror', (e) => erros.push(e.message));
await pag.goto(URL_JOGO);
await pag.evaluate(() => document.fonts.ready);

const estado = () => pag.evaluate(() => window.__jogo.estado());
const cena = async () => (await estado()).cenaId;

console.log('Offline e fontes');
ok((await pag.title()) === 'Caso clínico', '<title> neutro: "Caso clínico"');
// @font-face só carrega quando usado: força a carga e confere que veio do WOFF2 embutido.
const fontes = await pag.evaluate(async () => Promise.all(['400 32px Inter', '600 32px Inter', '700 32px Inter', '400 24px "IBM Plex Mono"', '500 24px "IBM Plex Mono"']
  .map(async (f) => [f, (await document.fonts.load(f)).some((ff) => ff.status === 'loaded')])));
for (const [f, carregada] of fontes) ok(carregada, `fonte embutida carregada: ${f}`);

console.log('Painel sobreposto (P com uma tela só)');
const telaUnica = await pag.evaluate(() => window.screen.isExtended === false);
if (telaUnica) {
  await pag.keyboard.press('p');
  const quadro = pag.frameLocator('#sobreposto');
  await quadro.locator('#cena-id').filter({ hasText: 'abertura-capa' }).waitFor();
  ok(true, 'P com uma tela abre o painel sobreposto e sincroniza');
  await pag.keyboard.press('p');
  ok(await pag.locator('#sobreposto').count() === 0, 'P de novo fecha o painel sobreposto');
} else console.log('  (ambiente com tela estendida: modo sobreposto não testado)');

console.log('Painel do apresentador em janela (Shift+P)');
const [popup] = await Promise.all([ctx.waitForEvent('page'), pag.keyboard.press('Shift+P')]);
popup.on('pageerror', (e) => erros.push('painel: ' + e.message));
await popup.waitForSelector('#painel');
await popup.waitForFunction(() => document.getElementById('cena-id').textContent.includes('abertura-capa'));
ok(true, 'janela do apresentador abriu e recebeu o estado');
await popup.waitForFunction(() => document.getElementById('conexao').textContent === 'conectado', null, { timeout: 4000 });
ok(true, 'indicador de conexão: conectado');

console.log('Fala sincronizada');
await pag.bringToFront();
await pag.keyboard.press('ArrowRight');
await pag.keyboard.press('ArrowRight');
ok((await cena()) === 'historia-fala', 'avança até a fala');
ok(await pag.locator('.personagem[data-quem="N"], .legenda .quem').first().isVisible(), 'legenda visível');
await pag.keyboard.press('ArrowRight');
ok((await estado()).passo === 1, '→ avança um trecho da legenda');
ok(await pag.locator('.personagem[data-quem="P"].falando').count() === 1, 'personagem que fala é destacado');
await popup.waitForFunction(() => document.querySelector('#fala p.atual')?.textContent.includes('escada'));
ok(true, 'painel acompanha o trecho atual da fala');
for (let i = 0; i < 3; i++) await pag.keyboard.press(' ');
ok((await cena()) === 'menu-conduta-1', 'espaço avança até o menu');

console.log('Menu, consequência, dica, desfazer');
await pag.keyboard.press('1');
ok((await cena()) === 'cons-m1-rm' && (await estado()).custo === 2, 'conduta errada → consequência, custo 2');
await popup.waitForFunction(() => document.getElementById('custo').textContent === '2');
ok(true, 'painel mostra custo 2');
await pag.keyboard.press('ArrowRight');
ok((await cena()) === 'menu-conduta-1', 'consequência volta ao mesmo menu');
ok(await pag.locator('.opcao.tentada').count() === 1, 'opção já tentada marcada');
ok(await pag.locator('.dica').count() === 0, 'sem dica após 1 erro');
await pag.keyboard.press('3');
await pag.keyboard.press('ArrowRight');
ok(await pag.locator('.dica').count() === 1, 'dica do preceptor após 2 erros');
ok((await estado()).custo === 5, 'custo acumulado 5');
await pag.keyboard.press('z');
ok((await cena()) === 'cons-m1-alta', 'Z desfaz o retorno ao menu');
await pag.keyboard.press('z');
const s = await estado();
ok(s.cenaId === 'menu-conduta-1' && s.custo === 2 && s.desvios['menu-conduta-1'] === 1, 'Z desfaz a escolha (custo 2, 1 desvio)');

console.log('Teclas vindas do painel');
await popup.bringToFront();
await popup.keyboard.press('2');
await esperar(150);
ok((await cena()) === 'resultado-imagem', 'tecla 2 no painel registra a conduta na plateia');
await popup.waitForFunction(() => document.getElementById('proxima').textContent.includes('oculto'));
ok(!(await popup.locator('#proxima').textContent()).includes('diagnóstico'), 'prévia da Revelação oculta no painel');

console.log('Anotação');
await pag.bringToFront();
const opac = () => pag.locator('.quadro img.anot').evaluate((e) => getComputedStyle(e).opacity);
ok((await opac()) === '0', 'anotação começa desligada');
await pag.keyboard.press('a');
await esperar(600);
ok((await opac()) === '1', 'A liga a anotação');
ok((await pag.locator('.credito').textContent()).includes('teste'), 'crédito gerado do manifesto sob a imagem');
const imgs = await pag.locator('.quadro img').evaluateAll((els) => els.map((e) => e.complete && e.naturalWidth > 0));
ok(imgs.length === 2 && imgs.every(Boolean), 'par limpo/anotado carregou de assets/');
console.log('Pilha de cortes');
ok((await pag.locator('.quadro .corte').textContent()).startsWith('corte 4/8'), 'abre no corte-chave (4/8)');
await pag.keyboard.press('ArrowDown');
await esperar(100);
ok((await pag.locator('.quadro .corte').textContent()).startsWith('corte 5/8'), '↓ avança um corte');
ok((await pag.locator('.quadro img.base').getAttribute('src')).endsWith('pilha-tst/005.webp'), 'mostra o corte 005 da pilha');
ok((await opac()) === '0', 'fora do corte-chave a anotação some');
const h0 = await pag.evaluate(() => window.__jogo.historico());
await pag.keyboard.press('ArrowDown');
ok((await pag.evaluate(() => window.__jogo.historico())) === h0, 'rolagem não entra no histórico de desfazer');
await pag.keyboard.press('ArrowUp');
await pag.keyboard.press('ArrowUp');
await esperar(600);
ok((await pag.locator('.quadro .corte').textContent()).startsWith('corte 4/8') && (await opac()) === '1', '↑ volta ao corte-chave e a anotação reaparece');
for (let i = 0; i < 12; i++) await pag.keyboard.press('ArrowUp');
ok((await pag.locator('.quadro .corte').textContent()).startsWith('corte 1/8'), 'rolagem para no primeiro corte');
for (let i = 0; i < 3; i++) await pag.keyboard.press('ArrowDown');
await esperar(600);
await pag.keyboard.press('a');
await esperar(600);
ok((await opac()) === '0', 'A desliga a anotação');

console.log('Fechamento e reinício');
await pag.keyboard.press('ArrowRight');
ok((await cena()) === 'revelacao', 'avança para a Revelação');
await pag.keyboard.press('ArrowRight');
ok((await cena()) === 'fechamento-placar', 'avança para o fechamento');
ok((await pag.locator('.placar .num').first().textContent()) === '2', 'placar mostra custo da turma 2');
await pag.keyboard.press('r');
ok((await cena()) === 'fechamento-placar', 'R uma vez só pede confirmação');
await pag.keyboard.press('r');
ok((await cena()) === 'abertura-capa' && (await estado()).custo === 0, 'R R reinicia');

console.log('Robustez');
ok(externas.length === 0, `nenhuma requisição fora de file:// (${externas.length})`);
ok(erros.length === 0, `nenhum erro de JavaScript${erros.length ? ': ' + erros.join(' | ') : ''}`);

await nav.close();
console.log(falhas ? `\n${falhas} falha(s).` : '\nPiloto: todos os testes passaram.');
process.exit(falhas ? 1 : 0);
