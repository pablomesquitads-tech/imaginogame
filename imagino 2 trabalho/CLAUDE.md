# Seminário de Imaginologia — Jogo de atendimento (HTML)

Apresentação interativa em **HTML offline**, no formato de jogo de atendimento ramificado.
A turma decide as condutas por maioria de braços levantados; o apresentador registra a escolha.
O Claude Code é a fábrica: motor, conteúdo, processamento de imagens, build e revisão visual.

---

## 0. Restrições do evento

| Restrição | Valor | Consequência no projeto |
|---|---|---|
| Duração nominal | 8 min | Caminho ideal decidido em ~10 min (seção 10): excede o nominal em ~2 min |
| Duração máxima com interação | 20 min | Desvios limitados (ver seção 5) + timer no painel do apresentador |
| Grupos por dia | ~4 | Setup em menos de 1 min: notebook já com a apresentação aberta, só conectar o HDMI |
| Máquina | Notebook próprio via HDMI | Tela dupla: projetor = plateia; tela do notebook = painel do apresentador |
| Diagnóstico | **Não pode aparecer antes da Revelação** | Ver seção 2 (sigilo) |
| Fontes de imagem | Radiopaedia, Radiology Education, Teaching Files Radiology | **O Claude Code busca e baixa** imagens, sequências e vídeos (seção 1A); licença verificada imagem a imagem |

---

## 1. Regras invioláveis de imagem

1. **Conteúdo médico só de fonte real.** TC, RM, anatomia, achados: nunca gerados por IA.
2. **Paciente ilustrado é permitido** como personagem, marcado como "ilustração" no manifesto, **sem nenhum sinal clínico desenhado**.
3. **Toda imagem está no `manifesto.csv`** antes de entrar em qualquer cena. Sem linha no manifesto, não entra.
4. **Crédito automático** gerado pelo build a partir do manifesto. Nunca escrever crédito à mão.
5. **Formato Radiopaedia:** `Case courtesy of [autor], Radiopaedia.org, rID: [número]`.
6. **Licença verificada por imagem** (coluna `licenca_verificada`). Imagem sem licença clara: não usar.
7. Radiopaedia é CC BY-NC-SA: imagem anotada herda a licença; proibido uso comercial.
8. **Aquisição pelo Claude Code**, exclusivamente das fontes autorizadas e conforme a seção 1A.

---

## 1A. Aquisição de imagens, sequências e vídeos (Claude Code)

### Fontes autorizadas

| Fonte | Endereço |
|---|---|
| Radiopaedia | radiopaedia.org |
| Radiology Education | confirmar o site exato com o usuário antes do primeiro acesso |
| Teaching Files Radiology | confirmar o site exato com o usuário antes do primeiro acesso |

Nenhuma outra fonte (busca de imagens genérica, bancos de imagem, sites não listados) sem autorização explícita do usuário.

### Procedimento

1. **Termos antes de baixar.** Antes do primeiro download de cada site, ler os termos de uso, a página de licença e o `robots.txt`. Registrar a conclusão em `assets/fontes-licencas.md`. Se o site proibir download automatizado, **não baixar**: gerar `assets/downloads-manuais.md` com as URLs exatas para o usuário baixar à mão.
2. **Guiado por requisitos.** Buscar apenas o que está em `conteudo/requisitos-imagem.md` (modalidade, sequência/janela, achado que deve estar visível). Sem varredura ampla; intervalo entre requisições; volume mínimo.
3. **Candidatos com aprovação.** Para cada requisito, baixar 2–3 casos candidatos em `assets/candidatos/<requisito>/` e montar `assets/candidatos/revisao.md` com miniatura, fonte, autor, rID/referência, licença e o que a imagem mostra **segundo a descrição do próprio caso na fonte**. Nada segue para processamento sem o usuário marcar o candidato escolhido.
4. **Achado nunca inferido pelo Claude.** O que a imagem mostra vem da legenda ou descrição do caso na fonte, não da interpretação visual do Claude.
5. **Sequências de cortes (pilhas).** Baixar os frames na ordem da série para `assets/pilhas/<id>/`. Gerar duas saídas: frames WebP para rolagem interativa e vídeo WebM/MP4 (ffmpeg) para loop.
6. **Vídeos da fonte.** Só se a licença permitir; converter para MP4 H.264 ou WebM; sem áudio.
7. **Sigilo no ato do download.** Renomear para ID neutro imediatamente; nome original, título do caso e URL ficam só no manifesto e em `originais/`. Nem `originais/` nem `candidatos/` vão para `dist/`.
8. **Manifesto automático.** Preencher `fonte`, `autor`, `rid_ou_ref`, `url`, `licenca`, `licenca_verificada` e `aprovado_usuario` para cada item.
9. **Texto gravado na imagem** (rótulos, legendas, setas da fonte que entreguem o diagnóstico): recortar ou cobrir no processamento e marcar na coluna `texto_gravado_na_imagem`.

