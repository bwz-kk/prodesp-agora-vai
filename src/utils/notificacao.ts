// Agente de Notificação — cria alertas automáticos por mudança de status e prazos.
import prisma from "../database";
import { Perfil, StatusEdital } from "../generated/prisma/client";

interface NotificacaoInput {
  usuarioId: number;
  titulo: string;
  mensagem: string;
  tipo?: string;
  editalId?: number | null;
}

export async function criarNotificacao(input: NotificacaoInput): Promise<void> {
  await prisma.notificacao.create({
    data: {
      usuarioId: input.usuarioId,
      titulo: input.titulo,
      mensagem: input.mensagem,
      tipo: input.tipo ?? "STATUS",
      editalId: input.editalId ?? null,
    },
  });
}

/** Cria a mesma notificação para todos os usuários de determinados perfis. */
export async function notificarUsuariosPorPerfil(
  perfis: Perfil[],
  titulo: string,
  mensagem: string,
  editalId?: number | null
): Promise<void> {
  const usuarios = await prisma.usuario.findMany({
    where: { perfil: { in: perfis } },
    select: { id: true },
  });
  await Promise.all(
    usuarios.map((u) => criarNotificacao({ usuarioId: u.id, titulo, mensagem, editalId }))
  );
}

/** Dispara notificações conforme o destino do fluxo (tabela do Agente de Notificação). */
export async function notificarTransicao(
  edital: { id: number; numero: string; nome: string },
  destino: StatusEdital
): Promise<void> {
  const titulo = `Edital ${edital.numero}`;
  const nome = `"${edital.nome}"`;

  switch (destino) {
    case StatusEdital.AGUARDANDO_REVISAO_JURIDICA:
      await notificarUsuariosPorPerfil(
        [Perfil.JURIDICO],
        titulo,
        `Novo edital ${nome} aguarda revisão jurídica.`,
        edital.id
      );
      break;
    case StatusEdital.AGUARDANDO_REVISAO_TECNICA:
      await notificarUsuariosPorPerfil(
        [Perfil.TECNICO],
        titulo,
        `Edital ${nome} foi aprovado juridicamente e aguarda revisão técnica.`,
        edital.id
      );
      break;
    case StatusEdital.AGUARDANDO_APROVACAO_GESTOR:
      await notificarUsuariosPorPerfil(
        [Perfil.GESTOR],
        titulo,
        `Edital ${nome} foi aprovado tecnicamente e aguarda decisão final.`,
        edital.id
      );
      break;
    case StatusEdital.PUBLICADO:
      await notificarUsuariosPorPerfil(
        [Perfil.COMUNICACAO, Perfil.ADMINISTRADOR],
        titulo,
        `Edital ${nome} foi publicado.`,
        edital.id
      );
      break;
    case StatusEdital.REPROVADO:
      await notificarUsuariosPorPerfil(
        [Perfil.ADMINISTRADOR],
        titulo,
        `Edital ${nome} foi reprovado. Verifique as observações.`,
        edital.id
      );
      break;
    case StatusEdital.EM_CORRECAO:
      await notificarUsuariosPorPerfil(
        [Perfil.ADMINISTRADOR],
        titulo,
        `Edital ${nome} retornou para correção.`,
        edital.id
      );
      break;
    default:
      break;
  }
}
