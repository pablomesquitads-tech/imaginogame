Leia o CLAUDE.md desta pasta inteiro antes de começar (seções 0, 2, 4, 5 e 6). Sua tarefa é redigir o RASCUNHO do conteúdo do seminário. Não gere o cenas.json nem código.

## Caso e contexto

- Diagnóstico do caso: neurocisticercose. Ele pode aparecer nos arquivos de trabalho, mas NUNCA em texto visível na tela antes da cena de Revelação (seção 2).
- Público: estudantes de medicina, disciplina Imaginologia Médica II (ênfase em SNC).
- A turma vota por maioria de braços levantados; o grupo lê as falas em voz alta.
- Caminho ideal: ~10 min. Teto com desvios: 20 min.

## Estrutura aprovada (não alterar a ordem nem os temas)

1. Abertura — regras e pontuação
2. Pista 1: história — convulsão, procedência rural
3. Pista 2: exame — achados neurológicos focais → MENU 1
4. Pista 3: TC — calcificações puntiformes → MENU 2
5. Pista 4: RM — diferencial do realce anelar → MENU 3
6. Revelação — escólex visível
7. Virada — fases evolutivas e tratamento
8. Papel da imagem — critérios diagnósticos revisados de Del Brutto (2017)
9. Fechamento — mensagens e placar

## Regras de conteúdo

**Fala do paciente (bloco 2)**
- Primeira pessoa, português brasileiro coloquial e natural, sem caricatura regional.
- Pode ser dividida entre paciente e acompanhante, para distribuir a leitura entre os integrantes do grupo.
- 60–90 s de leitura em voz alta.
- Descrição leiga e imprecisa do episódio ("apagão", "tremedeira", "fiquei esquisito"), com ambiguidades plausíveis que abram diferenciais reais.
- A procedência rural aparece de forma natural, sem destaque. Informações epidemiológicas mais fortes só aparecem quando a turma escolhe a conduta certa no Menu 1 (anamnese dirigida).

**Menus (blocos 3, 4, 5)**
- 3–4 opções por menu. Só uma avança.
- Cada opção errada deve ser plausível e representar um erro real de raciocínio clínico ou de indicação de exame.
- Cada opção errada leva a uma consequência de até 30 s, com custo em pontos (1–3) e uma justificativa de uma linha (exame desnecessário, atraso, risco, custo ao sistema).
- Escreva a dica do "preceptor" que aparece após 2 erros no mesmo menu, sem entregar a resposta de forma literal.

**Resultados**
- Achados em linguagem de laudo, curtos, legíveis no projetor.
- Cada resultado com imagem gera um requisito em `requisitos-imagem.md`.

**Blocos 7 e 8**
- Enxutos: no máximo 3 ideias por cena.
- O bloco 8 deve conectar explicitamente cada pista do jogo a uma categoria dos critérios revisados (absoluto; neuroimagem maior, confirmativo, menor; clínico/exposição) e concluir o nível de certeza diagnóstica do caso.

**Fechamento**
- 3 mensagens-chave, uma frase cada.
- Placar: custo da turma × custo do caminho ideal.

**Rigor**
- Toda afirmação clínica leva referência. Prioridade: diretriz IDSA/ASTMH 2017 de neurocisticercose; Del Brutto et al. 2017 (critérios revisados); livros do plano de ensino (Brant, Mello Jr., Novelline) e Osborn para neurorradiologia.
- Onde não tiver certeza, marque `[VERIFICAR]`. Não invente números, dados nem citações.

## Arquivos a gerar

1. `conteudo/roteiro.md`
   - Primeira linha: `STATUS: RASCUNHO — aguardando aprovação`.
   - Para cada cena: `id`, `bloco`, `tipo`, `tempo_alvo_s`, texto visível (legenda), fala (e quem lê), opções (tecla, rótulo, destino, custo, correta, justificativa), notas do apresentador, referência.

2. `conteudo/requisitos-imagem.md`, uma tabela com as colunas:
   `requisito`, `cena`, `modalidade`, `sequência/janela`, `plano`, `achado que deve estar visível`, `imagem única / pilha / vídeo`, `anotação prevista`, `prioridade`.
   É esta tabela que guia a busca de imagens da seção 1A.

3. `conteudo/termos-proibidos.txt`: um termo por linha. Inclua o diagnóstico, sinônimos, siglas, variações sem acento, o nome do parasita e sinais radiológicos epônimos que entreguem o caso.

## Verificação final (obrigatória)

- Some o tempo do caminho ideal. Se passar de 10 min, proponha cortes sem alterar a estrutura aprovada.
- Confira você mesmo que nenhum termo de `termos-proibidos.txt` aparece em texto visível antes da Revelação.
- Liste, ao final da resposta, as decisões que dependem da minha aprovação e todos os pontos marcados `[VERIFICAR]`.
