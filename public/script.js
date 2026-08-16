// PRODESP — Sistema de Editais (Front-End Vanilla JS)
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

// Perfis de demonstração (mapeados aos perfis reais do back-end)
const DEMO_PROFILES = [
  { key: "ADMINISTRADOR", label: "Administrador", nome: "Carlos", email: "admin@prodesp.gov.br", color: "#6d28d9" },
  { key: "GESTOR", label: "Gestor", nome: "Roberto Almeida", email: "gestor@prodesp.gov.br", color: "#2563eb" },
  { key: "TECNICO", label: "Analista", nome: "Fernanda Lima", email: "tecnico@prodesp.gov.br", color: "#0ea5e9" },
  { key: "COMUNICACAO", label: "Visualizador", nome: "Mariana Costa", email: "comunicacao@prodesp.gov.br", color: "#16a34a" },
  { key: "JURIDICO", label: "Revisor Jurídico", nome: "Paulo Mendes", email: "juridico@prodesp.gov.br", color: "#d97706" },
];

const NAV_CONFIG = {
  ADMINISTRADOR: [
    { view: "dashboard", label: "Dashboard", icon: "dashboard" },
    { view: "editais", label: "Editais", icon: "doc" },
    { view: "cadastro", label: "Novo Edital", icon: "plus" },
    { view: "admin", label: "Administração", icon: "users" },
    { view: "auditoria", label: "Relatórios", icon: "report" },
  ],
  JURIDICO: [
    { view: "dashboard", label: "Dashboard", icon: "dashboard" },
    { view: "editais", label: "Editais", icon: "doc" },
    { view: "juridico", label: "Pareceres", icon: "shield" },
  ],
  TECNICO: [
    { view: "dashboard", label: "Dashboard", icon: "dashboard" },
    { view: "editais", label: "Editais", icon: "doc" },
    { view: "tecnico", label: "Pareceres", icon: "clipboard" },
  ],
  GESTOR: [
    { view: "dashboard", label: "Dashboard", icon: "dashboard" },
    { view: "editais", label: "Editais", icon: "doc" },
    { view: "gestor", label: "Aprovações", icon: "check" },
  ],
  COMUNICACAO: [
    { view: "dashboard", label: "Dashboard", icon: "dashboard" },
    { view: "editais", label: "Editais", icon: "doc" },
    { view: "licitacao", label: "Solicitar Licitação", icon: "plus" },
  ],
};

// Ícones (SVG outline)
const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
};

function icon(name) { return ICONS[name] || ""; }

const state = {
  token: localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  usuario: null,
  demoProfile: null, // chave do perfil de demonstração ativo
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
function elHtml(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
function fmtData(d) { return d ? new Date(d).toLocaleDateString("pt-BR") : "—"; }
function initials(nome) {
  const p = (nome || "?").trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase() || "?";
}

// ---------- Navegação / views ----------
const VIEWS = ["dashboard", "editais", "cadastro", "edital", "juridico", "tecnico", "gestor", "admin", "auditoria", "comunicacao", "licitacao"];

function showView(name) {
  VIEWS.forEach((v) => { const s = $("#view-" + v); if (s) s.hidden = true; });
  const target = $("#view-" + name);
  if (target) target.hidden = false;
  document.querySelectorAll("#sidebar-nav a").forEach((a) => a.classList.toggle("active", a.dataset.view === name));
}

function demoProfile() {
  return DEMO_PROFILES.find((p) => p.key === state.demoProfile) || DEMO_PROFILES[0];
}

function renderShell() {
  const dp = demoProfile();
  const nome = dp.nome;
  const role = dp.label;
  $("#sb-avatar").textContent = initials(nome);
  $("#sb-name").textContent = nome;
  $("#sb-role").textContent = role;
  $("#tb-avatar").textContent = initials(nome);
  $("#tb-name").textContent = nome;
  $("#tb-role").textContent = role;
  renderNav();
  renderSwitcher();
}

function renderNav() {
  const items = NAV_CONFIG[state.demoProfile] || NAV_CONFIG.ADMINISTRADOR;
  const nav = $("#sidebar-nav");
  nav.innerHTML = "";
  items.forEach((it) => {
    const a = elHtml("a", "", icon(it.icon) + "<span>" + it.label + "</span>");
    a.href = "#";
    a.dataset.view = it.view;
    a.addEventListener("click", (e) => { e.preventDefault(); route(it.view); });
    nav.appendChild(a);
  });
}

function renderSwitcher() {
  const box = $("#sw-pills");
  box.innerHTML = "";
  DEMO_PROFILES.forEach((p) => {
    const b = el("button", "sw-pill" + (p.key === state.demoProfile ? " active" : ""), p.label);
    b.addEventListener("click", () => {
      state.demoProfile = p.key;
      renderShell();
      route("dashboard");
    });
    box.appendChild(b);
  });
}

function route(view) {
  const labels = { dashboard: "Dashboard", editais: "Editais", cadastro: "Novo Edital", edital: "Edital", juridico: "Pareceres", tecnico: "Pareceres", gestor: "Aprovações", admin: "Administração", auditoria: "Relatórios", comunicacao: "Comunicação", licitacao: "Solicitar Licitação" };
  $("#crumb-current").textContent = labels[view] || "Dashboard";
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
  else if (view === "licitacao") loadLicitacao();
}

// ---------- Login ----------
function renderDemoProfiles() {
  const box = $("#demo-profiles");
  box.innerHTML = "";
  DEMO_PROFILES.forEach((p) => {
    const row = elHtml("div", "demo-profile",
      '<div class="av" style="background:' + p.color + '">' + initials(p.nome) + '</div>' +
      '<div class="info"><b>' + p.label + '</b><span>' + p.email + '</span></div>');
    row.addEventListener("click", () => {
      $("#login-email").value = p.email;
      $("#login-senha").value = "123456";
    });
    box.appendChild(row);
  });
}

function bindLogin() {
  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#login-email").value.trim();
    const senha = $("#login-senha").value;
    const err = $("#login-error");
    err.hidden = true;
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, senha }) });
      state.token = data.token;
      state.usuario = data.usuario;
      state.demoProfile = data.usuario.perfil;
      localStorage.setItem("token", data.token);
      entrarApp();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    }
  });
  $("#login-eye").addEventListener("click", () => {
    const i = $("#login-senha");
    i.type = i.type === "password" ? "text" : "password";
  });
  $("#login-forgot").addEventListener("click", (e) => { e.preventDefault(); alert("Recuperação de senha ainda não integrada ao back-end."); });
}

