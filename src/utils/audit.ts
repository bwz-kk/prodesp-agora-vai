// Agente de Auditoria (Logger) — registra toda ação no sistema com usuário e data/hora UTC.
import { Prisma, StatusEdital, TipoAcao } from "../generated/prisma/client";
import prisma from "../database";

interface AuditoriaInput {
  usuarioId: number;
  tipoAcao: TipoAcao;
  editalId?: number | null;
  estadoAnterior?: StatusEdital | null;
  estadoPosterior?: StatusEdital | null;
  observacoes?: string | null;
}

export async function registrarAuditoria(input: AuditoriaInput): Promise<void> {
  const data: Prisma.AuditoriaUncheckedCreateInput = {
    usuarioId: input.usuarioId,
    tipoAcao: input.tipoAcao,
    editalId: input.editalId ?? null,
    estadoAnterior: input.estadoAnterior ?? null,
    estadoPosterior: input.estadoPosterior ?? null,
    observacoes: input.observacoes ?? null,
    dataHora: new Date(), // timestamp UTC
  };
  await prisma.auditoria.create({ data });
}