import { drizzle } from "drizzle-orm/mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Inserir secretarias
  const secretariasData = [
    { sigla: "SAEB", nome: "Secretaria de Administração", ordem: 1, titularNome: "Hemerson Cardoso Guimarães", titularEmail: "hemerson.guimaraes@saeb.ba.gov.br", suplenteNome: "Marcia Hlavnicka", suplenteEmail: "marcia.hlavnicka@saeb.ba.gov.br" },
    { sigla: "CASA CIVIL", nome: "Casa Civil", ordem: 2, titularNome: "Armindo Miranda", titularEmail: "armindo.miranda@casacivil.ba.gov.br", suplenteNome: "Cézar Wagner Vianna da Silva", suplenteEmail: "cezar.silva@casacivil.ba.gov.br" },
    { sigla: "SEFAZ", nome: "Secretaria da Fazenda", ordem: 3, titularNome: "Hélio Oliveira Junior", titularEmail: null, suplenteNome: "Ana Silva Simões Vasconcelos", suplenteEmail: "asvasconcelos@sefaz.ba.gov.br" },
    { sigla: "SEINFRA", nome: "Secretaria de Infraestrutura", ordem: 4, titularNome: "Maria Virgínia Lomanto Carneiro", titularEmail: "m.virginia@infra.ba.gov.br", suplenteNome: "Beatriz Santana Bastos", suplenteEmail: "beatriz.bastos@infra.ba.gov.br" },
    { sigla: "SEDUR", nome: "Secretaria de Desenvolvimento Urbano", ordem: 5, titularNome: "Robson Wilson da Silva Junior", titularEmail: "robson.junior@sedur.ba.gov.br", suplenteNome: "Cristianderson Luna Lima", suplenteEmail: "cristianderson.luna@sedur.ba.gov.br" },
    { sigla: "SEPLAN", nome: "Secretaria de Planejamento", ordem: 6, titularNome: "Valnei Damasceno de Almeida", titularEmail: "valnei.almeida@seplan.ba.gov.br", suplenteNome: "Ricardo Lorenzo", suplenteEmail: "ricardo.lorenzo@seplan.ba.gov.br" },
    { sigla: "SSP", nome: "Secretaria de Segurança Pública", ordem: 7, titularNome: "Adriano Freitas Santos", titularEmail: "adriano.freitas@ssp.ba.gov.br", suplenteNome: "Luiz Hippolyto Correia", suplenteEmail: "luiz.hippolyto@ssp.ba.gov.br" },
    { sigla: "SEC", nome: "Secretaria de Educação", ordem: 8, titularNome: "Tiago Alcântara", titularEmail: "tiago.alcantara@educacao.ba.gov.br", suplenteNome: "Luan Pereira da Silva", suplenteEmail: "luan.silva@educacao.ba.gov.br" },
    { sigla: "SESAB", nome: "Secretaria de Saúde", ordem: 9, titularNome: "Silvia Maria Pereira de Melo", titularEmail: "silvia.melo1@saude.ba.gov.br", suplenteNome: "Lucas Leonardo Mucarzel Rosa", suplenteEmail: "lucas.rosa@saude.ba.gov.br" },
    { sigla: "SEAP", nome: "Secretaria de Administração Penitenciária", ordem: 10, titularNome: "Lucas Nogueira dos Santos", titularEmail: "lucas.santos@seap.ba.gov.br", suplenteNome: "Bernardo Conduru de Aquino Simões", suplenteEmail: null },
    { sigla: "SIHS", nome: "Secretaria de Infraestrutura Hídrica e Saneamento", ordem: 11, titularNome: "Karla de Parracho e Melo", titularEmail: null, suplenteNome: "Renan Garrido Bitencourt", suplenteEmail: null },
  ];

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

  // Inserir primeira reunião
  await db.execute(`INSERT INTO reunioes (numero, data, tipo, local, modalidade, pauta, quorumAtingido, totalPresentes, totalEsperado, taxaPresenca) VALUES 
    (1, '2025-01-15', 'ordinaria', 'Salvador - BA', 'presencial', 'Instalação do CGBIM-BAHIA e apresentação da Estratégia BIM-BA', 1, 10, 11, 90.91)
  `);
  console.log("✅ Primeira reunião inserida");

  // Inserir presenças da primeira reunião
  await db.execute(`INSERT INTO presencas (reuniaoId, secretariaId, presente, tipoParticipante) VALUES 
    (1, 1, 1, 'titular'),
    (1, 2, 1, 'titular'),
    (1, 3, 0, 'titular'),
    (1, 4, 1, 'titular'),
    (1, 5, 1, 'titular'),
    (1, 6, 1, 'titular'),
    (1, 7, 1, 'titular'),
    (1, 8, 1, 'titular'),
    (1, 9, 1, 'titular'),
    (1, 10, 1, 'titular'),
    (1, 11, 1, 'titular')
  `);
  console.log("✅ Presenças da primeira reunião inseridas");

  // Inserir ações iniciais
  await db.execute(`INSERT INTO acoes (titulo, descricao, responsavelSecretariaId, dataInicio, dataPrevista, status, percentualConclusao, prioridade, objetivoDecreto) VALUES 
    ('Elaborar Plano de Trabalho Anual 2025', 'Definir objetivos estratégicos, metas e cronograma para implementação da Estratégia BIM-BA', 1, '2025-01-15', '2025-03-31', 'em_progresso', 50, 'alta', 'Art. 5º, II'),
    ('Criar Biblioteca Estadual BIM', 'Desenvolver e implementar biblioteca de objetos BIM para uso nos projetos estaduais', 4, '2025-02-01', '2025-12-31', 'planejada', 0, 'alta', 'Art. 2º, VI'),
    ('Implementar Ambiente Comum de Dados (CDE)', 'Estruturar plataforma para compartilhamento de informações BIM entre órgãos', 1, '2025-03-01', '2025-09-30', 'planejada', 0, 'critica', 'Art. 5º, V'),
    ('Elaborar Instruções Normativas BIM', 'Criar manuais e protocolos para adoção do BIM nos órgãos estaduais', 1, '2025-02-15', '2025-06-30', 'em_progresso', 25, 'alta', 'Art. 5º, III')
  `);
  console.log("✅ Ações iniciais inseridas");

  // Inserir capacitações
  await db.execute(`INSERT INTO capacitacoes (titulo, descricao, data, local, modalidade, instrutor, cargaHoraria, participantesEsperados, participantesConfirmados, participantesPresentes, taxaPresenca, status) VALUES 
    ('Introdução ao BIM - Conceitos Fundamentais', 'Capacitação básica sobre Building Information Modeling para servidores estaduais', '2025-02-20', 'Salvador - BA', 'presencial', 'Especialista Externo', 8, 50, 45, 42, 93.33, 'realizada'),
    ('BIM para Gestores Públicos', 'Treinamento focado em gestão de projetos BIM no setor público', '2025-03-15', 'Online', 'virtual', 'Consultor BIM', 16, 30, 28, 0, 0, 'agendada'),
    ('Ferramentas BIM - Revit Básico', 'Curso prático de modelagem BIM utilizando Autodesk Revit', '2025-04-10', 'Salvador - BA', 'presencial', 'Instrutor Certificado', 40, 25, 0, 0, 0, 'agendada')
  `);
  console.log("✅ Capacitações inseridas");

  // Inserir itens de conformidade regulatória
  await db.execute(`INSERT INTO conformidade_regulatoria (categoria, item, descricao, percentualConclusao, status, responsavelSecretariaId) VALUES 
    ('biblioteca_bim', 'Biblioteca Estadual BIM', 'Desenvolvimento da biblioteca de objetos BIM para projetos estaduais', 15, 'em_progresso', 4),
    ('cde', 'Ambiente Comum de Dados (CDE)', 'Implementação de plataforma para compartilhamento colaborativo de modelos BIM', 10, 'em_progresso', 1),
    ('laboratorio_geobim', 'Laboratório GeoBIM', 'Estruturação de espaço para desenvolvimento de projetos com BIM e geoprocessamento', 5, 'em_progresso', 1),
    ('normativas', 'Instruções Normativas BIM', 'Elaboração de normas, manuais e protocolos BIM para órgãos estaduais', 30, 'em_progresso', 1),
    ('capacitacao', 'Programa de Capacitação BIM', 'Realização de treinamentos e formação de multiplicadores', 20, 'em_progresso', 1),
    ('parcerias', 'Parcerias e Cooperações Técnicas', 'Estabelecimento de parcerias com entidades públicas e privadas', 25, 'em_progresso', 1)
  `);
  console.log("✅ Itens de conformidade regulatória inseridos");

  console.log("🎉 Seed concluído com sucesso!");
}

seed().catch(console.error).finally(() => process.exit(0));
