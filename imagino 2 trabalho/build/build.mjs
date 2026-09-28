// Build do jogo: node build/build.mjs [--piloto]
// Lê conteudo/cenas.json (ou conteudo/piloto/cenas.json), valida contra o manifesto,
// roda a checagem de sigilo e gera dist/caso-clinico/ (index.html autocontido + assets/).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerCsv } from './csv.mjs';
import { lerLista, criarVerificador, checarCenas, normalizar } from './sigilo.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PILOTO = process.argv.includes('--piloto');
const DIR_CONTEUDO = path.join(RAIZ, 'conteudo', PILOTO ? 'piloto' : '');
const DIST = path.join(RAIZ, 'dist', 'caso-clinico');

const TIPOS = ['fala', 'menu', 'resultado', 'consequencia', 'expositiva', 'revelacao', 'fechamento'];
const LINEARES = ['fala', 'resultado', 'expositiva', 'revelacao'];

const erros = [];
const erro = (msg) => erros.push(msg);
const ler = (p) => fs.readFileSync(p, 'utf8');
const rel = (p) => path.relative(RAIZ, p);

// ---------- entrada ----------
const bruto = JSON.parse(ler(path.join(DIR_CONTEUDO, 'cenas.json')));
const meta = { titulo: 'Caso clínico', alvo_total_s: 600, teto_s: 1200, ...bruto.meta, piloto: PILOTO };
const cenas = bruto.cenas ?? [];
const manifesto = lerCsv(ler(path.join(RAIZ, 'manifesto.csv')));
const porId = new Map(manifesto.map((m) => [m.id, m]));
const termos = lerLista(ler(path.join(RAIZ, 'conteudo', 'termos-proibidos.txt')));
const permitidos = lerLista(ler(path.join(RAIZ, 'conteudo', 'termos-permitidos.txt')));
const verificar = criarVerificador(termos, permitidos);

// ---------- portão do roteiro (CLAUDE.md, seção 11) ----------
if (!PILOTO && cenas.length) {
  const status = ler(path.join(RAIZ, 'conteudo', 'roteiro.md')).split(/\r?\n/)[0].trim();
  if (status !== 'STATUS: APROVADO') erro(`roteiro.md não está aprovado ("${status}"); conteúdo clínico não entra no build.`);
}

// ---------- validação das cenas ----------
const ids = new Set();
for (const c of cenas) {
  if (!c.id) erro('cena sem id');
  if (ids.has(c.id)) erro(`id duplicado: ${c.id}`);
  ids.add(c.id);
  if (!TIPOS.includes(c.tipo)) erro(`${c.id}: tipo inválido "${c.tipo}"`);
}
cenas.forEach((c, i) => {
  if (c.tipo === 'menu') {
    const ops = c.opcoes ?? [];
    if (ops.length < 2 || ops.length > 4) erro(`${c.id}: menu precisa de 2–4 opções`);
    if (ops.filter((o) => o.correta).length !== 1) erro(`${c.id}: menu precisa de exatamente 1 opção correta`);
    const teclas = ops.map((o) => o.tecla);
    if (new Set(teclas).size !== teclas.length || teclas.some((t) => ![1, 2, 3, 4].includes(t))) erro(`${c.id}: teclas devem ser 1–4, sem repetição`);
    for (const o of ops) {
      if (!ids.has(o.destino)) erro(`${c.id}: destino inexistente "${o.destino}"`);
      else if (!o.correta && cenas.find((x) => x.id === o.destino).tipo !== 'consequencia') erro(`${c.id}: opção errada ${o.tecla} deve levar a uma cena "consequencia"`);
    }
  }
  if (LINEARES.includes(c.tipo)) {
    if (!c.proxima) c.proxima = cenas.slice(i + 1).find((x) => x.tipo !== 'consequencia')?.id ?? null;
    if (c.proxima && !ids.has(c.proxima)) erro(`${c.id}: proxima inexistente "${c.proxima}"`);
    if (!c.proxima) erro(`${c.id}: cena linear sem próxima cena`);
  }
  if (c.tipo === 'fala' && !(c.legendas?.length)) erro(`${c.id}: cena de fala precisa de "legendas"`);
});

// ---------- imagens × manifesto (CLAUDE.md, seção 1) ----------
const usadas = new Map(); // manifesto_id -> linha
function exigirImagem(mid, cena) {
  const m = porId.get(mid);
  if (!m) return erro(`${cena}: "${mid}" não está no manifesto.csv`);
  const arq = path.join(RAIZ, m.arquivo_neutro);
  if (!fs.existsSync(arq)) erro(`${cena}: arquivo de "${mid}" não existe (${m.arquivo_neutro})`);
  if (/originais|candidatos/.test(m.arquivo_neutro)) erro(`${mid}: arquivo_neutro aponta para originais/candidatos`);
  if (!PILOTO) {
    if (m.tipo === 'teste') erro(`${mid}: imagem de teste do piloto no build final`);
    if (['radiologia', 'pilha', 'video'].includes(m.tipo) && (m.licenca_verificada !== 'sim' || m.aprovado_usuario !== 'sim'))
      erro(`${mid}: licença não verificada ou candidato não aprovado`);
    if (m.tipo === 'ilustracao' && m.aprovado_usuario !== 'sim') erro(`${mid}: ilustração não aprovada`);
  }
  usadas.set(mid, m);
}
for (const c of cenas) {
  for (const im of c.imagens ?? []) {
    exigirImagem(im.manifesto_id, c.id);
    if (im.anotacao) exigirImagem(im.anotacao, c.id);
  }
  if (c.ilustracao) exigirImagem(c.ilustracao, c.id);
}

