// Gera a demonstração para portfólio em docs/:
//   docs/app.html   = o assistente (index.html) abrindo com dados fictícios de 4 áreas
//   docs/index.html = página de apresentação (fonte em site/landing.html)
// Todos os dados são inventados e gerados aqui, sempre iguais (semente fixa).
// Uso: node tools/build-demo.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");

let seed = 7;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = arr => arr[Math.floor(rnd() * arr.length)];
const weighted = pairs => { let r = rnd() * pairs.reduce((s, [, w]) => s + w, 0); for (const [v, w] of pairs) if ((r -= w) < 0) return v; return pairs[0][0]; };
const pad2 = n => String(n).padStart(2, "0");
const brl = v => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dmy = d => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
const dayIn = m => new Date(2026, m, 1 + Math.floor(rnd() * 28));
const csv = (head, rows) => [head, ...rows].map(r => r.join(";")).join("\n");
const MONTHS = 9; // jan a set/2026

function vendas() {
  // Nomes e valores propositalmente fictícios (Fulano de Tal, Empresa Alfa, Fornecedor A, valores redondos).
  const clientes = ["Alfa", "Beta", "Gama", "Delta", "Épsilon", "Zeta", "Teta", "Iota", "Kappa", "Lambda", "Sigma", "Tau", "Ômega", "Ômicron"].map(x => "Empresa " + x);
  const vendedores = [["Fulano de Tal", 1.25], ["Ciclano da Silva", 1], ["Beltrano Souza", 1.1], ["Fulana de Tal", .8], ["Beltrana Costa", .9]];
  const regioes = [["Sudeste", 4], ["Sul", 2.5], ["Nordeste", 2], ["Centro-Oeste", 1.2]];
  const produtos = [["Notebook", "Informática", 4000], ["Monitor", "Informática", 1000], ["Impressora", "Informática", 1500], ["Cadeira", "Mobiliário", 1200], ["Mesa", "Mobiliário", 1000], ["Papel (caixa)", "Suprimentos", 200], ["Toner", "Suprimentos", 300], ["Fone de ouvido", "Acessórios", 200], ["Teclado", "Acessórios", 150]];
  const rows = []; let n = 1;
  for (let m = 0; m < MONTHS; m++) {
    const count = 34 + m * 3 + Math.floor(rnd() * 8);
    for (let i = 0; i < count; i++) {
      const [prod, cat, price] = pick(produtos);
      const qtd = cat === "Suprimentos" ? 5 + Math.floor(rnd() * 30) : 1 + Math.floor(rnd() * (cat === "Informática" ? 6 : 10));
      const desc = qtd >= 10 ? .92 : 1;
      const trend = 1 + m * .025; // leve crescimento ao longo do ano
      rows.push([dmy(dayIn(m)), `PV-${String(n++).padStart(4, "0")}`, pick(clientes), weighted(vendedores), weighted(regioes), prod, cat, qtd, brl(Math.round(price * qtd * desc * trend / 10) * 10), weighted([["Pago", 75], ["Pendente", 18], ["Cancelado", 7]])]);
    }
  }
  return csv(["Data", "Pedido", "Cliente", "Vendedor", "Região", "Produto", "Categoria", "Quantidade", "Valor (R$)", "Status"], rows);
}

function estoque() {
  const itens = [
    ["Papel A4 (caixa)", "Suprimentos", "Fornecedor A", 190], ["Toner", "Suprimentos", "Fornecedor B", 330], ["Caneta azul (cx 50)", "Suprimentos", "Fornecedor A", 40], ["Grampeador", "Suprimentos", "Fornecedor C", 40], ["Pasta suspensa (cx)", "Suprimentos", "Fornecedor C", 60],
    ["Monitor 24\"", "Informática", "Fornecedor B", 900], ["Teclado sem fio", "Informática", "Fornecedor B", 160], ["Mouse óptico", "Informática", "Fornecedor D", 50], ["Cabo HDMI 2 m", "Informática", "Fornecedor D", 30], ["Nobreak 1200 VA", "Informática", "Fornecedor E", 800], ["SSD 480 GB", "Informática", "Fornecedor D", 260],
    ["Cadeira ergonômica", "Mobiliário", "Fornecedor F", 1200], ["Mesa de escritório", "Mobiliário", "Fornecedor F", 1000], ["Armário de aço", "Mobiliário", "Fornecedor G", 1400], ["Gaveteiro", "Mobiliário", "Fornecedor F", 500],
    ["Café em grãos (kg)", "Copa", "Fornecedor H", 70], ["Açúcar (5 kg)", "Copa", "Fornecedor I", 20], ["Copo descartável (pct)", "Copa", "Fornecedor I", 10], ["Filtro de água (refil)", "Copa", "Fornecedor J", 90],
    ["Detergente (5 L)", "Limpeza", "Fornecedor K", 30], ["Papel toalha (fardo)", "Limpeza", "Fornecedor K", 60], ["Álcool 70% (5 L)", "Limpeza", "Fornecedor K", 50], ["Saco de lixo 100 L", "Limpeza", "Fornecedor I", 40],
    ["Lâmpada LED 18 W", "Manutenção predial", "Fornecedor L", 20], ["Disjuntor 20 A", "Manutenção predial", "Fornecedor L", 30], ["Fita isolante", "Manutenção predial", "Fornecedor L", 10], ["Filtro de ar-condicionado", "Manutenção predial", "Fornecedor M", 60], ["Tinta branca (18 L)", "Manutenção predial", "Fornecedor N", 290],
  ];
  const rows = itens.map(([item, cat, forn, preco], i) => {
    const min = [5, 10, 20, 30][Math.floor(rnd() * 4)];
    const qtd = rnd() < .25 ? Math.floor(rnd() * min) : min + Math.floor(rnd() * min * 3);
    return [`EST-${String(1 + i).padStart(3, "0")}`, item, cat, forn, qtd, min, brl(preco), brl(qtd * preco), dmy(new Date(2026, 5 + Math.floor(rnd() * 4), 1 + Math.floor(rnd() * 28))), qtd < min ? "Abaixo do mínimo" : "OK"];
  });
  return csv(["Código", "Item", "Categoria", "Fornecedor", "Quantidade", "Estoque mínimo", "Preço unitário (R$)", "Valor em estoque (R$)", "Última entrada", "Situação"], rows);
}

