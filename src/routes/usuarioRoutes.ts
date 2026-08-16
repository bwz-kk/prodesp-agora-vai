import { Router } from "express";
import { Perfil } from "../generated/prisma/client";
import { listarUsuarios, criarUsuario, excluirUsuario } from "../controllers/usuarioController";
import { autenticar } from "../middlewares/authenticate";
import { autorizar } from "../middlewares/rbac";

const router = Router();

router.use(autenticar, autorizar(Perfil.ADMINISTRADOR));

// GET /api/usuarios — listagem exclusiva do Administrador
router.get("/", listarUsuarios);

// POST /api/usuarios — criação exclusiva do Administrador
router.post("/", criarUsuario);

// DELETE /api/usuarios/:id — exclusão exclusiva do Administrador
router.delete("/:id", excluirUsuario);

export default router;