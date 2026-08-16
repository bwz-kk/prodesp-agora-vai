import { Router } from "express";
import { Perfil } from "@prisma/client";
import {
  criarEdital,
  listarEditais,
  obterEdital,
  atualizarEdital,
  transicionarStatus,
  registrarParecer,
  excluirEdital,
} from "../controllers/editalController";
import { autenticar } from "../middlewares/authenticate";
import { autorizar } from "../middlewares/rbac";
import { validarCampos } from "../middlewares/validate";
import { uploadPdf } from "../middlewares/upload";

const router = Router();

// Todas as rotas de edital exigem autenticação
router.use(autenticar);

// GET /api/editais — listagem (todos autenticados, conforme acesso por perfil)
router.get("/", listarEditais);

// POST /api/editais — criação exclusiva do Administrador
router.post(
  "/",
  autorizar(Perfil.ADMINISTRADOR),
  uploadPdf.single("pdf"),
  validarCampos(["numero", "nome"]),
  criarEdital
);

// GET /api/editais/:id — detalhe do edital
router.get("/:id", obterEdital);

// PUT /api/editais/:id — atualização exclusiva do Administrador
router.put(
  "/:id",
  autorizar(Perfil.ADMINISTRADOR),
  uploadPdf.single("pdf"),
  atualizarEdital
);

// PUT /api/editais/:id/status — movimentação no fluxo (workflow + RBAC próprio)
router.put("/:id/status", validarCampos(["status"]), transicionarStatus);

// POST /api/editais/:id/parecer — emissão de parecer (Jurídico/Técnico, validado no controller)
router.post("/:id/parecer", validarCampos(["tipo", "resultado", "conteudo"]), registrarParecer);

// DELETE /api/editais/:id — exclusão exclusiva do Administrador
router.delete("/:id", autorizar(Perfil.ADMINISTRADOR), excluirEdital);

export default router;