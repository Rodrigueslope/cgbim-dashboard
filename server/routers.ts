import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== Secretarias =====
  secretarias: router({
    list: publicProcedure.query(async () => {
      return await db.getAllSecretarias();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getSecretariaById(input.id);
      }),
  }),

  // ===== Reuniões =====
  reunioes: router({
    list: publicProcedure.query(async () => {
      return await db.getAllReunioes();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getReuniaoById(input.id);
      }),
    create: publicProcedure
      .input(z.object({
        numero: z.number(),
        data: z.string(),
        tipo: z.enum(["ordinaria", "extraordinaria"]),
        local: z.string().optional(),
        modalidade: z.enum(["presencial", "virtual", "hibrida"]),
        pauta: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { data, ...rest } = input;
        const id = await db.createReuniao({
          ...rest,
          data: new Date(data),
          totalEsperado: 11,
        });
        return { id };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        ata: z.string().optional(),
        quorumAtingido: z.boolean().optional(),
        totalPresentes: z.number().optional(),
        taxaPresenca: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateReuniao(id, data);
        return { success: true };
      }),
  }),

  // ===== Presenças =====
  presencas: router({
    listByReuniao: publicProcedure
      .input(z.object({ reuniaoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPresencasByReuniaoId(input.reuniaoId);
      }),
    create: publicProcedure
      .input(z.object({
        reuniaoId: z.number(),
        secretariaId: z.number(),
        presente: z.boolean(),
        tipoParticipante: z.enum(["titular", "suplente"]),
        justificativa: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPresenca(input);
        return { success: true };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        presente: z.boolean().optional(),
        justificativa: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePresenca(id, data);
        return { success: true };
      }),
  }),

  // ===== Ações =====
  acoes: router({
    list: publicProcedure.query(async () => {
      return await db.getAllAcoes();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getAcaoById(input.id);
      }),
    create: publicProcedure
      .input(z.object({
        titulo: z.string(),
        descricao: z.string().optional(),
        responsavelSecretariaId: z.number(),
        dataInicio: z.string(),
        dataPrevista: z.string(),
        status: z.enum(["planejada", "em_progresso", "concluida", "atrasada", "cancelada"]).optional(),
        percentualConclusao: z.number().optional(),
        prioridade: z.enum(["baixa", "media", "alta", "critica"]).optional(),
        objetivoDecreto: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { dataInicio, dataPrevista, ...rest } = input;
        const id = await db.createAcao({
          ...rest,
          dataInicio: new Date(dataInicio),
          dataPrevista: new Date(dataPrevista),
        });
        return { id };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        titulo: z.string().optional(),
        descricao: z.string().optional(),
        responsavelSecretariaId: z.number().optional(),
        dataInicio: z.string().optional(),
        dataPrevista: z.string().optional(),
        dataConclusao: z.string().optional(),
        status: z.enum(["planejada", "em_progresso", "concluida", "atrasada", "cancelada"]).optional(),
        percentualConclusao: z.number().optional(),
        prioridade: z.enum(["baixa", "media", "alta", "critica"]).optional(),
        objetivoDecreto: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, dataInicio, dataPrevista, dataConclusao, ...rest } = input;
        const data: any = { ...rest };
        if (dataInicio) data.dataInicio = new Date(dataInicio);
        if (dataPrevista) data.dataPrevista = new Date(dataPrevista);
        if (dataConclusao) data.dataConclusao = new Date(dataConclusao);
        await db.updateAcao(id, data);
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteAcao(input.id);
        return { success: true };
      }),
  }),

  // ===== Capacitações =====
  capacitacoes: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCapacitacoes();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCapacitacaoById(input.id);
      }),
    create: publicProcedure
      .input(z.object({
        titulo: z.string(),
        descricao: z.string().optional(),
        data: z.string(),
        local: z.string().optional(),
        modalidade: z.enum(["presencial", "virtual", "hibrida"]),
        instrutor: z.string().optional(),
        cargaHoraria: z.number().optional(),
        participantesEsperados: z.number().optional(),
        status: z.enum(["agendada", "realizada", "cancelada"]).optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { data, ...rest } = input;
        const id = await db.createCapacitacao({
          ...rest,
          data: new Date(data),
        });
        return { id };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        titulo: z.string().optional(),
        descricao: z.string().optional(),
        data: z.string().optional(),
        local: z.string().optional(),
        modalidade: z.enum(["presencial", "virtual", "hibrida"]).optional(),
        instrutor: z.string().optional(),
        cargaHoraria: z.number().optional(),
        participantesEsperados: z.number().optional(),
        participantesConfirmados: z.number().optional(),
        participantesPresentes: z.number().optional(),
        taxaPresenca: z.string().optional(),
        status: z.enum(["agendada", "realizada", "cancelada"]).optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, data, ...rest } = input;
        const updateData: any = { ...rest };
        if (data) updateData.data = new Date(data);
        await db.updateCapacitacao(id, updateData);
        return { success: true };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCapacitacao(input.id);
        return { success: true };
      }),
  }),

  // ===== Conformidade Regulatória =====
  conformidade: router({
    list: publicProcedure.query(async () => {
      return await db.getAllConformidade();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getConformidadeById(input.id);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        percentualConclusao: z.number().optional(),
        status: z.enum(["nao_iniciado", "em_progresso", "concluido"]).optional(),
        responsavelSecretariaId: z.number().optional(),
        dataInicio: z.string().optional(),
        dataPrevista: z.string().optional(),
        dataConclusao: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, dataInicio, dataPrevista, dataConclusao, ...rest } = input;
        const data: any = { ...rest };
        if (dataInicio) data.dataInicio = new Date(dataInicio);
        if (dataPrevista) data.dataPrevista = new Date(dataPrevista);
        if (dataConclusao) data.dataConclusao = new Date(dataConclusao);
        await db.updateConformidade(id, data);
        return { success: true };
      }),
  }),

  // ===== Dashboard e KPIs =====
  dashboard: router({
    kpis: publicProcedure.query(async () => {
      return await db.getKPIs();
    }),
    frequencia: publicProcedure.query(async () => {
      return await db.getFrequenciaData();
    }),
  }),
});

export type AppRouter = typeof appRouter;