---

## 2. Sigilo do diagnóstico (antes da Revelação)

O diagnóstico não pode vazar por nenhum canal visível no projetor:

| Canal de vazamento | Regra |
|---|---|
| Título da apresentação e capa | Neutros: tema clínico sem diagnóstico (definido pelo usuário) |
| `<title>` do HTML (aba do navegador) | Neutro |
| Nome do arquivo e da pasta | Neutros: `caso-clinico/index.html` |
| Nomes de arquivo de imagem | Renomeados para ID neutro (`img-01.webp`), nunca o nome original baixado |
| URL da Radiopaedia (contém o nome do caso) | **Não exibir** antes da Revelação. Crédito nas cenas usa só autor + rID |
| Texto gravado dentro da imagem | Recortar ou cobrir no processamento |
| Referências completas com URL | Só no fechamento |
| Legenda do paciente e opções dos menus | Sem termos que entreguem o diagnóstico |

O build faz uma checagem automática: busca uma lista de termos proibidos (definida pelo usuário em `conteudo/termos-proibidos.txt`) em todo texto visível das cenas anteriores à Revelação e **falha** se encontrar algum.

---

## 3. Requisitos de runtime

| Requisito | Implementação |
|---|---|
| Offline total | Nenhum CDN em tempo de execução; fontes WOFF2 embutidas |
| Abrir via `file://` | Conteúdo embutido no HTML no build (sem `fetch` de JSON externo) |
| Mídia | Pasta `assets/` com caminhos relativos ao lado do `index.html` |
| Resolução | Palco base 1920×1080, escalonado com letterbox; testar também em 1366×768 |
| Navegadores | Chrome e Firefox atuais |
| Sem dependência de armazenamento | Estado em memória; `localStorage` só opcional, com try/catch |
| Tela dupla | A janela da plateia abre a janela do apresentador com `window.open` e as duas se comunicam por referência direta de janela + `postMessage` (não usar `BroadcastChannel`, que é instável em `file://`). O estado vive só na janela da plateia |
| Janela do apresentador | Timer (total e da cena), custo acumulado, desvios no menu atual, notas, fala a ler, prévia da próxima cena; aceita os mesmos atalhos de teclado |
| Proporção do projetor | Pode ser 16:9, 16:10 ou 4:3: o letterbox do palco 1920×1080 cobre todos |

### Controles do apresentador (teclado)

| Tecla | Ação |
|---|---|
| `→` / espaço / `PgDn` / `Enter` | Avançar (cenas lineares; `PgDn` cobre passadores de slide) |
| `1`–`4` | Registrar a conduta escolhida pela turma |
| `Z` | Desfazer a última ação (histórico completo) |
| `P` | Abrir a janela do apresentador (arrastar para a tela do notebook); com uma tela só, alterna um painel sobreposto |
| `Shift+P` | Forçar a janela separada mesmo com uma tela só (ensaio) |
| `A` | Ligar/desligar camada de anotação da imagem |
| `F` | Tela cheia (só na janela da plateia: o navegador exige o gesto nela) |
| `R` | Reiniciar o jogo (confirmação: `R` de novo em até 3 s) |

---

## 4. Modelo de conteúdo

Todo o conteúdo fica em `conteudo/cenas.json`, separado do motor. Esquema de uma cena:

```json
{
  "id": "menu-exame-1",
  "bloco": 4,
  "tipo": "fala | menu | resultado | consequencia | expositiva | revelacao | fechamento",
  "legenda": "texto exibido na tela",
  "fala": "texto lido pelo grupo (vai para as notas)",
  "imagens": [{ "manifesto_id": "img-03", "anotacao": "img-03-anot" }],
  "video": null,
  "opcoes": [
    { "tecla": 1, "rotulo": "…", "destino": "resultado-tc", "custo": 0, "correta": true },
    { "tecla": 2, "rotulo": "…", "destino": "consequencia-x", "custo": 2, "correta": false }
  ],
  "notas": "orientação ao apresentador",
  "tempo_alvo_s": 90
}
```

Estado do jogo: cena atual, histórico, custo acumulado, número de desvios por menu, tempo decorrido.

---

## 5. Mecânica

