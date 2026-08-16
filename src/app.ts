// Aplicação Express — monta middlewares globais e as rotas da API
import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import { resolvePublicDir } from "./utils/paths";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos (uploads de PDF e front-end)
const publicDir = resolvePublicDir();
app.use("/uploads", express.static(path.join(publicDir, "uploads")));
app.use(express.static(publicDir));

// Rotas da API
app.use("/api", routes);

// 404 para rotas não encontradas
app.use(notFound);

// Tratamento centralizado de erros (multer, JSON inválido, etc.)
app.use(errorHandler);

export default app;