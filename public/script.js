// PRODESP — Automatização de Editais (Front-End Vanilla JS)
const API = "/api";

const STATUS_LABEL = {
  RASCUNHO: "Rascunho",
  AGUARDANDO_REVISAO_JURIDICA: "Aguardando Revisão Jurídica",
  EM_REVISAO_JURIDICA: "Em Revisão Jurídica",
  AGUARDANDO_REVISAO_TECNICA: "Aguardando Revisão Técnica",
  EM_REVISAO_TECNICA: "Em Revisão Técnica",
  AGUARDANDO_APROVACAO_GESTOR: "Aguardando Aprovação do Gestor",
  EM_APROVACAO_GESTOR: "Em Aprovação do Gestor",
  PUBLICADO: "Publicado",
  REPROVADO: "Reprovado",
  EM_CORRECAO: "Em Correção",
};

const PERFIL_LABEL = {
  ADMINISTRADOR: "Administrador",
  JURIDICO: "Jurídico",
  TECNICO: "Técnico",
  GESTOR: "Gestor",
  COMUNICACAO: "Comunicação",
};

const state = {
  token: localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  usuario: null,
};

// ---------- API helper ----------
async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(API + path, { ...opts, headers });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || `Erro ${res.status}`);
  return data;
}

function $(sel) { return document.querySelector(sel); }
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

// ---------- Navegação ----------
const VIEWS = ["dashboard", "editais", "cadastro", "edital", "juridico", "tecnico", "gestor", "admin", "auditoria", "comunicacao"];

function showView(name) {
  VIEWS.forEach((v) => { const s = $("#view-" + v); if (s) s.hidden = true; });
  const target = $("#view-" + name);
  if (target) target.hidden = false;
  document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.view === name));
}

function renderNav() {
  const p = state.usuario?.perfil;
  const items = [{ view: "dashboard", label: "Dashboard" }, { view: "editais", label: "Editais" }];
  if (p === "ADMINISTRADOR") {
    items.push({ view: "cadastro", label: "Cadastro" }, { view: "admin", label: "Usuários" }, { view: "auditoria", label: "Histórico" });
  } else if (p === "JURIDICO") {
    items.push({ view: "juridico", label: "Revisão Jurídica" });
  } else if (p === "TECNICO") {
    items.push({ view: "tecnico", label: "Revisão Técnica" });
  } else if (p === "GESTOR") {
    items.push({ view: "gestor", label: "Aprovação Final" });
  } else if (p === "COMUNICACAO") {
    items.push({ view: "comunicacao", label: "Comunicação" });
  }
  const nav = $("#nav");
  nav.innerHTML = "";
  items.forEach((it) => {
    const a = el("a", "", it.label);
    a.href = "#";
    a.dataset.view = it.view;
    a.addEventListener("click", (e) => { e.preventDefault(); route(it.view); });
    nav.appendChild(a);
  });
}

function route(view) {
  showView(view);
  if (view === "dashboard") loadDashboard();
  else if (view === "editais") loadEditais();
  else if (view === "cadastro") resetFormEdital();
  else if (view === "admin") loadAdmin();
  else if (view === "auditoria") loadAuditoria();
  else if (view === "juridico") loadJuridico();
  else if (view === "tecnico") loadTecnico();
  else if (view === "gestor") loadGestor();
  else if (view === "comunicacao") loadComunicacao();
}

// ---------- Login ----------
function bindLogin() {
  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#login-email").value.trim();
    const senha = $("#login-senha").value;
    const keep = $("#login-keep").checked;
    const err = $("#login-error");
    err.hidden = true;
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, senha }) });
      state.token = data.token;
      state.usuario = data.usuario;
      if (keep) localStorage.setItem("token", data.token);
      else sessionStorage.setItem("token", data.token);
      entrarApp();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    }
  });
  $("#login-google").addEventListener("click", () => alert("Login social (Google) ainda não integrado ao back-end."));
  $("#login-forgot").addEventListener("click", (e) => { e.preventDefault(); alert("Recuperação de senha ainda não integrada ao back-end."); });
}

function entrarApp() {
  $("#view-login").hidden = true;
  $("#view-app").hidden = false;
  $("#user-name").textContent = state.usuario.nome;
  $("#user-perfil").textContent = PERFIL_LABEL[state.usuario.perfil] || state.usuario.perfil;
  $("#btn-novo-edital").hidden = state.usuario.perfil !== "ADMINISTRADOR";
  renderNav();
  route("dashboard");
}

