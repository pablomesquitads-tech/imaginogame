// Painel do apresentador. Roda na janela pop-up (window.opener) ou no iframe sobreposto
// (window.parent). Não guarda estado de jogo: só exibe a "visão" enviada pela plateia.
(() => {
  'use strict';
  const plateia = window.opener && !window.opener.closed ? window.opener : (window.parent !== window ? window.parent : null);
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const mmss = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  let v = null;
  let ultimo = 0;
  let ultimoJson = "";

  function enviar(msg) { try { plateia?.postMessage(msg, '*'); } catch (_) { /* plateia fechada */ } }

  function relogios() {
    const con = $('conexao');
    const vivo = plateia && !plateia.closed && Date.now() - ultimo < 3500;
    con.textContent = vivo ? 'conectado' : 'sem sinal da plateia';
    con.className = 'conexao ' + (vivo ? 'ok' : 'falha');
    if (!v) return;
    const total = v.inicio ? (Date.now() - v.inicio) / 1000 : 0;
    const cena = (Date.now() - v.inicioCena) / 1000;
    $('t-total').textContent = mmss(total);
    $('t-total').className = total > v.teto_s ? 'estourou' : total > v.alvo_total_s ? 'passou' : '';
    $('t-total-alvo').textContent = `alvo ${mmss(v.alvo_total_s)} · teto ${mmss(v.teto_s)}`;
    $('t-cena').textContent = mmss(cena);
    $('t-cena').className = v.cena.tempo_alvo_s && cena > v.cena.tempo_alvo_s ? 'passou' : '';
    $('t-cena-alvo').textContent = v.cena.tempo_alvo_s ? `alvo ${mmss(v.cena.tempo_alvo_s)}` : '';
  }

  function render() {
    $('custo').textContent = v.custo;
    $('custo-ideal').textContent = `ideal ${v.custo_ideal}`;
    $('desvios').textContent = v.desvios == null ? '—' : `${v.desvios}${v.desvios >= 2 ? ' · dica visível' : ''}`;
    $('cena-id').textContent = `${v.cena.id ?? '—'} · ${v.cena.tipo ?? ''}${v.anotacao ? ' · anotação ligada' : ''}`;

    $('opcoes').innerHTML = v.opcoes ? `<ol class="ops">${v.opcoes.map((o) => `
      <li class="${o.correta ? 'correta' : ''}${o.tentada ? ' tentada' : ''}">
        <span class="k">${o.tecla}</span>
        <span><b>${esc(o.rotulo)}</b>${o.correta ? ' <em>✓ avança</em>' : ` <em>+${o.custo}</em>`}
        ${o.justificativa ? `<small>${esc(o.justificativa)}</small>` : ''}</span>
      </li>`).join('')}</ol>` : '';

    if (v.legendas) {
      $('fala').innerHTML = v.legendas.map((l, i) => `<p class="${i === v.passo ? 'atual' : i < v.passo ? 'lida' : ''}"><span class="quem">${esc(l.quem)}</span>${esc(l.texto)}</p>`).join('');
      $('fala').querySelector('.atual')?.scrollIntoView({ block: 'nearest' });
    } else $('fala').innerHTML = v.cena.fala ? `<p class="atual">${esc(v.cena.fala)}</p>` : '<p class="vazio">—</p>';

    $('notas').textContent = v.cena.notas || '—';
    $('proxima').innerHTML = v.proxima.map((p) => `<div class="prox">${p.tecla ? `<span class="k">${p.tecla}</span>` : ''}${p.id ? `<span class="mono">${esc(p.id)}</span> ` : ''}${esc(p.texto)}</div>`).join('');
    relogios();
  }

  function aviso(t) {
    const d = $('dica-local');
    d.textContent = t;
    d.classList.add('visivel');
    clearTimeout(aviso.t);
    aviso.t = setTimeout(() => d.classList.remove('visivel'), 2200);
  }

  // Atribuição por propriedade: se o documento for reescrito, o handler é substituído, não duplicado.
  window.onmessage = (e) => {
    if (e.source !== plateia) return;
    const m = e.data || {};
    ultimo = Date.now();
    if (m.tipo === 'estado') {
      const s = JSON.stringify(m.visao);
      if (s !== ultimoJson) { ultimoJson = s; v = m.visao; render(); }
    }
    else if (m.tipo === 'aviso') aviso(m.texto);
  };

  window.onkeydown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === 'f') { e.preventDefault(); return aviso('F só funciona na janela da plateia (o navegador exige o gesto lá).'); }
    if (k === 'p') { e.preventDefault(); return; }
    if (['ArrowRight', ' ', 'PageDown', 'Enter', '1', '2', '3', '4', 'z', 'a', 'r'].includes(k) || /^(Digit|Numpad)[1-4]$/.test(e.code)) {
      e.preventDefault();
      enviar({ tipo: 'tecla', key: e.key, code: e.code, shift: e.shiftKey });
    }
  };

  // Batimento: a plateia responde a "pronto" com o estado; serve de sinal de conexão.
  clearInterval(window.__painelBatimento);
  window.__painelBatimento = setInterval(() => { enviar({ tipo: 'pronto' }); relogios(); }, 1000);
  enviar({ tipo: 'pronto' });
})();
