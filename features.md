# features.md — Funcionalidades do Sistema
> **Projeto:** Automatização de Editais — PRODESP  
> **Instituição:** Senac SP · 3º Ano do Ensino Médio Integrado a Informática  
> **Ano Letivo:** 2026  
> **Fontes:** Projeto do Ano Letivo (PDF) · Sistema de Gerenciamento de Editais — Front 2 (PDF) · Modelo de Edital Oficial PRODESP — Pregão Eletrônico Nº 90018/2025 (PDF)

---

## Visão Geral

O sistema é uma **plataforma web** para automatizar o processo de elaboração e gerenciamento de editais da PRODESP, substituindo um fluxo atualmente manual por um ciclo digital controlado, rastreável e auditável.

---

## Módulos do Sistema

### 1. Módulo de Autenticação e Acesso

| Funcionalidade | Descrição |
|---|---|
| Login com e-mail e senha | Autenticação segura com validação de campos |
| Login social | Suporte a "Sign in with Google" |
| Recuperação de senha | Fluxo de reset via e-mail ("Esqueci minha senha") |
| Controle de sessão | "Keep me logged in" para sessões persistentes |
| Redirecionamento por perfil | Após login, o usuário é direcionado às telas compatíveis com sua função |

---

### 2. Módulo de Cadastro de Edital (Tela 1)

> Acessível apenas ao perfil **Administrador**.

| Funcionalidade | Descrição |
|---|---|
| Formulário de criação | Interface com validação de dados antes do salvamento |
| Campo: Nome do Edital | Título identificador do edital |
| Campo: Número do Edital | Numeração oficial |
| Campo: Descrição Detalhada | Editor de texto rico com suporte a mídia |
| Campo: Data de Publicação | Seleção de data |
| Campo: Prazo de Vigência | Período de validade do edital |
| Campo: Upload de PDF | Anexo do documento oficial em formato PDF |
| Ação: Salvar | Valida campos, registra o edital e inicia o fluxo de aprovação |
| Ação: Cancelar | Descarta alterações e retorna à lista de editais |

---

### 3. Módulo de Lista de Editais (Tela 2)

> Visão centralizada de todos os editais cadastrados no sistema.

| Funcionalidade | Descrição |
|---|---|
| Tabela interativa | Listagem com colunas: Nome, Número, Código único, Status, Prazo, Data de vigência |
| Pesquisa por texto livre | Busca por nome, número ou descrição |
| Filtro por status | Filtra editais por etapa do fluxo ou prazo |
| Filtro por responsável | Segmenta por usuário responsável |
| Ordenação | Ordena por qualquer coluna da tabela |
| Acesso rápido | Clique para abrir a página detalhada do edital |

---

### 4. Módulo de Página do Edital (Tela 3)

> Consolidação de todas as informações de um edital em uma única tela.

| Funcionalidade | Descrição |
|---|---|
| Dados completos | Exibe nome, número, descrição, data de publicação e prazo de vigência |
| Visualização de PDF | Permite visualizar ou baixar o PDF anexado diretamente na interface |
| Status atual | Exibe a etapa atual do fluxo de aprovação |
| Pareceres emitidos | Histórico dos pareceres jurídico e técnico registrados |
| Documentos relacionados | Edital Consolidado, Anexos Técnicos, Retificações, Esclarecimentos |
| Canal de suporte | Acesso direto à equipe de suporte para dúvidas sobre o edital |

---

### 5. Módulo de Revisão Jurídica (Tela 4)

> Acessível ao perfil **Revisão Jurídica**.

| Funcionalidade | Descrição |
|---|---|
| Análise de conformidade | Revisa o edital conforme a legislação vigente |
| Inserção de observações | Campo para apontamentos e comentários legais |
| Aprovação jurídica | Aprova o edital e registra parecer no sistema |
| Solicitação de correções | Retorna o edital para o Administrador com indicação de ajustes |
| Parecer registrado | Resultado fica armazenado e rastreável no sistema |

---

### 6. Módulo de Especialidade Técnica (Tela 4 — paralela)

> Acessível ao perfil **Especialidade Técnica**.

| Funcionalidade | Descrição |
|---|---|
| Avaliação de requisitos técnicos | Analisa especificações e critérios técnicos do edital |
| Verificação de especificações | Confere compatibilidade com normas e regulatórias |
| Inserção de observações técnicas | Campo para apontamentos e notas técnicas |
| Aprovação técnica | Registra parecer de aprovação técnica |
| Solicitação de ajustes | Retorna o edital para correção técnica |

