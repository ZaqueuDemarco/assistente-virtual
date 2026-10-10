// Gera exemplos/kit-de-teste/: arquivos fictícios para testar o assistente (planilhas, CSV, JSON e PDF).
// Empresa, pessoas e números são inventados. Nada de dados reais.
// Uso: node tools/build-kit-teste.js   (o PDF é gerado com o Chromium do Playwright, se existir)
const fs = require("fs"), path = require("path"), XLSX = require(path.join(__dirname, "..", "vendor", "xlsx.full.min.js"));
const out = path.join(__dirname, "..", "exemplos", "kit-de-teste");
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
let seed = 23; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = a => a[Math.floor(rnd() * a.length)], int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pad2 = n => String(n).padStart(2, "0"), br = d => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
const money = v => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const writeXlsx = (file, sheets) => {
  const wb = XLSX.utils.book_new();
  for (const [name, rows, widths] of sheets) { const ws = XLSX.utils.aoa_to_sheet(rows); if (widths) ws["!cols"] = widths.map(w => ({ wch: w })); XLSX.utils.book_append_sheet(wb, ws, name); }
  fs.writeFileSync(path.join(out, file), XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
};
const pessoas = ["Fulano de Tal", "Ciclano da Silva", "Beltrano Souza", "Fulana de Tal", "Ciclana Pereira"];
const setores = ["Produção", "Expedição", "Almoxarifado", "Administrativo", "Refeitório", "Utilidades"];
const equips = ["Compressor de ar", "Empilhadeira", "Bomba d'água", "Caldeira", "Esteira transportadora", "Ar-condicionado", "Gerador", "Portão automático", "Elevador de carga"];

// 1) Ordens de serviço "limpas" (12 meses), boa para gráficos por mês, setor, tipo e técnico.
{
  const rows = [["Nº OS", "Abertura", "Fechamento", "Equipamento", "Setor", "Tipo", "Prioridade", "Situação", "Técnico", "Horas", "Custo peças (R$)", "Custo mão de obra (R$)"]];
  for (let i = 0; i < 360; i++) {
    const ab = new Date(2025, 9 + Math.floor(i / 30), int(1, 28));
    const tipo = pick(["Corretiva", "Corretiva", "Preventiva", "Preventiva", "Preventiva", "Preditiva", "Melhoria"]);
    const recente = i >= 330, sit = recente && rnd() < .5 ? pick(["Aberta", "Em andamento", "Aguardando peça"]) : rnd() < .03 ? "Cancelada" : "Fechada";
    const horas = tipo === "Corretiva" ? int(1, 12) : int(1, 4);
    const fe = sit === "Fechada" ? br(new Date(ab.getTime() + int(0, tipo === "Corretiva" ? 9 : 3) * 864e5)) : "";
    rows.push([`OS-${String(i + 1).padStart(5, "0")}`, br(ab), fe, pick(equips), pick(setores), tipo, pick(["Baixa", "Média", "Média", "Alta", "Urgente"]), sit, pick(pessoas), horas,
      tipo === "Corretiva" ? int(5, 180) * 10 : int(0, 30) * 10, horas * 85]);
  }
  writeXlsx("01-ordens-de-servico.xlsx", [["Ordens", rows, [11, 11, 11, 22, 15, 11, 10, 16, 17, 7, 16, 20]]]);
}

// 2) Estoque de peças: quantidade x mínimo, para "o que está abaixo do mínimo" e valor em estoque.
{
  const itens = [["Correia em V A-42", "Transmissão"], ["Rolamento 6205", "Rolamentos"], ["Rolamento 6308", "Rolamentos"], ["Filtro de ar compressor", "Filtros"], ["Filtro de óleo", "Filtros"],
    ["Óleo hidráulico 68 (20 L)", "Lubrificantes"], ["Graxa de lítio (1 kg)", "Lubrificantes"], ["Contator 25 A", "Elétrica"], ["Disjuntor 32 A", "Elétrica"], ["Lâmpada LED tubular", "Elétrica"],
    ["Fusível NH 100 A", "Elétrica"], ["Selo mecânico bomba", "Hidráulica"], ["Mangueira 1/2\" (m)", "Hidráulica"], ["Válvula esfera 1\"", "Hidráulica"], ["Gás refrigerante R-410A", "Refrigeração"],
    ["Capacitor 35 µF", "Refrigeração"], ["Pneu empilhadeira", "Movimentação"], ["Bateria 12 V", "Movimentação"], ["Parafuso sextavado M10 (cx)", "Fixação"], ["Fita veda-rosca", "Hidráulica"],
    ["Termostato caldeira", "Caldeira"], ["Pressostato", "Caldeira"], ["Sensor indutivo", "Automação"], ["Relé temporizador", "Automação"], ["Luva nitrílica (cx)", "EPI"], ["Óculos de proteção", "EPI"]];
  const rows = [["Código", "Item", "Categoria", "Quantidade", "Estoque mínimo", "Unidade", "Custo unitário", "Fornecedor", "Última entrada", "Localização"]];
  itens.forEach(([nome, cat], i) => {
    const min = int(2, 20), qtd = rnd() < .3 ? int(0, min - 1) : int(min, min * 3);
    rows.push([`P-${100 + i}`, nome, cat, qtd, min, pick(["un", "un", "cx", "m", "L"]), int(8, 900) + .9, pick(["Fornecedor Alfa", "Distribuidora Beta", "Casa das Peças Gama", "Delta Industrial"]),
      br(new Date(2026, int(0, 8), int(1, 28))), `Prateleira ${String.fromCharCode(65 + int(0, 5))}${int(1, 9)}`]);
  });
  writeXlsx("02-estoque-de-pecas.xlsx", [["Estoque", rows, [8, 28, 14, 11, 15, 8, 14, 22, 14, 14]]]);
}

// 3) Plano de preventivas com próxima data: tem vencidas, a vencer e em dia (referência: outubro/2026).
{
  const rows = [["Equipamento", "Setor", "Atividade", "Periodicidade", "Última execução", "Próxima execução", "Status", "Responsável"]];
  const ativ = ["Lubrificação geral", "Troca de filtros", "Inspeção elétrica", "Limpeza e higienização", "Teste de segurança", "Aferição de instrumentos", "Reaperto de conexões"];
  const per = { Mensal: 30, Trimestral: 91, Semestral: 182, Anual: 365 }, hoje = new Date(2026, 9, 10);
  for (let i = 0; i < 60; i++) {
    const p = pick(Object.keys(per)), prox = new Date(hoje.getTime() + int(-40, 120) * 864e5), ult = new Date(prox.getTime() - per[p] * 864e5);
    const dias = (prox - hoje) / 864e5, status = dias < 0 ? "Vencida" : dias <= 30 ? "A vencer" : "Em dia";
    rows.push([pick(equips), pick(setores), pick(ativ), p, br(ult), br(prox), status, pick(pessoas)]);
  }
  writeXlsx("03-plano-de-preventivas.xlsx", [["Preventivas", rows, [22, 15, 24, 13, 15, 16, 10, 17]]]);
}

// 4) Contratos de fornecedores em CSV no formato brasileiro (ponto e vírgula, vírgula decimal).
{
  const forn = ["Fornecedor Alfa", "Distribuidora Beta", "Casa das Peças Gama", "Delta Industrial", "Elevadores Épsilon", "Clima Zeta Refrigeração", "Limpeza Ômega", "Segurança Sigma", "Energia Kappa", "Jardinagem Lambda"];
  const serv = ["Manutenção de elevadores", "Manutenção de ar-condicionado", "Fornecimento de peças", "Limpeza predial", "Vigilância", "Manutenção de geradores", "Jardinagem", "Dedetização", "Manutenção de caldeira", "Locação de empilhadeira"];
  const lines = ["Contrato;Fornecedor;Serviço;Início;Fim;Valor mensal;Reajuste;Situação;Gestor"];
  forn.forEach((f, i) => {
    const ini = new Date(2024 + int(0, 2), int(0, 11), 1), fim = new Date(ini.getFullYear() + int(1, 2), ini.getMonth(), 0);
    const sit = fim < new Date(2026, 9, 10) ? "Vencido" : (fim - new Date(2026, 9, 10)) / 864e5 < 90 ? "Renovar" : "Ativo";
    lines.push([`CT-${2024 + i}`, f, serv[i], br(ini), br(fim), `R$ ${money(int(15, 400) * 50)}`, pick(["IPCA", "IGP-M", "Sem reajuste"]), sit, pick(pessoas)].join(";"));
  });
  fs.writeFileSync(path.join(out, "04-contratos.csv"), "﻿" + lines.join("\r\n") + "\r\n");
}

// 5) Orçamento x realizado: duas abas (resumo por mês e lançamentos), para testar planilha com várias abas.
{
  const centros = ["Manutenção predial", "Manutenção industrial", "Utilidades", "Frota", "Serviços terceirizados"];
  const meses = ["jan/26", "fev/26", "mar/26", "abr/26", "mai/26", "jun/26", "jul/26", "ago/26", "set/26"];
  const resumo = [["Mês", "Centro de custo", "Orçado (R$)", "Realizado (R$)"]], lanc = [["Data", "Centro de custo", "Descrição", "Fornecedor", "Valor (R$)", "Nota fiscal"]];
  for (const [mi, m] of meses.entries()) for (const c of centros) {
    const orc = int(20, 90) * 500, real = Math.round(orc * (0.75 + rnd() * .45));
    resumo.push([m, c, orc, real]);
    for (let k = 0; k < 3; k++) lanc.push([br(new Date(2026, mi, int(1, 28))), c, pick(["Compra de peças", "Serviço terceirizado", "Material elétrico", "Combustível", "Ferramentas", "Locação"]),
      pick(["Fornecedor Alfa", "Distribuidora Beta", "Delta Industrial", "Energia Kappa"]), Math.round(real / 3), `NF ${int(10000, 99999)}`]);
  }
  writeXlsx("05-orcamento-x-realizado.xlsx", [["Resumo mensal", resumo, [8, 24, 13, 15]], ["Lançamentos", lanc, [11, 24, 22, 20, 12, 11]]]);
}

// 6) Consumo diário de energia e água por prédio (série de tempo longa).
{
  const lines = ["Data,Prédio,Energia (kWh),Água (m3),Temperatura média (°C)"];
  for (let d = 0; d < 180; d++) {
    const dt = new Date(2026, 3, 1 + d), fds = [0, 6].includes(dt.getDay());
    for (const [p, base] of [["Bloco A", 1800], ["Bloco B", 1200], ["Galpão", 3200]]) {
      const temp = 18 + 8 * Math.sin((d + 40) / 58) + rnd() * 3;
      lines.push([dt.toISOString().slice(0, 10), p, Math.round(base * (fds ? .55 : 1) * (1 + (temp - 20) / 40) + rnd() * 150), (base / 60 * (fds ? .5 : 1) + rnd() * 6).toFixed(1), temp.toFixed(1)].join(","));
    }
  }
  fs.writeFileSync(path.join(out, "06-consumo-energia-agua.csv"), lines.join("\n") + "\n");
}

// 7) Chamados (JSON, como viria de uma API).
{
  const cham = [];
  for (let i = 0; i < 80; i++) {
    const ab = new Date(2026, 8, int(1, 30), int(7, 18), pick([0, 15, 30, 45]));
    const st = pick(["aberto", "em_atendimento", "resolvido", "resolvido", "resolvido"]);
    cham.push({ id: 5000 + i, aberto_em: ab.toISOString().slice(0, 16).replace("T", " "), solicitante: pick(pessoas), local: pick(setores), categoria: pick(["Elétrica", "Hidráulica", "Civil", "Ar-condicionado", "Mobiliário", "TI"]),
      descricao: pick(["Lâmpada queimada", "Vazamento na pia", "Porta não fecha", "Ar não gela", "Tomada sem energia", "Infiltração no teto", "Cadeira quebrada"]), status: st, sla_horas: pick([4, 8, 24, 48]),
      horas_ate_resolver: st === "resolvido" ? +(rnd() * 50).toFixed(1) : null, nota_satisfacao: st === "resolvido" ? int(2, 5) : null });
  }
  fs.writeFileSync(path.join(out, "07-chamados.json"), JSON.stringify({ origem: "API fictícia de chamados", gerado_em: "2026-10-10", chamados: cham }, null, 2));
}

// 8) Planilha "bagunçada", como muitos sistemas exportam: título, células mescladas, subtotais e rodapé.
fs.copyFileSync(path.join(__dirname, "..", "exemplos", "planilha-teste.xlsx"), path.join(out, "08-relatorio-baguncado.xlsx"));

// 9) Relatório em PDF com tabela (testa a leitura de PDF).
const pdfHtml = (() => {
  const rows = []; let total = 0;
  for (let i = 0; i < 40; i++) {
    const v = int(10, 300) * 10; total += v;
    rows.push(`<tr><td>OS-${String(9000 + i)}</td><td>${br(new Date(2026, 8, int(1, 30)))}</td><td>${pick(equips)}</td><td>${pick(setores)}</td><td>${pick(["Corretiva", "Preventiva"])}</td><td>${pick(pessoas)}</td><td style="text-align:right">${money(v)}</td></tr>`);
  }
  return `<!doctype html><meta charset="utf-8"><style>body{font:11px Arial,sans-serif;margin:28px}h1{font-size:16px;margin:0}p{margin:2px 0 12px;color:#555}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #ccc;padding:4px 6px;text-align:left}th{background:#eee}</style>
<h1>Empresa Exemplo Ltda: ordens de serviço de setembro/2026</h1><p>Relatório fictício para teste. Todos os nomes e valores são inventados.</p>
<table><tr><th>Nº OS</th><th>Data</th><th>Equipamento</th><th>Setor</th><th>Tipo</th><th>Técnico</th><th>Custo (R$)</th></tr>${rows.join("")}</table>
<p style="margin-top:10px"><b>Total: R$ ${money(total)}</b></p>`;
})();
fs.writeFileSync(path.join(out, ".relatorio.html"), pdfHtml);
(async () => {
  try {
    const { chromium } = require(require("child_process").execSync("npm root -g").toString().trim() + "/playwright");
    const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage();
    await p.setContent(pdfHtml); await p.pdf({ path: path.join(out, "09-relatorio-setembro.pdf"), format: "A4" }); await b.close();
  } catch (e) { console.log("PDF não gerado:", e.message); }
  fs.rmSync(path.join(out, ".relatorio.html"));
  fs.copyFileSync(path.join(__dirname, "kit-como-testar.txt"), path.join(out, "00-COMO-TESTAR.txt"));
  // Tudo num .zip, para baixar de uma vez (no iPad, o app Arquivos abre o .zip).
  const zip = path.join(out, "..", "kit-de-teste.zip"); fs.rmSync(zip, { force: true });
  try { require("child_process").execSync(`zip -q -X -j "${zip}" "${out}"/*`); } catch (e) { console.log("zip não gerado:", e.message); }
  console.log(fs.readdirSync(out).join("\n"));
})();
