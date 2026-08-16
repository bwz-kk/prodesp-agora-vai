// Controller de Solicitação de Licitação — cria um edital em RASCUNHO a partir de uma
// solicitação do perfil Comunicação (Visualizador) e notifica os Administradores.
import { Request, Response } from "express";
import prisma from "../database";
import { Perfil, StatusEdital, TipoAcao } from "../generated/prisma/client";
import { registrarAuditoria } from "../utils/audit";
import { notificarUsuariosPorPerfil } from "../utils/notificacao";

function gerarNumero(): string {
  const ano = new Date().getFullYear();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `SOL-${ano}-${seq}`;
}

export async function criarSolicitacao(req: Request, res: Response): Promise<void> {
  const {
    orgao,
    objeto,
    modalidade,
    valorEstimado,
    justificativa,
    prazoDesejado,
    emailContato,
    observacoes,
  } = req.body ?? {};

  if (!orgao || !String(orgao).trim() || !objeto || !String(objeto).trim()) {
    res.status(400).json({ erro: "Campos obrigatórios: órgão solicitante e objeto da licitação." });
    return;
  }
  if (!justificativa || String(justificativa).trim().length < 5) {
    res.status(400).json({ erro: "A justificativa da necessidade é obrigatória (mín. 5 caracteres)." });
    return;
  }

  const numero = gerarNumero();
  const descricao = [
    justificativa,
    emailContato ? `Contato: ${emailContato}` : null,
    observacoes ? `Observações: ${observacoes}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const edital = await prisma.edital.create({
      data: {
        numero,
        nome: String(objeto).trim(),
        descricao,
        orgao: orgao ? String(orgao).trim() : null,
        modalidade: modalidade || null,
        valorEstimado: valorEstimado ? Number(valorEstimado) : null,
        dataPublicacao: prazoDesejado ? new Date(prazoDesejado) : null,
        status: StatusEdital.RASCUNHO,
        criadoPorId: req.usuario!.id,
      },
    });

    await registrarAuditoria({
      usuarioId: req.usuario!.id,
      tipoAcao: TipoAcao.CRIAR_EDITAL,
      editalId: edital.id,
      estadoPosterior: StatusEdital.RASCUNHO,
      observacoes: `Solicitação de licitação ${edital.numero} criada`,
    });

    await notificarUsuariosPorPerfil(
      [Perfil.ADMINISTRADOR],
      `Solicitação de licitação ${edital.numero}`,
      `Nova solicitação "${edital.nome}" (${edital.orgao || "órgão não informado"}) recebida.`,
      edital.id
    );

    res.status(201).json(edital);
  } catch (err) {
    res.status(400).json({ erro: (err as Error).message });
  }
}
