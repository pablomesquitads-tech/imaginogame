# Status do projeto

Atualizado em 2026-09-28.

```
Fase 0 ✔ ─ Fase 1 ◐ ─ 2a ◐ ─ 2b ✔ ─ 3 ✔ ─ 4 ◐ ─ 5 ◐ ─ 6 ☐ ─ 7 ◐ ─ 8 ☐
✔ pronto   ◐ ferramenta pronta, falta insumo seu   ✖ bloqueado   ☐ é com você
```

| Fase | Pronto (Claude) | Falta | Quem destrava |
|---|---|---|---|
| 0. Setup | Pastas, fontes, build, ffmpeg/cwebp/Playwright | — | — |
| 1. Piloto | Motor + painel; 46 verificações automáticas em Chromium (+ 16 de sigilo) | Teste no notebook com HDMI e no Firefox (`COMO-TESTAR-PILOTO.md`) | **Você** |
| 2a. Roteiro | `roteiro.md` rascunhado; conversor `roteiro.md → cenas.json`; rascunho completo navegável (26 cenas, 9:50, sigilo ok) | Revisar os `[VERIFICAR]` e mudar a 1ª linha para `STATUS: APROVADO` | **Você** |
| 2b. Imagens | 4 imagens-chave + 2 pilhas baixadas do Radiopaedia (rID 197449 e 92354), escolha delegada ao Claude; manifesto preenchido | Aceitar a Revelação com outro paciente (ou pedir outro caso) | **Você** |
| 3. Processamento | Feito: pares limpo/anotado com as setas do autor da fonte; pilhas em WebP + MP4/WebM | Seta na imagem da Revelação (a fonte não tem): opcional, pelo anotador | Opcional |
| 4. Build | Build final com portões; imagens já passam | Roteiro APROVADO e ilustração aprovada | **Você** |
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
