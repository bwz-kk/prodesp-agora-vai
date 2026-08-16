// Controller de Dashboard — agrega dados reais para KPIs, gráficos e pendências.
import { Request, Response } from "express";
import prisma from "../database";
import { Perfil, StatusEdital } from "../generated/prisma/client";

const EM_ANALISE: StatusEdital[] = [
  StatusEdital.AGUARDANDO_REVISAO_JURIDICA,
  StatusEdital.EM_REVISAO_JURIDICA,
  StatusEdital.AGUARDANDO_REVISAO_TECNICA,
  StatusEdital.EM_REVISAO_TECNICA,
  StatusEdital.AGUARDANDO_APROVACAO_GESTOR,
  StatusEdital.EM_APROVACAO_GESTOR,
];

const STATUS_PENDENCIA: Record<Perfil, StatusEdital[]> = {
  [Perfil.ADMINISTRADOR]: [StatusEdital.RASCUNHO, StatusEdital.EM_CORRECAO],
  [Perfil.JURIDICO]: [StatusEdital.AGUARDANDO_REVISAO_JURIDICA, StatusEdital.EM_REVISAO_JURIDICA],
  [Perfil.TECNICO]: [StatusEdital.AGUARDANDO_REVISAO_TECNICA, StatusEdital.EM_REVISAO_TECNICA],
  [Perfil.GESTOR]: [StatusEdital.AGUARDANDO_APROVACAO_GESTOR, StatusEdital.EM_APROVACAO_GESTOR],
  [Perfil.COMUNICACAO]: [],
};

export async function dashboard(req: Request, res: Response): Promise<void> {
  const editais = await prisma.edital.findMany({
    orderBy: { criadoEm: "desc" },
    include: { criadoPor: { select: { nome: true } } },
  });

  const total = editais.length;
  const publicados = editais.filter((e) => e.status === StatusEdital.PUBLICADO).length;
  const reprovados = editais.filter((e) => e.status === StatusEdital.REPROVADO).length;
  const rascunho = editais.filter((e) => e.status === StatusEdital.RASCUNHO).length;
  const emCorrecao = editais.filter((e) => e.status === StatusEdital.EM_CORRECAO).length;
  const emAnalise = editais.filter((e) => EM_ANALISE.includes(e.status)).length;
  const ativos = total - rascunho - reprovados - emCorrecao;

  const concluidos = publicados + reprovados;
  const taxaAprovacao = concluidos ? Math.round((publicados / concluidos) * 100) : 0;

  const comDatas = editais.filter((e) => e.dataPublicacao && e.prazoVigencia);
  const diasTotais = comDatas.reduce(
    (acc, e) =>
      acc + (new Date(e.prazoVigencia!).getTime() - new Date(e.dataPublicacao!).getTime()) / 86400000,
    0
  );
  const prazoMedio = comDatas.length ? Math.round(diasTotais / comDatas.length) : 0;

  const porStatus = Object.values(StatusEdital)
    .map((status) => ({ status, total: editais.filter((e) => e.status === status).length }))
    .filter((x) => x.total > 0);

  const porMes: Array<{ mes: string; total: number }> = [];
  const agora = new Date();
  for (let i = 7; i >= 0; i--) {
    const inicio = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const fim = new Date(agora.getFullYear(), agora.getMonth() - i + 1, 1);
    const totalMes = editais.filter((e) => {
      const c = new Date(e.criadoEm);
      return c >= inicio && c < fim;
    }).length;
    porMes.push({
      mes: inicio.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      total: totalMes,
    });
  }

  const recentes = editais.slice(0, 5).map((e) => ({
    id: e.id,
    numero: e.numero,
    nome: e.nome,
    orgao: e.orgao || e.criadoPor?.nome || "PRODESP",
    status: e.status,
    valorEstimado: e.valorEstimado,
    propostas: e.propostas,
    prazoVigencia: e.prazoVigencia,
  }));

  const ultimoPublicado = editais.find((e) => e.status === StatusEdital.PUBLICADO) || null;

  const perfil = req.usuario!.perfil as Perfil;
  const statusesPendencia = STATUS_PENDENCIA[perfil] ?? [];
  const pendencias = editais
    .filter((e) => statusesPendencia.includes(e.status))
    .slice(0, 5)
    .map((e) => ({ id: e.id, numero: e.numero, nome: e.nome, status: e.status, prazoVigencia: e.prazoVigencia }));

  const limite = new Date();
  limite.setDate(limite.getDate() + 7);
  const prazosCriticos = editais
    .filter(
      (e) =>
        e.prazoVigencia &&
        e.prazoVigencia <= limite &&
        e.status !== StatusEdital.PUBLICADO &&
        e.status !== StatusEdital.REPROVADO
    )
    .map((e) => ({ id: e.id, numero: e.numero, nome: e.nome, prazoVigencia: e.prazoVigencia }));

  res.json({
    totais: { total, ativos, emAnalise, publicados, reprovados, rascunho, emCorrecao, taxaAprovacao, prazoMedio },
    porStatus,
    porMes,
    recentes,
    ultimoPublicado,
    pendencias,
    prazosCriticos,
  });
}
