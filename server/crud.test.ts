import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("CRUD Operations", () => {
  describe("reunioes.create", () => {
    it("cria uma nova reunião com dados válidos", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reunioes.create({
        numero: 99,
        data: "2025-12-31",
        tipo: "ordinaria",
        local: "Sala de Testes",
        modalidade: "presencial",
        pauta: "Teste de criação de reunião",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });
  });

  describe("acoes.create", () => {
    it("cria uma nova ação com dados válidos", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.acoes.create({
        titulo: "Ação de Teste",
        descricao: "Descrição da ação de teste",
        responsavelSecretariaId: 1,
        dataInicio: "2025-01-01",
        dataPrevista: "2025-12-31",
        status: "planejada",
        percentualConclusao: 0,
        prioridade: "media",
        objetivoDecreto: "Teste",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });
  });

  describe("acoes.update", () => {
    it("atualiza o status de uma ação existente", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Primeiro cria uma ação
      const created = await caller.acoes.create({
        titulo: "Ação para Atualizar",
        responsavelSecretariaId: 1,
        dataInicio: "2025-01-01",
        dataPrevista: "2025-12-31",
      });

      // Depois atualiza
      const result = await caller.acoes.update({
        id: created.id,
        status: "em_progresso",
        percentualConclusao: 50,
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("capacitacoes.create", () => {
    it("cria uma nova capacitação com dados válidos", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.capacitacoes.create({
        titulo: "Capacitação de Teste",
        descricao: "Descrição da capacitação",
        data: "2025-06-15",
        local: "Auditório Teste",
        modalidade: "presencial",
        instrutor: "Instrutor Teste",
        cargaHoraria: 8,
        participantesEsperados: 30,
        status: "agendada",
      });

      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });
  });

  describe("presencas.create", () => {
    it("registra presença em uma reunião", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Primeiro cria uma reunião
      const reuniao = await caller.reunioes.create({
        numero: 98,
        data: "2025-12-30",
        tipo: "ordinaria",
        modalidade: "presencial",
      });

      // Depois registra presença
      const result = await caller.presencas.create({
        reuniaoId: reuniao.id,
        secretariaId: 1,
        presente: true,
        tipoParticipante: "titular",
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("acoes.list", () => {
    it("lista todas as ações cadastradas", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.acoes.list();

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("titulo");
        expect(result[0]).toHaveProperty("status");
      }
    });
  });

  describe("capacitacoes.list", () => {
    it("lista todas as capacitações cadastradas", async () => {
      const ctx = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.capacitacoes.list();

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("titulo");
        expect(result[0]).toHaveProperty("status");
      }
    });
  });
});
