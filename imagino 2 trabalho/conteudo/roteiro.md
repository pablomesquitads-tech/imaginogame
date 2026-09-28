STATUS: RASCUNHO — aguardando aprovação

# Roteiro — Jogo de atendimento (Imaginologia Médica II, SNC)

> Rascunho do Claude, gerado a partir de `prompt-roteiro.md` e `CLAUDE.md` (seções 0, 2, 4, 5, 6). Não é `cenas.json`.
> Convenções: **campos visíveis no projetor** = `legenda`, `fala`, `opções` (rótulo/justificativa). **Campos só do painel do apresentador** = `notas`, `referência`. O diagnóstico só aparece em texto visível na cena `revelacao` e nas posteriores.
> `caminho_ideal: sim` = cena do caminho sem desvios; `não` = desvio (consequência ≤ 30 s, volta ao menu).

## Referências (chaves usadas nas cenas)

| Chave | Referência | Status |
|---|---|---|
| R1 | White AC Jr, Coyle CM, Rajshekhar V, et al. Diagnosis and Treatment of Neurocysticercosis: 2017 Clinical Practice Guidelines by IDSA and ASTMH. *Clin Infect Dis* 2018;66(8):e49–e75. doi:10.1093/cid/cix1084 | Citação confirmada no PubMed. Recomendações específicas: [VERIFICAR] no texto completo |
| R2 | Del Brutto OH, Nash TE, White AC Jr, et al. Revised diagnostic criteria for neurocysticercosis. *J Neurol Sci* 2017;372:202–210. doi:10.1016/j.jns.2016.11.045 | Citação e estrutura das categorias confirmadas no resumo (PubMed). Definição exata de "exposição": [VERIFICAR] no texto completo |
| R3 | Osborn AG. *Osborn's Brain: Imaging, Pathology, and Anatomy* — capítulo de infecções parasitárias | [VERIFICAR] edição e páginas |
| R4 | Brant WE, Helms CA. *Fundamentals of Diagnostic Radiology* — neurorradiologia | [VERIFICAR] edição e capítulo |
| R5 | Novelline RA. *Squire's Fundamentals of Radiology* — crânio/SNC | [VERIFICAR] edição e capítulo |
| R6 | Mello Jr CF — obra do plano de ensino da disciplina | [VERIFICAR] título/edição exatos com o plano de ensino |
| R7 | Escobar A. The pathology of neurocysticercosis. In: Palacios E, et al., eds. *Cysticercosis of the Central Nervous System*. Springfield: Thomas; 1983 (estadiamento patológico) | [VERIFICAR] dados bibliográficos (citado de memória); preferir citar via R3/R1 |
| R8 | Fisher RS, et al. Operational classification of seizure types by the ILAE. *Epilepsia* 2017;58(4):522–530 | [VERIFICAR] |

---

## BLOCO 1 — Abertura

### id: abertura-capa
- bloco: 1
- tipo: expositiva
- caminho_ideal: sim
- tempo_alvo_s: 10
- legenda: Plantão no pronto atendimento — decisões em imagem
- fala (leitor): —
- notas: Título/capa neutros, propostos por mim (decisão D3). Nenhum termo do diagnóstico. Custo zerado no placar.
- referência: —

### id: abertura-regras
- bloco: 1
- tipo: expositiva
- caminho_ideal: sim
- tempo_alvo_s: 30
- legenda: Vocês são a equipe de plantão. 1) A turma decide cada conduta por maioria de braços levantados. 2) Conduta errada custa pontos (tempo e recursos). 3) Objetivo: chegar ao diagnóstico com o menor custo.
- fala (leitor 1 — narrador): "Vocês são a equipe de plantão. Em cada decisão, levantem o braço pela conduta que escolherem; vale a maioria. Conduta errada custa pontos. O objetivo é fechar o diagnóstico gastando o mínimo."
- notas: Ler as regras sem antecipar nada do caso. Mostrar o custo em 0. Explicar que, após 2 erros no mesmo menu, o preceptor dá uma dica.
- referência: —

---

