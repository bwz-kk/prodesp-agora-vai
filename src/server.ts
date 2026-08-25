// Ponto de entrada do servidor (inicializa a API)
// Nota: .env local é carregado via "-r dotenv/config" no script dev;
// em produção (Prisma Compute) as variáveis são injetadas pela plataforma.
import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`✔ API Prodesp Editais rodando em http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
});