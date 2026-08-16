# architecture.md — Arquitetura do Sistema
> **Projeto:** Automatização de Editais — PRODESP  
> **Instituição:** Senac SP · 3º Ano do Ensino Médio Integrado a Informática  
> **Ano Letivo:** 2026  
> **Fontes:** Projeto do Ano Letivo (PDF) · Sistema de Gerenciamento de Editais — Front 2 (PDF) · Modelo de Edital Oficial PRODESP — Pregão Eletrônico Nº 90018/2025 (PDF)

---

## 1. Visão Geral da Arquitetura

O sistema adota uma **arquitetura modular em três camadas**, com separação clara de responsabilidades entre interface, lógica de negócio e armazenamento de dados.

```
┌─────────────────────────────────────────────┐
│              CAMADA DE APRESENTAÇÃO          │
│         Front-End — HTML / CSS / JS Vanilla  │
│  (Equipe Front 1: Editais | Front 2: Acesso) │
└───────────────────────┬─────────────────────┘
                        │ HTTP (REST API)
┌───────────────────────▼─────────────────────┐
│              CAMADA DE NEGÓCIO               │
│         Back-End — JavaScript / Node.js      │
│     (Controllers · Routes · Middlewares)     │
└───────────────────────┬─────────────────────┘
                        │ Prisma ORM
┌───────────────────────▼─────────────────────┐
│           CAMADA DE DADOS                    │
│   Banco de Dados — PostgreSQL (via Docker)    │
│   ORM: Prisma + TypeScript                   │
└─────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológico

| Camada | Tecnologia | Versão / Observação |
|---|---|---|
| Front-End | HTML5 | Semântico e acessível |
| Front-End | CSS3 | Estilização e responsividade |
| Front-End | JavaScript Vanilla | Sem frameworks — JS puro |
| Back-End | JavaScript (Node.js) | Runtime do servidor |
| Back-End | Express.js | Framework HTTP (implícito pelo uso de routes/) |
| ORM | Prisma | Mapeamento objeto-relacional com TypeScript |
| Tipagem | TypeScript | Usado na camada de banco e ORM |
| Banco de Dados | PostgreSQL | Banco relacional principal |
| Containerização | Docker + Docker Compose | Ambiente do PostgreSQL em container |
| Versionamento | GitHub | Controle de código-fonte e colaboração |
| Gestão de Tarefas | Microsoft Planner | Controle de sprints e progresso |
| Infraestrutura | Cloud (a definir) | Deploy e disponibilização da aplicação |

---

## 3. Estrutura de Pastas do Projeto

```
/prodesp-edital-automator
│
├── docker-compose.yml        # Configuração do PostgreSQL no Docker
├── .env                      # Variáveis de ambiente sensíveis (senha do banco, porta)
├── package.json              # Registro de dependências (npm install)
│
├── prisma/                   # Configuração do ORM (Back-End)
│   └── schema.prisma         # Definição das tabelas do banco de dados
│
├── src/                      # Código-fonte do Back-End
│   ├── database/             # Conexão com o Prisma Client
│   ├── controllers/          # Lógica de negócio (criar edital, listar perfis, etc.)
│   ├── routes/               # Definição das URLs da API REST
│   └── server.js             # Arquivo principal — inicializa o Node.js
│
└── public/                   # Código-fonte do Front-End (Vanilla JS)
    ├── index.html            # Tela principal
    ├── style.css             # Visual do sistema
    └── script.js            # Lógica de clique e envio de dados
```

---

## 4. Arquitetura do Back-End

### 4.1 Camada de Rotas (`src/routes/`)

Define os endpoints da API REST. Cada recurso principal tem seu próprio arquivo de rotas.

**Rotas previstas:**

| Método | Endpoint | Controller | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/login` | AuthController | Autenticação do usuário |
| `POST` | `/api/auth/logout` | AuthController | Encerramento de sessão |
| `GET` | `/api/editais` | EditalController | Listagem de editais (com filtros) |
| `POST` | `/api/editais` | EditalController | Criação de novo edital |
| `GET` | `/api/editais/:id` | EditalController | Detalhes de um edital específico |
| `PUT` | `/api/editais/:id` | EditalController | Atualização de edital |
| `PUT` | `/api/editais/:id/status` | FluxoController | Transição de estado no fluxo |
| `POST` | `/api/editais/:id/parecer` | ParecerController | Registro de parecer (jurídico/técnico) |
| `GET` | `/api/usuarios` | UsuarioController | Listagem de usuários (Admin) |
| `POST` | `/api/usuarios` | UsuarioController | Criação de usuário (Admin) |
| `PUT` | `/api/usuarios/:id` | UsuarioController | Edição de usuário (Admin) |
| `DELETE` | `/api/usuarios/:id` | UsuarioController | Exclusão de usuário (Admin) |
| `GET` | `/api/auditoria` | AuditoriaController | Histórico de ações (com filtros) |
| `POST` | `/api/editais/:id/upload` | UploadController | Upload do PDF do edital |
| `POST` | `/api/editais/:id/gerar-pdf` | GeracaoPDFController | Gera o PDF do edital no modelo oficial PRODESP |

