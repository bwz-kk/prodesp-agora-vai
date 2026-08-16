// Controller de Editais — CRUD, fluxo de aprovação (workflow) e pareceres.
import { Request, Response } from "express";
import {
  Prisma,
  StatusEdital,
  TipoParecer,
  ResultadoParecer,
  TipoAcao,
  Perfil,
} from "../generated/prisma/client";
import prisma from "../database";
import { encontrarTransicao } from "../utils/workflow";
import { registrarAuditoria } from "../utils/audit";
import { notificarTransicao } from "../utils/notificacao";

interface DadosEdital {
  numero?: string;
  nome?: string;
  descricao?: string;
  orgao?: string;
  modalidade?: string;
  valorEstimado?: number;
  propostas?: number;
  dataPublicacao?: string;
  prazoVigencia?: string;
  pdfPath?: string;
}

// ---- Agente de Validação de Formulário (regras de validade dos campos) ----
function validarDados(dados: DadosEdital, numeroExistenteId?: number): void {
  const { numero, nome } = dados;
  if (numero !== undefined) {
    if (typeof numero !== "string" || numero.trim().length < 3) {
      throw new Error("O 'numero' do edital é obrigatório (mín. 3 caracteres).");
    }
  }
  if (nome !== undefined && (typeof nome !== "string" || nome.trim().length < 3)) {
    throw new Error("O 'nome' do edital é obrigatório (mín. 3 caracteres).");
  }
  void numeroExistenteId; // usado em criar/atualizar para validação de unicidade
}

function parseData(valor?: string): Date | null {
  if (!valor) return null;
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) throw new Error("Data inválida.");
  return d;
}

export async function criarEdital(req: Request, res: Response): Promise<void> {
  try {
    const dados: DadosEdital = req.body ?? {};
    const { numero, nome, descricao, dataPublicacao, prazoVigencia } = dados;
    const pdfPath = (req.file && (req.file as Express.Multer.File).path) || dados.pdfPath;
    validarDados({ numero, nome });

    if (await prisma.edital.findUnique({ where: { numero: String(numero) } })) {
      res.status(400).json({ erro: "Número do edital já cadastrado." });
      return;
    }

    const edital = await prisma.edital.create({
      data: {
        numero: String(numero),
        nome: String(nome),
        descricao,
        orgao: dados.orgao,
        modalidade: dados.modalidade,
        valorEstimado: dados.valorEstimado != null ? Number(dados.valorEstimado) : null,
        propostas: dados.propostas != null ? Number(dados.propostas) : 0,
        dataPublicacao: parseData(dataPublicacao),
        prazoVigencia: parseData(prazoVigencia),
        pdfPath,
        status: StatusEdital.RASCUNHO,
        criadoPorId: req.usuario!.id,
      },
    });

    await registrarAuditoria({
      usuarioId: req.usuario!.id,
      tipoAcao: TipoAcao.CRIAR_EDITAL,
      editalId: edital.id,
      estadoPosterior: StatusEdital.RASCUNHO,
      observacoes: `Edital ${edital.numero} criado`,
    });

    res.status(201).json(edital);
  } catch (err) {
    res.status(400).json({ erro: (err as Error).message });
  }
}

export async function listarEditais(req: Request, res: Response): Promise<void> {
  const { busca, status, responsavel } = req.query as {
    busca?: string;
    status?: string;
    responsavel?: string;
  };

  const where: Prisma.EditalWhereInput = {};
  if (busca) {
    where.OR = [
      { nome: { contains: busca } },
      { numero: { contains: busca } },
      { descricao: { contains: busca } },
    ];
  }
  if (status) where.status = status as StatusEdital;
  if (responsavel) where.criadoPorId = Number(responsavel) || undefined;

  const editais = await prisma.edital.findMany({
    where,
    orderBy: { criadoEm: "desc" },
    include: { criadoPor: { select: { id: true, nome: true, perfil: true } } },
  });
  res.json(editais);
}

export async function obterEdital(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const edital = await prisma.edital.findUnique({
    where: { id },
    include: {
      criadoPor: { select: { id: true, nome: true, perfil: true } },
      pareceres: {
        include: { emitidoPor: { select: { id: true, nome: true, perfil: true } } },
        orderBy: { criadoEm: "desc" },
      },
      auditorias: { orderBy: { dataHora: "desc" } },
    },
  });
  if (!edital) {
    res.status(404).json({ erro: "Edital não encontrado." });
    return;
  }
  res.json(edital);
}

