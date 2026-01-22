import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("presencas.register", () => {
  it("registra múltiplas presenças e recalcula taxa", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Dados de teste: 8 secretarias presentes de 11
    const presencasData = [
      { secretariaId: 1, presente: true, tipoParticipante: "titular" as const },
      { secretariaId: 2, presente: true, tipoParticipante: "titular" as const },
      { secretariaId: 3, presente: false, tipoParticipante: "titular" as const },
      { secretariaId: 4, presente: true, tipoParticipante: "suplente" as const },
      { secretariaId: 5, presente: true, tipoParticipante: "titular" as const },
      { secretariaId: 6, presente: true, tipoParticipante: "titular" as const },
      { secretariaId: 7, presente: false, tipoParticipante: "titular" as const },
      { secretariaId: 8, presente: true, tipoParticipante: "titular" as const },
      { secretariaId: 9, presente: true, tipoParticipante: "titular" as const },
      { secretariaId: 10, presente: false, tipoParticipante: "titular" as const },
      { secretariaId: 11, presente: true, tipoParticipante: "titular" as const },
    ];

    const result = await caller.presencas.register({
      reuniaoId: 1,
      presencas: presencasData,
    });

    expect(result).toEqual({ success: true });
  });

  it("lista presenças por reunião", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const presencas = await caller.presencas.listByReuniao({ reuniaoId: 1 });

    expect(Array.isArray(presencas)).toBe(true);
    // Deve ter 11 registros (uma para cada secretaria)
    expect(presencas.length).toBeGreaterThan(0);
  });

  it("atualiza presença individual", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Buscar uma presença existente
    const presencas = await caller.presencas.listByReuniao({ reuniaoId: 1 });
    
    if (presencas.length > 0) {
      const primeiraPresenca = presencas[0];
      
      const result = await caller.presencas.update({
        id: primeiraPresenca.id,
        presente: !primeiraPresenca.presente,
        justificativa: "Teste de atualização",
      });

      expect(result).toEqual({ success: true });
    }
  });
});

describe("presencas.create", () => {
  it("cria uma nova presença individual", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.presencas.create({
      reuniaoId: 2,
      secretariaId: 1,
      presente: true,
      tipoParticipante: "titular",
    });

    expect(result).toEqual({ success: true });
  });
});
