// Percorre o jogo pelas teclas, a partir dos dados embutidos na página.
// modo "ideal": só condutas corretas. modo "revisao": em cada menu, 1 erro antes de acertar
// (fotografa a consequência e o menu com "já tentada"). Chama foto(nome) em cada estado visível.
export async function percorrer(pag, { modo = 'ideal', foto, anotacao = true } = {}) {
  const cenas = await pag.evaluate(() => window.__jogo.cenas());
  const CENA = Object.fromEntries(cenas.map((c) => [c.id, c]));
  const est = () => pag.evaluate(() => window.__jogo.estado());
  const errados = new Set();
  let n = 0;
  const nome = (s, extra = '') => `${String(++n).padStart(2, '0')}-${s.cenaId}${s.passo ? '-' + (s.passo + 1) : ''}${extra}`;
  for (let guarda = 0; guarda < 200; guarda++) {
    const s = await est();
    const c = CENA[s.cenaId];
    await foto(nome(s));
    if (anotacao && c.imagens?.some((i) => i.anotacao)) {
      await pag.keyboard.press('a');
      await foto(nome(s, '-anotado'));
      await pag.keyboard.press('a');
    }
    if (c.tipo === 'menu') {
      const errada = c.opcoes.find((o) => !o.correta);
      if (modo === 'revisao' && !errados.has(c.id) && errada) { errados.add(c.id); await pag.keyboard.press(String(errada.tecla)); }
      else await pag.keyboard.press(String(c.opcoes.find((o) => o.correta).tecla));
    } else if (c.tipo === 'fechamento' && !c.proxima) return n;
    else await pag.keyboard.press('ArrowRight');
  }
  throw new Error('percurso não terminou (laço?)');
}