## BLOCO 2 — Pista 1: história

### id: historia-fala
- bloco: 2
- tipo: fala
- caminho_ideal: sim
- tempo_alvo_s: 80
- legenda (aparece sincronizada por trecho, cada trecho com o nome de quem fala): Paciente e esposa na triagem. Queixa: "apagão" hoje cedo.
- fala (3 leitores: **N** = narrador/triagem, **P** = paciente, **A** = acompanhante) — ~200 palavras, 60–90 s:
  - **N:** "Marcos, 34 anos, trazido ao pronto atendimento pela esposa, Daniela. Queixa: um apagão hoje cedo."
  - **P:** "Doutor, eu tava tomando café e, do nada, começou um formigamento na minha mão direita. A mão começou a tremer sozinha e eu fiquei esquisito, sem conseguir falar direito."
  - **A:** "Eu vi tudo. Ele ficou com o olhar parado, a mão direita tremendo, depois o braço inteiro duro, e caiu no chão. Tremeu uns dois minutos, babou. Depois ficou meio fora do ar."
  - **P:** "Quando acordei, minha língua tava doendo e eu tava com um sono enorme. O braço direito ficou fraco, dormente, por um tempo."
  - **A:** "Ele já vinha com dor de cabeça de vez em quando. E, faz uns meses, tinha uns momentos que ele parava no meio da frase. A gente achou que era estresse."
  - **P:** "Eu moro no sítio da família, lá no interior, e trabalho na roça. Vim pra cidade visitar minha irmã. Nunca tinha tido nada assim. Bebo pouco, não uso droga."
  - **A:** "Febre, acho que não. Só uma gripe, uns dias atrás."
- notas: Ambiguidades intencionais que abrem diferenciais reais: primeira crise do adulto (idiopática × sintomática), "gripe" recente (infecção), dor de cabeça (lesão expansiva × cefaleia primária), "parava no meio da frase" (crises focais prévias × distração), álcool/droga (crise provocada). Procedência rural aparece sem destaque, ao lado de "roça". **Não** mencionar porcos, água ou saneamento aqui (só no resultado da conduta certa do Menu 1). **Dependência da imagem:** "mão direita/braço direito" pressupõe lesão hemisférica esquerda (região frontoparietal/perirrolândica). Se a imagem escolhida na seção 1A tiver outra lateralidade/localização, ajustar a fala e o resultado do exame (decisão D1).
- referência: Semiologia da crise focal e paresia pós-ictal: R8 [VERIFICAR]. Neurocisticercose como causa de crises em adultos de áreas endêmicas: R1 [VERIFICAR passagem].

---

## BLOCO 3 — Pista 2: exame → Menu 1

### id: menu-conduta-1
- bloco: 3
- tipo: menu
- caminho_ideal: sim
- tempo_alvo_s: 30
- legenda: Primeira crise, com fraqueza no braço direito depois. Qual a próxima conduta?
- opções:
  - [1] rótulo: Iniciar anticonvulsivante e dar alta com retorno ambulatorial | destino: cons-m1-alta | custo: 3 | correta: não | justificativa: Alta sem investigar crise focal atrasa o diagnóstico e expõe a nova crise.
  - [2] rótulo: Pedir RM de crânio já, antes de complementar história e exame | destino: cons-m1-rm | custo: 2 | correta: não | justificativa: Exame caro sem hipótese direcionada gera protocolo genérico e laudo inespecífico.
  - [3] rótulo: Anamnese dirigida (antecedentes, exposição, sintomas associados) e exame neurológico completo | destino: resultado-anamnese-exame | custo: 0 | correta: sim | justificativa: A história e o exame direcionam a indicação e o protocolo do exame de imagem.
  - [4] rótulo: Fazer punção lombar de imediato | destino: cons-m1-lp | custo: 3 | correta: não | justificativa: Punção sem imagem em déficit focal arrisca herniação se houver efeito de massa.
