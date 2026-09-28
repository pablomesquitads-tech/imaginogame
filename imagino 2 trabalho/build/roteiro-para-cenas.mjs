// Converte conteudo/roteiro.md em conteudo/cenas.json (o roteiro é a fonte única do texto).
// Mídias, personagens e meta vêm de conteudo/config-roteiro.json.
// Uso: node build/roteiro-para-cenas.mjs   (depois: build --rascunho, ou build final se APROVADO)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ler = (f) => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const cfg = JSON.parse(ler('conteudo/config-roteiro.json'));
const roteiro = ler('conteudo/roteiro.md').replace(/\r\n/g, '\n');
const status = roteiro.split('\n')[0].trim();

const semAcento = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const limpar = (s) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`/g, '').trim();
const semAspas = (s) => limpar(s).replace(/^["“](.*)["”]$/s, '$1');
const MAIUSC = 'A-ZÀÁÂÃÉÊÍÓÔÕÚÇ';
const frase = (s) => { const t = s.trim().toLowerCase(); return t.charAt(0).toUpperCase() + t.slice(1); };

// ---------- leitura das cenas ----------
const blocos = roteiro.split(/^### id: /m).slice(1).map((b) => {
  const linhas = b.split('\n');
  const id = linhas[0].trim();
  const campos = {};
  let atual = null;
  for (const l of linhas.slice(1)) {
    if (/^(## |---)/.test(l)) break;
    const topo = /^- ([^:(]+)(?:\((.*?)\))?[^:]*?:\s*(.*)$/.exec(l);
    const sub = /^\s{2,}- (.*)$/.exec(l);
    if (topo) { atual = semAcento(topo[1]); campos[atual] = { valor: topo[3].trim(), lista: [] }; }
    else if (sub && atual) campos[atual].lista.push(sub[1].trim());
  }
  return { id, campos };
});

const v = (b, k) => (b.campos[k]?.valor ?? '').replace(/^—$/, '');
const num = (b, k) => (v(b, k) === '' ? undefined : Number(v(b, k)));

function falas(lista) {
  return lista.map((l) => /^\*\*(\w+):\*\*\s*(.*)$/.exec(l)).filter(Boolean).map((m) => ({ quem: m[1], texto: semAspas(m[2]) }));
}

// "TÍTULO 1) a 2) b 3) c" ou "Frase. 1) a 2) b"
function comItens(texto) {
  const m = /^(.*?)\s*1\)\s+(.*)$/s.exec(texto);
  if (!m) return { legenda: texto };
  const itens = ('1) ' + m[2]).split(/(?:^|\s)\d\)\s+/).filter(Boolean).map((t) => t.trim());
  const pre = m[1].trim();
  if (!pre) return { itens };
  return new RegExp(`^[${MAIUSC}0-9 →/—-]+$`).test(pre) ? { titulo: frase(pre), itens } : { legenda: pre, itens };
}

// "CABEÇALHO — texto. OUTRO CABEÇALHO — texto." → seções
function secoes(texto) {
  const re = new RegExp(`(?:^|\\s)([${MAIUSC}][${MAIUSC}0-9 /]{3,}?) — `, 'g');
  const marcas = [...texto.matchAll(re)];
  if (!marcas.length) return [{ texto }];
  return marcas.map((m, i) => ({
    titulo: m[1].trim(),
    texto: texto.slice(m.index + m[0].length, i + 1 < marcas.length ? marcas[i + 1].index : undefined).trim(),
  }));
}

const cenas = [];
const dicas = {};
for (const b of blocos) {
  const tipo = v(b, 'tipo');
  const legenda = limpar(v(b, 'legenda'));
  if (/^dica-/.test(b.id)) { dicas[v(b, 'destino')] = semAspas(legenda.replace(/^Preceptor:\s*/, '')); continue; }
  const c = { id: b.id, bloco: num(b, 'bloco'), tipo };
  const t = num(b, 'tempo_alvo_s');

  const fala = b.campos.fala;
  if (tipo === 'fala') {
    c.legendas = falas(fala?.lista ?? []);
    c.personagens = cfg.personagens;
    if (cfg.ilustracao[b.id]) c.ilustracao = cfg.ilustracao[b.id];
  } else if (fala) {
    const linhas = falas(fala.lista);
    c.fala = linhas.length ? linhas.map((l) => `${cfg.personagens[l.quem] ?? l.quem}: ${l.texto}`).join('\n') : semAspas(fala.valor.replace(/^—$/, ''));
  }

  if (b.id === 'abertura-capa') {
    Object.assign(c, { layout: 'capa', titulo: cfg.meta.titulo });
    if (cfg.capa?.subtitulo) c.legenda = cfg.capa.subtitulo;
  } else if (tipo === 'menu') {
    c.legenda = legenda;
    c.opcoes = b.campos.opcoes.lista.map((l) => {
      const tecla = Number(/^\[(\d)\]/.exec(l)[1]);
      const kv = Object.fromEntries(l.replace(/^\[\d\]\s*/, '').split(' | ').map((p) => {
        const i = p.indexOf(':');
        return [semAcento(p.slice(0, i)), limpar(p.slice(i + 1))];
      }));
      return { tecla, rotulo: kv.rotulo, destino: kv.destino, custo: Number(kv.custo), correta: semAcento(kv.correta) === 'sim', justificativa: kv.justificativa };
    });
  } else if (tipo === 'consequencia') {
    Object.assign(c, { legenda, custo: num(b, 'custo'), justificativa: limpar(v(b, 'justificativa')) });
  } else if (tipo === 'revelacao') {
    const m = new RegExp(`^([${MAIUSC} ]+)\\.\\s+(.*)$`, 's').exec(legenda);
    if (m) Object.assign(c, { titulo: frase(m[1]), secoes: [{ texto: m[2] }] });
    else c.legenda = legenda;
  } else if (tipo === 'resultado') {
    c.secoes = secoes(legenda);
  } else if (tipo === 'fechamento') {
    if (/placar/.test(b.id)) { /* placar desenhado pelo motor */ }
    else if (/referencias/.test(b.id)) {
      c.layout = 'referencias';
      c.titulo = 'Referências';
      c.itens = legenda.replace(/^REFER[ÊE]NCIAS\s*—\s*/, '').replace(/\s*Créditos das imagens:.*$/s, '').split(/\s+·\s+/).map((x) => x.trim()).filter(Boolean);
    } else Object.assign(c, { layout: 'mensagens' }, comItens(legenda));
  } else {
    Object.assign(c, comItens(legenda));
  }

  if (cfg.imagens[b.id]) c.imagens = cfg.imagens[b.id].map((im) => Object.fromEntries(Object.entries(im).filter(([, x]) => x != null)));
  const notas = limpar(v(b, 'notas'));
  if (notas) c.notas = notas;
  if (t) c.tempo_alvo_s = t;
  cenas.push(c);
}
for (const c of cenas) if (c.tipo === 'menu' && dicas[c.id]) c.dica = dicas[c.id];

// ---------- relatório ----------
const ideal = cenas.filter((c) => !['consequencia'].includes(c.tipo));
const totalS = ideal.reduce((s, c) => s + (c.tempo_alvo_s || 0), 0);
const saida = { meta: { ...cfg.meta, gerado_de: 'conteudo/roteiro.md', status_roteiro: status }, cenas };
fs.writeFileSync(path.join(RAIZ, 'conteudo/cenas.json'), JSON.stringify(saida, null, 2) + '\n');
const semDica = cenas.filter((c) => c.tipo === 'menu' && !c.dica).map((c) => c.id);
console.log(`cenas.json gerado: ${cenas.length} cenas (${Object.keys(dicas).length} dicas embutidas nos menus) · caminho ideal ${Math.floor(totalS / 60)}:${String(totalS % 60).padStart(2, '0')} · ${status}`);
if (semDica.length) console.log('Aviso: menus sem dica do preceptor: ' + semDica.join(', '));
