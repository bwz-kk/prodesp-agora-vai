# agents.md — Agentes do Sistema
> **Projeto:** Automatização de Editais — PRODESP  
> **Instituição:** Senac SP · 3º Ano do Ensino Médio Integrado a Informática  
> **Ano Letivo:** 2026  
> **Fontes:** Projeto do Ano Letivo (PDF) · Sistema de Gerenciamento de Editais — Front 2 (PDF) · Modelo de Edital Oficial PRODESP — Pregão Eletrônico Nº 90018/2025 (PDF)

---

## Visão Geral

Este documento descreve os **agentes** do sistema em dois sentidos:

1. **Perfis de Usuário** — atores humanos que interagem com a plataforma, cada um com responsabilidades e permissões distintas dentro do fluxo de editais.
2. **Agentes de Automação** — processos automatizados que operam em segundo plano para garantir eficiência, notificações e integridade dos dados.

---

## Parte 1 — Perfis de Usuário (Atores Humanos)

O sistema define **cinco perfis** com responsabilidades e níveis de acesso distintos, garantindo controle granular sobre cada etapa do processo de edital.

---

### 1.1 Administrador

| Atributo | Detalhe |
|---|---|
| **Papel no fluxo** | Ponto de entrada — cadastra e publica editais |
| **Acesso** | Sistema completo |
| **Telas disponíveis** | Cadastro de Edital, Lista de Editais, Página do Edital, Painel do Administrador, Histórico de Ações |

**Responsabilidades:**
- Criar, editar e excluir editais no sistema
- Fazer upload do PDF oficial do edital
- Gerenciar usuários (criar, editar, excluir, definir permissões)
- Configurar integrações do sistema
- Monitorar o sistema completo

**Ações disponíveis:**
- `Criar edital` → inicia o fluxo de aprovação
- `Gerenciar usuários` → controle total de perfis e acessos
- `Visualizar histórico` → auditoria de todas as ações do sistema

---

### 1.2 Revisão Jurídica (Jurídico)

| Atributo | Detalhe |
|---|---|
| **Papel no fluxo** | Etapa 2 — validação legal do edital |
| **Acesso** | Editais em análise jurídica |
| **Telas disponíveis** | Lista de Editais, Página do Edital, Tela de Revisão Jurídica |

**Responsabilidades:**
- Analisar a conformidade do edital com a legislação vigente
- Inserir observações e apontamentos legais
- Emitir parecer jurídico formal
- Solicitar correções quando necessário

**Ações disponíveis:**
- `Revisar legalmente` → análise e anotações no edital
- `Aprovar juridicamente` → edital avança para Especialidade Técnica
- `Solicitar correções` → edital retorna ao Administrador com indicações

**Restrições:**
- Não pode criar ou excluir editais
- Não acessa dados de outros perfis
- Não tem acesso ao painel administrativo

---

### 1.3 Especialidade Técnica (Técnico)

| Atributo | Detalhe |
|---|---|
| **Papel no fluxo** | Etapa 3 — validação técnica do edital |
| **Acesso** | Editais em análise técnica |
| **Telas disponíveis** | Lista de Editais, Página do Edital, Tela de Especialidade Técnica |

**Responsabilidades:**
- Avaliar os requisitos técnicos do edital
- Verificar especificações e compatibilidade com normas e regulatórias
- Emitir parecer técnico
- Solicitar ajustes técnicos quando necessário

**Ações disponíveis:**
- `Revisar tecnicamente` → avaliação e anotações técnicas
- `Aprovar tecnicamente` → edital avança para aprovação do Gestor
- `Solicitar ajustes` → edital retorna para correção com indicações técnicas

**Restrições:**
- Não pode criar ou excluir editais
- Não acessa informações jurídicas em detalhamento interno
- Não tem acesso ao painel administrativo

---

### 1.4 Gestor

| Atributo | Detalhe |
|---|---|
| **Papel no fluxo** | Etapa 4 — decisão final de publicação |
| **Acesso** | Todos os editais e seus pareceres consolidados |
| **Telas disponíveis** | Lista de Editais, Página do Edital, Tela de Aprovação Final |

**Responsabilidades:**
- Visualizar os pareceres jurídico e técnico lado a lado
- Tomar a decisão final de aprovação ou reprovação do edital
- Aprovar → edital é publicado
- Reprovar → edital retorna ao responsável para correções

**Ações disponíveis:**
- `Aprovar edital` → confirma e publica o edital
- `Reprovar edital` → rejeita e retorna para correção