- notas: Ordem das opções na tela pode ser embaralhada no build (a correta não deve ser sempre a 3). Opção 2 é o erro mais "defensável": discutir que a RM depende de uma pergunta clínica (decisão D2). Dica do preceptor após 2 erros: ver `dica-m1`.
- referência: Avaliação da primeira crise e uso de imagem: R1 (neuroimagem no diagnóstico), R8 [VERIFICAR diretriz de primeira crise — ex.: ACEP/ILAE]. Contraindicação de punção com efeito de massa: R1 [VERIFICAR passagem].

### id: cons-m1-alta
- bloco: 3
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 25
- legenda: Uma semana depois: nova crise, agora com fraqueza persistente no braço direito. Ele volta ao pronto atendimento.
- justificativa (uma linha): Atraso no diagnóstico e risco de nova crise sem investigação.
- custo: 3
- destino: menu-conduta-1
- notas: Comentar que crise focal com déficit não deve ser tratada como evento benigno sem imagem.
- referência: R8 [VERIFICAR]

### id: cons-m1-rm
- bloco: 3
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 25
- legenda: O técnico da RM pergunta a hipótese clínica. Sem história dirigida nem exame, o protocolo é genérico e o laudo, inespecífico. O exame precisará ser repetido.
- justificativa (uma linha): Exame de alto custo pedido sem hipótese direcionada.
- custo: 2
- destino: menu-conduta-1
- notas: Reforçar o vínculo entre pergunta clínica e escolha de sequências.
- referência: R4, R3 [VERIFICAR passagem sobre protocolo dirigido]

### id: cons-m1-lp
- bloco: 3
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 25
- legenda: A enfermagem pergunta: "Sem imagem antes?" A punção é suspensa por risco. Horas perdidas.
- justificativa (uma linha): Punção sem imagem prévia em déficit focal: risco de herniação se houver efeito de massa.
- custo: 3
- destino: menu-conduta-1
- notas: —
- referência: R1 [VERIFICAR passagem sobre punção lombar e efeito de massa]

### id: dica-m1
- bloco: 3
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 15
- legenda: Preceptor: "Uma boa hipótese nasce de uma boa conversa e de um exame à beira do leito. O que ainda não foi perguntado nem examinado?"
- justificativa (uma linha): Dica do preceptor (após 2 erros neste menu). Sem custo.
- custo: 0
- destino: menu-conduta-1
- notas: Aparece após 2 condutas erradas no Menu 1.
- referência: —

### id: resultado-anamnese-exame
- bloco: 3
- tipo: resultado
- caminho_ideal: sim
- tempo_alvo_s: 40
- legenda: EXAME NEUROLÓGICO — Vigil, orientado, afebril. Paresia leve em membro superior direito. Reflexos vivos à direita; Babinski à direita. Sem sinais meníngeos. Fundo de olho sem papiledema. ANAMNESE DIRIGIDA — Mora em sítio; lida com roça e com criação de porcos soltos no quintal. Água de poço, sem esgoto tratado. Cefaleia intermitente há alguns meses. Sem HIV conhecido; sem imunossupressores.
- fala (leitores **A** e **P**):
  - **A:** "Esqueci de contar, doutor: lá no sítio a gente cria uns porcos soltos no quintal, e a água é de poço."
  - **P:** "E essa dor de cabeça vem e vai faz uns meses."
- notas: Este é o momento da "informação epidemiológica mais forte". Discutir: sinais piramidais direitos + crise focal = lesão estrutural em hemisfério esquerdo (localização depende da imagem escolhida, decisão D1). Se o grupo quiser, pedir que a turma liste a hipótese de lesão estrutural (tumor, infecção, vascular). Decisão D4: "porcos soltos" e "água de poço" são deixados em texto visível antes da revelação de propósito, por serem o dado epidemiológico que a anamnese dirigida deve recompensar; não entram em `termos-proibidos.txt`.
- referência: Fatores de exposição (área rural, criação de suínos, saneamento precário): R1 [VERIFICAR passagem]; R2 (categoria clínico/exposição).

---

## BLOCO 4 — Pista 3: TC → Menu 2

