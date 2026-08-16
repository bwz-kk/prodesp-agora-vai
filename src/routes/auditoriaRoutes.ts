import { Router } from "express";
import { Perfil } from "@prisma/client";
import { listarAuditorias } from "../controllers/auditoriaController";
import { autenticar } from "../middlewares/authenticate";
import { autorizar } from "../middlewares/rbac";

const router = Router();

router.use(autenticar);

// GET /api/auditoria — histórico de ações (apenas Administrador)
router.get("/", autorizar(Perfil.ADMINISTRADOR), listarAuditorias);

export default router;