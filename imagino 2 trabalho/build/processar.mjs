// Fase 3 — processamento de imagens a partir de assets/processamento.json.
// Para cada id: recorta, cobre texto gravado, redimensiona e grava WebP com nome neutro;
// gera o par anotado (círculos/setas na cor de acento) e, para pilhas, os cortes WebP + vídeo MP4/WebM.
// As coordenadas vêm do anotador (ferramentas/anotador.html), em pixels da imagem ORIGINAL.
// Uso: node build/processar.mjs [config.json] [--saida <pasta>] [--so <id>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i === -1 ? null : args.splice(i, 2)[1]; };
const SAIDA = path.resolve(RAIZ, opt('--saida') || 'assets');
const SO = opt('--so');
const CONFIG = path.resolve(RAIZ, args[0] || 'assets/processamento.json');
const ACENTO = '#F2A900';

const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'processar-'));
const ff = (...a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a]);
const tamanho = (arq) => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', arq]).toString().trim().split(',').map(Number);
const neutro = (id) => { if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`id não neutro: "${id}"`); return id; };

// Filtro ffmpeg: cobrir (em coordenadas originais) → recortar → redimensionar.
function filtro(item, [w0, h0]) {
  const f = (item.cobrir || []).map(([x, y, w, h]) => `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=black:t=fill`);
  const [cx, cy, cw, ch] = item.recorte || [0, 0, w0, h0];
  if (item.recorte) f.push(`crop=${cw}:${ch}:${cx}:${cy}`);
  const larg = Math.min(item.largura || 1024, cw);
  f.push(`scale=${larg}:-2:flags=lanczos`);
  return { vf: f.join(','), escala: larg / cw, origem: [cx, cy] };
}

async function anotar(nav, pngLimpo, item, geo, destino) {
  const [w, h] = tamanho(pngLimpo);
  const t = ([x, y]) => [(x - geo.origem[0]) * geo.escala, (y - geo.origem[1]) * geo.escala];
  const esp = Math.max(3, Math.round(w / 170));
  const formas = item.anotacoes.map((a) => {
    if (a.tipo === 'circulo') { const [x, y] = t([a.x, a.y]); return `<circle cx="${x}" cy="${y}" r="${a.r * geo.escala}" fill="none" stroke="${ACENTO}" stroke-width="${esp}"/>`; }
    if (a.tipo === 'seta') {
      const [x1, y1] = t([a.x1, a.y1]); const [x2, y2] = t([a.x2, a.y2]);
      const ang = Math.atan2(y2 - y1, x2 - x1); const L = esp * 5;
      const p = (d) => `${x2 - L * Math.cos(ang + d)},${y2 - L * Math.sin(ang + d)}`;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ACENTO}" stroke-width="${esp}" stroke-linecap="round"/><polygon points="${x2},${y2} ${p(0.45)} ${p(-0.45)}" fill="${ACENTO}"/>`;
    }
    throw new Error(`anotação desconhecida: ${a.tipo}`);
  }).join('');
  const pag = await nav.newPage({ viewport: { width: w, height: h } });
  await pag.setContent(`<body style="margin:0"><div style="position:relative;width:${w}px;height:${h}px">
    <img src="data:image/png;base64,${fs.readFileSync(pngLimpo).toString('base64')}" style="display:block">
    <svg width="${w}" height="${h}" style="position:absolute;inset:0">${formas}</svg></div></body>`);
  await pag.waitForFunction(() => document.images[0].complete);
  const png = path.join(tmp, 'anot.png');
  await pag.screenshot({ path: png, clip: { x: 0, y: 0, width: w, height: h } });
  await pag.close();
  execFileSync('cwebp', ['-quiet', '-q', '90', png, '-o', destino]);
}

const nav = await chromium.launch();
for (const [id, item] of Object.entries(cfg)) {
  if (id.startsWith('_') || (SO && id !== SO)) continue;
  neutro(id);
  if (item.tipo === 'pilha') {
    const dirOrig = path.resolve(RAIZ, item.originais);
    const frames = fs.readdirSync(dirOrig).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (!frames.length) throw new Error(`${id}: nenhum corte em ${item.originais}`);
    const dest = path.join(SAIDA, 'pilhas', id);
    fs.rmSync(dest, { recursive: true, force: true });
    fs.mkdirSync(dest, { recursive: true });
    const geo = filtro(item, tamanho(path.join(dirOrig, frames[0])));
    frames.forEach((f, i) => {
      const png = path.join(tmp, `${String(i + 1).padStart(3, '0')}.png`);
      ff('-i', path.join(dirOrig, f), '-vf', geo.vf, png);
      execFileSync('cwebp', ['-quiet', '-q', '88', png, '-o', path.join(dest, `${String(i + 1).padStart(3, '0')}.webp`)]);
    });
    const fps = String(item.fps || 8);
    ff('-framerate', fps, '-i', path.join(tmp, '%03d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', path.join(dest, `${id}.mp4`));
    ff('-framerate', fps, '-i', path.join(tmp, '%03d.png'), '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-an', path.join(dest, `${id}.webm`));
    for (const f of fs.readdirSync(tmp)) if (f.endsWith('.png')) fs.rmSync(path.join(tmp, f));
    console.log(`${id}: ${frames.length} cortes → ${path.relative(RAIZ, dest)}/ (+ mp4, webm)`);
  } else {
    const orig = path.resolve(RAIZ, item.original);
    const geo = filtro(item, tamanho(orig));
    const png = path.join(tmp, `${id}.png`);
    ff('-i', orig, '-vf', geo.vf, png);
    const dest = path.join(SAIDA, 'processadas');
    fs.mkdirSync(dest, { recursive: true });
    execFileSync('cwebp', ['-quiet', '-q', '90', png, '-o', path.join(dest, `${id}.webp`)]);
    let msg = `${id}: ${path.relative(RAIZ, path.join(dest, id + '.webp'))}`;
    if (item.anotacoes?.length) {
      const idAnot = neutro(item.anotado_id || `${id}-anot`);
      await anotar(nav, png, item, geo, path.join(dest, `${idAnot}.webp`));
      msg += ` + ${idAnot}.webp (${item.anotacoes.length} marcas)`;
    }
    console.log(msg);
  }
}
await nav.close();
fs.rmSync(tmp, { recursive: true, force: true });