function manutencao() {
  const equip = [["Monitor multiparâmetro", 1], ["Ventilador pulmonar", 1.4], ["Bomba de infusão", .6], ["Autoclave", 1.8], ["Desfibrilador", 1], ["Ar-condicionado", 1.2], ["Gerador", 2.4], ["Elevador", 2.2], ["Centrífuga", .9], ["Raio-X móvel", 2.6]];
  const setores = [["UTI Adulto", 3], ["Centro Cirúrgico", 2.5], ["Pronto Atendimento", 2.5], ["Radiologia", 1.5], ["Laboratório", 1.5], ["Internação", 2]];
  const tecnicos = ["Técnico A", "Técnico B", "Técnico C", "Técnico D"];
  const rows = []; let n = 1;
  for (let m = 0; m < MONTHS; m++) {
    const count = 30 + Math.floor(rnd() * 12);
    for (let i = 0; i < count; i++) {
      const [eq, peso] = pick(equip);
      const tipo = weighted([["Corretiva", 55], ["Preventiva", 35], ["Calibração", 10]]);
      const open = dayIn(m);
      // Quanto mais recente, maior a chance de ainda estar aberta.
      const late = m >= MONTHS - 2 ? (m === MONTHS - 1 ? .45 : .2) : .03;
      const sit = rnd() < late ? weighted([["Aberta", 1], ["Em andamento", 1]]) : "Fechada";
      const horas = tipo === "Corretiva" ? 1 + rnd() * 7 * peso : .5 + rnd() * 2.5;
      const close = sit === "Fechada" ? new Date(open.getTime() + (1 + Math.floor(rnd() * (tipo === "Corretiva" ? 6 : 2))) * 864e5) : null;
      const custo = Math.round((tipo === "Corretiva" ? (120 + rnd() * 1400) * peso : tipo === "Calibração" ? 180 + rnd() * 120 : rnd() * 260) / 10) * 10;
      const t = Math.round(horas * 4) / 4;
      rows.push([`OS-${String(n++).padStart(4, "0")}`, dmy(open), close ? dmy(close) : "", eq, weighted(setores), tipo, sit, pick(tecnicos), `${pad2(Math.floor(t))}:${pad2(Math.round((t % 1) * 60))}`, brl(custo)]);
    }
  }
  return csv(["Nº OS", "Data Abertura", "Data Fechamento", "Equipamento", "Setor", "Tipo de Manutenção", "Situação", "Técnico", "Tempo Atendimento", "Custo (R$)"], rows);
}

function financeiro() {
  const fixas = [["Aluguel da sede", "Fornecedor A", "Administrativo", "Aluguel", 10000], ["Energia elétrica", "Fornecedor B", "Operações", "Energia", 4000], ["Internet e telefonia", "Fornecedor C", "TI", "Telecom", 2000], ["Licenças de software", "Fornecedor D", "TI", "Software", 3000], ["Limpeza e conservação", "Fornecedor E", "Administrativo", "Serviços terceirizados", 5000]];
  const variaveis = [["Material de escritório", "Fornecedor F", "Administrativo", "Materiais", 300, 1800], ["Campanha de marketing", "Fornecedor G", "Comercial", "Marketing", 1500, 9000], ["Viagem a cliente", "Fornecedor H", "Comercial", "Viagens", 600, 4000], ["Manutenção de equipamentos", "Fornecedor I", "Operações", "Manutenção", 400, 5200], ["Frete de mercadorias", "Fornecedor J", "Operações", "Frete", 250, 3100], ["Treinamento da equipe", "Fornecedor K", "Administrativo", "Treinamento", 800, 4800], ["Equipamentos de TI", "Fornecedor L", "TI", "Equipamentos", 700, 7800]];
  const rows = [];
  for (let m = 0; m < MONTHS; m++) {
    const status = d => m === MONTHS - 1 ? weighted([["A vencer", 6], ["Paga", 3], ["Vencida", 1]]) : m === MONTHS - 2 ? weighted([["Paga", 8], ["Vencida", 1]]) : "Paga";
    fixas.forEach(([desc, forn, cc, cat, v]) => rows.push([dmy(new Date(2026, m, 5 + Math.floor(rnd() * 5))), desc, forn, cc, cat, brl(Math.round(v * (.95 + rnd() * .12) / 50) * 50), weighted([["Boleto", 3], ["Pix", 2], ["Débito automático", 2]]), status()]));
    const count = 16 + Math.floor(rnd() * 8);
    for (let i = 0; i < count; i++) {
      const [desc, forn, cc, cat, a, b] = pick(variaveis);
      rows.push([dmy(dayIn(m)), desc, forn, cc, cat, brl(Math.round((a + rnd() * (b - a)) / 50) * 50), weighted([["Pix", 4], ["Boleto", 3], ["Cartão corporativo", 3]]), status()]);
    }
  }
  return csv(["Data", "Descrição", "Fornecedor", "Centro de custo", "Categoria", "Valor (R$)", "Forma de pagamento", "Situação"], rows);
}

