// Agente de Controle de Acesso — autenticação via JWT (camada 1 do RBAC)
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Perfil } from "@prisma/client";

export interface AuthPayload {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
}

// Torna `req.usuario` tipado em toda a aplicação
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      usuario?: AuthPayload;
    }
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ erro: "Token não informado." });
    return;
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}