### id: menu-imagem-2
- bloco: 4
- tipo: menu
- caminho_ideal: sim
- tempo_alvo_s: 30
- legenda: Crise focal com déficit e cefaleia. Qual exame de imagem primeiro?
- opções:
  - [1] rótulo: Radiografia simples de crânio | destino: cons-m2-rx | custo: 1 | correta: não | justificativa: Sem rendimento para lesão intracraniana; atrasa o diagnóstico.
  - [2] rótulo: Angiotomografia de crânio | destino: cons-m2-angio | custo: 2 | correta: não | justificativa: Sem pergunta vascular no quadro; contraste e radiação sem necessidade.
  - [3] rótulo: TC de crânio sem contraste | destino: resultado-tc | custo: 1 | correta: sim | justificativa: Rápida e disponível; exclui hemorragia e efeito de massa e mostra calcificações.
  - [4] rótulo: PET-CT cerebral | destino: cons-m2-pet | custo: 3 | correta: não | justificativa: Custo elevado e baixa disponibilidade; sem papel na avaliação inicial.
- notas: Custo 1 da opção correta compõe o "custo do caminho ideal" no placar (ver `fechamento-placar`, decisão D5). Se a turma perguntar "por que não RM direto?": TC é o primeiro exame na urgência pela disponibilidade e pela sensibilidade a calcificação e hemorragia; a RM entra a seguir para caracterizar (é o Menu 3). Ver decisão D2.
- referência: R1 (TC e RM no diagnóstico), R5, R4 [VERIFICAR passagem sobre escolha inicial de imagem em crise], R3.

### id: cons-m2-rx
- bloco: 4
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 20
- legenda: Radiografia de crânio sem alterações. Nada foi esclarecido; o tempo passou.
- justificativa (uma linha): Exame sem rendimento para lesão intracraniana.
- custo: 1
- destino: menu-imagem-2
- notas: —
- referência: R5 [VERIFICAR]

### id: cons-m2-angio
- bloco: 4
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 25
- legenda: Angiotomografia sem oclusão nem aneurisma. Contraste iodado e radiação sem uma pergunta vascular a responder.
- justificativa (uma linha): Indicação vascular não sustentada pelo quadro.
- custo: 2
- destino: menu-imagem-2
- notas: —
- referência: R4 [VERIFICAR]

### id: cons-m2-pet
- bloco: 4
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 20
- legenda: O PET-CT não está disponível na urgência. O paciente aguarda sem diagnóstico.
- justificativa (uma linha): Custo elevado e baixa disponibilidade, sem papel na avaliação inicial.
- custo: 3
- destino: menu-imagem-2
- notas: —
- referência: R1, R4 [VERIFICAR papel do PET na investigação de crises]

### id: dica-m2
- bloco: 4
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 15
- legenda: Preceptor: "Na urgência, qual exame responde rápido às perguntas mais perigosas — sangue, massa — e ainda enxerga cálcio?"
- justificativa (uma linha): Dica do preceptor (após 2 erros neste menu). Sem custo.
- custo: 0
- destino: menu-imagem-2
- notas: Aparece após 2 condutas erradas no Menu 2.
- referência: —

### id: resultado-tc
- bloco: 4
- tipo: resultado
- caminho_ideal: sim
- tempo_alvo_s: 45
- legenda: TC DE CRÂNIO SEM CONTRASTE — Múltiplas áreas hiperdensas no parênquima cerebelar, algumas com calcificação interna (seta) e outras com hipodensidade ao redor (edema). Sugerido complemento com RM de crânio.
- fala (leitor **N**): "A TC mostra áreas densas no cerebelo, algumas com cálcio e outras com edema ao redor. Para caracterizar as lesões, o radiologista sugere RM."
- notas: Ativar a camada de anotação (tecla A): a seta é a do autor do caso ("calcification"). ↑/↓ percorrem 51 cortes. [AJUSTADO À IMAGEM: laudo reescrito a partir da descrição da fonte, caso rID 197449; a TC do caso não descreve lesão hipodensa frontoparietal.] Não afirmar número de calcificações.
- referência: TC como método mais sensível para calcificação: R3, R5 [VERIFICAR passagem]; R1 (papel da TC).

