// Upload de PDF (Agente de Validação de Formulário — verifica formato e tamanho)
import multer from "multer";
import path from "path";
import fs from "fs";
import { resolvePublicDir } from "../utils/paths";

const UPLOAD_DIR = path.join(resolvePublicDir(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unico}-${file.originalname}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype !== "application/pdf" && !file.originalname.toLowerCase().endsWith(".pdf")) {
    cb(new Error("Somente arquivos em formato PDF são permitidos."));
    return;
  }
  cb(null, true);
};

export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});