# Status do projeto

Atualizado em 2026-09-28.

```
Fase 0 ✔ ─ Fase 1 ◐ ─ 2a ◐ ─ 2b ✖ ─ 3 ◐ ─ 4 ◐ ─ 5 ◐ ─ 6 ☐ ─ 7 ◐ ─ 8 ☐
✔ pronto   ◐ ferramenta pronta, falta insumo seu   ✖ bloqueado   ☐ é com você
```

| Fase | Pronto (Claude) | Falta | Quem destrava |
|---|---|---|---|
| 0. Setup | Pastas, fontes, build, ffmpeg/cwebp/Playwright | — | — |
| 1. Piloto | Motor + painel; 46 verificações automáticas em Chromium (+ 16 de sigilo) | Teste no notebook com HDMI e no Firefox (`COMO-TESTAR-PILOTO.md`) | **Você** |
| 2a. Roteiro | `roteiro.md` rascunhado; conversor `roteiro.md → cenas.json`; rascunho completo navegável (26 cenas, 9:50, sigilo ok) | Revisar os `[VERIFICAR]` e mudar a 1ª linha para `STATUS: APROVADO` | **Você** |
| 2b. Imagens | Pré-triagem de 6 casos (`assets/candidatos/revisao.md`) | Rede bloqueia radiopaedia.org; endereços de Radiology Education e Teaching Files | **Você** (liberar a rede; confirmar sites; escolher candidatos) |
| 3. Processamento | `build/processar.mjs` (recorte, cobrir texto, par anotado, pilha → WebP + MP4/WebM) e `ferramentas/anotador.html` | Imagens aprovadas + marcas de anotação (onde está o achado: você aponta) | Depende de 2b |
| 4. Build | Build final com portões (roteiro aprovado, licença, aprovação, sigilo) | Insumos de 2a, 2b e 3 | Automático depois deles |
| 5. Revisão visual | `tests/revisao-visual.mjs` (1920×1080, 1366×768, painel) | Rodar no build final | Claude, depois da 4 |
| 6. Ensaio | Painel com cronômetro vs 10:00 e 20:00 | Ensaio cronometrado | **Você** |
| 7. Contingência | `tests/pdf-contingencia.mjs` (PDF do caminho ideal) | Gerar no build final; copiar para pendrive e Drive | Claude gera; você copia |
| 8. Dia | `CHECKLIST-DIA.md` | — | **Você** |

## Comandos

| Comando | O que faz |
|---|---|
| `npm run roteiro` | `roteiro.md` → `conteudo/cenas.json` |
| `npm run build:rascunho` | Conteúdo real com "IMAGEM PENDENTE" → `dist/rascunho/` (fora do entregável) |
| `npm run build` | Entregável → `dist/caso-clinico/` (falha se algum portão não passar) |
| `npm run build:piloto` | Piloto fictício → `dist/caso-clinico/` |
| `npm run processar` | Fase 3 a partir de `assets/processamento.json` |
| `npm test` | Sigilo + piloto |
| `npm run revisao -- <index.html>` | Screenshots da fase 5 |
| `npm run pdf` | PDF de contingência do `dist/caso-clinico/` |