function logout() {
  state.token = null;
  state.usuario = null;
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  $("#view-app").hidden = true;
  $("#view-login").hidden = false;
}

// ---------- Dashboard ----------
async function loadDashboard() {
  const v = $("#view-dashboard");
  v.innerHTML = "";
  const h = el("div", "view-head");
  h.appendChild(el("h2", "", "Painel Inicial"));
  v.appendChild(h);
  try {
    const editais = await api("/editais");
    const porStatus = {};
    editais.forEach((e) => { porStatus[e.status] = (porStatus[e.status] || 0) + 1; });
    const grid = el("div", "grid");
    Object.entries(porStatus).forEach(([st, n]) => {
      const c = el("div", "card");
      c.appendChild(el("div", "stat", String(n)));
      c.appendChild(el("div", "muted", STATUS_LABEL[st] || st));
      grid.appendChild(c);
    });
    v.appendChild(grid);
    const c2 = el("div", "card");
    c2.appendChild(el("h3", "", "Total de editais"));
    c2.appendChild(el("div", "stat", String(editais.length)));
    v.appendChild(c2);
  } catch (ex) {
    v.appendChild(el("p", "error", ex.message));
  }
}

// ---------- Lista de Editais ----------
let editaisCache = [];
let sortKey = "criadoEm";
let sortAsc = false;

async function loadEditais() {
  const statusSel = $("#filtro-status");
  const respSel = $("#filtro-responsavel");
  try {
    editaisCache = await api("/editais");
    const statuses = [...new Set(editaisCache.map((e) => e.status))];
    statusSel.innerHTML = '<option value="">Todos os status</option>';
    statuses.forEach((s) => { const o = el("option", "", STATUS_LABEL[s] || s); o.value = s; statusSel.appendChild(o); });
    const resp = new Map();
    editaisCache.forEach((e) => { if (e.criadoPor) resp.set(e.criadoPor.id, e.criadoPor.nome); });
    respSel.innerHTML = '<option value="">Todos os responsáveis</option>';
    resp.forEach((nome, id) => { const o = el("option", "", nome); o.value = id; respSel.appendChild(o); });
    renderEditais();
  } catch (ex) {
    const tbody = $("#tabela-editais-body");
    tbody.innerHTML = "";
    const tr = el("tr");
    tr.appendChild(el("td", "error", ex.message));
    tbody.appendChild(tr);
  }
}

function renderEditais() {
  const busca = ($("#filtro-busca").value || "").toLowerCase();
  const status = $("#filtro-status").value;
  const resp = $("#filtro-responsavel").value;
  let rows = editaisCache.filter((e) => {
    if (status && e.status !== status) return false;
    if (resp && String(e.criadoPor?.id) !== resp) return false;
    if (busca) {
      const hay = `${e.nome} ${e.numero} ${e.descricao || ""}`.toLowerCase();
      if (!hay.includes(busca)) return false;
    }
    return true;
  });
  rows.sort((a, b) => {
    const av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
    const r = String(av).localeCompare(String(bv));
    return sortAsc ? r : -r;
  });
  const tbody = $("#tabela-editais-body");
  tbody.innerHTML = "";
  rows.forEach((e) => {
    const tr = el("tr");
    const nome = el("td", "clickable", e.nome);
    nome.addEventListener("click", () => abrirEdital(e.id));
    tr.appendChild(nome);
    tr.appendChild(el("td", "", e.numero));
    tr.appendChild(el("td", "", e.codigo));
    const st = el("td");
    st.appendChild(el("span", "pill status-" + e.status, STATUS_LABEL[e.status] || e.status));
    tr.appendChild(st);
    tr.appendChild(el("td", "", fmtData(e.prazoVigencia)));
    tr.appendChild(el("td", "", fmtData(e.dataPublicacao)));
    tbody.appendChild(tr);
  });
}

function fmtData(d) { return d ? new Date(d).toLocaleDateString("pt-BR") : "—"; }

function bindEditais() {
  $("#filtro-busca").addEventListener("input", renderEditais);
  $("#filtro-status").addEventListener("change", renderEditais);
  $("#filtro-responsavel").addEventListener("change", renderEditais);
  document.querySelectorAll("#tabela-editais th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const k = th.dataset.sort;
      if (sortKey === k) sortAsc = !sortAsc;
      else { sortKey = k; sortAsc = false; }
      renderEditais();
    });
  });
  $("#btn-novo-edital").addEventListener("click", () => route("cadastro"));
}

