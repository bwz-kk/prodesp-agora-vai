import { Router } from "express";
import authRoutes from "./authRoutes";
import editalRoutes from "./editalRoutes";
import auditoriaRoutes from "./auditoriaRoutes";
import usuarioRoutes from "./usuarioRoutes";
import notificacaoRoutes from "./notificacaoRoutes";
import dashboardRoutes from "./dashboardRoutes";
import solicitacaoRoutes from "./solicitacaoRoutes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", servico: "Prodesp Editais API", hora: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/editais", editalRoutes);
router.use("/auditoria", auditoriaRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/notificacoes", notificacaoRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/solicitacoes", solicitacaoRoutes);

export default router;