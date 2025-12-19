import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Secretarias que compõem o CGBIM-BAHIA
 */
export const secretarias = mysqlTable("secretarias", {
  id: int("id").autoincrement().primaryKey(),
  sigla: varchar("sigla", { length: 20 }).notNull().unique(),
  nome: text("nome").notNull(),
  titularNome: text("titularNome"),
  titularEmail: varchar("titularEmail", { length: 320 }),
  titularTelefone: varchar("titularTelefone", { length: 20 }),
  suplenteNome: text("suplenteNome"),
  suplenteEmail: varchar("suplenteEmail", { length: 320 }),
  suplenteTelefone: varchar("suplenteTelefone", { length: 20 }),
  ordem: int("ordem").notNull(), // ordem de exibição
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Secretaria = typeof secretarias.$inferSelect;
export type InsertSecretaria = typeof secretarias.$inferInsert;

/**
 * Reuniões do CGBIM-BAHIA (ordinárias e extraordinárias)
 */
export const reunioes = mysqlTable("reunioes", {
  id: int("id").autoincrement().primaryKey(),
  numero: int("numero").notNull(), // número sequencial da reunião
  data: date("data").notNull(),
  tipo: mysqlEnum("tipo", ["ordinaria", "extraordinaria"]).notNull(),
  local: text("local"),
  modalidade: mysqlEnum("modalidade", ["presencial", "virtual", "hibrida"]).notNull(),
  pauta: text("pauta"),
  ata: text("ata"),
  quorumAtingido: boolean("quorumAtingido").default(false).notNull(),
  totalPresentes: int("totalPresentes").default(0).notNull(),
  totalEsperado: int("totalEsperado").default(11).notNull(),
  taxaPresenca: decimal("taxaPresenca", { precision: 5, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reuniao = typeof reunioes.$inferSelect;
export type InsertReuniao = typeof reunioes.$inferInsert;

/**
 * Registro de presença nas reuniões
 */
export const presencas = mysqlTable("presencas", {
  id: int("id").autoincrement().primaryKey(),
  reuniaoId: int("reuniaoId").notNull(),
  secretariaId: int("secretariaId").notNull(),
  presente: boolean("presente").default(false).notNull(),
  tipoParticipante: mysqlEnum("tipoParticipante", ["titular", "suplente"]).notNull(),
  justificativa: text("justificativa"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Presenca = typeof presencas.$inferSelect;
export type InsertPresenca = typeof presencas.$inferInsert;

/**
 * Ações vinculadas aos objetivos do Decreto BIM-BA
 */
export const acoes = mysqlTable("acoes", {
  id: int("id").autoincrement().primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  responsavelSecretariaId: int("responsavelSecretariaId").notNull(),
  dataInicio: date("dataInicio").notNull(),
  dataPrevista: date("dataPrevista").notNull(),
  dataConclusao: date("dataConclusao"),
  status: mysqlEnum("status", ["planejada", "em_progresso", "concluida", "atrasada", "cancelada"]).default("planejada").notNull(),
  percentualConclusao: int("percentualConclusao").default(0).notNull(),
  prioridade: mysqlEnum("prioridade", ["baixa", "media", "alta", "critica"]).default("media").notNull(),
  objetivoDecreto: varchar("objetivoDecreto", { length: 100 }), // Ex: "Art. 5º, II"
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Acao = typeof acoes.$inferSelect;
export type InsertAcao = typeof acoes.$inferInsert;

/**
 * Capacitações em BIM realizadas
 */
export const capacitacoes = mysqlTable("capacitacoes", {
  id: int("id").autoincrement().primaryKey(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  data: date("data").notNull(),
  local: text("local"),
  modalidade: mysqlEnum("modalidade", ["presencial", "virtual", "hibrida"]).notNull(),
  instrutor: text("instrutor"),
  cargaHoraria: int("cargaHoraria"), // em horas
  participantesEsperados: int("participantesEsperados").default(0).notNull(),
  participantesConfirmados: int("participantesConfirmados").default(0).notNull(),
  participantesPresentes: int("participantesPresentes").default(0).notNull(),
  taxaPresenca: decimal("taxaPresenca", { precision: 5, scale: 2 }).default("0.00").notNull(),
  status: mysqlEnum("status", ["agendada", "realizada", "cancelada"]).default("agendada").notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Capacitacao = typeof capacitacoes.$inferSelect;
export type InsertCapacitacao = typeof capacitacoes.$inferInsert;

/**
 * Participantes de capacitações por secretaria
 */
export const participantesCapacitacao = mysqlTable("participantes_capacitacao", {
  id: int("id").autoincrement().primaryKey(),
  capacitacaoId: int("capacitacaoId").notNull(),
  secretariaId: int("secretariaId").notNull(),
  numeroParticipantes: int("numeroParticipantes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ParticipanteCapacitacao = typeof participantesCapacitacao.$inferSelect;
export type InsertParticipanteCapacitacao = typeof participantesCapacitacao.$inferInsert;

/**
 * Conformidade regulatória - acompanhamento de requisitos do Decreto
 */
export const conformidadeRegulatoria = mysqlTable("conformidade_regulatoria", {
  id: int("id").autoincrement().primaryKey(),
  categoria: mysqlEnum("categoria", ["biblioteca_bim", "cde", "laboratorio_geobim", "normativas", "capacitacao", "parcerias"]).notNull(),
  item: text("item").notNull(),
  descricao: text("descricao"),
  percentualConclusao: int("percentualConclusao").default(0).notNull(),
  status: mysqlEnum("status", ["nao_iniciado", "em_progresso", "concluido"]).default("nao_iniciado").notNull(),
  responsavelSecretariaId: int("responsavelSecretariaId"),
  dataInicio: date("dataInicio"),
  dataPrevista: date("dataPrevista"),
  dataConclusao: date("dataConclusao"),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConformidadeRegulatoria = typeof conformidadeRegulatoria.$inferSelect;
export type InsertConformidadeRegulatoria = typeof conformidadeRegulatoria.$inferInsert;
