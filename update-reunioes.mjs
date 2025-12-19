import { drizzle } from 'drizzle-orm/mysql2';
import { reunioes, presencas } from './drizzle/schema.js';

const db = drizzle(process.env.DATABASE_URL);

async function updateReunioes() {
  console.log('Limpando dados antigos de reunioes e presencas...');
  
  await db.delete(presencas);
  await db.delete(reunioes);
  
  console.log('Dados antigos removidos');
  
  console.log('Criando reunioes corretas...');
  
  const [reuniao1] = await db.insert(reunioes).values({
    numero: 1,
    data: new Date('2024-11-15'),
    tipo: 'ordinaria',
    local: 'Sede SEINFRA - Salvador/BA',
    modalidade: 'presencial',
    pauta: 'Primeira reuniao ordinaria do CGBIM-BAHIA. Apresentacao do comite, discussao dos objetivos do Decreto BIM-BA e planejamento das acoes iniciais.',
    totalEsperado: 11,
    totalPresentes: 11,
    taxaPresenca: '100.00',
    quorumAtingido: true,
    ata: 'Reuniao realizada com presenca de todas as 11 secretarias (titulares). Quorum completo atingido.'
  });
  
  console.log('1a Reuniao criada (Novembro/2024)');
  
  const secretariasIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  
  for (const secId of secretariasIds) {
    await db.insert(presencas).values({
      reuniaoId: reuniao1.insertId,
      secretariaId: secId,
      presente: true,
      tipoParticipante: 'titular'
    });
  }
  
  console.log('Presencas da 1a reuniao registradas (11/11 titulares presentes)');
  
  const [reuniao2] = await db.insert(reunioes).values({
    numero: 2,
    data: new Date('2024-12-19'),
    tipo: 'ordinaria',
    local: 'A definir',
    modalidade: 'hibrida',
    pauta: 'Segunda reuniao ordinaria do CGBIM-BAHIA. Acompanhamento das acoes em andamento e planejamento para 2025.',
    totalEsperado: 11,
    totalPresentes: 0,
    taxaPresenca: '0.00',
    quorumAtingido: false,
    ata: 'Reuniao em andamento.'
  });
  
  console.log('2a Reuniao criada (19/12/2024 - Hoje)');
  
  const [reuniao3] = await db.insert(reunioes).values({
    numero: 3,
    data: new Date('2025-01-30'),
    tipo: 'ordinaria',
    local: 'A definir',
    modalidade: 'hibrida',
    pauta: 'Terceira reuniao ordinaria do CGBIM-BAHIA. Planejamento estrategico para o primeiro semestre de 2025.',
    totalEsperado: 11,
    totalPresentes: 0,
    taxaPresenca: '0.00',
    quorumAtingido: false,
    ata: 'Reuniao agendada.'
  });
  
  console.log('3a Reuniao criada (Janeiro/2025 - Agendada)');
  
  console.log('Atualizacao concluida com sucesso!');
  console.log('Resumo:');
  console.log('- 1a Reuniao: Novembro/2024 (100% presenca - 11/11)');
  console.log('- 2a Reuniao: 19/12/2024 (em andamento)');
  console.log('- 3a Reuniao: Janeiro/2025 (agendada)');
  
  process.exit(0);
}

updateReunioes().catch((error) => {
  console.error('Erro ao atualizar reunioes:', error);
  process.exit(1);
});
