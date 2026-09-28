# Fase 1: testar o piloto no notebook

O piloto usa **conteúdo fictício** (torção de tornozelo, imagem de teste geométrica). Ele serve para testar o motor, não o caso.

## Abrir

1. Baixe a pasta `dist/caso-clinico/` inteira (o `index.html` precisa da pasta `assets/` ao lado).
2. **Desligue o Wi-Fi.**
3. Ligue o notebook ao monitor/TV por HDMI e escolha **Estender** (Win+P).
4. Abra `index.html` no Chrome (depois repita no Firefox) com duplo clique; o endereço começa com `file://`.
5. Arraste a janela para o monitor externo e pressione **F** (tela cheia).
6. Pressione **P**. O painel do apresentador abre em outra janela; arraste-o para a tela do notebook.
   Se o navegador bloquear o pop-up, libere pop-ups para arquivos locais e pressione P de novo.

## Checklist (critério da fase 1)

| # | Verificar | Como | OK |
|---|---|---|---|
| 1 | Abre offline | Wi-Fi desligado; tudo aparece, inclusive a imagem de teste | ☐ |
| 2 | Fontes corretas | Títulos em Inter (sem serifa, "a" de dois andares); créditos e custo em mono com zero cortado | ☐ |
| 3 | Painel sincroniza | Cada tecla muda a plateia e o painel ao mesmo tempo; o selo diz "conectado" | ☐ |
| 4 | Teclas no painel | Com o foco no painel, → e 1–4 comandam a plateia | ☐ |
| 5 | Fala | → avança trecho a trecho; quem fala mexe a boca, o outro fica esmaecido | ☐ |
| 6 | Menu e consequência | 1 ou 3 → consequência com "+N" → volta ao menu; a opção fica marcada "já tentada" | ☐ |
| 7 | Dica | Depois de 2 erros aparece "Preceptor" | ☐ |
| 8 | **Z desfaz** | Z volta passo a passo, inclusive o custo | ☐ |
| 9 | Anotação e cortes | No resultado, A liga e desliga os círculos âmbar; ↑ e ↓ percorrem 8 cortes e a anotação só aparece no corte 4 | ☐ |
| 10 | Placar | O fechamento mostra o custo da turma contra o caminho ideal (0) | ☐ |
| 11 | Reiniciar | R, depois R de novo em até 3 s, volta à capa | ☐ |
| 12 | Legibilidade | Do fundo da sala: legenda da fala, opções do menu e crédito da imagem | ☐ |
| 13 | Cores certo/errado | O "+N" vermelho e o "conectado" verde ficam discretos e legíveis no projetor | ☐ |
| 14 | Passador de slides (se usar) | O botão "avançar" do passador funciona como → | ☐ |

**Se algum item falhar, pare e anote o item, o navegador e o que apareceu.** (CLAUDE.md, fase 1: "Se falhar, parar e reavaliar".)

## Regerar (opcional, precisa do Node 18+)

```
npm install                  # só Playwright, para os testes
npm run build:piloto         # gera dist/caso-clinico/ com o piloto
npm run teste:piloto         # teste automatizado (Chromium)
npm run teste:sigilo         # teste da checagem de termos proibidos
npm run revisao              # screenshots em tests/saida/
npm run build                # build real (hoje vazio; exige roteiro APROVADO)
```
