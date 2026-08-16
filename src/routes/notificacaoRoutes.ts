import { Router } from "express";
import { autenticar } from "../middlewares/authenticate";
import {
  listarNotificacoes,
  contarNaoLidas,
  marcarLida,
  marcarTodasLidas,
} from "../controllers/notificacaoController";

const router = Router();

router.use(autenticar);

// GET /api/notificacoes — lista as notificações do usuário autenticado
router.get("/", listarNotificacoes);

// GET /api/notificacoes/nao-lidas — contagem de não lidas (para o badge)
router.get("/nao-lidas", contarNaoLidas);

// POST /api/notificacoes/lidas — marca todas como lidas
router.post("/lidas", marcarTodasLidas);

// POST /api/notificacoes/:id/lida — marca uma como lida
router.post("/:id/lida", marcarLida);

export default router;
