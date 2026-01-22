import { eq, desc, and, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  secretarias, 
  reunioes, 
  presencas, 
  acoes, 
  capacitacoes, 
  participantesCapacitacao,
  conformidadeRegulatoria,
  type Secretaria,
  type Reuniao,
  type Presenca,
  type Acao,
  type Capacitacao,
  type ConformidadeRegulatoria
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Secretarias =====
export async function getAllSecretarias(): Promise<Secretaria[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(secretarias).orderBy(secretarias.ordem);
}

export async function getSecretariaById(id: number): Promise<Secretaria | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(secretarias).where(eq(secretarias.id, id)).limit(1);
  return result[0];
}

// ===== Reuniões =====
export async function getAllReunioes(): Promise<Reuniao[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reunioes).orderBy(desc(reunioes.data));
}

export async function getReuniaoById(id: number): Promise<Reuniao | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reunioes).where(eq(reunioes.id, id)).limit(1);
  return result[0];
}

export async function createReuniao(data: typeof reunioes.$inferInsert): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reunioes).values(data);
  return Number(result[0].insertId);
}

export async function updateReuniao(id: number, data: Partial<typeof reunioes.$inferInsert>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(reunioes).set(data).where(eq(reunioes.id, id));
}

// ===== Presenças =====
export async function getPresencasByReuniaoId(reuniaoId: number): Promise<Presenca[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(presencas).where(eq(presencas.reuniaoId, reuniaoId));
}

export async function createPresenca(data: typeof presencas.$inferInsert): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(presencas).values(data);
}

export async function updatePresenca(id: number, data: Partial<typeof presencas.$inferInsert>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(presencas).set(data).where(eq(presencas.id, id));
}

export async function registerPresencas(
  reuniaoId: number,
  presencasData: Array<{ secretariaId: number; presente: boolean; tipoParticipante: 'titular' | 'suplente' }>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Deletar presenças existentes desta reunião
  await db.delete(presencas).where(eq(presencas.reuniaoId, reuniaoId));
  
  // Inserir novas presenças
  if (presencasData.length > 0) {
    await db.insert(presencas).values(
      presencasData.map((p) => ({
        reuniaoId,
        secretariaId: p.secretariaId,
        presente: p.presente,
        tipoParticipante: p.tipoParticipante,
      }))
    );
  }
  
  // Recalcular estatísticas da reunião
  const totalEsperado = 11; // 11 secretarias
  const totalPresentes = presencasData.filter((p) => p.presente).length;
  const taxaPresenca = ((totalPresentes / totalEsperado) * 100).toFixed(2);
  const quorumAtingido = totalPresentes >= Math.ceil(totalEsperado / 2);
  
  await db.update(reunioes).set({
    totalEsperado,
    totalPresentes,
    taxaPresenca,
    quorumAtingido,
  }).where(eq(reunioes.id, reuniaoId));
}

// ===== Ações =====
export async function getAllAcoes(): Promise<Acao[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(acoes).orderBy(desc(acoes.dataPrevista));
}

export async function getAcaoById(id: number): Promise<Acao | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(acoes).where(eq(acoes.id, id)).limit(1);
  return result[0];
}

export async function createAcao(data: typeof acoes.$inferInsert): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(acoes).values(data);
  return Number(result[0].insertId);
}

export async function updateAcao(id: number, data: Partial<typeof acoes.$inferInsert>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(acoes).set(data).where(eq(acoes.id, id));
}

export async function deleteAcao(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(acoes).where(eq(acoes.id, id));
}

// ===== Capacitações =====
export async function getAllCapacitacoes(): Promise<Capacitacao[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(capacitacoes).orderBy(desc(capacitacoes.data));
}

export async function getCapacitacaoById(id: number): Promise<Capacitacao | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(capacitacoes).where(eq(capacitacoes.id, id)).limit(1);
  return result[0];
}

export async function createCapacitacao(data: typeof capacitacoes.$inferInsert): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(capacitacoes).values(data);
  return Number(result[0].insertId);
}

export async function updateCapacitacao(id: number, data: Partial<typeof capacitacoes.$inferInsert>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(capacitacoes).set(data).where(eq(capacitacoes.id, id));
}

export async function deleteCapacitacao(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(capacitacoes).where(eq(capacitacoes.id, id));
}

// ===== Conformidade Regulatória =====
export async function getAllConformidade(): Promise<ConformidadeRegulatoria[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(conformidadeRegulatoria);
}

export async function getConformidadeById(id: number): Promise<ConformidadeRegulatoria | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(conformidadeRegulatoria).where(eq(conformidadeRegulatoria.id, id)).limit(1);
  return result[0];
}

export async function updateConformidade(id: number, data: Partial<typeof conformidadeRegulatoria.$inferInsert>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(conformidadeRegulatoria).set(data).where(eq(conformidadeRegulatoria.id, id));
}

// ===== KPIs e Estatísticas =====
export async function getKPIs() {
  const db = await getDb();
  if (!db) return null;

  // Taxa de presença geral (média de todas as reuniões)
  const reunioesData = await db.select().from(reunioes);
  const taxaPresencaGeral = reunioesData.length > 0 
    ? reunioesData.reduce((acc, r) => acc + Number(r.taxaPresenca), 0) / reunioesData.length 
    : 0;

  // Total de ações em andamento
  const acoesEmAndamento = await db.select({ count: sql<number>`count(*)` })
    .from(acoes)
    .where(eq(acoes.status, 'em_progresso'));

  // Capacitações realizadas
  const capacitacoesRealizadas = await db.select({ count: sql<number>`count(*)` })
    .from(capacitacoes)
    .where(eq(capacitacoes.status, 'realizada'));

  // Status geral da estratégia (média de conformidade)
  const conformidadeData = await db.select().from(conformidadeRegulatoria);
  const statusGeralEstrategia = conformidadeData.length > 0
    ? conformidadeData.reduce((acc, c) => acc + c.percentualConclusao, 0) / conformidadeData.length
    : 0;

  return {
    taxaPresencaGeral: Number(taxaPresencaGeral.toFixed(2)),
    acoesEmAndamento: Number(acoesEmAndamento[0]?.count || 0),
    capacitacoesRealizadas: Number(capacitacoesRealizadas[0]?.count || 0),
    statusGeralEstrategia: Number(statusGeralEstrategia.toFixed(2)),
  };
}

export async function getFrequenciaData() {
  const db = await getDb();
  if (!db) return null;

  // Presença por secretaria (todas as reuniões)
  const presencaPorSecretaria = await db
    .select({
      secretariaId: presencas.secretariaId,
      totalPresencas: sql<number>`count(case when ${presencas.presente} = 1 then 1 end)`,
      totalReunioes: sql<number>`count(*)`,
    })
    .from(presencas)
    .groupBy(presencas.secretariaId);

  // Evolução temporal da taxa de presença
  const evolucaoPresenca = await db
    .select({
      data: reunioes.data,
      taxaPresenca: reunioes.taxaPresenca,
    })
    .from(reunioes)
    .orderBy(reunioes.data);

  return {
    presencaPorSecretaria,
    evolucaoPresenca,
  };
}