---

### 7. Módulo de Aprovação Final pelo Gestor (Tela 5)

> Acessível ao perfil **Gestor**.

| Funcionalidade | Descrição |
|---|---|
| Painel consolidado | Exibe pareceres jurídico e técnico lado a lado |
| Dados completos do edital | Resumo completo para revisão final antes da decisão |
| Ação: Aprovar | Confirma o edital e torna-o disponível para publicação |
| Ação: Reprovar | Rejeita o edital e retorna ao responsável para correções |

---

### 8. Módulo de Painel Inicial (Dashboard)

| Funcionalidade | Descrição |
|---|---|
| Indicadores principais | Cards com totais: Editais cadastrados, Pendentes, Aprovados, Reprovados |
| Menu lateral de navegação | Acesso rápido aos módulos compatíveis com o perfil do usuário |
| Visão imediata de status | Situação dos processos em tempo real |

---

### 9. Módulo de Comunicação

> Acessível ao perfil **Comunicação**.

| Funcionalidade | Descrição |
|---|---|
| Visualizar editais publicados | Acesso completo à lista e detalhes dos editais ativos |
| Notificações em tempo real | Alertas automáticos sobre atualizações e mudanças |
| Acompanhar prazos | Controle visual dos cronogramas ativos dos editais |
| Receber alertas de prazos críticos | Notificações para garantir o cumprimento dos cronogramas |

---

### 10. Módulo de Administrador

> Acessível ao perfil **Administrador**.

| Funcionalidade | Descrição |
|---|---|
| Criar usuários | Cadastro de novos usuários no sistema |
| Editar usuários | Atualização de dados e perfis existentes |
| Excluir usuários | Remoção de acessos inativos |
| Definir permissões | Configuração de níveis de acesso por perfil |
| Gestão de integrações | Configurações do sistema e integrações externas |
| Acesso completo ao sistema | Visualização e gerenciamento de todos os módulos |

---

### 11. Módulo de Histórico de Ações (Auditoria)

| Funcionalidade | Descrição |
|---|---|
| Rastreabilidade completa | Todas as ações realizadas são registradas em tabela auditável |
| Filtros por usuário | Filtra ações por quem as executou |
| Filtros por tipo de ação | Filtra por categoria da ação realizada |
| Filtros por intervalo de data | Busca por período específico |
| Tabela de auditoria | Exibe: Usuário, Ação, Data e Horário |
| Conformidade operacional | Garante transparência e conformidade em todo o processo |

---

### 12. Módulo de Pré-visualização do Edital

| Funcionalidade | Descrição |
|---|---|
| Seleção de tópicos | O usuário seleciona quais campos/seções aparecerão no edital |
| Pré-visualização em tempo real | Renderização do documento conforme os campos preenchidos |
| Geração padronizada | Saída em formato compatível com o modelo oficial da PRODESP |
| Download do edital gerado | Exportação do documento em PDF seguindo o padrão PRODESP |

---

### 13. Estrutura Real do Edital PRODESP (Referência de Conteúdo)

> Baseado no **Modelo de Edital oficial da PRODESP** (Pregão Eletrônico Nº 90018/2025).  
> Esta é a estrutura que o sistema deve ser capaz de gerar e gerenciar.

#### Cabeçalho / Metadados do Edital

| Campo | Exemplo Real |
|---|---|
| Modalidade | Pregão Eletrônico |
| Número do Edital | `90018/2025` |
| Versão | `2ª VERSÃO` |
| UASG | `533201` |
| Órgão | CIA. DE PROCESSAMENTO DE DADOS DO ESTADO DE SÃO PAULO — PRODESP |
| Endereço | Rua Agueda Gonçalves, 240 — Taboão da Serra — SP |
| Número do Processo | `359.00000615/2025-33` |
| Objeto | Descrição resumida do objeto da licitação |
| Data e Hora da Sessão Pública | Ex.: `17/11/2025 às 09h` |
| Critério de Julgamento | Ex.: `Maior Desconto por Lote` |
| Modo de Disputa | Ex.: `Aberto` |
| Participação restrita ME/EPP | Sim / Não |

#### Cronograma do Edital (campos obrigatórios)