- **Menu com desvios, não árvore.** Em cada menu só uma conduta avança. As erradas mostram uma consequência curta (≤ 30 s) e voltam ao mesmo menu.
- **Limite de desvios:** após 2 condutas erradas no mesmo menu, surge uma dica do "preceptor" apontando para a conduta certa. Isso limita o pior caso de tempo.
- **Voto:** o apresentador lê as opções, a turma levanta o braço, o apresentador registra a maioria com `1`–`4`.
- **Pontuação coletiva:** custo acumulado da turma (tempo/recursos) comparado, no fechamento, com o custo do caminho ideal.
- **Paciente:** legenda sincronizada com a fala lida pelo grupo; linguagem leiga e ambígua; o paciente só revela certas informações quando a conduta certa é escolhida.

---

## 6. Estrutura aprovada → cenas e orçamento de tempo

| # | Bloco aprovado | Cenas | Tempo alvo |
|---|---|---|---|
| 1 | Abertura — regras e pontuação | Capa neutra, regras, custo zerado | 0:45 |
| 2 | Pista 1 — história | Fala do paciente (legenda + ilustração) | 1:30 |
| 3 | Pista 2 — exame | Menu 1 (anamnese dirigida / exame físico / exames) → resultado | 1:30 |
| 4 | Pista 3 — TC | Menu 2 (escolha do exame de imagem) → resultado TC com camada de anotação | 1:30 |
| 5 | Pista 4 — RM | Menu 3 → resultado RM + pergunta de diferencial | 1:30 |
| 6 | Revelação | Imagem com o achado decisivo; primeira menção ao diagnóstico | 1:00 |
| 7 | Virada — fases e tratamento | Expositiva | 2:00 |
| 8 | Papel da imagem — critérios diagnósticos | Expositiva, conectando as pistas do caso aos critérios | 1:30 |
| 9 | Fechamento — mensagens e placar | Custo da turma × caminho ideal; referências completas | 1:00 |
| | **Total do caminho ideal** | | **~12:15** |
| | Folga para desvios até o teto de 20 min | | ~7:45 |

Obs.: tabela = orçamento original (~12:15). **Decidido (seção 10):** caminho ideal ~10 min, mantendo os 3 menus e enxugando os blocos 7 e 8. Os tempos por cena são reajustados no `roteiro.md`.

---

## 7. Sistema visual

| Token | Valor | Uso |
|---|---|---|
| `fundo` | `#0B0D10` | Fundo padrão (imagem radiológica em fundo escuro) |
| `superficie` | `#15181D` | Cartões de opção, painel |
| `texto` | `#E8E6E1` | Texto principal |
| `texto-sec` | `#9AA0A8` | Texto secundário |
| `acento` | `#F2A900` | **Exclusivo** para anotações de achado |
| `certo` / `errado` | a definir no piloto | Feedback de conduta, discreto |
| Fonte corpo/títulos | Inter (WOFF2 embutido) | |
| Fonte medidas/créditos | IBM Plex Mono (WOFF2 embutido) | |

Legibilidade no projetor: corpo mínimo 28 px no palco de 1080p; legenda do paciente mínimo 36 px.

---

## 8. Estrutura de pastas

```
seminario/                  (pasta de trabalho — nome livre)
├── CLAUDE.md
├── manifesto.csv
├── conteudo/
│   ├── cenas.json
│   ├── piloto/cenas.json   # conteúdo fictício do piloto (build --piloto)
│   ├── roteiro.md          # rascunho do Claude → aprovado pelo usuário
│   ├── requisitos-imagem.md # o que cada imagem precisa mostrar (guia a busca)
│   ├── termos-proibidos.txt
│   └── termos-permitidos.txt # exceções de palavra inteira (ex.: "vermelho" × "verme")
├── assets/
│   ├── fontes-licencas.md  # termos de uso de cada site, lidos antes de baixar
│   ├── downloads-manuais.md # URLs para o usuário, se um site proibir download automático
│   ├── candidatos/         # 2–3 casos por requisito + revisao.md (fora do dist)
│   ├── originais/          # como baixado (nomes originais ficam só aqui; fora do dist)
│   ├── processadas/        # renomeadas, recortadas, WebP; pares limpo/anotado
│   ├── pilhas/             # frames de cortes sequenciais
│   ├── paciente/           # ilustrações/vídeos do personagem
│   └── fontes/             # WOFF2
├── src/                    # motor: HTML/CSS/JS sem framework
├── build/                  # script de build + checagem de sigilo
├── tests/                  # testes (Playwright) e revisão visual; saída em tests/saida/
└── dist/
    └── caso-clinico/       # ENTREGÁVEL: index.html + assets/ (vai para o pendrive)
```

---

## 9. Fases

