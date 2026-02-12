import { eq, desc, and, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  InsertUser, users, secretarias, reunioes, presencas, acoes, 
  capacitacoes, participantesCapacitacao, conformidadeRegulatoria,
  materiaisApoio, type Secretaria, type Reuniao, type Presenca, 
  type Acao, type Capacitacao, type ConformidadeRegulatoria, type InsertMaterialApoio
} from "../drizzle/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

const client = postgres(connectionString, { ssl: 'require' });
export const db = drizzle(client);

// ===== Funções de Usuário =====
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) return;
  await db.insert(users).values(user).onConflictDoUpdate({
    target: users.openId,
    set: { name: user.name, email: user.email, lastSignedIn: new Date(), role: user.role }
  });
}
export async function getUserByOpenId(openId: string) {
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

// ===== Secretarias (ESSENCIAL PARA OS GRÁFICOS) =====
export async function getAllSecretarias(): Promise<Secretaria[]> {
  return db.select().from(secretarias).orderBy(secretarias.ordem);
}
export async function getSecretariaById(id: number) {
  const result = await db.select().from(secretarias).where(eq(secretarias.id, id)).limit(1);
  return result[0];
}

// ===== Reuniões =====
export async function getAllReunioes(): Promise<Reuniao[]> {
  return db.select().from(reunioes).orderBy(desc(reunioes.data));
}
export async function getReuniaoById(id: number) {
  const result = await db.select().from(reunioes).where(eq(reunioes.id, id)).limit(1);
  return result[0];
}
export async function createReuniao(data: any): Promise<number> {
  const result = await db.insert(reunioes).values(data).returning({ id: reunioes.id });
  return result[0].id;
}
export async function updateReuniao(id: number, data: any) {
  await db.update(reunioes).set(data).where(eq(reunioes.id, id));
}
export async function deleteReuniao(id: number) {
  await db.delete(presencas).where(eq(presencas.reuniaoId, id));
  await db.delete(reunioes).where(eq(reunioes.id, id));
}

// ===== Presenças =====
export async function createPresenca(data: any) { await db.insert(presencas).values(data); }
export async function updatePresenca(id: number, data: any) { await db.update(presencas).set(data).where(eq(presencas.id, id)); }
export async function getPresencasByReuniaoId(reuniaoId: number) {
  return db.select().from(presencas).where(eq(presencas.reuniaoId, reuniaoId));
}
export async function registerPresencas(reuniaoId: number, data: any[]) {
  await db.delete(presencas).where(eq(presencas.reuniaoId, reuniaoId));
  if (data.length > 0) { await db.insert(presencas).values(data.map(p => ({ ...p, reuniaoId }))); }
}

// ===== Ações =====
export async function getAllAcoes(): Promise<Acao[]> {
  return db.select().from(acoes).orderBy(desc(acoes.dataPrevista));
}
export async function getAcaoById(id: number) {
  const result = await db.select().from(acoes).where(eq(acoes.id, id)).limit(1);
  return result[0];
}
export async function createAcao(data: any) {
  const result = await db.insert(acoes).values(data).returning({ id: acoes.id });
  return result[0].id;
}
export async function updateAcao(id: number, data: any) { await db.update(acoes).set(data).where(eq(acoes.id, id)); }
export async function deleteAcao(id: number) { await db.delete(acoes).where(eq(acoes.id, id)); }

// ===== Capacitações =====
export async function getAllCapacitacoes(): Promise<Capacitacao[]> {
  return db.select().from(capacitacoes).orderBy(desc(capacitacoes.data));
}
export async function getCapacitacaoById(id: number) {
  const result = await db.select().from(capacitacoes).where(eq(capacitacoes.id, id)).limit(1);
  return result[0];
}
export async function createCapacitacao(data: any) {
  const result = await db.insert(capacitacoes).values(data).returning({ id: capacitacoes.id });
  return result[0].id;
}
export async function updateCapacitacao(id: number, data: any) { await db.update(capacitacoes).set(data).where(eq(capacitacoes.id, id)); }
export async function deleteCapacitacao(id: number) { await db.delete(capacitacoes).where(eq(capacitacoes.id, id)); }

// ===== Conformidade e Materiais =====
export async function getAllConformidade() { return db.select().from(conformidadeRegulatoria); }
export async function getConformidadeById(id: number) {
  const result = await db.select().from(conformidadeRegulatoria).where(eq(conformidadeRegulatoria.id, id)).limit(1);
  return result[0];
}
export async function updateConformidade(id: number, data: any) { await db.update(conformidadeRegulatoria).set(data).where(eq(conformidadeRegulatoria.id, id)); }
export async function getMateriaisByReuniao(reuniaoId: number) {
  return db.select().from(materiaisApoio).where(eq(materiaisApoio.reuniaoId, reuniaoId)).orderBy(desc(materiaisApoio.createdAt));
}
export async function getAllMateriaisApoio() { return db.select().from(materiaisApoio).orderBy(desc(materiaisApoio.createdAt)); }
export async function createMaterialApoio(data: InsertMaterialApoio) { return db.insert(materiaisApoio).values(data).returning(); }
export async function deleteMaterialApoio(id: number) { await db.delete(materiaisApoio).where(eq(materiaisApoio.id, id)); }

// ===== KPIs e Estatísticas =====
export async function getKPIs() {
  const re = await db.select().from(reunioes);
  const ac = await db.select().from(acoes).where(eq(acoes.status, 'em_progresso'));
  const ca = await db.select().from(capacitacoes).where(eq(capacitacoes.status, 'realizada'));
  const co = await db.select().from(conformidadeRegulatoria);
  return {
    taxaPresencaGeral: re.length > 0 ? re.reduce((a, b) => a + Number(b.taxaPresenca), 0) / re.length : 0,
    acoesEmAndamento: ac.length,
    capacitacoesRealizadas: ca.length,
    statusGeralEstrategia: co.length > 0 ? co.reduce((a, b) => a + (b.percentualConclusao || 0), 0) / co.length : 0,
  };
}
export async function getFrequenciaData() {
  const evolucao = await db.select({ data: reunioes.data, taxaPresenca: reunioes.taxaPresenca }).from(reunioes).orderBy(reunioes.data);
  return { presencaPorSecretaria: [], evolucaoPresenca: evolucao };
}}
