// Configuração do Prisma ORM (v7) — migrações apontam para o banco via DATABASE_URL.
// O cliente em runtime usa o driver adapter em src/database/index.ts.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
});