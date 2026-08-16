// Controller de Notificações — lista, contagem de não lidas e marcação como lida.
import { Request, Response } from "express";
import prisma from "../database";

export async function listarNotificacoes(req: Request, res: Response): Promise<void> {
  const notificacoes = await prisma.notificacao.findMany({
    where: { usuarioId: req.usuario!.id },
    orderBy: { criadoEm: "desc" },
    take: 50,
    include: { edital: { select: { id: true, numero: true, nome: true } } },
  });
  const naoLidas = notificacoes.filter((n) => !n.lida).length;
  res.json({ notificacoes, naoLidas });
}

export async function contarNaoLidas(req: Request, res: Response): Promise<void> {
  const naoLidas = await prisma.notificacao.count({
    where: { usuarioId: req.usuario!.id, lida: false },
  });
  res.json({ naoLidas });
}

export async function marcarLida(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const notificacao = await prisma.notificacao.findFirst({
    where: { id, usuarioId: req.usuario!.id },
  });
  if (!notificacao) {
    res.status(404).json({ erro: "Notificação não encontrada." });
    return;
  }
  await prisma.notificacao.update({ where: { id }, data: { lida: true } });
  res.json({ ok: true });
}

export async function marcarTodasLidas(req: Request, res: Response): Promise<void> {
  await prisma.notificacao.updateMany({
    where: { usuarioId: req.usuario!.id, lida: false },
    data: { lida: true },
  });
  res.json({ ok: true });
}
