// Agente de Validação de Formulário (síncrono) — verifica campos antes de processar.
import { Request, Response, NextFunction } from "express";

export function validarCampos(camposObrigatorios: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const faltando = camposObrigatorios.filter(
      (campo) => req.body == null || req.body[campo] === undefined || req.body[campo] === ""
    );
    if (faltando.length > 0) {
      res.status(400).json({ erro: `Campos obrigatórios ausentes: ${faltando.join(", ")}.` });
      return;
    }
    next();
  };
}