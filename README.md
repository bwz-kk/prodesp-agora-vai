# PRODESP — Automatização de Editais

Plataforma web para automatizar a elaboração e o gerenciamento de editais da PRODESP, substituindo o fluxo manual por um ciclo digital, rastreável e auditável, com aprovação por etapas (Administrador → Jurídico → Técnico → Gestor).

> **Instituição:** Senac SP · 3º Ano do Ensino Médio Integrado a Informática · Ano Letivo 2026

---

## Stack

| Camada | Tecnologia |
|---|---|
| Front-End | HTML5, CSS3, JavaScript Vanilla (`public/`) |
| Back-End | Node.js + Express.js + TypeScript |
| ORM | Prisma 7 (`prisma-client` generator) + driver adapter PostgreSQL |
| Banco de Dados | PostgreSQL (local via Docker; produção: Prisma Postgres) |
| Container | Docker + Docker Compose |
| Deploy | Prisma Compute (`@prisma/cli`) |

---

## Estrutura

```
prodesp-agora-vai/
├── prisma/
│   ├── schema.prisma        # Modelos + enums (Perfil, StatusEdital, ...)
│   ├── migrations/          # Migrações SQL
│   └── seed.ts              # Usuários de demonstração por perfil
├── src/
│   ├── database/index.ts    # PrismaClient + driver adapter (PrismaPg)
│   ├── controllers/         # Lógica de negócio (auth, editais, auditoria, usuarios)
│   ├── routes/              # Endpoints REST
│   ├── middlewares/         # authenticate (JWT), rbac, validate, upload, errorHandler
│   ├── utils/               # workflow (state machine) e audit (logger)
│   ├── generated/prisma/    # Cliente Prisma gerado (gitignored, regenerado no build)
│   ├── app.ts               # Express app
│   └── server.ts            # Entry point
├── public/                  # Front-end (HTML/CSS/JS)
├── prisma.config.ts         # Config Prisma 7 (migrações via DATABASE_URL)
├── prisma.compute.ts        # Config do Prisma Compute
├── docker-compose.yml       # PostgreSQL local
└── package.json
```

---

## Configuração local

### 1. Instalar dependências
```bash
npm install
```

### 2. Variáveis de ambiente
Copie `.env.example` para `.env` e ajuste:
```env
DATABASE_URL="postgresql://postgres:prodesp123@localhost:5432/prodesp_editais"
DB_PASSWORD=prodesp123
DB_NAME=prodesp_editais
PORT=3000
JWT_SECRET=dev_secret_prodesp_2026
NODE_ENV=development
```

### 3. Subir o PostgreSQL (Docker)
```bash
docker compose up -d
```
> Requer Docker Desktop com engine WSL2 ativo. Se `docker info` retornar erro 500,
> instale o WSL2 (`wsl --install --no-distribution` em terminal Administrador) e reinicie.

### 4. Aplicar migrações e popular dados
```bash
npx prisma migrate deploy
npx prisma db seed
```

### 5. Rodar
```bash
npm run dev      # desenvolvimento (ts-node-dev)
npm run build    # prisma generate && tsc
npm start        # node dist/server.js
```

A API sobe em `http://localhost:3000` (health: `/api/health`).

---

## Usuários de demonstração (seed)

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@prodesp.gov.br` | `123456` |
| Jurídico | `juridico@prodesp.gov.br` | `123456` |
| Técnico | `tecnico@prodesp.gov.br` | `123456` |
| Gestor | `gestor@prodesp.gov.br` | `123456` |
| Comunicação | `comunicacao@prodesp.gov.br` | `123456` |

---

## Endpoints da API

| Método | Rota | Perfil |
|---|---|---|
| POST | `/api/auth/login` | público |
| GET | `/api/auth/me` | autenticado |
| GET | `/api/editais` | autenticado |
| POST | `/api/editais` | Administrador |
| GET | `/api/editais/:id` | autenticado |
| PUT | `/api/editais/:id` | Administrador |
| PUT | `/api/editais/:id/status` | workflow (RBAC por estado) |
| POST | `/api/editais/:id/parecer` | Jurídico / Técnico |
| DELETE | `/api/editais/:id` | Administrador |
| GET | `/api/auditoria` | Administrador |
| GET/POST/DELETE | `/api/usuarios` | Administrador |
| GET | `/api/health` | público |

Autenticação via `Authorization: Bearer <token>` (JWT).

---

## Fluxo de aprovação (workflow)

```
RASCUNHO → AGUARDANDO_REVISÃO_JURIDICA → EM_REVISÃO_JURIDICA
         → AGUARDANDO_REVISÃO_TECNICA  → EM_REVISÃO_TECNICA
         → AGUARDANDO_APROVAÇÃO_GESTOR → EM_APROVAÇÃO_GESTOR
         → PUBLICADO | REPROVADO | EM_CORREÇÃO
```

Regras de transição por perfil em `src/utils/workflow.ts`. Toda transição é registrada na tabela `Auditoria` (usuário + data/hora + estado anterior/posterior).

---

## Deploy (Prisma Compute)

A aplicação está publicada em **https://xcodlgzjj79u5cie7z0c474y.ewr.prisma.build** (projeto `Prodesp`, região `us-east-1`, branch `main`).

Fluxo de deploy:
```bash
npx @prisma/cli@latest auth login
npx @prisma/cli@latest app deploy --project proj_cmsv2uahl1enj02dzm4ax8wlm --prod -y
```

Configurações relevantes:
- `prisma.compute.ts` — framework `custom`, build `npm run build`, output `dist`, entrypoint `server.js`, porta 3000.
- `prisma.config.ts` — migrações via `DATABASE_URL` (carregado de `.env` por `dotenv/config`).
- O runtime usa o **driver adapter** `@prisma/adapter-pg` (Prisma 7), compatível com o engine Bun do Prisma Compute.

---

## Documentação de referência

- `agents.md` — perfis de usuário e agentes de automação
- `architecture.md` — arquitetura do sistema
- `features.md` — funcionalidades e histórias