export async function atualizarEdital(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const dados: DadosEdital = req.body ?? {};
  const edital = await prisma.edital.findUnique({ where: { id } });

  if (!edital) {
    res.status(404).json({ erro: "Edital não encontrado." });
    return;
  }

  const editaveis: StatusEdital[] = [StatusEdital.RASCUNHO, StatusEdital.EM_CORRECAO];
  if (!editaveis.includes(edital.status)) {
    res
      .status(409)
      .json({
        erro: "Edital não pode ser editado no estado atual. Ajuste apenas em RASCUNHO ou EM_CORRECAO.",
      });
    return;
  }

  validarDados(dados);

  if (dados.numero) {
    const outro = await prisma.edital.findUnique({ where: { numero: dados.numero } });
    if (outro && outro.id !== id) {
      res.status(400).json({ erro: "Número do edital já cadastrado." });
      return;
    }
  }

  const pdfPath = (req.file && (req.file as Express.Multer.File).path) || dados.pdfPath;
  const atualizado = await prisma.edital.update({
    where: { id },
    data: {
      numero: dados.numero,
      nome: dados.nome,
      descricao: dados.descricao,
      orgao: dados.orgao,
      modalidade: dados.modalidade,
      valorEstimado: dados.valorEstimado != null ? Number(dados.valorEstimado) : null,
      propostas: dados.propostas != null ? Number(dados.propostas) : undefined,
      dataPublicacao: parseData(dados.dataPublicacao),
      prazoVigencia: parseData(dados.prazoVigencia),
      ...(pdfPath ? { pdfPath } : {}),
    },
  });

  await registrarAuditoria({
    usuarioId: req.usuario!.id,
    tipoAcao: TipoAcao.ATUALIZAR_EDITAL,
    editalId: id,
    estadoAnterior: edital.status,
    estadoPosterior: atualizado.status,
    observacoes: "Dados do edital atualizados",
  });

  res.json(atualizado);
}

export async function transicionarStatus(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { status } = req.body ?? {};
  const destino = status as StatusEdital;

  if (!Object.values(StatusEdital).includes(destino)) {
    res.status(400).json({ erro: "Status de destino inválido." });
    return;
  }

  const edital = await prisma.edital.findUnique({ where: { id } });
  if (!edital) {
    res.status(404).json({ erro: "Edital não encontrado." });
    return;
  }

  const perfil = req.usuario!.perfil as Perfil;

  try {
    const transicao = encontrarTransicao(edital.status, destino, perfil);

    const atualizado = await prisma.edital.update({
      where: { id },
      data: { status: destino },
    });

    await registrarAuditoria({
      usuarioId: req.usuario!.id,
      tipoAcao: transicao.acao,
      editalId: id,
      estadoAnterior: edital.status,
      estadoPosterior: atualizado.status,
      observacoes: req.body.observacoes,
    });

    // Agente de Notificação — alerta os perfis da próxima etapa
    await notificarTransicao(atualizado, destino);

    res.json(atualizado);
  } catch (err) {
    res.status(403).json({ erro: (err as Error).message });
  }
}

export async function registrarParecer(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const { tipo, resultado, conteudo } = req.body ?? {};

  if (![TipoParecer.JURIDICO, TipoParecer.TECNICO].includes(tipo)) {
    res.status(400).json({ erro: "Tipo de parecer inválido. Use JURIDICO ou TECNICO." });
    return;
  }
  if (![ResultadoParecer.APROVADO, ResultadoParecer.REPROVADO].includes(resultado)) {
    res.status(400).json({ erro: "Resultado de parecer inválido. Use APROVADO ou REPROVADO." });
    return;
  }
  if (!conteudo || typeof conteudo !== "string" || conteudo.trim().length < 5) {
    res.status(400).json({ erro: "O parecer deve conter pelo menos 5 caracteres." });
    return;
  }

  const edital = await prisma.edital.findUnique({ where: { id } });
  if (!edital) {
    res.status(404).json({ erro: "Edital não encontrado." });
    return;
  }

  // Garante que o parecer só é emitido por quem tem o perfil correspondente
  const perfil = req.usuario!.perfil as Perfil;
  if (tipo === TipoParecer.JURIDICO && perfil !== Perfil.JURIDICO) {
    res.status(403).json({ erro: "Apenas o perfil Jurídico pode emitir parecer jurídico." });
    return;
  }
  if (tipo === TipoParecer.TECNICO && perfil !== Perfil.TECNICO) {
    res.status(403).json({ erro: "Apenas o perfil Técnico pode emitir parecer técnico." });
    return;
  }

  const parecer = await prisma.parecer.create({
    data: {
      editalId: id,
      tipo,
      resultado,
      conteudo,
      emitidoPorId: req.usuario!.id,
    },
  });

  await registrarAuditoria({
    usuarioId: req.usuario!.id,
    tipoAcao:
      tipo === TipoParecer.JURIDICO ? TipoAcao.PARECER_JURIDICO : TipoAcao.PARECER_TECNICO,
    editalId: id,
    estadoAnterior: edital.status,
    estadoPosterior: edital.status,
    observacoes: `Parecer ${tipo} — ${resultado}`,
  });

  res.status(201).json(parecer);
}

export async function excluirEdital(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const edital = await prisma.edital.findUnique({ where: { id } });
  if (!edital) {
    res.status(404).json({ erro: "Edital não encontrado." });
    return;
  }
  if (edital.status !== StatusEdital.RASCUNHO) {
    res
      .status(409)
      .json({ erro: "Somente editais em RASCUNHO podem ser excluídos." });
    return;
  }

  await prisma.edital.delete({ where: { id } });
  await registrarAuditoria({
    usuarioId: req.usuario!.id,
    tipoAcao: TipoAcao.EXCLUIR_EDITAL,
    editalId: id,
    estadoAnterior: edital.status,
    observacoes: `Edital ${edital.numero} excluído`,
  });

  res.status(204).send();
}