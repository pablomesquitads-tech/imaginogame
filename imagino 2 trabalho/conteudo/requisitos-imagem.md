| requisito | cena | modalidade | sequência/janela | plano | achado que deve estar visível | imagem única / pilha / vídeo | anotação prevista | prioridade |
|---|---|---|---|---|---|---|---|---|
| R01 | resultado-tc | TC de crânio | Sem contraste; janela de parênquima (cérebro) | Axial | Calcificações puntiformes no parênquima cerebral; de preferência com área hipodensa frontoparietal esquerda com discreto efeito de massa (compatível com o texto do laudo) | Pilha (série axial, cortes que incluam as calcificações) + imagem única do corte-chave | Setas ou círculos (cor `acento`) sobre as calcificações; par limpo/anotado | Alta |
| R02 | resultado-rm | RM de crânio | T1 pós-gadolínio | Axial (ou coronal) | Lesão com realce periférico em anel, frontoparietal esquerda | Imagem única do corte-chave (pilha opcional) | Contorno do anel de realce; par limpo/anotado | Alta |
| R03 | resultado-rm | RM de crânio | FLAIR (ou T2) | Axial, mesmo nível de R02 | Edema perilesional ao redor da lesão de R02 | Imagem única | Contorno leve da área de edema (opcional) | Média |
| R04 | revelacao | RM de crânio | T2 3D de alta resolução (CISS/FIESTA ou equivalente) ou T2 axial fino | Axial ou reformatado; qualquer plano que mostre o interior | Lesão cística com escólex visível como ponto excêntrico no interior (achado conforme a descrição do caso na fonte) | Imagem única do corte-chave + pilha curta (3 a 6 cortes) para rolagem; vídeo em loop opcional | Seta sobre o escólex; par limpo/anotado | Alta |
| R05 | resultado-tc / resultado-rm / revelacao | Mesmo caso de R01–R04 | Ver linhas R01–R04 | — | Preferência: R01, R02, R03 e R04 vindos do **mesmo paciente/caso**. Se não houver, aceitar casos separados e ajustar o roteiro (decisão D1) | — | — | Alta (critério de escolha do caso) |
| R06 | virada-fases | TC e/ou RM | Vários | Axial | Exemplos das quatro fases evolutivas (vesicular, coloidal, granular nodular, nodular calcificada), conforme a descrição da fonte | Quatro imagens únicas (uma por fase) | Rótulo neutro por fase (texto do build, não gravado na imagem) | Baixa (opcional) |
| R07 | historia-fala / resultado-anamnese-exame | Ilustração do personagem (paciente e esposa) | — | — | Personagens em atendimento; **sem nenhum sinal clínico desenhado**; marcada como "ilustração" no manifesto | Imagem única ou animação CSS (fora da regra 1A: não vem de site radiológico; decisão D7) | Nenhuma | Média |
| R08 | resultado-tc (opcional) | TC de crânio | Sem contraste; janela óssea ou parênquima | Axial | Comparação de calcificação puntiforme, sem lesão associada (para explicar "cálcio" na TC) | Imagem única | Seta | Baixa (opcional) |

**Notas para a busca (seção 1A)**
- Buscar só o que consta nesta tabela; 2 a 3 candidatos por requisito em `assets/candidatos/<requisito>/`.
- O que a imagem mostra vem da legenda/descrição do caso na fonte, não da interpretação do Claude.
- Renomear para ID neutro no ato do download; título, autor, rID e URL só no manifesto.
- Texto gravado (rótulos, legendas, setas da fonte que entreguem o diagnóstico): recortar ou cobrir no processamento.
- Não usar as palavras do diagnóstico em nomes de pasta de candidatos visíveis no `dist/` (a pasta `candidatos/` já fica fora do `dist/`).
- Sites "Radiology Education" e "Teaching Files Radiology": confirmar o endereço exato com o usuário antes do primeiro acesso.
- Antes do primeiro download de cada site: ler termos de uso, licença e `robots.txt`; registrar em `assets/fontes-licencas.md`.
