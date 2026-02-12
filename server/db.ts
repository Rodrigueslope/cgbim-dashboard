import { eq, desc, and, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js"; // Trocado de mysql2 para postgres-js
import postgres from "postgres"; // Driver do PostgreSQL
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
  materiaisApoio,
  type Secretaria,
  type Reuniao,
  type Presenca,
  type Acao,
  type Capacitacao,
  type ConformidadeRegulatoria,
  type InsertMaterialApoio
} from "../drizzle/schema";

// Configuração da conexão com SSL obrigatório para o Render
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const client = postgres(connectionString, { ssl: 'require' });
export const db = drizzle(client);

// ===== Funções Adaptadas para PostgreSQL =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) return;
  
  // No PostgreSQL usamos onConflictDoUpdate em vez de onDuplicateKeyUpdate
  await db.insert(users).values(user).onConflictDoUpdate({
    target: users.openId,
    set: {
      name: user.name,
      email: user.email,
      lastSignedIn: new Date(),
      role: user.role
    }
  });
}

export async function getUserByOpenId(openId: string) {
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Secretarias =====
export async function getAllSecretarias(): Promise<Secretaria[]> {
  return db.select().from(secretarias).orderBy(secretarias.ordem);
}

// ===== Reuniões =====
export async function createReuniao(data: typeof reunioes.$inferInsert): Promise<number> {
  // No Postgres usamos .returning() para pegar o ID inserido
  const result = await db.insert(reunioes).values(data).returning({ id: reunioes.id });
  return result[0].id;
}

export async function getAllReunioes(): Promise<Reuniao[]> {
  return db.select().from(reunioes).orderBy(desc(reunioes.data));
}

export async function registerPresencas(
  reuniaoId: number,
  presencasData: Array<{ secretariaId: number; presente: boolean; tipoParticipante: 'titular' | 'suplente' }>
): Promise<void> {
  await db.delete(presencas).where(eq(presencas.reuniaoId, reuniaoId));
  
  if (presencasData.length > 0) {
    await db.insert(presencas).values(
      presencasData.map((p) => ({
        reuniaoId,
        secretariaId: p.secretariaId,
        presente: p.presente ? 1 : 0, // Ajuste para garantir 1/0 se o schema for int
        tipoParticipante: p.tipoParticipante,
      }))
    );
  }
  
  const totalPresentes = presencasData.filter((p) => p.presente).length;
  const taxa = ((totalPresentes / 11) * 100).toFixed(2);
  
  await db.update(reunioes).set({
    totalPresentes,
    taxaPresenca: taxa,
    quorumAtingido: totalPresentes >= 6 ? 1 : 0,
  }).where(eq(reunioes.id, reuniaoId));
}

// ===== Outras funções mantêm a lógica similar =====
export async function getAllAcoes(): Promise<Acao[]> {
  return db.select().from(acoes).orderBy(desc(acoes.dataPrevista));
}

export async function getKPIs() {
  const reunioesData = await db.select().from(reunioes);
  const taxaPresencaGeral = reunioesData.length > 0 
    ? reunioesData.reduce((acc, r) => acc + Number(r.taxaPresenca), 0) / reunioesData.length 
    : 0;

  const acoesEm = await db.select().from(acoes).where(eq(acoes.status, 'em_progresso'));
  const caps = await db.select().from(capacitacoes).where(eq(capacitacoes.status, 'realizada'));

  return {
    taxaPresencaGeral: Number(taxaPresencaGeral.toFixed(2)),
    acoesEmAndamento: acoesEm.length,
    capacitacoesRealizadas: caps.length,
    statusGeralEstrategia: 18, // Valor estático para teste igual ao Manus
  };
}

// Funções de Materiais de Apoio
export async function getAllMateriaisApoio() {
  return await db.select().from(materiaisApoio).orderBy(desc(materiaisApoio.createdAt));
}