**Restrições:**
- Não pode editar o conteúdo do edital
- Não gerencia usuários
- Decisão baseada nos pareceres já emitidos

---

### 1.5 Comunicação

| Atributo | Detalhe |
|---|---|
| **Papel no fluxo** | Observador — acompanha editais publicados e prazos |
| **Acesso** | Editais e prazos (modo leitura) |
| **Telas disponíveis** | Lista de Editais, Página do Edital, Tela de Comunicação |

**Responsabilidades:**
- Acompanhar editais ativos e seus prazos
- Receber notificações sobre atualizações e mudanças de status
- Monitorar cronogramas para garantir cumprimento de prazos

**Ações disponíveis:**
- `Visualizar editais` → acesso completo à lista e detalhes dos processos
- `Receber notificações` → alertas automáticos sobre atualizações e mudanças
- `Acompanhar prazos` → controle visual dos cronogramas ativos

> **Confirmado pelo PDF do Front 2:** A Tela de Comunicação é uma "Central de Acompanhamento" com notificações em tempo real e alertas de prazos críticos para garantir o cumprimento dos cronogramas.

**Restrições:**
- Acesso somente leitura — não pode criar, editar ou aprovar editais
- Não tem acesso ao painel administrativo
- Não emite pareceres

---

### Tabela Resumo de Permissões

| Perfil | Visualização | Criar Edital | Revisar | Aprovar | Gerenciar Usuários |
|---|---|---|---|---|---|
| Comunicação | Editais e prazos | ✗ | ✗ | ✗ | ✗ |
| Jurídico | Editais em análise | ✗ | ✓ (legal) | ✗ | ✗ |
| Técnico | Editais em análise | ✗ | ✓ (técnico) | ✗ | ✗ |
| Gestor | Todos os editais | ✗ | ✗ | ✓ | ✗ |
| Administrador | Sistema completo | ✓ | ✗ | ✗ | ✓ |

---

## Parte 2 — Agentes de Automação

Os agentes de automação são **processos do sistema** que operam sem interação manual direta, garantindo eficiência, padronização e integridade do fluxo de editais.

---

### 2.1 Agente de Notificação

**Tipo:** Evento-acionado (Event-driven)  
**Tecnologia:** Back-end Node.js + sistema de filas (a definir)

**Responsabilidades:**
- Detectar mudanças de status no fluxo do edital
- Enviar notificações automáticas aos perfis envolvidos na etapa seguinte
- Alertar o perfil Comunicação sobre atualizações relevantes
- Emitir alertas de prazos críticos (ex.: edital próximo do vencimento)

**Gatilhos:**
| Evento | Destinatário | Mensagem |
|---|---|---|
| Edital criado | Jurídico | Novo edital aguarda revisão jurídica |
| Aprovação jurídica | Técnico | Edital aprovado juridicamente, aguarda revisão técnica |
| Aprovação técnica | Gestor | Edital aprovado tecnicamente, aguarda decisão final |
| Aprovação final | Comunicação + Administrador | Edital publicado |
| Reprovação | Administrador | Edital reprovado — verifique as observações |
| Prazo crítico | Comunicação | Edital X vence em N dias |

---

### 2.2 Agente de Validação de Formulário

**Tipo:** Síncrono (executa no momento do submit)  
**Tecnologia:** Back-end Node.js + Prisma

**Responsabilidades:**
- Validar campos obrigatórios antes de salvar o edital
- Verificar formato e tamanho do arquivo PDF enviado
- Garantir que datas sejam coerentes (ex.: prazo de vigência > data de publicação)
- Retornar mensagens de erro específicas por campo

**Regras de validação:**
- Nome do Edital: obrigatório, mínimo de caracteres a definir
- Número do Edital: obrigatório, único no sistema
- Data de Publicação: obrigatória, não pode ser no passado
- Prazo de Vigência: obrigatório, deve ser posterior à data de publicação
- PDF: obrigatório, formato `.pdf`, tamanho máximo a definir

---

### 2.3 Agente de Controle de Fluxo (Workflow Engine)

**Tipo:** Orquestrador de estado  
**Tecnologia:** Back-end Node.js + Prisma (campo `status` no banco de dados)

**Responsabilidades:**
- Gerenciar o estado atual de cada edital no fluxo de aprovação
- Garantir que um edital só avance para a próxima etapa quando a atual for concluída
- Bloquear ações incompatíveis com o estado atual do edital
- Registrar cada transição de estado com data, hora e usuário responsável

**Estados do Edital:**