| Etapa | Descrição |
|---|---|
| Publicação do Aviso de Licitação | Data de publicação oficial |
| Prazo limite para Esclarecimentos e Impugnações | Data limite de envio |
| Prazo limite para resposta de Esclarecimentos | Data limite de resposta |
| Abertura da Sessão Pública | Data e hora da sessão |

#### Seções Obrigatórias do Edital (estrutura completa)

| Nº | Seção |
|---|---|
| 1 | Objeto |
| 2 | Condições para Participação |
| 3 | Propostas |
| 4 | Habilitação |
| 5 | Sessão Pública e Julgamento |
| 6 | Julgamento |
| 7 | Habilitação (detalhamento) |
| 8 | Recurso, Adjudicação e Homologação |
| 9 | Prazos, Locais e Condições de Execução dos Serviços |
| 10 | Condições de Recebimento do Objeto |
| 11 | Pagamentos |
| 12 | Contratação |
| 13 | Sanções Administrativas |
| 14 | Garantia de Execução Contratual |
| 15 | Impugnações e Pedidos de Esclarecimentos |
| 16 | Disposições Gerais |
| 17 | Anexos |

#### Anexos Obrigatórios do Edital

| Anexo | Descrição |
|---|---|
| Anexo I | Termo de Referência |
| Anexo II-A | Modelo de Planilha de Proposta |
| Anexo II-B | Modelo de Planilha Orçamentária |
| Anexo II-C | Modelo de Planilha de Composição de Custos e Preços |
| Anexo II-D | Modelo de Planilha de Composição Analítica do Percentual do BDI |
| Anexo III | Modelo de Declaração de Comprovação de Regularidade (Ministério do Trabalho) |
| Anexo IV | Modelo de Declaração — Marco Legal Anticorrupção |
| Anexo V | Modelo de Declaração de Enquadramento como ME/EPP |
| Anexo VI | Modelo de Declaração (empresas em recuperação judicial) |
| Anexo VII | Modelo de Declaração de Inexistência de Fato Impeditivo |
| Anexo VIII | Modelo de Declaração de Ciência |
| Anexo IX | Modelo de Declaração de Capacidade Técnica |
| Anexo X | Modelo de Planilha de Atestados Apresentados |
| Anexo XI | Minuta de Contrato |
| Anexo XII | Regulamento Interno de Licitações e Contratos da PRODESP |

> **Nota para o desenvolvimento:** O sistema deve permitir que o Administrador preencha os metadados do edital, o cronograma e selecione as seções e anexos aplicáveis, gerando o documento padronizado conforme este modelo oficial.

---

## Fluxo Completo de Aprovação do Edital

```
1. CADASTRO DO EDITAL      →  Administrador cria e envia o edital
2. REVISÃO JURÍDICA        →  Jurídico analisa conformidade legal
        ↓ (Aprovado ou solicita correções)
3. ESPECIALIDADE TÉCNICA   →  Técnico avalia requisitos técnicos
        ↓ (Aprovado ou solicita ajustes)
4. APROVAÇÃO DO GESTOR     →  Gestor revisa pareceres e decide
        ↓
5. RESULTADO               →  Aprovado → Publicado
                               Reprovado → Retorna para correção
```

> Cada etapa pode gerar um ciclo de correções antes de avançar para o próximo nível de aprovação.

---

## Funcionalidades Transversais

| Funcionalidade | Descrição |
|---|---|
| Controle de acesso por perfil | Cada usuário acessa apenas as funcionalidades compatíveis com sua função |
| Rastreabilidade | Histórico completo de todas as ações em todos os módulos |
| Transparência | Informações e status visíveis para os perfis autorizados |
| Upload de documentos | Suporte a arquivos PDF em múltiplos pontos do sistema |
| Notificações | Alertas automáticos de mudanças de status e prazos críticos |
| Responsividade | Interface adaptável (mobile e desktop) |

---

## Entregáveis do Front 1

A equipe Front 1 é responsável pelo **ciclo completo de gestão dos editais**:

- Tela 1 — Cadastro de Edital
- Tela 2 — Lista de Editais
- Tela 3 — Página do Edital
- Tela 4a — Revisão Jurídica
- Tela 4b — Especialidade Técnica
- Tela 5 — Aprovação Final pelo Gestor

## Entregáveis do Front 2

A equipe Front 2 é responsável pelo **fluxo de acesso e navegação da plataforma**:

- Tela Login
- Painel Inicial (Dashboard)
- Tela de Comunicação
- Painel do Administrador
- Histórico de Ações
