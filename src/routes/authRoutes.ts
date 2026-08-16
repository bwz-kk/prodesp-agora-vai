import { Router } from "express";
import { login, me } from "../controllers/authController";
import { autenticar } from "../middlewares/authenticate";
import { validarCampos } from "../middlewares/validate";

const router = Router();

// POST /api/auth/login — autenticação
router.post("/login", validarCampos(["email", "senha"]), login);

// GET /api/auth/me — usuário autenticado
router.get("/me", autenticar, me);

export default router;