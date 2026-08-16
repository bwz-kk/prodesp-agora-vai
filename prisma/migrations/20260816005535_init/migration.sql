-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMINISTRADOR', 'JURIDICO', 'TECNICO', 'GESTOR', 'COMUNICACAO');

-- CreateEnum
CREATE TYPE "StatusEdital" AS ENUM ('RASCUNHO', 'AGUARDANDO_REVISAO_JURIDICA', 'EM_REVISAO_JURIDICA', 'AGUARDANDO_REVISAO_TECNICA', 'EM_REVISAO_TECNICA', 'AGUARDANDO_APROVACAO_GESTOR', 'EM_APROVACAO_GESTOR', 'PUBLICADO', 'REPROVADO', 'EM_CORRECAO');

-- CreateEnum
CREATE TYPE "TipoParecer" AS ENUM ('JURIDICO', 'TECNICO');

-- CreateEnum
CREATE TYPE "ResultadoParecer" AS ENUM ('APROVADO', 'REPROVADO');

-- CreateEnum
CREATE TYPE "TipoAcao" AS ENUM ('LOGIN', 'CRIAR_EDITAL', 'ATUALIZAR_EDITAL', 'EXCLUIR_EDITAL', 'ENVIAR_PARA_REVISAO', 'INICIAR_REVISAO_JURIDICA', 'INICIAR_REVISAO_TECNICA', 'INICIAR_APROVACAO_GESTOR', 'PARECER_JURIDICO', 'PARECER_TECNICO', 'APROVAR_JURIDICO', 'APROVAR_TECNICO', 'APROVAR_GESTOR', 'REPROVAR_GESTOR', 'SOLICITAR_CORRECAO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edital" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "dataPublicacao" TIMESTAMP(3),
    "prazoVigencia" TIMESTAMP(3),
    "pdfPath" TEXT,
    "status" "StatusEdital" NOT NULL DEFAULT 'RASCUNHO',
    "criadoPorId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Edital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parecer" (
    "id" SERIAL NOT NULL,
    "editalId" INTEGER NOT NULL,
    "tipo" "TipoParecer" NOT NULL,
    "resultado" "ResultadoParecer" NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emitidoPorId" INTEGER NOT NULL,

    CONSTRAINT "Parecer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" SERIAL NOT NULL,
    "tipoAcao" "TipoAcao" NOT NULL,
    "editalId" INTEGER,
    "estadoAnterior" "StatusEdital",
    "estadoPosterior" "StatusEdital",
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Edital_codigo_key" ON "Edital"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Edital_numero_key" ON "Edital"("numero");

-- AddForeignKey
ALTER TABLE "Edital" ADD CONSTRAINT "Edital_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parecer" ADD CONSTRAINT "Parecer_editalId_fkey" FOREIGN KEY ("editalId") REFERENCES "Edital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parecer" ADD CONSTRAINT "Parecer_emitidoPorId_fkey" FOREIGN KEY ("emitidoPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_editalId_fkey" FOREIGN KEY ("editalId") REFERENCES "Edital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