// ---------- créditos (gerados do manifesto; nunca à mão) ----------
function credito(m) {
  if (m.tipo === 'teste') return 'Imagem de teste do piloto — sem valor diagnóstico';
  if (m.tipo === 'ilustracao') return 'Ilustração';
  if (/radiopaedia/i.test(m.fonte)) return `Case courtesy of ${m.autor}, Radiopaedia.org, rID: ${m.rid_ou_ref}`;
  return `${m.autor} — ${m.fonte}, ref. ${m.rid_ou_ref}`;
}
const referencia = (m) => (m.url && !m.url.startsWith('[') && m.url !== '—' ? `${credito(m)}. ${m.url}` : credito(m));

// ---------- sigilo (CLAUDE.md, seção 2) ----------
const sigilo = checarCenas(cenas, verificar);
for (const campo of ['titulo', 'subtitulo']) for (const t of verificar(meta[campo] ?? '')) sigilo.push({ cena: 'meta', campo, termo: t, trecho: meta[campo] });
const iRev = cenas.findIndex((c) => c.tipo === 'revelacao');
const cenasAntes = new Set((iRev === -1 ? cenas : cenas.slice(0, iRev)).map((c) => c.id));
for (const [mid, m] of usadas) {
  const antes = cenas.some((c) => cenasAntes.has(c.id) && [...(c.imagens ?? []).flatMap((i) => [i.manifesto_id, i.anotacao]), c.ilustracao].includes(mid));
  if (antes) for (const t of verificar(credito(m))) sigilo.push({ cena: mid, campo: 'credito', termo: t, trecho: credito(m) });
  for (const t of verificar(path.basename(m.arquivo_neutro))) sigilo.push({ cena: mid, campo: 'arquivo', termo: t, trecho: m.arquivo_neutro });
}
for (const s of sigilo) erro(`SIGILO: termo "${s.termo}" em ${s.cena} › ${s.campo}: "${s.trecho}"`);

if (erros.length) {
  console.error(`\nBuild FALHOU (${erros.length}):\n` + erros.map((e) => '  ✗ ' + e).join('\n'));
  process.exit(1);
}

// ---------- montagem ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

const midia = {};
for (const [mid, m] of usadas) {
  const orig = path.join(RAIZ, m.arquivo_neutro);
  const nome = path.basename(orig);
  if (!/^[a-z0-9-]+\.(webp|png|jpg|svg|mp4|webm)$/.test(nome)) erro(`${mid}: nome de arquivo não neutro "${nome}"`);
  const item = { credito: credito(m), referencia: referencia(m), tipo: m.tipo };
  if (m.tipo === 'ilustracao' && nome.endsWith('.svg')) item.svg = ler(orig).replace(/<\?xml[^>]*>\s*/, '');
  else { fs.copyFileSync(orig, path.join(DIST, 'assets', nome)); item.src = `assets/${nome}`; }
  midia[mid] = item;
}
if (erros.length) { console.error(erros.join('\n')); process.exit(1); }

const custoIdeal = cenas.filter((c) => c.tipo === 'menu').reduce((s, c) => s + (c.opcoes.find((o) => o.correta)?.custo ?? 0), 0);
const dados = { meta: { ...meta, custo_ideal: custoIdeal }, cenas, midia };

const fonte = (arq, familia, peso) =>
  `@font-face{font-family:"${familia}";font-weight:${peso};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(RAIZ, 'assets/fontes', arq)).toString('base64')}) format("woff2");}`;
const fontes = [
  fonte('inter-latin-400-normal.woff2', 'Inter', 400),
  fonte('inter-latin-600-normal.woff2', 'Inter', 600),
  fonte('inter-latin-700-normal.woff2', 'Inter', 700),
  fonte('ibm-plex-mono-latin-400-normal.woff2', 'IBM Plex Mono', 400),
  fonte('ibm-plex-mono-latin-500-normal.woff2', 'IBM Plex Mono', 500),
].join('\n');

// JSON seguro dentro de <script>: "<" escapado impede fechar a tag.
const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
const src = (f) => ler(path.join(RAIZ, 'src', f));
const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const painel = src('apresentador.html')
  .replace('/*FONTES*/', () => fontes)
  .replace('/*TOKENS*/', () => src('tokens.css'))
  .replace('/*CSS*/', () => src('apresentador.css'))
  .replace('/*JS*/', () => src('apresentador.js'));

const html = src('index.html')
  .replace('{{TITULO}}', () => escHtml(meta.titulo))
  .replace('/*FONTES*/', () => fontes)
  .replace('/*TOKENS*/', () => src('tokens.css'))
  .replace('/*CSS*/', () => src('estilo.css'))
  .replace('/*DADOS*/', () => json(dados))
  .replace('/*PAINEL*/', () => json(painel))
  .replace('/*JS*/', () => src('motor.js'));

for (const t of verificar(meta.titulo)) erro(`SIGILO: <title> contém "${t}"`);
fs.writeFileSync(path.join(DIST, 'index.html'), html);

// Nomes de tudo o que vai para o dist também passam pela lista.
for (const f of fs.readdirSync(DIST, { recursive: true })) for (const t of verificar(f)) erro(`SIGILO: arquivo "${f}" contém "${t}"`);
if (erros.length) { console.error(erros.join('\n')); fs.rmSync(DIST, { recursive: true, force: true }); process.exit(1); }

const kb = (fs.statSync(path.join(DIST, 'index.html')).size / 1024).toFixed(0);
console.log(`Build ${PILOTO ? 'PILOTO ' : ''}ok → ${rel(DIST)}/index.html (${kb} KB) · ${cenas.length} cenas · ${usadas.size} mídias · custo ideal ${custoIdeal} · sigilo ok (${termos.length} termos, ${cenasAntes.size} cenas checadas)`);