const demo = {
  sheets: [
    { name: "Vendas", csv: vendas(), charts: ["valor por mês", "valor por vendedor", "pizza de valor por categoria"],
      cards: [{ titulo: "Pedidos" }, { titulo: "Faturamento", coluna: "Valor (R$)", medida: "soma" }, { titulo: "Ticket médio", coluna: "Valor (R$)", medida: "media" }, { titulo: "Pedidos pendentes", filtro: ["Status", "Pendente"] }] },
    { name: "Manutenção", csv: manutencao(), charts: ["O.S. abertas x fechadas por mês", "custo por setor", "pizza de O.S. por tipo de manutenção", "tempo médio por técnico"],
      cards: [{ titulo: "Total de O.S." }, { titulo: "O.S. abertas", filtro: ["Situação", "Aberta"] }, { titulo: "Tempo médio de atendimento", coluna: "Tempo Atendimento", medida: "media" }, { titulo: "Custo de manutenção", coluna: "Custo (R$)", medida: "soma" }] },
    { name: "Estoque", csv: estoque(), addMonth: false, comparar: false, charts: [{ agrupar: "Categoria", coluna: "Valor em estoque (R$)" }, { agrupar: "Situação", tipo: "doughnut" }, { agrupar: "Item", coluna: "Valor em estoque (R$)", tipo: "rank", top: 10 }],
      cards: [{ titulo: "Itens cadastrados" }, { titulo: "Unidades em estoque", coluna: "Quantidade", medida: "soma" }, { titulo: "Valor em estoque", coluna: "Valor em estoque (R$)", medida: "soma" }, { titulo: "Itens abaixo do mínimo", filtro: ["Situação", "Abaixo do mínimo"] }] },
    { name: "Financeiro", csv: financeiro(), charts: ["valor por mês", "valor por centro de custo", "pizza de valor por categoria"],
      cards: [{ titulo: "Despesas", coluna: "Valor (R$)", medida: "soma" }, { titulo: "Lançamentos" }, { titulo: "Contas a vencer (R$)", coluna: "Valor (R$)", medida: "soma", filtro: ["Situação", "A vencer"] }, { titulo: "Contas vencidas", filtro: ["Situação", "Vencida"] }] },
  ],
  tasks: [["Revisar metas de vendas do 4º trimestre", 6], ["Repor itens abaixo do mínimo no estoque", 2], ["Fechar as O.S. abertas da UTI Adulto", -1], ["Conferir contas a vencer do mês", 3], ["Enviar relatório mensal à diretoria", 9, true]],
  tips: ["resumo", "gráfico de valor por região", "top 10 cliente", "cartão de pedidos pendentes", "nova tarefa Ligar para fornecedor até 15/10"],
};

fs.mkdirSync(path.join(root, "docs"), { recursive: true });
let app = fs.readFileSync(path.join(root, "index.html"), "utf8");
const inject = `<script>window.ASSISTENTE_DEMO = ${JSON.stringify(demo).replace(/</g, "\\u003c")};</script>\n`;
const libs = '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/';
if (!app.includes(libs)) throw new Error("não achei o carregamento do Chart.js");
app = `<!doctype html>\n<html lang="pt-BR">\n` + app.replace(libs, inject + libs);
fs.writeFileSync(path.join(root, "docs", "app.html"), app);
const landing = fs.readFileSync(path.join(root, "site", "landing.html"), "utf8");
fs.writeFileSync(path.join(root, "docs", "index.html"), `<!doctype html>\n<html lang="pt-BR">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n` + landing);
const kb = f => (fs.statSync(path.join(root, "docs", f)).size / 1024).toFixed(0) + " KB";
console.log("docs/app.html", kb("app.html"), "· docs/index.html", kb("index.html"), "·", demo.sheets.map(s => `${s.name}: ${s.csv.split("\n").length - 1} linhas`).join(", "));
