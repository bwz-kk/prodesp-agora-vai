// Controller de Usuários — gestão de usuários (acesso apenas ao Administrador).
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Perfil } from "@prisma/client";
import prisma from "../database";

export async function listarUsuarios(req: Request, res: Response): Promise<void> {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, email: true, perfil: true, criadoEm: true },
  });
  res.json(usuarios);
}

export async function criarUsuario(req: Request, res: Response): Promise<void> {
  const { nome, email, senha, perfil } = req.body ?? {};

  if (!nome || !email || !senha || !perfil) {
    res.status(400).json({ erro: "nome, email, senha e perfil são obrigatórios." });
    return;
  }
  if (!Object.values(Perfil).includes(perfil)) {
    res.status(400).json({ erro: "Perfil inválido." });
    return;
  }

  const emailLower = String(email).toLowerCase();
  const existe = await prisma.usuario.findUnique({ where: { email: emailLower } });
  if (existe) {
    res.status(400).json({ erro: "E-mail já cadastrado." });
    return;
  }

  const senhaHash = await bcrypt.hash(String(senha), 10);
  const usuario = await prisma.usuario.create({
    data: { nome: String(nome), email: emailLower, senhaHash, perfil: perfil as Perfil },
    select: { id: true, nome: true, email: true, perfil: true, criadoEm: true },
  });

  res.status(201).json(usuario);
}

export async function excluirUsuario(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (id === req.usuario!.id) {
    res.status(400).json({ erro: "Não é possível excluir o próprio usuário." });
    return;
  }
  try {
    await prisma.usuario.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ erro: "Usuário não encontrado." });
  }
}