| Fase | Quem | O quê | Critério de conclusão |
|---|---|---|---|
| 0. Setup | Claude | Estrutura de pastas, Playwright, ffmpeg, cwebp; ler skills frontend-design | Build vazio roda |
| 1. Piloto | Claude + usuário | Motor com 1 fala + 1 menu + 1 resultado com imagem e anotação + 1 consequência + painel do apresentador; testar no notebook ligado por HDMI a um monitor ou TV em modo **Estender** (Win+P no Windows), com Wi-Fi desligado | Abre offline, janela do apresentador sincroniza, fontes corretas, teclas funcionam, `Z` desfaz. **Se falhar, parar e reavaliar** |
| 2a. Roteiro | Claude rascunha, usuário aprova | `roteiro.md`, `requisitos-imagem.md`, `termos-proibidos.txt` (via prompt de roteiro) | Cabeçalho do `roteiro.md` alterado pelo usuário para `STATUS: APROVADO` |
| 2b. Aquisição de imagens | Claude busca, usuário escolhe | Seção 1A: termos de cada site, candidatos por requisito, `revisao.md` | Todo requisito com candidato aprovado e licença verificada no manifesto |
| 3. Processamento | Claude | Renomear, recortar, remover texto gravado, gerar pares limpo/anotado, WebP | Nenhum nome original em `processadas/` |
| 4. Build | Claude | Gerar `cenas.json` completo e o `dist/` | Checagem de sigilo passa |
| 5. Revisão visual | Claude | Playwright: screenshot de cada cena em 1920×1080 e 1366×768; inspecionar sobreposição, corte de texto, contraste, crédito presente | Lista de checagem sem defeitos |
| 6. Ensaio | Usuário | Caminho ideal cronometrado + um ensaio com desvios | Caminho ideal dentro do alvo decidido |
| 7. Contingência | Claude | PDF do caminho ideal (Playwright); cópia de `dist/` + PDF em pendrive (caso o notebook falhe e seja preciso usar o PC da sala) e no Drive | PDF abre sem o HTML |
| 8. Checklist do dia | Usuário | Carregador ligado; adaptador HDMI (se a porta for USB-C); notificações e suspensão desligadas; modo Estender; apresentação aberta em tela cheia antes da vez do grupo | Tudo marcado antes de entrar |

---

## 10. Decisões

### Tomadas (2026-09-28)

| Decisão | Escolha | Consequência no projeto |
|---|---|---|
| Duração-alvo do caminho ideal | **~10 min**, com os **3 menus** mantidos e os **blocos 7–8 enxutos** (no máximo 3 ideias por cena) | `meta.alvo_total_s = 600` e `teto_s = 1200` no `cenas.json`; o painel do apresentador marca o tempo contra 10:00 e 20:00. Excede em ~2 min os 8 min nominais (seção 0) |
| Paciente | **Ilustração estática com animação CSS**. Vídeo gerado descartado | SVG embutido no HTML no build: respiração, piscar e boca de quem fala; quem não fala fica esmaecido. Regra 1.2 vale: sem sinal clínico desenhado, linha `ilustracao` no manifesto |
| Título e capa | **"Caso clínico"** (provisório) | `meta.titulo` no `cenas.json` alimenta a capa e o `<title>`; trocar só ali. Passa pela checagem de sigilo |

### Pendentes

| Decisão | Proposta |
|---|---|
| Cores `certo` / `errado` (seção 7) | `#5FB38A` / `#D9695F` no piloto; confirmar no projetor real |
| Painel sobreposto (uma tela só) mostra a opção correta e as notas | Aceitável só se ninguém usar uma tela; com o projetor espelhado, o painel vaza a resposta. Alternativa: esconder a marca de correta no modo sobreposto |
| `roteiro.md` (D3) ainda propõe outro título | Alinhar D3 a "Caso clínico" na aprovação do roteiro |

---

## 11. Regras de trabalho do Claude

- Se um código falhar, escrever primeiro o diagnóstico da causa raiz, depois a nova versão.
- Após 2 tentativas sem sucesso no mesmo problema: parar, declarar o impasse e listar as premissas possivelmente erradas.
- Não reintroduzir abordagens já descartadas na sessão.
- Ao corrigir, alterar só o bloco necessário.
- Não instalar skills de terceiros sem mostrar o conteúdo ao usuário antes.
- Toda revisão visual é feita olhando o screenshot renderizado, não o código.
- Conteúdo clínico só entra no build a partir de `roteiro.md` com `STATUS: APROVADO`. Rascunhos do Claude trazem referência para cada afirmação clínica e marcam `[VERIFICAR]` onde houver incerteza.
- Não baixar nada de fonte fora da seção 1A.
