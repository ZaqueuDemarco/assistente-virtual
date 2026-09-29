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
  const clientes = ["Padaria Bom Grão", "Clínica Vida Plena", "Mercado Serra Azul", "Construtora Alicerce", "Auto Peças Rota 40", "Escola Pequeno Saber", "Hotel Mirante", "Farmácia Bem Estar", "Restaurante Sabor da Terra", "Academia Ritmo", "Papelaria Traço", "Transportadora Via Sul", "Contabilidade Exata", "Pet Shop Amigo Fiel"];
  const vendedores = [["Ana Ribeiro", 1.25], ["Bruno Costa", 1], ["Carla Nunes", 1.1], ["Diego Alves", .8], ["Elisa Moraes", .9]];
  const regioes = [["Sudeste", 4], ["Sul", 2.5], ["Nordeste", 2], ["Centro-Oeste", 1.2]];
  const produtos = [["Notebook 14\"", "Informática", 3890], ["Monitor 24\"", "Informática", 899], ["Impressora laser", "Informática", 1450], ["Cadeira ergonômica", "Mobiliário", 1240], ["Mesa de escritório", "Mobiliário", 980], ["Papel A4 (caixa)", "Suprimentos", 189.9], ["Toner", "Suprimentos", 329], ["Headset USB", "Acessórios", 214], ["Teclado sem fio", "Acessórios", 159]];
  const rows = []; let n = 10230;
  for (let m = 0; m < MONTHS; m++) {
    const count = 34 + m * 3 + Math.floor(rnd() * 8);
    for (let i = 0; i < count; i++) {
      const [prod, cat, price] = pick(produtos);
      const qtd = cat === "Suprimentos" ? 5 + Math.floor(rnd() * 30) : 1 + Math.floor(rnd() * (cat === "Informática" ? 6 : 10));
      const desc = qtd >= 10 ? .92 : 1;
      const trend = 1 + m * .025; // leve crescimento ao longo do ano
      rows.push([dmy(dayIn(m)), `PV-${n++}`, pick(clientes), weighted(vendedores), weighted(regioes), prod, cat, qtd, brl(Math.round(price * qtd * desc * trend * 100) / 100), weighted([["Pago", 75], ["Pendente", 18], ["Cancelado", 7]])]);
    }
  }
  return csv(["Data", "Pedido", "Cliente", "Vendedor", "Região", "Produto", "Categoria", "Quantidade", "Valor (R$)", "Status"], rows);
}

function estoque() {
  const itens = [
    ["Papel A4 (caixa)", "Suprimentos", "Distribuidora Sul", 189.9], ["Toner HP 85A", "Suprimentos", "InfoParts", 329], ["Caneta azul (cx 50)", "Suprimentos", "Distribuidora Sul", 42.5], ["Grampeador", "Suprimentos", "Papelaria Central", 38.9], ["Pasta suspensa (cx)", "Suprimentos", "Papelaria Central", 64],
    ["Monitor 24\"", "Informática", "InfoParts", 899], ["Teclado sem fio", "Informática", "InfoParts", 159], ["Mouse óptico", "Informática", "TecnoMais", 49.9], ["Cabo HDMI 2 m", "Informática", "TecnoMais", 29.9], ["Nobreak 1200 VA", "Informática", "Energia Forte", 780], ["SSD 480 GB", "Informática", "TecnoMais", 259],
    ["Cadeira ergonômica", "Mobiliário", "Móveis Lima", 1240], ["Mesa de escritório", "Mobiliário", "Móveis Lima", 980], ["Armário de aço", "Mobiliário", "Aço Forte", 1350], ["Gaveteiro", "Mobiliário", "Móveis Lima", 540],
    ["Café em grãos (kg)", "Copa", "Torra Viva", 72.5], ["Açúcar (5 kg)", "Copa", "Atacado Bom Preço", 24.9], ["Copo descartável (pct)", "Copa", "Atacado Bom Preço", 9.8], ["Filtro de água (refil)", "Copa", "Água Pura", 89],
    ["Detergente (5 L)", "Limpeza", "Limpa Tudo", 32], ["Papel toalha (fardo)", "Limpeza", "Limpa Tudo", 58], ["Álcool 70% (5 L)", "Limpeza", "Limpa Tudo", 46], ["Saco de lixo 100 L", "Limpeza", "Atacado Bom Preço", 36],
    ["Lâmpada LED 18 W", "Manutenção predial", "Elétrica Luz", 22.9], ["Disjuntor 20 A", "Manutenção predial", "Elétrica Luz", 31.5], ["Fita isolante", "Manutenção predial", "Elétrica Luz", 7.9], ["Filtro de ar-condicionado", "Manutenção predial", "Clima Certo", 64], ["Tinta branca (18 L)", "Manutenção predial", "Casa das Tintas", 289],
  ];
  const rows = itens.map(([item, cat, forn, preco], i) => {
    const min = [5, 10, 20, 30][Math.floor(rnd() * 4)];
    const qtd = rnd() < .25 ? Math.floor(rnd() * min) : min + Math.floor(rnd() * min * 3);
    return [`EST-${String(101 + i)}`, item, cat, forn, qtd, min, brl(preco), brl(Math.round(qtd * preco * 100) / 100), dmy(new Date(2026, 5 + Math.floor(rnd() * 4), 1 + Math.floor(rnd() * 28))), qtd < min ? "Abaixo do mínimo" : "OK"];
  });
  return csv(["Código", "Item", "Categoria", "Fornecedor", "Quantidade", "Estoque mínimo", "Preço unitário (R$)", "Valor em estoque (R$)", "Última entrada", "Situação"], rows);
}