```
RASCUNHO → AGUARDANDO_REVISÃO_JURIDICA → EM_REVISÃO_JURIDICA
         → AGUARDANDO_REVISÃO_TECNICA  → EM_REVISÃO_TECNICA
         → AGUARDANDO_APROVAÇÃO_GESTOR → EM_APROVAÇÃO_GESTOR
         → PUBLICADO
         → REPROVADO
         → EM_CORREÇÃO
```

**Regras de transição:**
- Apenas o Administrador pode mover de `RASCUNHO` → `AGUARDANDO_REVISÃO_JURIDICA`
- Apenas o Jurídico pode mover para `AGUARDANDO_REVISÃO_TECNICA` ou `EM_CORREÇÃO`
- Apenas o Técnico pode mover para `AGUARDANDO_APROVAÇÃO_GESTOR` ou `EM_CORREÇÃO`
- Apenas o Gestor pode mover para `PUBLICADO` ou `REPROVADO`

---

### 2.4 Agente de Auditoria (Logger)

**Tipo:** Passivo — registra todas as ações do sistema  
**Tecnologia:** Back-end Node.js + tabela de auditoria no PostgreSQL

**Responsabilidades:**
- Registrar automaticamente cada ação realizada no sistema
- Associar cada registro ao usuário, data e hora da ação
- Armazenar o estado anterior e posterior do edital em cada mudança
- Disponibilizar os dados para consulta via tela de Histórico de Ações

**Dados registrados por ação:**

| Campo | Descrição |
|---|---|
| `usuario_id` | ID do usuário que realizou a ação |
| `tipo_acao` | Ex.: `CRIAR_EDITAL`, `APROVAR_JURIDICO`, `REPROVAR_GESTOR` |
| `edital_id` | ID do edital afetado |
| `estado_anterior` | Status do edital antes da ação |
| `estado_posterior` | Status do edital após a ação |
| `data_hora` | Timestamp UTC da ação |
| `observacoes` | Comentários inseridos pelo usuário (pareceres, correções) |

---

### 2.5 Agente de Controle de Acesso (RBAC)

**Tipo:** Middleware de autorização  
**Tecnologia:** Back-end Node.js (middleware nas rotas da API)

**Responsabilidades:**
- Interceptar todas as requisições à API antes de processá-las
- Verificar se o usuário autenticado possui permissão para a ação solicitada
- Bloquear acessos não autorizados com resposta `403 Forbidden`
- Garantir isolamento entre perfis — cada usuário acessa apenas o que lhe é permitido

**Funcionamento:**
```
Requisição → [Middleware de Autenticação] → [Middleware RBAC] → Controller
                      ↓                             ↓
               Token inválido?              Sem permissão?
                   401                           403
```

---

### 2.6 Agente de Geração de Documento (Edital PDF)

**Tipo:** Sob demanda (triggered pelo Administrador)  
**Tecnologia:** Back-end Node.js + biblioteca de geração de PDF (a definir)

**Responsabilidades:**
- Receber os dados preenchidos no formulário de cadastro de edital
- Montar o documento seguindo a estrutura oficial do modelo PRODESP
- Preencher automaticamente os campos padronizados (cabeçalho, UASG, endereço da PRODESP, etc.)
- Inserir as seções selecionadas pelo Administrador na ordem correta
- Gerar o arquivo PDF final para upload e disponibilização no sistema

**Estrutura gerada (baseada no Modelo Oficial PRODESP — Pregão Nº 90018/2025):**

| Bloco | Campos preenchidos automaticamente |
|---|---|
| Cabeçalho | Modalidade, Número, Versão, UASG, Órgão, Endereço |
| Cronograma | Datas de publicação, impugnação, abertura da sessão |
| Corpo (Seções 1–16) | Seções selecionadas com conteúdo padrão editável |
| Anexos (I–XII) | Lista de anexos incluídos no edital |

---

### Tabela Resumo dos Agentes de Automação

| Agente | Tipo | Tecnologia | Função Principal |
|---|---|---|---|
| Notificação | Evento-acionado | Node.js | Alertas automáticos por mudança de status |
| Validação de Formulário | Síncrono | Node.js + Prisma | Verificação de campos antes do salvamento |
| Controle de Fluxo | Orquestrador | Node.js + Prisma | Gerencia estados e transições do edital |
| Auditoria (Logger) | Passivo | Node.js + PostgreSQL | Registra todas as ações com rastreabilidade |
| Controle de Acesso (RBAC) | Middleware | Node.js | Autorização por perfil em cada rota da API |
| Geração de Documento | Sob demanda | Node.js + lib PDF | Gera o PDF do edital seguindo o modelo oficial PRODESP |