---

## BLOCO 5 — Pista 4: RM → Menu 3

### id: resultado-rm
- bloco: 5
- tipo: resultado
- caminho_ideal: sim
- tempo_alvo_s: 45
- legenda: RM DE CRÂNIO COM CONTRASTE — Múltiplas lesões nodulares supra e infratentoriais, na transição entre substância cinzenta e branca. A maior, temporoparietal esquerda: realce periférico em anel (T1 pós-contraste), edema ao redor (FLAIR), sem restrição à difusão. Diferencial do realce anelar: abscesso, tuberculoma, toxoplasmose, glioma de alto grau, metástase.
- fala (leitor **N**): "A RM mostra várias lesões; a maior tem realce em anel e edema ao redor. O diferencial do realce anelar é amplo. Como vocês vão separar essas possibilidades?"
- notas: [AJUSTADO À IMAGEM: laudo a partir da descrição da fonte, rID 197449, mesmo paciente da TC.] Ativar anotação (setas do autor: "ring-like contrast enhancement" e "brain edema"). A lista do diferencial omite de propósito a hipótese diagnóstica do caso; a turma deve chegar a ela pela imagem. Se a turma disser "tuberculoma", "toxoplasmose" etc., valorizar o raciocínio e pedir que digam que achado de imagem os separaria. Discussão de DWI/ADC e espectroscopia pode ser mencionada, mas o Menu 3 quer uma etapa de caracterização não invasiva do interior da lesão.
- referência: Realce anelar e diferencial: R3, R4 [VERIFICAR passagens]; R1 (papel da RM).

### id: menu-diferencial-3
- bloco: 5
- tipo: menu
- caminho_ideal: sim
- tempo_alvo_s: 40
- legenda: Lesão com realce em anel e edema. Como diferenciar sem se precipitar?
- opções:
  - [1] rótulo: Iniciar esquema tuberculostático empírico | destino: cons-m3-tb | custo: 3 | correta: não | justificativa: Tratamento empírico sem hipótese sustentada: toxicidade e diagnóstico adiado.
  - [2] rótulo: Encaminhar para biópsia estereotáxica imediata | destino: cons-m3-biopsia | custo: 3 | correta: não | justificativa: Procedimento invasivo antes de esgotar a caracterização não invasiva.
  - [3] rótulo: Repetir a TC com contraste e reavaliar | destino: cons-m3-tc | custo: 2 | correta: não | justificativa: Repetir exame de menor resolução: radiação e custo sem informação nova.
  - [4] rótulo: Complementar a RM com cortes finos de alta resolução, olhando o interior da lesão | destino: revelacao | custo: 1 | correta: sim | justificativa: Caracteriza o conteúdo e o interior da lesão sem procedimento invasivo.
- notas: Custo 1 da opção correta compõe o custo do caminho ideal (D5). O texto da opção 4 não nomeia o achado. Ordem embaralhável no build.
- referência: Uso de sequências de alta resolução para identificar o escólex: R1, R3 [VERIFICAR nome exato das sequências, ex.: CISS/FIESTA/3D T2]. Biópsia raramente necessária: R1 [VERIFICAR passagem].

### id: cons-m3-tb
- bloco: 5
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 30
- legenda: Iniciado esquema tuberculostático empírico. Nos dias seguintes: náuseas e elevação de transaminases. A lesão continua sem explicação.
- justificativa (uma linha): Tratamento empírico sem hipótese sustentada: toxicidade e diagnóstico adiado.
- custo: 3
- destino: menu-diferencial-3
- notas: Não afirmar prevalência ou taxas de hepatotoxicidade (sem número verificado).
- referência: R4 [VERIFICAR]

### id: cons-m3-biopsia
- bloco: 5
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 30
- legenda: O neurocirurgião pede, antes de operar, uma caracterização completa da lesão por imagem. A biópsia é adiada.
- justificativa (uma linha): Procedimento invasivo antes de esgotar a caracterização não invasiva.
- custo: 3
- destino: menu-diferencial-3
- notas: —
- referência: R1 [VERIFICAR]

