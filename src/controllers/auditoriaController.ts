// Controller de Auditoria — histórico de ações (acesso apenas ao Administrador).
import { Request, Response } from "express";
import { Prisma, TipoAcao } from "@prisma/client";
import prisma from "../database";

export async function listarAuditorias(req: Request, res: Response): Promise<void> {
  const { editalId, tipoAcao, usuarioId } = req.query as {
    editalId?: string;
    tipoAcao?: string;
    usuarioId?: string;
  };

  const where: Prisma.AuditoriaWhereInput = {};
  if (editalId) where.editalId = Number(editalId) || undefined;
  if (tipoAcao) where.tipoAcao = tipoAcao as TipoAcao;
  if (usuarioId) where.usuarioId = Number(usuarioId) || undefined;

  const registros = await prisma.auditoria.findMany({
    where,
    orderBy: { dataHora: "desc" },
    include: {
      usuario: { select: { id: true, nome: true, email: true, perfil: true } },
      edital: { select: { id: true, numero: true, nome: true } },
    },
  });
  res.json(registros);
}