function entrarApp() {
  $("#view-login").hidden = true;
  $("#view-app").hidden = false;
  renderShell();
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

// ---------- Dados de demonstração (dashboard) ----------
const DEMO_EDITAIS = [
  { numero: "001/2024", nome: "Aquisição de Infraestrutura de TI", orgao: "SEFAZ", status: "EM_ANDAMENTO", valor: "R$ 2.450.000", prazo: "15/09/2024", propostas: 7 },
  { numero: "002/2024", nome: "Consultoria em Segurança da Informação", orgao: "SSP", status: "PUBLICADO", valor: "R$ 890.000", prazo: "22/08/2024", propostas: 12 },
  { numero: "003/2024", nome: "Licenças de Software Corporativo", orgao: "PRODESP", status: "EM_ANALISE", valor: "R$ 1.200.000", prazo: "30/09/2024", propostas: 5 },
  { numero: "004/2024", nome: "Manutenção de Sistemas Legados", orgao: "DETRAN", status: "EM_ANDAMENTO", valor: "R$ 3.100.000", prazo: "10/10/2024", propostas: 3 },
  { numero: "005/2024", nome: "Plataforma de Cloud Computing", orgao: "PRODESP", status: "PUBLICADO", valor: "R$ 5.700.000", prazo: "05/11/2024", propostas: 18 },
];

const DEMO_STATUS = {
  EM_ANDAMENTO: { label: "Em Andamento", cls: "pill-info" },
  PUBLICADO: { label: "Publicado", cls: "pill-ok" },
  EM_ANALISE: { label: "Em Análise", cls: "pill-warn" },
};

function statusPill(status) {
  const map = {
    RASCUNHO: "pill-muted",
    AGUARDANDO_REVISAO_JURIDICA: "pill-warn",
    AGUARDANDO_REVISAO_TECNICA: "pill-warn",
    AGUARDANDO_APROVACAO_GESTOR: "pill-warn",
    EM_REVISAO_JURIDICA: "pill-info",
    EM_REVISAO_TECNICA: "pill-info",
    EM_APROVACAO_GESTOR: "pill-info",
    PUBLICADO: "pill-ok",
    REPROVADO: "pill-err",
    EM_CORRECAO: "pill-warn",
  };
  return { label: STATUS_LABEL[status] || status, cls: map[status] || "pill-muted" };
}

function kpiCard(label, value, trend, trendCls, iconName, iconCls) {
  const c = el("div", "card");
  const k = el("div", "kpi");
  const left = el("div");
  left.appendChild(el("div", "kpi-label", label));
  left.appendChild(el("div", "kpi-value", value));
  left.appendChild(elHtml("span", "kpi-trend " + trendCls, icon(trendCls === "up" ? "up" : "down") + trend));
  k.appendChild(left);
  k.appendChild(elHtml("div", "kpi-icon " + iconCls, icon(iconName)));
  c.appendChild(k);
  return c;
}

function lineChart() {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
  const editais = [10, 14, 12, 18, 22, 20, 26, 30];
  const propostas = [20, 28, 34, 40, 48, 55, 62, 70];
  const W = 300, H = 160, padL = 34, padB = 24, padT = 12, padR = 8;
  const max = 80;
  const x = (i) => padL + (i * (W - padL - padR)) / (months.length - 1);
  const y = (v) => padT + (H - padT - padB) * (1 - v / max);
  let grid = "";
  for (let g = 0; g <= 4; g++) {
    const v = (g / 4) * max;
    const gy = y(v);
    grid += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" stroke="#eef0f4" stroke-width="1"/>';
    grid += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" text-anchor="end" font-size="8" fill="#9aa3b2">' + v + '</text>';
  }
  const path = (arr) => arr.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
  const area = (arr) => path(arr) + " L" + x(arr.length - 1).toFixed(1) + " " + (H - padB) + " L" + x(0).toFixed(1) + " " + (H - padB) + " Z";
  let labels = "";
  months.forEach((m, i) => { labels += '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="8" fill="#9aa3b2">' + m + '</text>'; });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" height="160" preserveAspectRatio="none">' +
    grid +
    '<defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d28d9" stop-opacity="0.25"/><stop offset="1" stop-color="#6d28d9" stop-opacity="0"/></linearGradient></defs>' +
    '<path d="' + area(propostas) + '" fill="url(#g1)"/>' +
    '<path d="' + path(editais) + '" fill="none" stroke="#2563eb" stroke-width="2"/>' +
    '<path d="' + path(propostas) + '" fill="none" stroke="#6d28d9" stroke-width="2"/>' +
    labels + '</svg>';
}

function donutChart() {
  const segs = [
    { v: 45, c: "#16a34a", l: "Aprovadas" },
    { v: 30, c: "#6d28d9", l: "Em Análise" },
    { v: 15, c: "#f59e0b", l: "Pendentes" },
    { v: 10, c: "#dc2626", l: "Reprovadas" },
  ];
  const r = 40, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  let offset = 0, arcs = "";
  segs.forEach((s) => {
    const len = (s.v / 100) * circ;
    arcs += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + s.c + '" stroke-width="14" stroke-dasharray="' + len.toFixed(2) + ' ' + (circ - len).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
    offset += len;
  });
  const svg = '<svg viewBox="0 0 100 100" width="150" height="150">' + arcs +
    '<text x="50" y="47" text-anchor="middle" font-size="16" font-weight="700" fill="#111827">87</text>' +
    '<text x="50" y="60" text-anchor="middle" font-size="7" fill="#6b7280">Propostas</text></svg>';
  const legend = el("div", "chart-legend");
  segs.forEach((s) => {
    legend.appendChild(elHtml("div", "lg", '<span class="sw" style="background:' + s.c + '"></span>' + s.l + '<b>' + s.v + '%</b>'));
  });
  const wrap = el("div");
  wrap.appendChild(elHtml("div", "", svg));
  wrap.appendChild(legend);
  return wrap;
}

// ---------- Dashboard ----------
async function loadDashboard() {
  const v = $("#view-dashboard");
  v.innerHTML = "";
  const dp = demoProfile();

  const head = el("div", "page-head");
  const hLeft = el("div");
  hLeft.appendChild(el("h2", "", "Bem-vindo, " + dp.nome.split(" ")[0]));
  const sub = elHtml("p", "sub", new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + ' · Você está no perfil <span class="badge badge-purple">' + dp.label + "</span>");
  hLeft.appendChild(sub);
  head.appendChild(hLeft);
  v.appendChild(head);

  const kpis = el("div", "grid grid-4");
  kpis.appendChild(kpiCard("EDITAIS ATIVOS", "22", "+10% vs. mês ant.", "up", "doc", "blue"));
  kpis.appendChild(kpiCard("PROPOSTAS EM ANÁLISE", "87", "+5% vs. mês ant.", "up", "clipboard", "purple"));
  kpis.appendChild(kpiCard("TAXA DE APROVAÇÃO", "73%", "+3% vs. mês ant.", "up", "check", "green"));
  kpis.appendChild(kpiCard("PRAZO MÉDIO (DIAS)", "28", "-8% vs. mês ant.", "down", "clock", "orange"));
  v.appendChild(kpis);

  const row = el("div", "grid grid-2");
  row.style.marginTop = "1rem";

  const tableCard = el("div", "table-card");
  const tcHead = el("div", "tc-head");
  const tcTitle = el("div");
  tcTitle.appendChild(el("h3", "", "Editais em Andamento"));
  tcTitle.appendChild(el("div", "sub", "Acompanhamento em tempo real"));
  tcHead.appendChild(tcTitle);
  const verTodos = el("a", "link", "Ver todos →");
  verTodos.href = "#";
  verTodos.addEventListener("click", (e) => { e.preventDefault(); route("editais"); });
  tcHead.appendChild(verTodos);
  tableCard.appendChild(tcHead);

  const table = el("table", "table");
  const thead = el("thead");
  const trh = el("tr");
  ["Nº EDITAL", "TÍTULO / ÓRGÃO", "STATUS", "VALOR EST.", "PRAZO", "PROPOSTAS"].forEach((h) => trh.appendChild(el("th", "", h)));
  thead.appendChild(trh);
  table.appendChild(thead);
  const tbody = el("tbody");
  DEMO_EDITAIS.forEach((e) => {
    const tr = el("tr");
    tr.appendChild(el("td", "num", e.numero));
    const title = el("td", "title-cell");
    title.appendChild(el("b", "", e.nome));
    title.appendChild(el("span", "", e.orgao));
    tr.appendChild(title);
    const st = el("td");
    st.appendChild(el("span", "pill " + DEMO_STATUS[e.status].cls, DEMO_STATUS[e.status].label));
    tr.appendChild(st);
    tr.appendChild(el("td", "val", e.valor));
    tr.appendChild(elHtml("td", "date", icon("calendar") + e.prazo));
    tr.appendChild(el("td", "", String(e.propostas)));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableCard.appendChild(table);
  row.appendChild(tableCard);

  const chartCard = el("div", "card");
  const ccHead = el("div", "card-head");
  const ccTitle = el("div");
  ccTitle.appendChild(el("h3", "", "Indicadores de Desempenho"));
  ccTitle.appendChild(el("div", "sub", "Últimos 8 meses"));
  ccHead.appendChild(ccTitle);
  const att = el("button", "btn btn-ghost btn-sm", "Atualizar");
  att.addEventListener("click", loadDashboard);
  ccHead.appendChild(att);
  chartCard.appendChild(ccHead);
  chartCard.appendChild(elHtml("div", "", lineChart()));
  const legend = elHtml("div", "chart-legend", '<div class="lg"><span class="sw" style="background:#2563eb"></span>Editais</div><div class="lg"><span class="sw" style="background:#6d28d9"></span>Propostas</div>');
  legend.style.flexDirection = "row";
  legend.style.gap = "1rem";
  legend.style.marginTop = ".5rem";
  chartCard.appendChild(legend);
  row.appendChild(chartCard);
  v.appendChild(row);

  const lower = el("div", "grid grid-3");
  lower.style.marginTop = "1rem";

  const donutCard = el("div", "card");
  donutCard.appendChild(el("h3", "", "Propostas em Análise"));
  donutCard.appendChild(el("div", "sub", "Distribuição por status"));
  donutCard.appendChild(donutChart());
  lower.appendChild(donutCard);

  const pubCard = el("div", "card");
  const pubHead = el("div", "card-head");
  pubHead.appendChild(el("h3", "", "Editais Publicados"));
  const novo = elHtml("button", "btn btn-primary btn-sm", icon("plus") + " Novo");
  novo.addEventListener("click", () => route("cadastro"));
  pubHead.appendChild(novo);
  pubCard.appendChild(pubHead);
  const pub = el("div");
  const pubTop = el("div", "ac-top");
  pubTop.appendChild(elHtml("div", "doc-ico", icon("doc")));
  const pubInfo = el("div", "ac-title");
  pubInfo.appendChild(el("div", "org", "002/2024"));
  pubInfo.appendChild(el("h4", "", "Consultoria em Segurança da Informação"));
  pubTop.appendChild(pubInfo);
  pub.appendChild(pubTop);
  pub.appendChild(elHtml("div", "ac-meta", "<span><b>R$ 890.000</b></span><span>12 propostas</span><span>Prazo: 22/08/2024</span>"));
  pub.appendChild(el("span", "pill pill-ok", "Publicado"));
  pubCard.appendChild(pub);
  lower.appendChild(pubCard);

  const pendCard = el("div", "card");
  pendCard.appendChild(el("h3", "", "Pendências"));
  pendCard.appendChild(el("div", "sub", "Itens que exigem ação"));
  const pendList = el("div");
  pendList.style.marginTop = ".5rem";
  [
    { pri: "high", t: "Documentação técnica pendente", s: "Edital 003/2024 · 30/09/2024" },
    { pri: "med", t: "Parecer jurídico aguardando", s: "Edital 001/2024 · 15/09/2024" },
    { pri: "med", t: "Revisão de propostas", s: "Edital 004/2024 · 10/10/2024" },
  ].forEach((p) => {
    const item = el("div", "pending-item");
    item.appendChild(el("span", "pri " + p.pri));
    const body = el("div", "body");
    body.appendChild(el("b", "", p.t));
    body.appendChild(el("span", "", p.s));
    item.appendChild(body);
    item.appendChild(elHtml("span", "arrow", icon("chevron")));
    pendList.appendChild(item);
  });
  pendCard.appendChild(pendList);
  lower.appendChild(pendCard);
  v.appendChild(lower);
}

// ---------- Gestão de Editais (tabs: visualizar / aprovar) ----------
let editaisTab = "visualizar";
let editaisCache = [];

function toast(msg) {
  let t = $("#toast");
  if (!t) {
    t = el("div", "");
    t.id = "toast";
    t.style.cssText = "position:fixed;bottom:1.5rem;right:1.5rem;background:#111827;color:#fff;padding:.7rem 1rem;border-radius:10px;font-size:.85rem;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:9999;opacity:0;transition:opacity .2s;";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.style.opacity = "0"; }, 2200);
}

function editaisTableRows() {
  const rows = [];
  editaisCache.forEach((e) => {
    rows.push({
      numero: e.numero, nome: e.nome, orgao: e.criadoPor?.nome || "PRODESP",
      status: e.status, valor: "—", prazo: fmtData(e.prazoVigencia), propostas: "—",
      id: e.id, isDemo: false,
    });
  });
  if (!rows.length) {
    DEMO_EDITAIS.forEach((e) => {
      rows.push({
        numero: e.numero, nome: e.nome, orgao: e.orgao, status: e.status,
        valor: e.valor, prazo: e.prazo, propostas: String(e.propostas), isDemo: true,
      });
    });
  }
  return rows;
}

function renderEditaisTable(container, busca) {
  container.innerHTML = "";
  const rows = editaisTableRows().filter((r) => {
    if (!busca) return true;
    return (r.numero + " " + r.nome + " " + r.orgao).toLowerCase().includes(busca);
  });
  const table = el("table", "table");
  const thead = el("thead");
  const trh = el("tr");
  ["Nº EDITAL", "TÍTULO / ÓRGÃO", "STATUS", "VALOR EST.", "PRAZO", "PROPOSTAS", "AÇÕES"].forEach((h) => trh.appendChild(el("th", "", h)));
  thead.appendChild(trh);
  table.appendChild(thead);
  const tbody = el("tbody");
  if (!rows.length) {
    const tr = el("tr");
    const td = el("td", "empty", "Nenhum edital encontrado.");
    td.colSpan = 7;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
  rows.forEach((r) => {
    const tr = el("tr");
    tr.appendChild(el("td", "num", r.numero));
    const title = el("td", "title-cell");
    title.appendChild(el("b", "", r.nome));
    title.appendChild(el("span", "", r.orgao));
    tr.appendChild(title);
    const st = el("td");
    const sp = r.isDemo ? DEMO_STATUS[r.status] : statusPill(r.status);
    st.appendChild(el("span", "pill " + sp.cls, sp.label));
    tr.appendChild(st);
    tr.appendChild(el("td", "val", r.valor));
    tr.appendChild(elHtml("td", "date", icon("calendar") + r.prazo));
    tr.appendChild(el("td", "", r.propostas));
    const ac = el("td", "actions");
    const ver = elHtml("button", "btn btn-ghost btn-sm", icon("eye") + " Ver");
    ver.addEventListener("click", () => {
      if (r.isDemo) toast("Edital de demonstração: " + r.numero);
      else abrirEdital(r.id);
    });
    ac.appendChild(ver);
    const dots = elHtml("button", "icon-btn", icon("dots"));
    dots.addEventListener("click", () => toast("Mais opções em breve."));
    ac.appendChild(dots);
    tr.appendChild(ac);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

async function loadEditais() {
  const v = $("#view-editais");
  v.innerHTML = "";
  try { editaisCache = await api("/editais"); } catch (ex) { editaisCache = []; }

  const head = el("div", "page-head");
  const hLeft = el("div");
  hLeft.appendChild(el("h2", "", "Gestão de Editais"));
  hLeft.appendChild(el("div", "sub", "Visualize e gerencie todos os editais do sistema"));
  head.appendChild(hLeft);
  const novo = elHtml("button", "btn btn-primary", icon("plus") + " Novo Edital");
  novo.addEventListener("click", () => route("cadastro"));
  head.appendChild(novo);
  v.appendChild(head);

  const tabs = el("div", "tabs");
  const t1 = el("button", "tab" + (editaisTab === "visualizar" ? " active" : ""), "Visualizar Editais");
  const t2 = el("button", "tab" + (editaisTab === "aprovar" ? " active" : ""), "Aprovar / Rejeitar");
  t1.addEventListener("click", () => { editaisTab = "visualizar"; loadEditais(); });
  t2.addEventListener("click", () => { editaisTab = "aprovar"; loadEditais(); });
  tabs.appendChild(t1);
  tabs.appendChild(t2);
  v.appendChild(tabs);

  if (editaisTab === "visualizar") {
    const card = el("div", "table-card");
    const tcHead = el("div", "tc-head");
    const tcTitle = el("div");
    tcTitle.appendChild(el("h3", "", "Todos os Editais"));
    tcTitle.appendChild(el("span", "count", String(editaisTableRows().length)));
    tcHead.appendChild(tcTitle);
    const search = elHtml("div", "tc-search", icon("search") + '<input type="search" placeholder="Buscar edital..." />');
    tcHead.appendChild(search);
    card.appendChild(tcHead);
    const body = el("div");
    card.appendChild(body);
    v.appendChild(card);
    renderEditaisTable(body, "");
    search.querySelector("input").addEventListener("input", (e) => renderEditaisTable(body, e.target.value.toLowerCase()));
  } else {
    const banner = elHtml("div", "banner warn", icon("warn") + "<span>4 editais aguardam sua aprovação. Decisões registradas são encaminhadas automaticamente aos responsáveis.</span>");
    v.appendChild(banner);

    const aprovar = [
      { numero: "001/2024", orgao: "SEFAZ", nome: "Aquisição de Infraestrutura de TI", valor: "R$ 2.450.000", prazo: "15/09/2024", propostas: 7 },
      { numero: "003/2024", orgao: "PRODESP", nome: "Licenças de Software Corporativo", valor: "R$ 1.200.000", prazo: "30/09/2024", propostas: 5 },
      { numero: "004/2024", orgao: "DETRAN", nome: "Manutenção de Sistemas Legados", valor: "R$ 3.100.000", prazo: "10/10/2024", propostas: 3 },
      { numero: "006/2024", orgao: "PRODESP", nome: "Sistema de Monitoramento de Rede", valor: "R$ 780.000", prazo: "20/10/2024", propostas: 0 },
    ];
    const grid = el("div", "grid grid-2");
    aprovar.forEach((a) => {
      const card = el("div", "card approval-card");
      const top = el("div", "ac-top");
      top.appendChild(elHtml("div", "doc-ico", icon("doc")));
      const ti = el("div", "ac-title");
      ti.appendChild(el("div", "org", a.numero + " — " + a.orgao));
      ti.appendChild(el("h4", "", a.nome));
      top.appendChild(ti);
      card.appendChild(top);
      card.appendChild(elHtml("div", "ac-meta",
        "<span>Valor: <b>" + a.valor + "</b></span><span>Prazo: <b>" + a.prazo + "</b></span><span>" + a.propostas + " propostas recebidas</span>"));
      const acts = el("div", "ac-actions");
      const ap = elHtml("button", "btn btn-ok btn-sm", icon("check") + " Aprovar");
      ap.addEventListener("click", () => toast("Edital " + a.numero + " aprovado (demonstração)."));
      const rj = elHtml("button", "btn btn-danger btn-sm", icon("close") + " Rejeitar");
      rj.addEventListener("click", () => toast("Edital " + a.numero + " rejeitado (demonstração)."));
      const jus = el("button", "btn btn-ghost btn-sm", "Justificativa");
      jus.addEventListener("click", () => toast("Justificativa (demonstração)."));
      const det = elHtml("button", "btn btn-primary btn-sm", icon("eye") + " Detalhes");
      det.addEventListener("click", () => toast("Detalhes do edital " + a.numero + " (demonstração)."));
      [ap, rj, jus, det].forEach((b) => acts.appendChild(b));
      card.appendChild(acts);
      grid.appendChild(card);
    });
    v.appendChild(grid);
  }
}

// ---------- Cadastro de Edital ----------
function buildCadastro() {
  const v = $("#view-cadastro");
  v.innerHTML = "";

  const head = el("div", "page-head");
  const hLeft = el("div");
  hLeft.appendChild(el("h2", "", "Cadastro de Edital"));
  hLeft.appendChild(el("div", "sub", "Preencha os dados do novo edital"));
  head.appendChild(hLeft);
  v.appendChild(head);

  const form = el("form", "form-card");
  form.id = "form-edital";

  const fc = el("div", "fc-head");
  fc.appendChild(elHtml("span", "", icon("doc")));
  fc.appendChild(el("h3", "", "Dados do Edital"));
  form.appendChild(fc);

  const mk = (label, req, input) => {
    const f = el("div", "field");
    const l = el("label", "", label);
    if (req) l.appendChild(el("span", "req", " *"));
    f.appendChild(l);
    f.appendChild(input);
    return f;
  };

  const nome = el("input"); nome.type = "text"; nome.id = "ed-nome"; nome.required = true;
  form.appendChild(mk("Nome do Edital", true, nome));

  const numero = el("input"); numero.type = "text"; numero.id = "ed-numero"; numero.required = true;
  form.appendChild(mk("Número do Edital", true, numero));

  const descricao = el("textarea"); descricao.id = "ed-descricao"; descricao.rows = 4;
  form.appendChild(mk("Descrição Detalhada", false, descricao));

  const row = el("div", "form-row");
  const data = el("input"); data.type = "date"; data.id = "ed-data";
  row.appendChild(mk("Data de Publicação", false, data));
  const prazo = el("input"); prazo.type = "date"; prazo.id = "ed-prazo";
  row.appendChild(mk("Prazo de Vigência", false, prazo));
  form.appendChild(row);

  const pdf = el("input"); pdf.type = "file"; pdf.id = "ed-pdf"; pdf.accept = "application/pdf";
  form.appendChild(mk("Upload de PDF", false, pdf));

  const err = el("p", "error"); err.id = "ed-error"; err.hidden = true;
  form.appendChild(err);

  const actions = el("div", "form-actions");
  const salvar = elHtml("button", "btn btn-primary", "Salvar");
  salvar.type = "submit";
  const cancelar = el("button", "btn btn-ghost", "Cancelar");
  cancelar.type = "button";
  cancelar.addEventListener("click", () => route("editais"));
  actions.appendChild(salvar);
  actions.appendChild(cancelar);
  form.appendChild(actions);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.hidden = true;
    const fd = new FormData();
    fd.append("numero", numero.value.trim());
    fd.append("nome", nome.value.trim());
    fd.append("descricao", descricao.value.trim());
    if (data.value) fd.append("dataPublicacao", data.value);
    if (prazo.value) fd.append("prazoVigencia", prazo.value);
    if (pdf.files[0]) fd.append("pdf", pdf.files[0]);
    try {
      const res = await fetch(API + "/editais", { method: "POST", headers: { Authorization: `Bearer ${state.token}` }, body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.erro || `Erro ${res.status}`);
      toast("Edital criado com sucesso.");
      route("editais");
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    }
  });

  v.appendChild(form);
}

function resetFormEdital() { buildCadastro(); }

// ---------- Página do Edital (detalhe) ----------
function kv(k, val) {
  const d = el("div", "kv");
  d.appendChild(el("span", "k", k));
  d.appendChild(el("span", "v", val ?? "—"));
  return d;
}

async function abrirEdital(id) {
  route("edital");
  const v = $("#view-edital");
  v.innerHTML = "";
  try {
    const e = await api("/editais/" + id);
    const head = el("div", "page-head");
    const hLeft = el("div");
    hLeft.appendChild(el("h2", "", e.nome));
    hLeft.appendChild(el("div", "sub", e.numero + " · " + (STATUS_LABEL[e.status] || e.status)));
    head.appendChild(hLeft);
    const voltar = el("button", "btn btn-ghost", "← Voltar");
    voltar.addEventListener("click", () => route("editais"));
    head.appendChild(voltar);
    v.appendChild(head);

    const c = el("div", "card");
    c.appendChild(kv("Número", e.numero));
    c.appendChild(kv("Código", e.codigo));
    c.appendChild(kv("Status", STATUS_LABEL[e.status] || e.status));
    c.appendChild(kv("Data de Publicação", fmtData(e.dataPublicacao)));
    c.appendChild(kv("Prazo de Vigência", fmtData(e.prazoVigencia)));
    c.appendChild(kv("Responsável", e.criadoPor?.nome || "—"));
    c.appendChild(el("h3", "", "Descrição"));
    c.appendChild(el("p", "muted", e.descricao || "—"));
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
        d.appendChild(el("div", "meta", (PERFIL_LABEL[p.emitidoPor?.perfil] || p.tipo) + " — " + p.resultado + " — " + (p.emitidoPor?.nome || "")));
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

function acoesEdital(e) {
  const box = el("div", "card");
  box.appendChild(el("h3", "", "Ações"));
  const p = state.usuario?.perfil;
  if (p === "ADMINISTRADOR" && (e.status === "RASCUNHO" || e.status === "EM_CORRECAO")) {
    const b = elHtml("button", "btn btn-primary", icon("arrow") + " Enviar para Revisão Jurídica");
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
    const ap = elHtml("button", "btn btn-ok", icon("check") + " Aprovar e Publicar");
    ap.addEventListener("click", () => transicionar(e.id, "PUBLICADO"));
    const rp = elHtml("button", "btn btn-danger", icon("close") + " Reprovar");
    rp.addEventListener("click", () => transicionar(e.id, "REPROVADO"));
    box.appendChild(ap);
    box.appendChild(rp);
  }
  if (box.children.length === 1) box.appendChild(el("p", "muted", "Nenhuma ação disponível para seu perfil neste status."));
  return box;
}

function parecerForm(id, tipo) {
  const wrap = el("div");
  const ta = el("textarea");
  ta.rows = 3;
  ta.placeholder = tipo === "JURIDICO" ? "Observações e apontamentos legais" : "Observações e apontamentos técnicos";
  const aprovar = elHtml("button", "btn btn-ok btn-sm", icon("check") + " Aprovar");
  const corrigir = elHtml("button", "btn btn-danger btn-sm", icon("close") + " Solicitar correções");
  aprovar.addEventListener("click", async () => {
    try {
      await api(`/editais/${id}/parecer`, { method: "POST", body: JSON.stringify({ tipo, resultado: "APROVADO", conteudo: ta.value || "Aprovado." }) });
      const dest = tipo === "JURIDICO" ? "AGUARDANDO_REVISAO_TECNICA" : "AGUARDANDO_APROVACAO_GESTOR";
      await transicionar(id, dest);
    } catch (ex) { toast(ex.message); }
  });
  corrigir.addEventListener("click", async () => {
    try {
      await api(`/editais/${id}/parecer`, { method: "POST", body: JSON.stringify({ tipo, resultado: "REPROVADO", conteudo: ta.value || "Correções solicitadas." }) });
      await transicionar(id, "EM_CORRECAO");
    } catch (ex) { toast(ex.message); }
  });
  wrap.appendChild(ta);
  const acts = el("div", "form-actions");
  acts.appendChild(aprovar);
  acts.appendChild(corrigir);
  wrap.appendChild(acts);
  return wrap;
}

async function transicionar(id, status) {
  try {
    await api(`/editais/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
    abrirEdital(id);
  } catch (ex) { toast(ex.message); }
}

// ---------- Filas por perfil ----------
async function renderFila(viewId, statuses, titulo) {
  const v = $("#view-" + viewId);
  v.innerHTML = "";
  const head = el("div", "page-head");
  head.appendChild(el("h2", "", titulo));
  v.appendChild(head);
  try {
    const editais = await api("/editais");
    const fila = editais.filter((e) => statuses.includes(e.status));
    if (!fila.length) { v.appendChild(el("p", "empty", "Nenhum edital aguardando nesta etapa.")); return; }
    const grid = el("div", "grid grid-2");
    fila.forEach((e) => {
      const c = el("div", "card");
      c.appendChild(el("h3", "", e.nome));
      c.appendChild(el("div", "sub", e.numero + " · " + (STATUS_LABEL[e.status] || e.status) + " · Prazo: " + fmtData(e.prazoVigencia)));
      const abrir = elHtml("button", "btn btn-primary btn-sm", icon("eye") + " Revisar");
      abrir.addEventListener("click", () => abrirEdital(e.id));
      c.appendChild(abrir);
      grid.appendChild(c);
    });
    v.appendChild(grid);
  } catch (ex) { v.appendChild(el("p", "error", ex.message)); }
}

function loadJuridico() { renderFila("juridico", ["AGUARDANDO_REVISAO_JURIDICA", "EM_REVISAO_JURIDICA"], "Revisão Jurídica"); }
function loadTecnico() { renderFila("tecnico", ["AGUARDANDO_REVISAO_TECNICA", "EM_REVISAO_TECNICA"], "Especialidade Técnica"); }
function loadGestor() { renderFila("gestor", ["AGUARDANDO_APROVACAO_GESTOR", "EM_APROVACAO_GESTOR"], "Aprovação Final"); }

// ---------- Administração (usuários) ----------
async function loadAdmin() {
  const v = $("#view-admin");
  v.innerHTML = "";
  const head = el("div", "page-head");
  head.appendChild(el("h2", "", "Gerenciamento de Usuários"));
  v.appendChild(head);

  const form = el("div", "form-card");
  const fc = el("div", "fc-head");
  fc.appendChild(elHtml("span", "", icon("users")));
  fc.appendChild(el("h3", "", "Novo usuário"));
  form.appendChild(fc);
  const nome = el("input"); nome.placeholder = "Nome";
  const email = el("input"); email.placeholder = "E-mail";
  const senha = el("input"); senha.type = "password"; senha.placeholder = "Senha";
  const perfil = el("select");
  ["ADMINISTRADOR", "JURIDICO", "TECNICO", "GESTOR", "COMUNICACAO"].forEach((p) => { const o = el("option", "", PERFIL_LABEL[p]); o.value = p; perfil.appendChild(o); });
  const btn = elHtml("button", "btn btn-primary", icon("plus") + " Criar usuário");
  const err = el("p", "error"); err.hidden = true;
  [nome, email, senha, perfil].forEach((n) => { const f = el("div", "field"); f.appendChild(n); form.appendChild(f); });
  btn.addEventListener("click", async () => {
    err.hidden = true;
    try {
      await api("/usuarios", { method: "POST", body: JSON.stringify({ nome: nome.value, email: email.value, senha: senha.value, perfil: perfil.value }) });
      toast("Usuário criado.");
      loadAdmin();
    } catch (ex) { err.textContent = ex.message; err.hidden = false; }
  });
  form.appendChild(btn);
  form.appendChild(err);
  v.appendChild(form);

  const lista = el("div", "card");
  lista.appendChild(el("h3", "", "Usuários"));
  try {
    const users = await api("/usuarios");
    users.forEach((u) => {
      const row = el("div", "kv");
      const info = el("span", "v", u.nome + " — " + u.email);
      info.appendChild(el("span", "badge badge-purple", PERFIL_LABEL[u.perfil] || u.perfil));
      row.appendChild(info);
      if (u.id !== state.usuario?.id) {
        const del = elHtml("button", "btn btn-danger btn-sm", icon("close") + " Excluir");
        del.addEventListener("click", async () => {
          if (!confirm(`Excluir usuário ${u.nome}?`)) return;
          try { await api("/usuarios/" + u.id, { method: "DELETE" }); loadAdmin(); } catch (ex) { toast(ex.message); }
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
  const head = el("div", "page-head");
  head.appendChild(el("h2", "", "Histórico de Ações"));
  v.appendChild(head);
  const c = el("div", "card");
  try {
    const regs = await api("/auditoria");
    if (!regs.length) { c.appendChild(el("p", "empty", "Nenhuma ação registrada.")); }
    regs.forEach((r) => {
      const row = el("div", "audit-row");
      row.appendChild(el("div", "", r.tipoAcao + " — " + (r.usuario?.nome || "") + " (" + (r.usuario?.perfil || "") + ")"));
      row.appendChild(el("div", "meta", (r.edital ? r.edital.numero : "—") + " · " + new Date(r.dataHora).toLocaleString("pt-BR") + " · " + (r.estadoAnterior || "—") + " → " + (r.estadoPosterior || "—")));
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
  const head = el("div", "page-head");
  head.appendChild(el("h2", "", "Comunicação — Editais Publicados e Prazos"));
  v.appendChild(head);
  try {
    const editais = await api("/editais");
    const publicados = editais.filter((e) => e.status === "PUBLICADO");
    if (!publicados.length) { v.appendChild(el("p", "empty", "Nenhum edital publicado.")); return; }
    const grid = el("div", "grid grid-2");
    publicados.forEach((e) => {
      const c = el("div", "card");
      c.appendChild(el("h3", "", e.nome));
      c.appendChild(el("p", "muted", "Número: " + e.numero + " · Prazo: " + fmtData(e.prazoVigencia)));
      const dias = diasRestantes(e.prazoVigencia);
      if (dias != null && dias <= 5) c.appendChild(el("p", "error", "Prazo crítico: vence em " + dias + " dia(s)."));
      grid.appendChild(c);
    });
    v.appendChild(grid);
  } catch (ex) { v.appendChild(el("p", "error", ex.message)); }
}

function diasRestantes(d) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

// ---------- Solicitação de Licitação (Visualizador) ----------
function loadLicitacao() {
  const v = $("#view-licitacao");
  v.innerHTML = "";

  const head = el("div", "page-head");
  const hLeft = el("div");
  hLeft.appendChild(el("h2", "", "Solicitação de Licitação"));
  hLeft.appendChild(el("div", "sub", "Preencha o formulário abaixo para solicitar a abertura de um processo licitatório."));
  head.appendChild(hLeft);
  v.appendChild(head);

  const steps = el("div", "steps");
  const s1 = elHtml("div", "step active", '<span class="n">1</span> Dados Básicos');
  const s2 = elHtml("div", "step", '<span class="n">2</span> Detalhes');
  const s3 = elHtml("div", "step", '<span class="n">3</span> Revisão');
  steps.appendChild(s1); steps.appendChild(s2); steps.appendChild(s3);
  v.appendChild(steps);

  const mk = (label, req, input) => {
    const f = el("div", "field");
    const l = el("label", "", label);
    if (req) l.appendChild(el("span", "req", " *"));
    f.appendChild(l);
    f.appendChild(input);
    return f;
  };

  const c1 = el("div", "form-card");
  const fc1 = el("div", "fc-head");
  fc1.appendChild(elHtml("span", "", icon("folder")));
  fc1.appendChild(el("h3", "", "Informações Básicas"));
  c1.appendChild(fc1);
  const orgao = el("input"); orgao.placeholder = "Ex: Secretaria da Fazenda — SEFAZ";
  c1.appendChild(mk("ÓRGÃO SOLICITANTE", true, orgao));
  const objeto = el("input"); objeto.placeholder = "Descreva brevemente o objeto a ser licitado";
  c1.appendChild(mk("OBJETO DA LICITAÇÃO", true, objeto));
  const row1 = el("div", "form-row");
  const modalidade = el("select");
  ["Selecione a modalidade", "Pregão Eletrônico", "Concorrência", "Tomada de Preços", "Convite", "Leilão", "Concurso", "Diálogo Competitivo"].forEach((m, i) => { const o = el("option", "", m); if (i === 0) o.value = ""; modalidade.appendChild(o); });
  row1.appendChild(mk("MODALIDADE", true, modalidade));
  const valor = el("input"); valor.placeholder = "R$ 0,00";
  row1.appendChild(mk("VALOR ESTIMADO", false, valor));
  c1.appendChild(row1);
  v.appendChild(c1);

  const c2 = el("div", "form-card");
  const fc2 = el("div", "fc-head");
  fc2.appendChild(elHtml("span", "", icon("clipboard")));
  fc2.appendChild(el("h3", "", "Detalhes e Justificativa"));
  c2.appendChild(fc2);
  const justificativa = el("textarea"); justificativa.rows = 4; justificativa.placeholder = "Descreva a necessidade da contratação e sua relevância para o órgão...";
  c2.appendChild(mk("JUSTIFICATIVA DA NECESSIDADE", true, justificativa));
  const row2 = el("div", "form-row");
  const prazo = el("input"); prazo.type = "date";
  row2.appendChild(mk("PRAZO DESEJADO PARA ABERTURA", false, prazo));
  const email = el("input"); email.type = "email"; email.placeholder = "setor@orgao.sp.gov.br";
  row2.appendChild(mk("E-MAIL DE CONTATO", true, email));
  c2.appendChild(row2);
  const obs = el("textarea"); obs.rows = 3; obs.placeholder = "Informações complementares relevantes para o processo...";
  c2.appendChild(mk("OBSERVAÇÕES ADICIONAIS", false, obs));
  const actions = el("div", "form-actions");
  const enviar = elHtml("button", "btn btn-primary", icon("arrow") + " Enviar Solicitação");
  enviar.addEventListener("click", () => toast("Solicitação enviada (demonstração)."));
  const cancelar = el("button", "btn btn-ghost", "Cancelar");
  cancelar.addEventListener("click", () => route("dashboard"));
  actions.appendChild(enviar);
  actions.appendChild(cancelar);
  c2.appendChild(actions);
  v.appendChild(c2);
}

// ---------- Init ----------
function init() {
  renderDemoProfiles();
  bindLogin();
  $("#btn-logout").addEventListener("click", (e) => { e.preventDefault(); logout(); });
  if (state.token) {
    api("/auth/me").then((d) => {
      state.usuario = d.usuario;
      state.demoProfile = d.usuario.perfil;
      entrarApp();
    }).catch(logout);
  } else {
    $("#view-login").hidden = false;
  }
}

document.addEventListener("DOMContentLoaded", init);