### id: cons-m3-tc
- bloco: 5
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 25
- legenda: A TC com contraste repetida mostra o mesmo padrão, com menos detalhe da lesão do que a RM já obtida.
- justificativa (uma linha): Repetir exame de menor resolução: radiação e custo sem informação nova.
- custo: 2
- destino: menu-diferencial-3
- notas: —
- referência: R3, R4 [VERIFICAR]

### id: dica-m3
- bloco: 5
- tipo: consequencia
- caminho_ideal: não
- tempo_alvo_s: 15
- legenda: Preceptor: "Antes de tratar às cegas ou de operar: o que a imagem ainda não mostrou sobre o interior dessa lesão? Existe sequência que responde isso sem agulha?"
- justificativa (uma linha): Dica do preceptor (após 2 erros neste menu). Sem custo.
- custo: 0
- destino: menu-diferencial-3
- notas: Aparece após 2 condutas erradas no Menu 3.
- referência: —

---

## BLOCO 6 — Revelação

### id: revelacao
- bloco: 6
- tipo: revelacao
- caminho_ideal: sim
- tempo_alvo_s: 45
- legenda: NEUROCISTICERCOSE. RM T1 pós-contraste em cortes finos: realce da parede do cisto e do escólex, o ponto no interior (cisto com ponto), fase coloidal. Critério ABSOLUTO — Del Brutto 2017.
- fala (leitor **N**): "O interior da lesão mostra o escólex. É neurocisticercose: a forma larvária da Taenia solium no sistema nervoso central."
- notas: [AJUSTADO À IMAGEM: imagem de OUTRO paciente (rID 92354, lesão parietal esquerda única), porque o caso da TC/RM não descreve escólex. Apresentar como "o mesmo achado, em corte fino". A fonte descreve fase coloidal e cisto com ponto. Sem seta na fonte: ↑/↓ percorrem 17 cortes.] Primeira menção ao diagnóstico. Ativar a anotação (tecla A) sobre o escólex; mostrar par limpo/anotado. Nome do sinal para a discussão oral: "cisto com ponto excêntrico" (descrição clássica em inglês: *hole-with-dot*). A fase evolutiva vinculada a um cisto com escólex e realce da parede (vesicular/coloidal-vesicular) depende da imagem real: usar a descrição do caso na fonte, não a minha (regra 1A.4). Crédito (autor + rID) gerado pelo build; URL só no fechamento.
- referência: Escólex no cisto = critério absoluto: R2. Aspecto de imagem do cisto com escólex: R3, R4 [VERIFICAR passagens].

---

## BLOCO 7 — Virada: fases evolutivas e tratamento

### id: virada-fases
- bloco: 7
- tipo: expositiva
- caminho_ideal: sim
- tempo_alvo_s: 40
- legenda: FASES EVOLUTIVAS 1) Vesicular → coloidal → granular nodular → nodular calcificada. 2) Realce anelar e edema = reação inflamatória à degeneração do cisto. 3) Neste caso coexistem calcificações antigas e lesão ativa.
- fala (leitor **N**): "O cisto passa por quatro fases. Quando degenera, o organismo reage: aparece o realce em anel e o edema. E este paciente tem calcificações antigas e uma lesão ativa ao mesmo tempo, o que fala de exposição prolongada."
- notas: Máximo 3 ideias. Se houver imagens ilustrativas das quatro fases (requisito R06, opcional), mostrar lado a lado. "Exposição prolongada" é inferência didática; formular como "sugere lesões em momentos diferentes", não como fato do caso. Nomes das fases: usar os de R3 (Osborn) e conferir com R7.
- referência: Estadiamento patológico: R7, R3 [VERIFICAR nomes exatos e sequência]. Realce/edema na degeneração: R3, R1 [VERIFICAR].

