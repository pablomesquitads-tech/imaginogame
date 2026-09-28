// Gera o par limpo/anotado da IMAGEM DE TESTE do piloto (padrão geométrico, nada anatômico).
// Também gera a pilha de teste (8 cortes; o 4º é idêntico ao tst-01) com vídeo MP4/WebM.
// SVG → PNG (Chromium via Playwright) → WebP (cwebp). Uso: node build/gerar-teste-piloto.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = path.join(RAIZ, 'assets', 'processadas');
const ALVOS = [[300, 640, 'A'], [620, 470, 'B'], [700, 760, 'C']];

function padrao(anotado, desvio = 0) {
  const degraus = Array.from({ length: 10 }, (_, i) => `<rect x="${112 + i * 80}" y="96" width="80" height="90" fill="rgb(${i * 28},${i * 28},${i * 28})"/>`).join('');
  const pares = [2, 4, 6, 10].map((w, j) => Array.from({ length: 6 }, (_, i) => `<rect x="${120 + j * 110 + i * w * 2}" y="236" width="${w}" height="120" fill="#bbb"/>`).join('')).join('');
  const aneis = [60, 110, 160, 210].map((r) => `<circle cx="512" cy="620" r="${Math.max(10, r + desvio * 14)}" fill="none" stroke="#555" stroke-width="3"/>`).join('');
  const alvos = ALVOS.map(([x, y, l]) => `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="#e6e6e6"/><text x="${x + 18}" y="${y - 14}" fill="#777" font-size="26" font-family="monospace">${l}</text>`).join('');
  const anot = anotado ? ALVOS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="42" fill="none" stroke="#F2A900" stroke-width="7"/>`).join('') +
    `<path d="M870 330 L745 440" stroke="#F2A900" stroke-width="8" stroke-linecap="round"/><path d="M745 440 l8 -38 M745 440 l37 -12" stroke="#F2A900" stroke-width="8" stroke-linecap="round"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" fill="#0a0a0a"/>
    <g stroke="#1c1c1c" stroke-width="2">${Array.from({ length: 15 }, (_, i) => `<line x1="${64 + i * 64}" y1="0" x2="${64 + i * 64}" y2="1024"/><line x1="0" y1="${64 + i * 64}" x2="1024" y2="${64 + i * 64}"/>`).join('')}</g>
    ${degraus}${pares}${aneis}
    <rect x="680" y="236" width="220" height="120" fill="none" stroke="#888" stroke-width="3"/>
    <line x1="680" y1="236" x2="900" y2="356" stroke="#888" stroke-width="3"/>
    ${alvos}${anot}
    <text x="512" y="960" fill="#8a8a8a" font-size="28" font-family="monospace" text-anchor="middle">IMAGEM DE TESTE · PILOTO · SEM VALOR DIAGNÓSTICO</text>
    ${desvio ? `<text x="512" y="1000" fill="#555" font-size="22" font-family="monospace" text-anchor="middle">corte ${desvio > 0 ? '+' : ''}${desvio}</text>` : ''}
  </svg>`;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'teste-piloto-'));
const nav = await chromium.launch();
const pag = await nav.newPage({ viewport: { width: 1024, height: 1024 } });
for (const [nome, anotado] of [['tst-01', false], ['tst-01-anot', true]]) {
  await pag.setContent(`<body style="margin:0">${padrao(anotado)}</body>`);
  const png = path.join(tmp, `${nome}.png`);
  await pag.screenshot({ path: png, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  execFileSync('cwebp', ['-quiet', '-q', '90', png, '-o', path.join(SAIDA, `${nome}.webp`)]);
  console.log('gerado', path.relative(RAIZ, path.join(SAIDA, `${nome}.webp`)));
}
// Pilha de teste: cortes 001–008, o 004 é o corte-chave (igual ao tst-01).
const PILHA = path.join(RAIZ, 'assets', 'pilhas', 'pilha-tst');
fs.rmSync(PILHA, { recursive: true, force: true });
fs.mkdirSync(PILHA, { recursive: true });
for (let i = 1; i <= 8; i++) {
  await pag.setContent(`<body style="margin:0">${padrao(false, i - 4)}</body>`);
  const png = path.join(tmp, `${String(i).padStart(3, '0')}.png`);
  await pag.screenshot({ path: png, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  execFileSync('cwebp', ['-quiet', '-q', '85', png, '-o', path.join(PILHA, `${String(i).padStart(3, '0')}.webp`)]);
}
const ff = (...a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', '6', '-i', path.join(tmp, '%03d.png'), ...a]);
ff('-vf', 'scale=512:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', path.join(PILHA, 'pilha-tst.mp4'));
ff('-vf', 'scale=512:-2', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-an', path.join(PILHA, 'pilha-tst.webm'));
console.log('gerado', path.relative(RAIZ, PILHA), '(8 cortes + mp4 + webm)');
await nav.close();
fs.rmSync(tmp, { recursive: true, force: true });
