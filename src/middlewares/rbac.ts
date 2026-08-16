// Agente de Controle de Acesso (RBAC) — autorização por perfil (camada 2)
import { Request, Response, NextFunction } from "express";
import { Perfil } from "@prisma/client";

export function autorizar(...perfisPermitidos: Perfil[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ erro: "Usuário não autenticado." });
      return;
    }
    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      res.status(403).json({
        erro: "Acesso negado. Seu perfil não possui permissão para esta ação.",
        perfilAtual: req.usuario.perfil,
        perfisPermitidos,
      });
      return;
    }
    next();
  };
}