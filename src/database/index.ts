// Conexão única com o Prisma Client (Prisma 7 + driver adapter PostgreSQL).
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export function criarPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definida.");
  }
  const adapter = new PrismaPg(url);
  return new PrismaClient({ adapter });
}

const prisma = global.prisma ?? criarPrisma();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;