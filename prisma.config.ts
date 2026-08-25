// Configuração do Prisma ORM (v7) — migrações apontam para o banco via DATABASE_URL.
// O cliente em runtime usa o driver adapter em src/database/index.ts.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const dbUrl = process.env.DATABASE_URL || (() => { try { return env("DATABASE_URL"); } catch { return "postgresql://localhost:5432/dummy"; } })();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
});