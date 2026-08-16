// Middleware de tratamento centralizado de erros (evita vazamento de stack em produção)
import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  const status = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  res.status(status).json({
    erro: err.message || "Erro interno do servidor.",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ erro: "Rota não encontrada." });
}