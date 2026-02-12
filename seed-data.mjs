import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

// Configuração com SSL obrigatório para o Render PostgreSQL
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { ssl: 'require' }); 
const db = drizzle(client);

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados PostgreSQL (RBIM)...");

  try {
    // 1. Inserir secretarias
    await db.execute(`INSERT INTO secretarias (sigla, nome, ordem, titularNome, titularEmail, suplenteNome, suplenteEmail) VALUES 
      ('SAEB', 'Secretaria de Administração', 1, 'Hemerson Cardoso Guimarães', 'hemerson.guimaraes@saeb.ba.gov.br', 'Marcia Hlavnicka', 'marcia.hlavnicka@saeb.ba.gov.br'),
      ('CASA CIVIL', 'Casa Civil', 2, 'Armindo Miranda', 'armindo.miranda@casacivil.ba.gov.br', 'Cézar Wagner Vianna da Silva', 'cezar.silva@casacivil.ba.gov.br'),
      ('SEFAZ', 'Secretaria da Fazenda', 3, 'Hélio Oliveira Junior', NULL, 'Ana Silva Simões Vasconcelos', 'asvasconcelos@sefaz.ba.gov.br'),
      ('SEINFRA', 'Secretaria de Infraestrutura', 4, 'Maria Virgínia Lomanto Carneiro', 'm.virginia@infra.ba.gov.br', 'Beatriz Santana Bastos', 'beatriz.bastos@infra.ba.gov.br'),
      ('SEDUR', 'Secretaria de Desenvolvimento Urbano', 5, 'Robson Wilson da Silva Junior', 'robson.junior@sedur.ba.gov.br', 'Cristianderson Luna Lima', 'cristianderson.luna@sedur.ba.gov.br'),
      ('SEPLAN', 'Secretaria de Planejamento', 6, 'Valnei Damasceno de Almeida', 'valnei.almeida@seplan.ba.gov.br', 'Ricardo Lorenzo', 'ricardo.lorenzo@seplan.ba.gov.br'),
      ('SSP', 'Secretaria de Segurança Pública', 7, 'Adriano Freitas Santos', 'adriano.freitas@ssp.ba.gov.br', 'Luiz Hippolyto Correia', 'luiz.hippolyto@ssp.ba.gov.br'),
      ('SEC', 'Secretaria de Educação', 8, 'Tiago Alcântara', 'tiago.alcantara@educacao.ba.gov.br', 'Luan Pereira da Silva', 'luan.silva@educacao.ba.gov.br'),
      ('SESAB', 'Secretaria de Saúde', 9, 'Silvia Maria Pereira de Melo', 'silvia.melo1@saude.ba.gov.br', 'Lucas Leonardo Mucarzel Rosa', 'lucas.rosa@saude.ba.gov.br'),
      ('SEAP', 'Secretaria de Administração Penitenciária', 10, 'Lucas Nogueira dos Santos', 'lucas.santos@seap.ba.gov.br', 'Bernardo Conduru de Aquino Simões', NULL),
      ('SIHS', 'Secretaria de Infraestrutura Hídrica e Saneamento', 11, 'Karla de Parracho e Melo', NULL, 'Renan Garrido Bitencourt', NULL)
    `);
    console.log("✅ Secretarias inseridas");

    // 2. Inserir primeira reunião
    await db.execute(`INSERT INTO reunioes (numero, data, tipo, local, modalidade, pauta, quorumAtingido, totalPresentes, totalEsperado, taxaPresenca) VALUES 
      (1, '2025-01-15', 'ordinaria', 'Salvador - BA', 'presencial', 'Instalação do CGBIM-BAHIA e apresentação da Estratégia BIM-BA', 1, 10, 11, 90.91)
    `);
    console.log("✅ Primeira reunião inserida");

    // 3. Inserir presenças
    await db.execute(`INSERT INTO presencas (reuniaoId, secretariaId, presente, tipoParticipante) VALUES 
      (1, 1, 1, 'titular'), (1, 2, 1, 'titular'), (1, 3, 0, 'titular'), (1, 4, 1, 'titular'),
      (1, 5, 1, 'titular'), (1, 6, 1, 'titular'), (1, 7, 1, 'titular'), (1, 8, 1, 'titular'),
      (1, 9, 1, 'titular'), (1, 10, 1, 'titular'), (1, 11, 1, 'titular')
    `);
    console.log("✅ Presenças inseridas");

    // 4. Inserir capacitações
    await db.execute(`INSERT INTO capacitacoes (titulo, descricao, data, local, modalidade, instrutor, cargaHoraria, participantesEsperados, participantesConfirmados, participantesPresentes, taxaPresenca, status) VALUES 
      ('Introdução ao BIM - Conceitos Fundamentais', 'Capacitação básica sobre Building Information Modeling para servidores estaduais', '2025-02-20', 'Salvador - BA', 'presencial', 'Especialista Externo', 8, 50, 45, 42, 93.33, 'realizada')
    `);
    console.log("✅ Capacitações inseridas");

    console.log("🎉 Seed concluído com sucesso para o Painel CG BIM-BA!");
  } catch (error) {
    console.error("❌ Erro ao inserir dados no PostgreSQL:", error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

seed();
