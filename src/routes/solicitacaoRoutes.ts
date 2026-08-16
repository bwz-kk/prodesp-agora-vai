import { Router } from "express";
import { autenticar } from "../middlewares/authenticate";
import { criarSolicitacao } from "../controllers/solicitacaoController";

const router = Router();

router.use(autenticar);

// POST /api/solicitacoes — cria uma solicitação de licitação (Comunicação/Visualizador)
router.post("/", criarSolicitacao);

export default router;
