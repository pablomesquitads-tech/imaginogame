// Motor do jogo — janela da plateia. Estado vive só aqui (CLAUDE.md, seção 3).
(() => {
  'use strict';
  const DADOS = JSON.parse(document.getElementById('dados').textContent);
  const { meta, cenas, midia } = DADOS;
  const CENA = Object.fromEntries(cenas.map((c) => [c.id, c]));
  const palco = document.getElementById('palco');
  const aviso = document.getElementById('aviso');

  // ---------- estado ----------
  const inicial = () => ({
    cenaId: cenas[0]?.id ?? null,
    passo: 0,            // trecho atual da legenda (cenas de fala)
    custo: 0,
    desvios: {},         // menuId -> nº de condutas erradas
    tentadas: {},        // menuId -> teclas erradas já escolhidas
    menuOrigem: null,    // menu para onde a consequência volta
    anotacao: false,
    escolhas: [],        // [{menu, tecla, correta, custo}]
    inicio: null,        // relógio total começa na primeira ação
    inicioCena: Date.now(),
  });
  let estado = inicial();
  const historico = [];

  const copia = (o) => JSON.parse(JSON.stringify(o));
  function registrar() { historico.push(copia(estado)); }
  function iniciarRelogio() { if (estado.inicio == null) estado.inicio = Date.now(); }

  function irPara(id) {
    estado.cenaId = id;
    estado.passo = 0;
    estado.anotacao = false;
    estado.inicioCena = Date.now();
  }

  // ---------- ações ----------
  function avancar() {
    const c = CENA[estado.cenaId];
    if (!c) return;
    if (c.tipo === 'menu' || c.tipo === 'fechamento') return;
    registrar(); iniciarRelogio();
    if (c.tipo === 'fala' && estado.passo < c.legendas.length - 1) { estado.passo++; return render(); }
    if (c.tipo === 'consequencia') irPara(c.destino ?? estado.menuOrigem);
    else if (c.proxima) irPara(c.proxima);
    render();
  }

  function escolher(tecla) {
    const c = CENA[estado.cenaId];
    if (!c || c.tipo !== 'menu') return;
    const op = c.opcoes.find((o) => o.tecla === tecla);
    if (!op) return;
    registrar(); iniciarRelogio();
    estado.custo += op.custo || 0;
    estado.escolhas.push({ menu: c.id, tecla, correta: !!op.correta, custo: op.custo || 0 });
    if (!op.correta) {
      estado.desvios[c.id] = (estado.desvios[c.id] || 0) + 1;
      estado.tentadas[c.id] = [...new Set([...(estado.tentadas[c.id] || []), tecla])];
      estado.menuOrigem = c.id;
    }
    irPara(op.destino);
    render();
    if (op.custo) pulsarCusto();
  }

  function desfazer() {
    if (!historico.length) return mostrarAviso('Nada para desfazer');
    const inicio = estado.inicio;
    estado = historico.pop();
    estado.inicio = inicio ?? estado.inicio; // o relógio total não volta
    estado.inicioCena = Date.now();
    render();
    mostrarAviso('Desfeito');
  }

  function alternarAnotacao() {
    const c = CENA[estado.cenaId];
    if (!c?.imagens?.some((i) => i.anotacao)) return;
    registrar();
    estado.anotacao = !estado.anotacao;
    const q = palco.querySelector('.quadro');
    q?.classList.toggle('anotado', estado.anotacao);
    const e = palco.querySelector('.estado-anot');
    if (e) { e.classList.toggle('ligada', estado.anotacao); e.lastChild.textContent = estado.anotacao ? 'Anotação ligada' : 'Anotação desligada (A)'; }
    enviarEstado();
  }

  let rPendente = 0;
  function reiniciar() {
    if (Date.now() - rPendente > 3000) { rPendente = Date.now(); return mostrarAviso('Pressione R de novo para reiniciar'); }
    rPendente = 0;
    estado = inicial();
    historico.length = 0;
    render();
    mostrarAviso('Jogo reiniciado');
  }

  function telaCheia() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => mostrarAviso('Tela cheia bloqueada pelo navegador'));
  }

  // ---------- teclado (plateia e painel usam o mesmo mapa) ----------
  function tratarTecla(key, code, shift) {
    const k = key.length === 1 ? key.toLowerCase() : key;
    if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter') return avancar(), true;
    const n = /^Digit([1-4])$|^Numpad([1-4])$/.exec(code || '');
    if (n) return escolher(Number(n[1] || n[2])), true;
    if (['1', '2', '3', '4'].includes(k)) return escolher(Number(k)), true;
    if (k === 'z') return desfazer(), true;
    if (k === 'a') return alternarAnotacao(), true;
    if (k === 'r') return reiniciar(), true;
    if (k === 'f') return telaCheia(), true;
    if (k === 'p') return abrirPainel(shift), true;
    return false;
  }
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if (tratarTecla(e.key, e.code, e.shiftKey)) e.preventDefault();
  });

  // ---------- escala do palco (letterbox) ----------
  function escalar() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    palco.style.transform = `scale(${s}) translate(-50%, -50%)`;
  }
  addEventListener('resize', escalar);
  escalar();

  // ---------- render ----------
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function hud(c) {
    const piloto = meta.piloto ? '<span class="pilula piloto">PILOTO</span>' : '';
    if (c.layout === 'capa') return `<div class="hud">${piloto}</div>`;
    return `<div class="hud">${piloto}<span class="pilula" id="hud-custo">Custo <b>${estado.custo}</b></span></div>`;
  }

  function imagemHtml(c) {
    const im = c.imagens[0];
    const limpo = midia[im.manifesto_id];
    const anot = im.anotacao ? midia[im.anotacao] : null;
    return `<div class="imagem">
      <div class="quadro${estado.anotacao ? ' anotado' : ''}">
        <img src="${esc(limpo.src)}" alt="">
        ${anot ? `<img class="anot" src="${esc(anot.src)}" alt="">` : ''}
      </div>
      <div class="credito">${esc(limpo.credito)}</div>
    </div>`;
  }

  const LAYOUTS = {
    expositiva(c) {
      if (c.layout === 'capa') return `<div class="cena capa"><div class="linha"></div><h1>${esc(c.titulo || meta.titulo)}</h1>${c.legenda ? `<div class="sub">${esc(c.legenda)}</div>` : ''}</div>`;
      return `<div class="cena expositiva">
        ${c.titulo ? `<h2>${esc(c.titulo)}</h2>` : ''}
        ${c.legenda ? `<p>${esc(c.legenda)}</p>` : ''}
        ${c.itens ? `<ol class="itens">${c.itens.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>` : ''}
      </div>`;
    },
    fala(c) {
      const trecho = c.legendas[estado.passo];
      const ilu = c.ilustracao ? midia[c.ilustracao] : null;
      const nomes = c.personagens || {};
      return `<div class="cena fala">
        <div class="ilustracao">${ilu ? (ilu.svg || `<img src="${esc(ilu.src)}" alt="">`) : ''}</div>
        <div class="legenda">
          <div class="quem">${esc(nomes[trecho.quem] || trecho.quem || '')}</div>
          <div class="texto entra">${esc(trecho.texto)}</div>
          <div class="passos">${c.legendas.map((_, i) => `<i class="${i < estado.passo ? 'feito' : i === estado.passo ? 'atual' : ''}"></i>`).join('')}</div>
        </div>
      </div>`;
    },
    menu(c) {
      const tentadas = estado.tentadas[c.id] || [];
      const dica = (estado.desvios[c.id] || 0) >= 2 && c.dica;
      return `<div class="cena menu">
        <div class="rotulo">Decisão da turma</div>
        <div class="pergunta">${esc(c.legenda)}</div>
        <div class="opcoes">${c.opcoes.map((o) => {
          const t = tentadas.includes(o.tecla);
          return `<div class="opcao${t ? ' tentada' : ''}" data-tecla="${o.tecla}"><span class="tecla">${o.tecla}</span><span class="rot">${esc(o.rotulo)}${t ? `<span class="marca">já tentada · +${o.custo}</span>` : ''}</span></div>`;
        }).join('')}</div>
        ${dica ? `<div class="dica"><span class="quem">Preceptor</span><span class="texto">${esc(c.dica)}</span></div>` : ''}
      </div>`;
    },
    resultado(c) {
      if (!c.imagens?.length) return LAYOUTS.expositiva(c);
      const temAnot = c.imagens.some((i) => i.anotacao);
      return `<div class="cena resultado">
        ${imagemHtml(c)}
        <div class="texto">
          ${c.titulo ? `<div class="rotulo">${esc(c.rotulo || 'Resultado')}</div><h2>${esc(c.titulo)}</h2>` : ''}
          <div class="laudo">${esc(c.legenda)}</div>
          ${temAnot ? `<div class="estado-anot${estado.anotacao ? ' ligada' : ''}"><i></i><span>${estado.anotacao ? 'Anotação ligada' : 'Anotação desligada (A)'}</span></div>` : ''}
        </div>
      </div>`;
    },
    revelacao(c) { return LAYOUTS.resultado(c); },
    consequencia(c) {
      const ult = estado.escolhas[estado.escolhas.length - 1];
      const custo = c.custo ?? ult?.custo ?? 0;
      return `<div class="cena consequencia"><div class="cartao">
        <div class="custo">+${custo}<small>pontos de custo</small></div>
        <div class="texto">${esc(c.legenda)}</div>
        ${c.justificativa ? `<div class="just">${esc(c.justificativa)}</div>` : ''}
      </div><div class="volta">→ voltar à decisão</div></div>`;
    },
    fechamento(c) {
      const refs = Object.values(midia).filter((m) => m.tipo !== 'ilustracao').map((m) => m.referencia);
      return `<div class="cena fechamento">
        <div class="rotulo">Placar</div>
        <div class="placar">
          <div><div class="num">${estado.custo}</div><div class="leg">custo da turma</div></div>
          <div class="vs">×</div>
          <div><div class="num ideal">${meta.custo_ideal}</div><div class="leg">caminho ideal</div></div>
        </div>
        ${(c.itens || []).map((t) => `<div class="msg">${esc(t)}</div>`).join('')}
        ${refs.length ? `<div class="referencias">${[...new Set(refs)].map(esc).join('<br>')}</div>` : ''}
      </div>`;
    },
  };

  function render() {
    const c = CENA[estado.cenaId];
    if (!c) {
      palco.innerHTML = `<div class="cena capa"><div class="linha"></div><h1>${esc(meta.titulo)}</h1><div class="sub">Nenhuma cena no build.</div></div>`;
      return enviarEstado();
    }
    palco.innerHTML = (LAYOUTS[c.tipo] || LAYOUTS.expositiva)(c) + hud(c);
    if (c.tipo === 'fala') marcarFalante(c);
    enviarEstado();
  }

  function marcarFalante(c) {
    const quem = c.legendas[estado.passo].quem;
    const falantes = new Set(c.legendas.map((l) => l.quem));
    palco.querySelectorAll('.personagem').forEach((g) => {
      const q = g.dataset.quem;
      g.classList.toggle('falando', q === quem);
      g.classList.toggle('calado', falantes.has(quem) && q !== quem && ['P', 'A'].includes(quem));
    });
  }

  function pulsarCusto() {
    const p = document.getElementById('hud-custo');
    if (p) { p.classList.remove('pulso'); void p.offsetWidth; p.classList.add('pulso'); }
  }

  let tAviso;
  function mostrarAviso(t) {
    aviso.textContent = t;
    aviso.classList.add('visivel');
    clearTimeout(tAviso);
    tAviso = setTimeout(() => aviso.classList.remove('visivel'), 1800);
    enviar({ tipo: 'aviso', texto: t });
  }

  // ---------- painel do apresentador ----------
  // Janela about:blank escrita por document.write (herda a origem, funciona em file://).
  // Comunicação só por postMessage com checagem de event.source (sem BroadcastChannel).
  let painel = null;     // Window do painel (popup ou iframe sobreposto)
  let sobreposto = null; // <iframe> no modo de uma tela só

  // P: automático (duas telas → janela separada; uma tela → painel sobreposto).
  // Shift+P: sempre janela separada (útil para ensaiar o pop-up com uma tela só).
  function abrirPainel(forcarJanela) {
    if (!forcarJanela && window.screen.isExtended === false) return alternarSobreposto();
    const w = window.open('', 'apresentador-caso-clinico', 'popup=yes,width=1280,height=800');
    if (!w) { mostrarAviso('Pop-up bloqueado: usando painel sobreposto'); return alternarSobreposto(); }
    if (sobreposto) alternarSobreposto();
    // Painel já aberto (P de novo, ou plateia recarregada): só reconecta.
    let aberto;
    try { aberto = !!w.document.getElementById('painel'); } catch (_) { aberto = true; }
    if (!aberto) {
      w.document.open();
      w.document.write(window.PAINEL_HTML);
      w.document.close();
    }
    painel = w;
    enviarEstado();
    w.focus();
  }

  function alternarSobreposto() {
    if (sobreposto) { sobreposto.remove(); sobreposto = null; painel = null; return; }
    sobreposto = document.createElement('iframe');
    sobreposto.id = 'sobreposto';
    sobreposto.srcdoc = window.PAINEL_HTML;
    document.body.appendChild(sobreposto);
    painel = sobreposto.contentWindow;
  }

  function enviar(msg) {
    if (painel && !painel.closed) { try { painel.postMessage(msg, '*'); } catch (_) { /* painel fechado */ } }
  }

  // Descrição da próxima cena para o painel. A Revelação nunca é antecipada no painel:
  // no modo de uma tela só o painel aparece no projetor.
  function previa(id) {
    const c = CENA[id];
    if (!c) return { texto: '—' };
    if (c.tipo === 'revelacao') return { id, tipo: c.tipo, texto: 'Revelação — conteúdo oculto no painel' };
    return { id, tipo: c.tipo, texto: c.titulo || c.legenda || c.legendas?.[0]?.texto || '' };
  }

  function visao() {
    const c = CENA[estado.cenaId] || {};
    let proxima;
    if (c.tipo === 'menu') proxima = c.opcoes.map((o) => ({ tecla: o.tecla, ...previa(o.destino) }));
    else if (c.tipo === 'fala' && estado.passo < c.legendas.length - 1) proxima = [{ texto: `Próximo trecho (${estado.passo + 2}/${c.legendas.length}): ${c.legendas[estado.passo + 1].texto}` }];
    else if (c.tipo === 'consequencia') proxima = [previa(c.destino ?? estado.menuOrigem)];
    else proxima = [previa(c.proxima)];
    return {
      cena: { id: c.id, tipo: c.tipo, tempo_alvo_s: c.tempo_alvo_s, notas: c.notas || '', fala: c.fala || '' },
      legendas: c.tipo === 'fala' ? c.legendas.map((l) => ({ quem: (c.personagens || {})[l.quem] || l.quem, texto: l.texto })) : null,
      passo: estado.passo,
      opcoes: c.tipo === 'menu' ? c.opcoes.map((o) => ({ tecla: o.tecla, rotulo: o.rotulo, correta: !!o.correta, custo: o.custo, justificativa: o.justificativa || '', tentada: (estado.tentadas[c.id] || []).includes(o.tecla) })) : null,
      desvios: c.tipo === 'menu' ? (estado.desvios[c.id] || 0) : (c.tipo === 'consequencia' ? (estado.desvios[estado.menuOrigem] || 0) : null),
      custo: estado.custo,
      custo_ideal: meta.custo_ideal,
      inicio: estado.inicio,
      inicioCena: estado.inicioCena,
      alvo_total_s: meta.alvo_total_s,
      teto_s: meta.teto_s,
      anotacao: estado.anotacao,
      proxima,
      historico: historico.length,
    };
  }

  function enviarEstado() { enviar({ tipo: 'estado', visao: visao() }); }

  window.addEventListener('message', (e) => {
    if (!painel || e.source !== painel) return;
    const m = e.data || {};
    if (m.tipo === 'pronto') enviarEstado();
    else if (m.tipo === 'tecla') tratarTecla(m.key, m.code, m.shift);
  });

  // Interface mínima para testes automatizados (não altera o comportamento).
  window.__jogo = { estado: () => copia(estado), historico: () => historico.length };

  render();
})();
