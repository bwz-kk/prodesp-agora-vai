import { Router } from "express";
import { autenticar } from "../middlewares/authenticate";
import { dashboard } from "../controllers/dashboardController";

const router = Router();

router.use(autenticar);

// GET /api/dashboard — dados agregados para KPIs, gráficos e pendências
router.get("/", dashboard);

export default router;