---

### 4.2 Camada de Controllers (`src/controllers/`)

Contém a lógica de negócio da aplicação.

**Controllers previstos:**

| Controller | Responsabilidade |
|---|---|
| `AuthController` | Login, logout, validação de token, recuperação de senha |
| `EditalController` | CRUD completo de editais, listagem com filtros e ordenação |
| `FluxoController` | Gerenciamento de transições de estado do fluxo de aprovação |
| `ParecerController` | Registro de pareceres jurídico e técnico |
| `UsuarioController` | CRUD de usuários, atribuição de perfis e permissões |
| `AuditoriaController` | Consulta ao histórico de ações com filtros |
| `UploadController` | Recebimento, validação e armazenamento de arquivos PDF |
| `NotificacaoController` | Disparo de notificações por mudança de status |
| `GeracaoPDFController` | Geração do documento PDF no formato oficial PRODESP (Pregão Eletrônico) |

---

### 4.3 Middlewares

Interceptores que operam entre a requisição e o controller.

| Middleware | Função |
|---|---|
| `autenticacao.js` | Verifica se o token JWT da sessão é válido. Retorna `401` se inválido. |
| `autorizacao.js` (RBAC) | Verifica se o perfil do usuário tem permissão para a rota acessada. Retorna `403` se não autorizado. |
| `upload.js` | Processa o recebimento de arquivos multipart/form-data (PDF) |
| `logger.js` | Registra automaticamente cada ação relevante na tabela de auditoria |
| `validacao.js` | Valida os dados do body antes de passar ao controller |

---

### 4.4 Camada de Banco de Dados (`prisma/schema.prisma`)

#### Modelos de Dados Previstos

**Usuário**
```prisma
model Usuario {
  id         Int       @id @default(autoincrement())
  nome       String
  email      String    @unique
  senha      String
  perfil     Perfil
  criadoEm  DateTime  @default(now())
  editais    Edital[]
  pareceres  Parecer[]
  acoes      Auditoria[]
}

enum Perfil {
  ADMINISTRADOR
  JURIDICO
  TECNICO
  GESTOR
  COMUNICACAO
}
```

**Edital**
```prisma
model Edital {
  id               Int        @id @default(autoincrement())
  titulo           String
  numero           String     @unique
  descricao        String     @db.Text
  dataPublicacao   DateTime
  prazoVigencia    DateTime
  pdfUrl           String?
  status           StatusEdital @default(RASCUNHO)
  criadoPor        Usuario    @relation(fields: [criadoPorId], references: [id])
  criadoPorId      Int
  criadoEm        DateTime   @default(now())
  atualizadoEm    DateTime   @updatedAt
  pareceres        Parecer[]
  historico        Auditoria[]
}

enum StatusEdital {
  RASCUNHO
  AGUARDANDO_REVISAO_JURIDICA
  EM_REVISAO_JURIDICA
  AGUARDANDO_REVISAO_TECNICA
  EM_REVISAO_TECNICA
  AGUARDANDO_APROVACAO_GESTOR
  EM_APROVACAO_GESTOR
  PUBLICADO
  REPROVADO
  EM_CORRECAO
}
```

**Parecer**
```prisma
model Parecer {
  id          Int          @id @default(autoincrement())
  tipo        TipoParecer
  resultado   ResultadoParecer
  observacoes String?      @db.Text
  edital      Edital       @relation(fields: [editalId], references: [id])
  editalId    Int
  autor       Usuario      @relation(fields: [autorId], references: [id])
  autorId     Int
  criadoEm   DateTime     @default(now())
}

enum TipoParecer {
  JURIDICO
  TECNICO
  GESTOR
}

enum ResultadoParecer {
  APROVADO
  REPROVADO
  CORRECAO_SOLICITADA
}
```