### id: virada-tratamento
- bloco: 7
- tipo: expositiva
- caminho_ideal: sim
- tempo_alvo_s: 40
- legenda: TRATAMENTO 1) Lesões ativas: antiparasitário (albendazol, com ou sem praziquantel) + corticoide + anticrise. 2) Antes: descartar hidrocefalia e cisto no olho. 3) Só calcificações: sem antiparasitário; tratar as crises.
- fala (leitor **N**): "Lesão ativa pede antiparasitário com corticoide e controle das crises. Antes, é preciso descartar hidrocefalia e cisticercose ocular. Calcificação sozinha não recebe antiparasitário."
- notas: Sem doses nos slides. Para perguntas: doses e duração estão em R1 [VERIFICAR: albendazol e duração; associação com praziquantel quando há mais de um cisto viável]. Mencionar que a conduta detalhada depende do número e do tipo de lesão e que é do time de neurologia/infectologia. Rastreio de contatos domiciliares (portador de tênia) pode ser citado em fala livre [VERIFICAR indicação em R1].
- referência: R1 (recomendações de tratamento) [VERIFICAR cada item: corticoide com antiparasitário; avaliação prévia de hidrocefalia/fundoscopia; calcificações isoladas].

---

## BLOCO 8 — Papel da imagem: critérios revisados (Del Brutto 2017)

### id: criterios-imagem
- bloco: 8
- tipo: expositiva
- caminho_ideal: sim
- tempo_alvo_s: 40
- legenda: PISTAS DE IMAGEM → CRITÉRIOS 1) Escólex dentro do cisto (RM, cortes finos) → ABSOLUTO. 2) Calcificações parenquimatosas típicas (TC) → NEUROIMAGEM, MAIOR. 3) Lesão com realce em anel (RM) → NEUROIMAGEM, MAIOR.
- fala (leitor **N**): "Cada pista de imagem cai numa categoria. O escólex é critério absoluto. As calcificações típicas e a lesão com realce são critérios de neuroimagem maiores."
- notas: Confirmativos (resolução do cisto após antiparasitário; resolução espontânea de lesão única com realce; migração de cisto ventricular) **não se aplicam** neste momento do caso (sem seguimento). Menores (hidrocefalia, realce leptomeníngeo) **não foram descritos**. Dizer isso em voz alta fecha as quatro categorias de neuroimagem.
- referência: R2 (categorias: absoluto; neuroimagem maior/confirmativo/menor; clínico/exposição), confirmadas pelo resumo no PubMed; conferir enunciados no texto completo [VERIFICAR].

### id: criterios-conclusao
- bloco: 8
- tipo: expositiva
- caminho_ideal: sim
- tempo_alvo_s: 30
- legenda: HISTÓRIA E EXPOSIÇÃO → CRITÉRIOS 1) Crise focal → clínico: manifestação sugestiva. 2) Vive em sítio rural, com criação de porcos → clínico/exposição: origem/residência em área de risco. 3) CERTEZA: DEFINITIVA — o critério absoluto basta.
- fala (leitor **N**): "A crise focal e a vida no sítio contam como critérios clínicos e de exposição. Mas o diagnóstico já é definitivo: um critério absoluto basta."
- notas: Pelos critérios, dois critérios maiores de neuroimagem (calcificações + lesão com realce) mais exposição também bastariam para definitivo; o escólex torna isso desnecessário. Citar isso em voz alta mostra por que a imagem carrega o diagnóstico. **Rótulo maior/menor de cada item clínico/exposição e o significado exato de "exposição" para o nível de certeza:** [VERIFICAR] no texto completo de R2 antes de aprovar esta cena. Não citar sensibilidade/especificidade sem verificar (existe estudo de validação em lesões ventriculares no PubMed, mas não é o caso aqui).
- referência: R2 (níveis de certeza: definitivo com critério absoluto; definitivo com dois maiores + exposição) — resumo confirmado no PubMed; detalhes [VERIFICAR].

---

## BLOCO 9 — Fechamento

