import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("reunioes CRUD operations", () => {
  it("should list all reunioes", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reunioes.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should get reuniao by id", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const reunioes = await caller.reunioes.list();
    const firstReuniao = reunioes[0];

    if (firstReuniao) {
      const result = await caller.reunioes.getById({ id: firstReuniao.id });
      expect(result).toBeDefined();
      expect(result?.id).toBe(firstReuniao.id);
    }
  });

  it("should create a new reuniao", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const newReuniao = {
      numero: 999,
      data: "2025-12-31",
      tipo: "extraordinaria" as const,
      local: "Teste Local",
      modalidade: "virtual" as const,
      pauta: "Teste de criação de reunião",
    };

    const result = await caller.reunioes.create(newReuniao);

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("number");
  });

  it("should update an existing reuniao", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const reunioes = await caller.reunioes.list();
    const firstReuniao = reunioes[0];

    if (firstReuniao) {
      const result = await caller.reunioes.update({
        id: firstReuniao.id,
        pauta: "Pauta atualizada por teste",
      });

      expect(result.success).toBe(true);
    }
  });

  it("should delete a reuniao", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Criar uma reunião de teste para deletar
    const created = await caller.reunioes.create({
      numero: 9999,
      data: "2099-12-31",
      tipo: "extraordinaria",
      local: "Teste Delete",
      modalidade: "virtual",
      pauta: "Reunião para teste de exclusão",
    });

    // Deletar a reunião criada
    const result = await caller.reunioes.delete({ id: created.id });

    expect(result.success).toBe(true);

    // Verificar que foi deletada
    const deleted = await caller.reunioes.getById({ id: created.id });
    expect(deleted).toBeUndefined();
  });
});
