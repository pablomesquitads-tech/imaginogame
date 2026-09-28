// Checagem de sigilo (CLAUDE.md, seção 2).
// Regra de casamento: sem acento, sem caixa, pontuação vira espaço; o termo casa quando
// uma palavra do texto COMEÇA com ele ("parasit" pega "parasitário"). Falha fechada:
// falsos positivos (ex.: "verme" em "vermelho") se resolvem em termos-permitidos.txt.

export function normalizar(s) {
  return String(s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function lerLista(texto) {
  return texto.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
}

export function criarVerificador(termos, permitidos = []) {
  const ts = [...new Set(termos.map(normalizar).filter(Boolean))];
  const ok = new Set(permitidos.map(normalizar).filter(Boolean));
  return function verificar(texto) {
    const palavras = normalizar(texto).split(' ').filter((p) => p && !ok.has(p));
    const alvo = ' ' + palavras.join(' ');
    return ts.filter((t) => alvo.includes(' ' + t));
  };
}

// Percorre todas as strings de um valor (objeto/array), com o caminho do campo.
export function* strings(valor, caminho = '') {
  if (typeof valor === 'string') yield [caminho, valor];
  else if (Array.isArray(valor)) for (let i = 0; i < valor.length; i++) yield* strings(valor[i], `${caminho}[${i}]`);
  else if (valor && typeof valor === 'object') for (const [k, v] of Object.entries(valor)) yield* strings(v, caminho ? `${caminho}.${k}` : k);
}

// Cenas anteriores à primeira "revelacao" na ordem do arquivo. Sem revelação: todas.
export function cenasSigilosas(cenas) {
  const i = cenas.findIndex((c) => c.tipo === 'revelacao');
  return i === -1 ? cenas : cenas.slice(0, i);
}

export function checarCenas(cenas, verificar) {
  const achados = [];
  for (const cena of cenasSigilosas(cenas)) {
    for (const [campo, texto] of strings(cena)) {
      for (const termo of verificar(texto)) achados.push({ cena: cena.id, campo, termo, trecho: texto.slice(0, 90) });
    }
  }
  return achados;
}
