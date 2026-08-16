// Seed — cria um usuário de demonstração para cada perfil do sistema.
// Senha padrão para todos: "123456" (somente para ambiente de desenvolvimento).
import { PrismaClient, Perfil } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const USUARIOS: Array<{ nome: string; email: string; perfil: Perfil }> = [
  { nome: "Administrador", email: "admin@prodesp.gov.br", perfil: Perfil.ADMINISTRADOR },
  { nome: "Jurídico", email: "juridico@prodesp.gov.br", perfil: Perfil.JURIDICO },
  { nome: "Técnico", email: "tecnico@prodesp.gov.br", perfil: Perfil.TECNICO },
  { nome: "Gestor", email: "gestor@prodesp.gov.br", perfil: Perfil.GESTOR },
  { nome: "Comunicação", email: "comunicacao@prodesp.gov.br", perfil: Perfil.COMUNICACAO },
];

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  for (const u of USUARIOS) {
    const existe = await prisma.usuario.findUnique({ where: { email: u.email } });
    if (existe) {
      console.log(`[seed] já existe: ${u.email}`);
      continue;
    }
    await prisma.usuario.create({
      data: { nome: u.nome, email: u.email, senhaHash, perfil: u.perfil },
    });
    console.log(`[seed] criado: ${u.email} (${u.perfil})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });