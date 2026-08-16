// Ponto de entrada do servidor (inicializa a API)
import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`✔ API Prodesp Editais rodando em http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
});