**Auditoria**
```prisma
model Auditoria {
  id              Int       @id @default(autoincrement())
  tipoAcao        String
  edital          Edital?   @relation(fields: [editalId], references: [id])
  editalId        Int?
  usuario         Usuario   @relation(fields: [usuarioId], references: [id])
  usuarioId       Int
  estadoAnterior  String?
  estadoPosterior String?
  observacoes     String?   @db.Text
  dataHora        DateTime  @default(now())
}
```

---

## 5. Arquitetura do Front-End

### 5.1 Divisão por Equipes

O Front-End é dividido entre duas equipes com responsabilidades distintas e integradas:

| Equipe | Responsabilidade | Telas |
|---|---|---|
| **Front 1** | Fluxo completo dos editais | Cadastro · Lista · Página do Edital · Revisão Jurídica · Especialidade Técnica · Aprovação Final |
| **Front 2** | Fluxo de acesso e navegação | Login · Painel Inicial · Comunicação · Administrador · Histórico de Ações |

### 5.2 Integração entre Front 1 e Front 2

```
Usuário acessa o sistema
        ↓
  [LOGIN — Front 2]
  Autenticação e definição de perfil
        ↓
  [PAINEL INICIAL — Front 2]
  Dashboard com indicadores
        ↓
  Redireciona conforme perfil
  ┌─────────────────────────────────────┐
  │ Front 1: Lista de Editais           │
  │ Front 1: Cadastro / Revisão / etc.  │
  └─────────────────────────────────────┘
```

### 5.3 Padrão de Comunicação com a API

O Front-End se comunica com o Back-End via **requisições HTTP assíncronas (Fetch API)**.

```javascript
// Exemplo de padrão de chamada à API
async function buscarEditais() {
  const resposta = await fetch('/api/editais', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const dados = await resposta.json();
  renderizarTabela(dados);
}
```

---

## 6. Modelo de Documento — Referência Oficial PRODESP

O sistema deve ser capaz de gerar e gerenciar editais conforme o **modelo oficial de Pregão Eletrônico da PRODESP**, extraído do documento real (Pregão Eletrônico Nº 90018/2025).

### 6.1 Campos do Cabeçalho (preenchidos no cadastro)

| Campo | Tipo | Obrigatório |
|---|---|---|
| Modalidade | Texto fixo ("Pregão Eletrônico") | Sim |
| Número do Edital | Texto (ex.: `90018/2025`) | Sim |
| Versão | Texto (ex.: `2ª VERSÃO`) | Sim |
| UASG | Código numérico (`533201`) | Sim |
| Número do Processo | Texto (ex.: `359.00000615/2025-33`) | Sim |
| Objeto | Texto longo | Sim |
| Data e Hora da Sessão Pública | Data + Hora | Sim |
| Critério de Julgamento | Seleção (ex.: Maior Desconto, Menor Preço) | Sim |
| Modo de Disputa | Seleção (Aberto / Fechado / Combinado) | Sim |
| Participação restrita ME/EPP | Booleano (Sim / Não) | Sim |

### 6.2 Cronograma Obrigatório

| Etapa | Tipo |
|---|---|
| Publicação do Aviso de Licitação | Data |
| Prazo limite para Esclarecimentos e Impugnações | Data |
| Prazo limite para resposta de Esclarecimentos e Impugnações | Data |
| Abertura da Sessão Pública | Data + Hora |

### 6.3 Seções do Corpo do Edital (1–16)

O sistema deve permitir que o Administrador selecione e preencha as seguintes seções:

```
1.  Objeto
2.  Condições para Participação
3.  Propostas
4.  Habilitação
5.  Sessão Pública e Julgamento
6.  Julgamento
7.  Habilitação (detalhamento)
8.  Recurso, Adjudicação e Homologação
9.  Prazos, Locais e Condições de Execução dos Serviços
10. Condições de Recebimento do Objeto
11. Pagamentos
12. Contratação
13. Sanções Administrativas
14. Garantia de Execução Contratual
15. Impugnações e Pedidos de Esclarecimentos
16. Disposições Gerais
17. Anexos
```

