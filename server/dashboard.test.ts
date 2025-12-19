import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@cgbim.ba.gov.br",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("dashboard.kpis", () => {
  it("retorna KPIs do sistema", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.kpis();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("taxaPresencaGeral");
    expect(result).toHaveProperty("acoesEmAndamento");
    expect(result).toHaveProperty("capacitacoesRealizadas");
    expect(result).toHaveProperty("statusGeralEstrategia");
    
    // Validar tipos
    expect(typeof result!.taxaPresencaGeral).toBe("number");
    expect(typeof result!.acoesEmAndamento).toBe("number");
    expect(typeof result!.capacitacoesRealizadas).toBe("number");
    expect(typeof result!.statusGeralEstrategia).toBe("number");
  });

  it("retorna valores numéricos válidos", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.kpis();

    expect(result!.taxaPresencaGeral).toBeGreaterThanOrEqual(0);
    expect(result!.taxaPresencaGeral).toBeLessThanOrEqual(100);
    expect(result!.acoesEmAndamento).toBeGreaterThanOrEqual(0);
    expect(result!.capacitacoesRealizadas).toBeGreaterThanOrEqual(0);
    expect(result!.statusGeralEstrategia).toBeGreaterThanOrEqual(0);
    expect(result!.statusGeralEstrategia).toBeLessThanOrEqual(100);
  });
});

describe("dashboard.frequencia", () => {
  it("retorna dados de frequência", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.frequencia();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("presencaPorSecretaria");
    expect(result).toHaveProperty("evolucaoPresenca");
    expect(Array.isArray(result!.presencaPorSecretaria)).toBe(true);
    expect(Array.isArray(result!.evolucaoPresenca)).toBe(true);
  });

  it("presença por secretaria contém dados válidos", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.dashboard.frequencia();

    if (result!.presencaPorSecretaria.length > 0) {
      const item = result!.presencaPorSecretaria[0];
      expect(item).toHaveProperty("secretariaId");
      expect(item).toHaveProperty("totalPresencas");
      expect(item).toHaveProperty("totalReunioes");
      expect(typeof item.secretariaId).toBe("number");
      expect(typeof item.totalPresencas).toBe("number");
      expect(typeof item.totalReunioes).toBe("number");
    }
  });
});

describe("secretarias.list", () => {
  it("retorna lista de secretarias", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.secretarias.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("secretarias contêm dados completos", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.secretarias.list();

    if (result.length > 0) {
      const secretaria = result[0];
      expect(secretaria).toHaveProperty("id");
      expect(secretaria).toHaveProperty("sigla");
      expect(secretaria).toHaveProperty("nome");
      expect(secretaria).toHaveProperty("ordem");
      expect(typeof secretaria.sigla).toBe("string");
      expect(typeof secretaria.nome).toBe("string");
    }
  });

  it("retorna exatamente 11 secretarias do CGBIM-BA", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.secretarias.list();

    expect(result.length).toBe(11);
  });
});