// ---------- Cadastro de Edital ----------
function resetFormEdital() {
  $("#form-edital").reset();
  $("#ed-error").hidden = true;
}

function bindCadastro() {
  $("#form-edital").addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("#ed-error");
    err.hidden = true;
    const fd = new FormData();
    fd.append("numero", $("#ed-numero").value.trim());
    fd.append("nome", $("#ed-nome").value.trim());
    fd.append("descricao", $("#ed-descricao").value.trim());
    if ($("#ed-data").value) fd.append("dataPublicacao", $("#ed-data").value);
    if ($("#ed-prazo").value) fd.append("prazoVigencia", $("#ed-prazo").value);
    const pdf = $("#ed-pdf").files[0];
    if (pdf) fd.append("pdf", pdf);
    try {
      const res = await fetch(API + "/editais", {
        method: "POST",
        headers: { Authorization: `Bearer ${state.token}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.erro || `Erro ${res.status}`);
      route("editais");
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    }
  });
  $("#btn-cancelar-edital").addEventListener("click", () => route("editais"));
}

// ---------- Página do Edital (detalhe) ----------
async function abrirEdital(id) {
  route("edital");
  const v = $("#view-edital");
  v.innerHTML = "";
  try {
    const e = await api("/editais/" + id);
    const h = el("div", "view-head");
    h.appendChild(el("h2", "", e.nome));
    const voltar = el("button", "btn btn-ghost", "← Voltar");
    voltar.addEventListener("click", () => route("editais"));
    h.appendChild(voltar);
    v.appendChild(h);

    const c = el("div", "card");
    const grid = el("div", "grid");
    grid.appendChild(kv("Número", e.numero));
    grid.appendChild(kv("Código", e.codigo));
    grid.appendChild(kv("Status", STATUS_LABEL[e.status] || e.status));
    grid.appendChild(kv("Data de Publicação", fmtData(e.dataPublicacao)));
    grid.appendChild(kv("Prazo de Vigência", fmtData(e.prazoVigencia)));
    grid.appendChild(kv("Responsável", e.criadoPor?.nome || "—"));
    c.appendChild(grid);
    c.appendChild(el("h3", "", "Descrição"));
    c.appendChild(el("p", "", e.descricao || "—"));
    if (e.pdfPath) {
      const a = el("a", "link", "Visualizar / baixar PDF");
      a.href = "/" + e.pdfPath.replace(/\\/g, "/");
      a.target = "_blank";
      c.appendChild(a);
    }
    v.appendChild(c);

    const pc = el("div", "card");
    pc.appendChild(el("h3", "", "Pareceres emitidos"));
    if (e.pareceres?.length) {
      e.pareceres.forEach((p) => {
        const d = el("div", "comment");
        d.appendChild(el("div", "meta", `${PERFIL_LABEL[p.emitidoPor?.perfil] || p.tipo} — ${p.resultado} — ${p.emitidoPor?.nome || ""}`));
        d.appendChild(el("div", "", p.conteudo));
        pc.appendChild(d);
      });
    } else pc.appendChild(el("p", "muted", "Nenhum parecer registrado."));
    v.appendChild(pc);

    v.appendChild(acoesEdital(e));
  } catch (ex) {
    v.appendChild(el("p", "error", ex.message));
  }
}

function kv(k, val) {
  const d = el("div", "kv");
  d.appendChild(el("div", "k", k));
  d.appendChild(el("div", "", val ?? "—"));
  return d;
}

function acoesEdital(e) {
  const box = el("div", "card");
  box.appendChild(el("h3", "", "Ações"));
  const p = state.usuario.perfil;
  if (p === "ADMINISTRADOR" && (e.status === "RASCUNHO" || e.status === "EM_CORRECAO")) {
    const b = el("button", "btn btn-primary", "Enviar para Revisão Jurídica");
    b.addEventListener("click", () => transicionar(e.id, "AGUARDANDO_REVISAO_JURIDICA"));
    box.appendChild(b);
  }
  if (p === "JURIDICO" && (e.status === "AGUARDANDO_REVISAO_JURIDICA" || e.status === "EM_REVISAO_JURIDICA")) {
    box.appendChild(parecerForm(e.id, "JURIDICO"));
  }
  if (p === "TECNICO" && (e.status === "AGUARDANDO_REVISAO_TECNICA" || e.status === "EM_REVISAO_TECNICA")) {
    box.appendChild(parecerForm(e.id, "TECNICO"));
  }
  if (p === "GESTOR" && (e.status === "AGUARDANDO_APROVACAO_GESTOR" || e.status === "EM_APROVACAO_GESTOR")) {
    const ap = el("button", "btn btn-ok", "Aprovar e Publicar");
    ap.addEventListener("click", () => transicionar(e.id, "PUBLICADO"));
    const rp = el("button", "btn btn-danger", "Reprovar");
    rp.addEventListener("click", () => transicionar(e.id, "REPROVADO"));
    box.appendChild(ap);
    box.appendChild(rp);
  }
  if (box.children.length === 1) box.appendChild(el("p", "muted", "Nenhuma ação disponível para seu perfil neste status."));
  return box;
}

function parecerForm(id, tipo) {
  const wrap = el("div");
  const ta = el("textarea", "", "");
  ta.rows = 3;
  ta.placeholder = tipo === "JURIDICO" ? "Observações e apontamentos legais" : "Observações e apontamentos técnicos";
  const aprovar = el("button", "btn btn-ok", "Aprovar");
  const corrigir = el("button", "btn btn-danger", "Solicitar correções");
  aprovar.addEventListener("click", async () => {
    try {
      await api(`/editais/${id}/parecer`, { method: "POST", body: JSON.stringify({ tipo, resultado: "APROVADO", conteudo: ta.value || "Aprovado." }) });
      const dest = tipo === "JURIDICO" ? "AGUARDANDO_REVISAO_TECNICA" : "AGUARDANDO_APROVACAO_GESTOR";
      await transicionar(id, dest);
    } catch (ex) { alert(ex.message); }
  });
  corrigir.addEventListener("click", async () => {
    try {
      await api(`/editais/${id}/parecer`, { method: "POST", body: JSON.stringify({ tipo, resultado: "REPROVADO", conteudo: ta.value || "Correções solicitadas." }) });
      await transicionar(id, "EM_CORRECAO");
    } catch (ex) { alert(ex.message); }
  });
  wrap.appendChild(ta);
  wrap.appendChild(aprovar);
  wrap.appendChild(corrigir);
  return wrap;
}

async function transicionar(id, status) {
  try {
    await api(`/editais/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
    abrirEdital(id);
  } catch (ex) { alert(ex.message); }
}

// ---------- Filas por perfil (Jurídico / Técnico / Gestor) ----------
async function renderFila(viewId, statuses, titulo) {
  const v = $("#view-" + viewId);
  v.innerHTML = "";
  const h = el("div", "view-head");
  h.appendChild(el("h2", "", titulo));
  v.appendChild(h);
  try {
    const editais = await api("/editais");
    const fila = editais.filter((e) => statuses.includes(e.status));
    if (!fila.length) { v.appendChild(el("p", "muted", "Nenhum edital aguardando nesta etapa.")); return; }
    fila.forEach((e) => {
      const c = el("div", "card");
      const linha = el("div", "view-head");
      linha.appendChild(el("h3", "", `${e.nome} (${e.numero})`));
      const abrir = el("button", "btn btn-primary", "Revisar");
      abrir.addEventListener("click", () => abrirEdital(e.id));
      linha.appendChild(abrir);
      c.appendChild(linha);
      c.appendChild(el("p", "muted", `Status: ${STATUS_LABEL[e.status] || e.status} · Prazo: ${fmtData(e.prazoVigencia)}`));
      v.appendChild(c);
    });
  } catch (ex) { v.appendChild(el("p", "error", ex.message)); }
}

function loadJuridico() { renderFila("juridico", ["AGUARDANDO_REVISAO_JURIDICA", "EM_REVISAO_JURIDICA"], "Revisão Jurídica"); }
function loadTecnico() { renderFila("tecnico", ["AGUARDANDO_REVISAO_TECNICA", "EM_REVISAO_TECNICA"], "Especialidade Técnica"); }
function loadGestor() { renderFila("gestor", ["AGUARDANDO_APROVACAO_GESTOR", "EM_APROVACAO_GESTOR"], "Aprovação Final"); }

// ---------- Painel do Administrador (usuários) ----------
async function loadAdmin() {
  const v = $("#view-admin");
  v.innerHTML = "";
  const h = el("div", "view-head");
  h.appendChild(el("h2", "", "Gerenciamento de Usuários"));
  v.appendChild(h);

  const form = el("div", "card");
  form.appendChild(el("h3", "", "Novo usuário"));
  const nome = el("input", "", ""); nome.placeholder = "Nome";
  const email = el("input", "", ""); email.placeholder = "E-mail";
  const senha = el("input", "", ""); senha.type = "password"; senha.placeholder = "Senha";
  const perfil = el("select", "", "");
  ["ADMINISTRADOR", "JURIDICO", "TECNICO", "GESTOR", "COMUNICACAO"].forEach((p) => { const o = el("option", "", PERFIL_LABEL[p]); o.value = p; perfil.appendChild(o); });
  const btn = el("button", "btn btn-primary", "Criar usuário");
  const err = el("p", "error", ""); err.hidden = true;
  btn.addEventListener("click", async () => {
    err.hidden = true;
    try {
      await api("/usuarios", { method: "POST", body: JSON.stringify({ nome: nome.value, email: email.value, senha: senha.value, perfil: perfil.value }) });
      loadAdmin();
    } catch (ex) { err.textContent = ex.message; err.hidden = false; }
  });
  [nome, email, senha, perfil, btn, err].forEach((n) => form.appendChild(n));
  v.appendChild(form);

  const lista = el("div", "card");
  lista.appendChild(el("h3", "", "Usuários"));
  try {
    const users = await api("/usuarios");
    users.forEach((u) => {
      const row = el("div", "view-head");
      const info = el("div", "", `${u.nome} — ${u.email}`);
      info.appendChild(el("span", "badge", PERFIL_LABEL[u.perfil] || u.perfil));
      row.appendChild(info);
      if (u.id !== state.usuario.id) {
        const del = el("button", "btn btn-danger", "Excluir");
        del.addEventListener("click", async () => {
          if (!confirm(`Excluir usuário ${u.nome}?`)) return;
          try { await api("/usuarios/" + u.id, { method: "DELETE" }); loadAdmin(); } catch (ex) { alert(ex.message); }
        });
        row.appendChild(del);
      }
      lista.appendChild(row);
    });
  } catch (ex) { lista.appendChild(el("p", "error", ex.message)); }
  v.appendChild(lista);
}

// ---------- Histórico de Ações (auditoria) ----------
async function loadAuditoria() {
  const v = $("#view-auditoria");
  v.innerHTML = "";
  const h = el("div", "view-head");
  h.appendChild(el("h2", "", "Histórico de Ações"));
  v.appendChild(h);
  const c = el("div", "card");
  try {
    const regs = await api("/auditoria");
    if (!regs.length) { c.appendChild(el("p", "muted", "Nenhuma ação registrada.")); }
    regs.forEach((r) => {
      const row = el("div", "audit-row");
      row.appendChild(el("div", "", `${r.tipoAcao} — ${r.usuario?.nome || ""} (${r.usuario?.perfil || ""})`));
      row.appendChild(el("div", "meta", `${r.edital ? r.edital.numero : "—"} · ${new Date(r.dataHora).toLocaleString("pt-BR")} · ${r.estadoAnterior || "—"} → ${r.estadoPosterior || "—"}`));
      if (r.observacoes) row.appendChild(el("div", "meta", r.observacoes));
      c.appendChild(row);
    });
  } catch (ex) { c.appendChild(el("p", "error", ex.message)); }
  v.appendChild(c);
}

// ---------- Comunicação (read-only, prazos) ----------
async function loadComunicacao() {
  const v = $("#view-comunicacao");
  v.innerHTML = "";
  const h = el("div", "view-head");
  h.appendChild(el("h2", "", "Comunicação — Editais Publicados e Prazos"));
  v.appendChild(h);
  try {
    const editais = await api("/editais");
    const publicados = editais.filter((e) => e.status === "PUBLICADO");
    if (!publicados.length) { v.appendChild(el("p", "muted", "Nenhum edital publicado.")); return; }
    publicados.forEach((e) => {
      const c = el("div", "card");
      c.appendChild(el("h3", "", e.nome));
      c.appendChild(el("p", "muted", `Número: ${e.numero} · Prazo: ${fmtData(e.prazoVigencia)}`));
      const dias = diasRestantes(e.prazoVigencia);
      if (dias != null && dias <= 5) c.appendChild(el("p", "error", `Prazo crítico: vence em ${dias} dia(s).`));
      v.appendChild(c);
    });
  } catch (ex) { v.appendChild(el("p", "error", ex.message)); }
}

function diasRestantes(d) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

// ---------- Init ----------
function init() {
  bindLogin();
  bindEditais();
  bindCadastro();
  $("#btn-logout").addEventListener("click", logout);
  if (state.token) {
    api("/auth/me").then((d) => { state.usuario = d.usuario; entrarApp(); }).catch(logout);
  } else {
    $("#view-login").hidden = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
