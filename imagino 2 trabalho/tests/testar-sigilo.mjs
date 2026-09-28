// Testes da checagem de sigilo (build/sigilo.mjs) com a lista real de termos.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerLista, criarVerificador, checarCenas } from '../build/sigilo.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lista = (f) => lerLista(fs.readFileSync(path.join(RAIZ, 'conteudo', f), 'utf8'));
const verificar = criarVerificador(lista('termos-proibidos.txt'), lista('termos-permitidos.txt'));

let falhas = 0;
const caso = (texto, deveAchar) => {
  const achou = verificar(texto);
  const ok = deveAchar ? achou.length > 0 : achou.length === 0;
  console.log(`${ok ? '  ✓' : '  ✗'} ${deveAchar ? 'bloqueia' : 'libera  '} "${texto}"${achou.length ? ` → ${achou.join(', ')}` : ''}`);
  if (!ok) falhas++;
};

console.log('Termos');
caso('Suspeita de NEUROCISTICERCOSE', true);
caso('lesão cística frontal', true);          // sem acento e flexão
caso('Cisto com escólex', true);
caso('sinal do hole-with-dot', true);         // hífen × espaço
caso('achado tipo hole with dot', true);
caso('infecção parasitária', true);           // prefixo "parasit"
caso('T. solium', true);
caso('região endêmica', true);
caso('Tratamento com Albendazol', true);
caso('pele vermelha e olho vermelho', false); // exceção de "verme"
caso('vermes intestinais', true);             // "vermes" continua bloqueado
caso('crise focal com paresia no braço direito', false);
caso('Cristo Redentor', false);               // não é prefixo de "cisto"
caso('mora no sítio e cria porcos', false);   // decisão D4 do roteiro

console.log('Fronteira da Revelação');
const cenas = [
  { id: 'menu-1', tipo: 'menu', legenda: 'Qual conduta?', opcoes: [{ rotulo: 'Tratar com praziquantel' }] },
  { id: 'revelacao', tipo: 'revelacao', legenda: 'Neurocisticercose' },
  { id: 'virada', tipo: 'expositiva', legenda: 'Fases do cisto' },
];
const achados = checarCenas(cenas, verificar);
const ok1 = achados.length === 1 && achados[0].cena === 'menu-1' && achados[0].campo === 'opcoes[0].rotulo';
console.log(`${ok1 ? '  ✓' : '  ✗'} só a cena anterior à Revelação é barrada (${achados.map((a) => `${a.cena}›${a.campo}`).join(', ')})`);
if (!ok1) falhas++;
const semRev = checarCenas([{ id: 'x', tipo: 'fala', legendas: [{ quem: 'P', texto: 'tive um cisto' }] }], verificar);
console.log(`${semRev.length === 1 ? '  ✓' : '  ✗'} sem cena de Revelação, todas as cenas são checadas (inclui legendas da fala)`);
if (semRev.length !== 1) falhas++;

console.log(falhas ? `\n${falhas} falha(s).` : '\nSigilo: todos os testes passaram.');
process.exit(falhas ? 1 : 0);