### 6.4 Anexos Disponíveis (I a XII)

| Anexo | Conteúdo |
|---|---|
| I | Termo de Referência |
| II-A | Modelo de Planilha de Proposta |
| II-B | Modelo de Planilha Orçamentária |
| II-C | Modelo de Planilha de Composição de Custos e Preços |
| II-D | Modelo de Planilha de Composição Analítica do BDI |
| III | Declaração de Comprovação de Regularidade (Ministério do Trabalho) |
| IV | Declaração — Marco Legal Anticorrupção |
| V | Declaração de Enquadramento como ME/EPP |
| VI | Declaração — empresas em recuperação judicial |
| VII | Declaração de Inexistência de Fato Impeditivo |
| VIII | Declaração de Ciência |
| IX | Declaração de Capacidade Técnica |
| X | Planilha de Atestados Apresentados |
| XI | Minuta de Contrato |
| XII | Regulamento Interno de Licitações e Contratos da PRODESP |

---

## 7. Infraestrutura e Deploy

### 7.1 Ambiente de Desenvolvimento (Docker)

O banco de dados PostgreSQL roda em container Docker, garantindo consistência entre os ambientes de todos os desenvolvedores.

```yaml
# docker-compose.yml (estrutura prevista)
version: '3.8'
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: prodesp_editais
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

### 7.2 Variáveis de Ambiente (`.env`)

```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/prodesp_editais"
PORT=3000
JWT_SECRET=sua_chave_secreta
```

### 7.3 Cloud (Produção)

A equipe Cloud (Henrique, Kaio e Enzo Nunez) é responsável pela infraestrutura de produção. O deploy incluirá:

- Hospedagem da aplicação Node.js em serviço cloud (a definir)
- Banco de dados PostgreSQL gerenciado ou em container cloud
- Configuração de domínio e HTTPS
- Monitoramento de disponibilidade

---

## 8. Metodologia de Desenvolvimento

O projeto adota **Scrum** como metodologia ágil, com os seguintes papéis:

| Papel | Descrição |
|---|---|
| **Product Owner** | Define prioridades e valida entregas com a PRODESP |
| **Scrum Master** | Facilita cerimônias e remove impedimentos |
| **Time de Desenvolvimento** | Executa as atividades de cada sprint |

### Cronograma de Sprints

| Mês | Entrega |
|---|---|
| Maio | Análise e conduta de desenvolvimento |
| Junho | Protótipos de tela e banco de dados |
| Agosto | Andamento do Front-End e Back-End |
| Setembro | Andamento do Front-End e Back-End (continuação) |
| Outubro | Testes e finalização do MVP |
| Novembro | Documentação, testes, finalização e apresentação final para a PRODESP |

---

## 9. Equipes e Responsabilidades Técnicas

| Área | Integrantes | Responsabilidade |
|---|---|---|
| **Back-End** | Henrique, André Kenzo, Kaio, Eduardo, Pedro, Vinicius Barbosa, Arthur José, Matheus | Lógica de negócio, APIs e integração com banco de dados |
| **Front-End** | Caio Feitosa, Enzo Guedes, Arthur Arcanjo, Isadora, Vinicius Nicolau, Maria Luiza, Guilherme Ruiz, Felipe Navarro, Ana, Sofia, Yasmin, Stella | Interfaces e experiência do usuário |
| **Banco de Dados** | André Kenzo, Henrique, Kaio, Enzo Nunez | Modelagem e gerenciamento das informações |
| **Cloud** | Henrique, Kaio, Enzo Nunez | Infraestrutura e disponibilização da aplicação |
| **Testes** | Guilherme Monteiro, João Pedro, Arthur Martins, Kaio | Validação funcional e controle de qualidade |
| **Documentação e Administração** | Eduardo Augusto, Arthur Sales, João Pedro, Guilherme Monteiro, Arthur Siqueira | Gerenciamento documental e acompanhamento do projeto |

---

## 10. Protótipo

O protótipo de interface está disponível em:

> 🔗 [https://stella032026.github.io/Prodesp/](https://stella032026.github.io/Prodesp/)

O protótipo foi desenvolvido durante a fase inicial do projeto para validar a experiência do usuário antes do início da implementação completa, cobrindo os fluxos de navegação e a identidade visual da plataforma.