function manutencao() {
  const equip = [["Monitor multiparâmetro", 1], ["Ventilador pulmonar", 1.4], ["Bomba de infusão", .6], ["Autoclave", 1.8], ["Desfibrilador", 1], ["Ar-condicionado", 1.2], ["Gerador", 2.4], ["Elevador", 2.2], ["Centrífuga", .9], ["Raio-X móvel", 2.6]];
  const setores = [["UTI Adulto", 3], ["Centro Cirúrgico", 2.5], ["Pronto Atendimento", 2.5], ["Radiologia", 1.5], ["Laboratório", 1.5], ["Internação", 2]];
  const tecnicos = ["Rafael Lima", "Juliana Prado", "Marcos Teixeira", "Patrícia Souza"];
  const rows = []; let n = 4810;
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
      const custo = tipo === "Corretiva" ? Math.round((120 + rnd() * 1400) * peso) : tipo === "Calibração" ? 180 + Math.round(rnd() * 120) : Math.round(rnd() * 260);
      const t = Math.round(horas * 4) / 4;
      rows.push([`OS-${n++}`, dmy(open), close ? dmy(close) : "", eq, weighted(setores), tipo, sit, pick(tecnicos), `${pad2(Math.floor(t))}:${pad2(Math.round((t % 1) * 60))}`, brl(custo)]);
    }
  }
  return csv(["Nº OS", "Data Abertura", "Data Fechamento", "Equipamento", "Setor", "Tipo de Manutenção", "Situação", "Técnico", "Tempo Atendimento", "Custo (R$)"], rows);
}

function financeiro() {
  const fixas = [["Aluguel da sede", "Imobiliária Centro", "Administrativo", "Aluguel", 12500], ["Energia elétrica", "Companhia de Energia", "Operações", "Energia", 4200], ["Internet e telefonia", "Conecta Telecom", "TI", "Telecom", 1890], ["Licenças de software", "SoftNuvem", "TI", "Software", 3400], ["Limpeza e conservação", "Limpa Tudo Serviços", "Administrativo", "Serviços terceirizados", 5600]];
  const variaveis = [["Material de escritório", "Papelaria Central", "Administrativo", "Materiais", 300, 1800], ["Campanha de marketing", "Agência Faísca", "Comercial", "Marketing", 1500, 9000], ["Viagem a cliente", "Viaje Bem", "Comercial", "Viagens", 600, 4200], ["Manutenção de equipamentos", "Técnica Rápida", "Operações", "Manutenção", 400, 5200], ["Frete de mercadorias", "Transportadora Via Sul", "Operações", "Frete", 250, 3100], ["Treinamento da equipe", "Escola de Gestão", "Administrativo", "Treinamento", 800, 4800], ["Equipamentos de TI", "InfoParts", "TI", "Equipamentos", 700, 7800]];
  const rows = [];
  for (let m = 0; m < MONTHS; m++) {
    const status = d => m === MONTHS - 1 ? weighted([["A vencer", 6], ["Paga", 3], ["Vencida", 1]]) : m === MONTHS - 2 ? weighted([["Paga", 8], ["Vencida", 1]]) : "Paga";
    fixas.forEach(([desc, forn, cc, cat, v]) => rows.push([dmy(new Date(2026, m, 5 + Math.floor(rnd() * 5))), desc, forn, cc, cat, brl(Math.round(v * (.95 + rnd() * .12) * 100) / 100), weighted([["Boleto", 3], ["Pix", 2], ["Débito automático", 2]]), status()]));
    const count = 16 + Math.floor(rnd() * 8);
    for (let i = 0; i < count; i++) {
      const [desc, forn, cc, cat, a, b] = pick(variaveis);
      rows.push([dmy(dayIn(m)), desc, forn, cc, cat, brl(Math.round((a + rnd() * (b - a)) * 100) / 100), weighted([["Pix", 4], ["Boleto", 3], ["Cartão corporativo", 3]]), status()]);
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
