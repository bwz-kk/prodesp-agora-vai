// Agente de Controle de Fluxo (Workflow Engine)
// Centraliza a máquina de estados do edital e as regras de transição por perfil.
import { StatusEdital, Perfil, TipoAcao } from "../generated/prisma/client";

export interface Transicao {
  acao: TipoAcao;
  origem: StatusEdital[];
  destino: StatusEdital;
  perfisPermitidos: Perfil[];
}

export const TRANSICOES: Transicao[] = [
  // Administrador envia rascunho/correção para revisão jurídica
  {
    acao: TipoAcao.ENVIAR_PARA_REVISAO,
    origem: [StatusEdital.RASCUNHO, StatusEdital.EM_CORRECAO],
    destino: StatusEdital.AGUARDANDO_REVISAO_JURIDICA,
    perfisPermitidos: [Perfil.ADMINISTRADOR],
  },
  // Jurídico inicia a análise formal (entra em revisão)
  {
    acao: TipoAcao.INICIAR_REVISAO_JURIDICA,
    origem: [StatusEdital.AGUARDANDO_REVISAO_JURIDICA],
    destino: StatusEdital.EM_REVISAO_JURIDICA,
    perfisPermitidos: [Perfil.JURIDICO],
  },
  // Jurídico aprova → avança para revisão técnica
  {
    acao: TipoAcao.APROVAR_JURIDICO,
    origem: [StatusEdital.EM_REVISAO_JURIDICA, StatusEdital.AGUARDANDO_REVISAO_JURIDICA],
    destino: StatusEdital.AGUARDANDO_REVISAO_TECNICA,
    perfisPermitidos: [Perfil.JURIDICO],
  },
  // Jurídico solicita correções → retorna ao administrador
  {
    acao: TipoAcao.SOLICITAR_CORRECAO,
    origem: [StatusEdital.EM_REVISAO_JURIDICA],
    destino: StatusEdital.EM_CORRECAO,
    perfisPermitidos: [Perfil.JURIDICO],
  },
  // Técnico inicia a análise formal
  {
    acao: TipoAcao.INICIAR_REVISAO_TECNICA,
    origem: [StatusEdital.AGUARDANDO_REVISAO_TECNICA],
    destino: StatusEdital.EM_REVISAO_TECNICA,
    perfisPermitidos: [Perfil.TECNICO],
  },
  // Técnico aprova → avança para decisão do gestor
  {
    acao: TipoAcao.APROVAR_TECNICO,
    origem: [StatusEdital.EM_REVISAO_TECNICA, StatusEdital.AGUARDANDO_REVISAO_TECNICA],
    destino: StatusEdital.AGUARDANDO_APROVACAO_GESTOR,
    perfisPermitidos: [Perfil.TECNICO],
  },
  // Técnico solicita ajustes → retorna ao administrador
  {
    acao: TipoAcao.SOLICITAR_CORRECAO,
    origem: [StatusEdital.EM_REVISAO_TECNICA],
    destino: StatusEdital.EM_CORRECAO,
    perfisPermitidos: [Perfil.TECNICO],
  },
  // Gestor inicia a análise final
  {
    acao: TipoAcao.INICIAR_APROVACAO_GESTOR,
    origem: [StatusEdital.AGUARDANDO_APROVACAO_GESTOR],
    destino: StatusEdital.EM_APROVACAO_GESTOR,
    perfisPermitidos: [Perfil.GESTOR],
  },
  // Gestor aprova → publicado
  {
    acao: TipoAcao.APROVAR_GESTOR,
    origem: [StatusEdital.EM_APROVACAO_GESTOR, StatusEdital.AGUARDANDO_APROVACAO_GESTOR],
    destino: StatusEdital.PUBLICADO,
    perfisPermitidos: [Perfil.GESTOR],
  },
  // Gestor reprova → reprovado
  {
    acao: TipoAcao.REPROVAR_GESTOR,
    origem: [StatusEdital.EM_APROVACAO_GESTOR, StatusEdital.AGUARDANDO_APROVACAO_GESTOR],
    destino: StatusEdital.REPROVADO,
    perfisPermitidos: [Perfil.GESTOR],
  },
];

export const ESTADOS = StatusEdital;

/** Busca a transição válida para o estado atual → destino pelo perfil. */
export function encontrarTransicao(
  origem: StatusEdital,
  destino: StatusEdital,
  perfil: Perfil
): Transicao {
  const transicao = TRANSICOES.find(
    (t) => t.destino === destino && t.origem.includes(origem) && t.perfisPermitidos.includes(perfil)
  );
  if (!transicao) {
    const permitida = TRANSICOES.find(
      (t) => t.destino === destino && t.origem.includes(origem)
    );
    if (permitida) {
      throw new Error(
        `Transição de "${origem}" para "${destino}" requer o perfil ${permitida.perfisPermitidos.join(
          " ou "
        )}.`
      );
    }
    throw new Error(`Transição inválida de "${origem}" para "${destino}".`);
  }
  return transicao;
}