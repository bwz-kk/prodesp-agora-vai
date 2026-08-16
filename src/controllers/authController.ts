// Controller de Autenticação — login e perfil do usuário autenticado.
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../database";
import { registrarAuditoria } from "../utils/audit";
import { TipoAcao } from "@prisma/client";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    res.status(400).json({ erro: "Informe e-mail e senha." });
    return;
  }

  const usuario = await prisma.usuario.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!usuario) {
    res.status(401).json({ erro: "Credenciais inválidas." });
    return;
  }

  const senhaOk = await bcrypt.compare(String(senha), usuario.senhaHash);
  if (!senhaOk) {
    res.status(401).json({ erro: "Credenciais inválidas." });
    return;
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    process.env.JWT_SECRET as string,
    { expiresIn: "8h" }
  );

  await registrarAuditoria({
    usuarioId: usuario.id,
    tipoAcao: TipoAcao.LOGIN,
    observacoes: "Login realizado com sucesso",
  });

  res.json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    },
  });
}

export async function me(req: Request, res: Response): Promise<void> {
  const { usuario } = req;
  res.json({ usuario });
}