### id: fechamento-mensagens
- bloco: 9
- tipo: fechamento
- caminho_ideal: sim
- tempo_alvo_s: 20
- legenda: MENSAGENS 1) Crise focal em adulto pede imagem, não alta com receita. 2) A TC vê o cálcio; a RM vê o interior da lesão: o exame certo responde à pergunta clínica. 3) Ver o escólex fecha o diagnóstico; sem ele, a soma de imagem e exposição sustenta o raciocínio.
- fala (leitor **N**): lê as três mensagens.
- notas: Uma frase por mensagem. Não acrescentar estatística.
- referência: R1, R2, R3.

### id: fechamento-placar
- bloco: 9
- tipo: fechamento
- caminho_ideal: sim
- tempo_alvo_s: 15
- legenda: PLACAR — Custo da turma: {custo_turma} pontos. Custo do caminho ideal: 2 pontos. Tempo da turma: {tempo_turma}.
- fala (leitor **N**): "A turma gastou {custo_turma} pontos. O caminho ideal custa 2."
- notas: Variáveis preenchidas pelo motor. O custo do caminho ideal (2) = TC (1) + complemento da RM (1); a conduta correta do Menu 1 custa 0 (D5). Comparar erro mais caro do grupo com a consequência clínica real.
- referência: —

### id: fechamento-referencias
- bloco: 9
- tipo: fechamento
- caminho_ideal: sim
- tempo_alvo_s: 10
- legenda: REFERÊNCIAS — White AC Jr, et al. IDSA/ASTMH 2017. Clin Infect Dis 2018;66(8):e49–e75. doi:10.1093/cid/cix1084 · Del Brutto OH, et al. Revised diagnostic criteria for neurocysticercosis. J Neurol Sci 2017;372:202–210. doi:10.1016/j.jns.2016.11.045 · Osborn AG; Brant & Helms; Novelline; Mello Jr (edições a confirmar). Créditos das imagens: gerados pelo build a partir do manifesto.
- fala (leitor): —
- notas: URLs completas de casos só aqui (regra da seção 2). Completar edições dos livros após [VERIFICAR].
- referência: —

---

## Pendências desta minuta

### Decisões que dependem de aprovação
| # | Decisão | Proposta |
|---|---|---|
| D1 | Caso de imagem único (mesmo paciente na TC, na RM e no 3D T2) e lateralidade | Preferir um único caso com as três etapas. Roteiro assume lesão frontoparietal esquerda (mão direita); ajustar fala e laudos à imagem aprovada |
| D2 | TC como primeiro exame e RM direta como erro do Menu 1 | Manter: RM antes de história/exame = erro de raciocínio; TC primeiro na urgência. Trocar se preferir tratar "RM direto" como aceitável |
| D3 | Título e capa neutros | "Plantão no pronto atendimento — decisões em imagem" |
| D4 | "Porcos soltos" e "água de poço" visíveis antes da Revelação | Sim, como recompensa da anamnese dirigida; ficam fora de `termos-proibidos.txt` |
| D5 | Custo do caminho ideal no placar | 2 pontos (TC 1 + complemento da RM 1); Menu 1 correto = 0 |
| D6 | Duração-alvo | Caminho ideal = 9:50 (tempo alvo, sem folga de leitura); ensaio confirma |
| D7 | Paciente: ilustração estática com animação CSS ou vídeo gerado | Pendente (CLAUDE.md, seção 10). Não afeta o texto |

### Pontos [VERIFICAR]
- R1: texto completo para: punção lombar e efeito de massa; papel de TC vs RM; sequências de alta resolução; biópsia raramente necessária; corticoide com antiparasitário; avaliação de hidrocefalia e fundoscopia antes do tratamento; calcificações isoladas; associação com praziquantel; rastreio de contatos.
- R2: texto completo para: rótulo maior/menor dos itens clínicos/exposição; significado de "exposição" no nível de certeza.
- R3–R6: edições, capítulos e páginas.
- R7: dados bibliográficos e nomes das fases.
- R8 e diretriz de primeira crise: definir a fonte.
- Nome exato das sequências (CISS/FIESTA/3D T2) conforme o caso escolhido.
- Fase evolutiva do cisto com escólex e realce, segundo a descrição do caso na fonte.
