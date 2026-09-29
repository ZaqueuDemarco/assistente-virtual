// Gera exemplos/planilha-teste.xlsx: relatório fictício "como sai do sistema", para testar a importação.
// Tem título, período, linhas em branco, datas em formatos variados, valores com e sem R$, nomes em caixa alta,
// uma linha repetida, linha de total e rodapé. Uso: node tools/build-planilha-teste.js
const path = require("path"), XLSX = require(path.join(__dirname, "..", "vendor", "xlsx.full.min.js"));
let seed = 11; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = a => a[Math.floor(rnd() * a.length)];
const pad2 = n => String(n).padStart(2, "0");
const setores = ["Produção", "produção", "Expedição", "EXPEDICAO", "Almoxarifado", "Administrativo", "Refeitório", "refeitorio"];
const equip = ["Compressor de ar", "Empilhadeira", "Bomba d'água", "Caldeira", "Esteira transportadora", "Ar-condicionado", "Gerador"];
const tecnicos = ["FULANO DE TAL", "Ciclano da Silva", "beltrano souza", "Fulana de Tal"];
const tipos = ["Corretiva", "corretiva", "Preventiva", "PREVENTIVA", "Calibração"];
const rows = [["Relatório de Ordens de Serviço — Empresa Exemplo"], ["Período: 01/07/2026 a 30/09/2026"], ["Emitido por: Sistema de Gestão (fictício)"], [],
  ["Nº OS", "Data Abertura", "Equipamento", "Setor", "Tipo de Manutenção", "Situação", "Técnico", "Tempo Atendimento", "Custo (R$)"]];
let total = 0;
for (let i = 0; i < 120; i++) {
  const m = 7 + Math.floor(i / 40), d = 1 + Math.floor(rnd() * 28);
  const data = [`${pad2(d)}/${pad2(m)}/2026`, `2026-${pad2(m)}-${pad2(d)}`, `${d}/${m}/26`][Math.floor(rnd() * 3)];
  const tipo = pick(tipos), corretiva = /corretiva/i.test(tipo);
  const sit = m === 9 && rnd() < .4 ? pick(["Aberta", "Em andamento", "aberta"]) : "Fechada";
  const custo = Math.round((corretiva ? 200 + rnd() * 1800 : 100 + rnd() * 300) / 10) * 10; total += custo;
  const h = corretiva ? 1 + Math.floor(rnd() * 8) : 1 + Math.floor(rnd() * 2), mi = pick([0, 15, 30, 45]);
  rows.push([`OS-${String(i + 1).padStart(4, "0")}`, data, pick(equip), pick(setores), tipo, sit, pick(tecnicos), `${pad2(h)}:${pad2(mi)}`,
    pick([`R$ ${custo.toLocaleString("pt-BR")},00`, custo, `${custo},00`])]);
  if (i === 30 || i === 77) rows.push([...rows[rows.length - 1]]); // linha repetida de propósito
  if (i === 59) rows.push([]); // linha em branco no meio
}
rows.push([], ["TOTAL", "", "", "", "", "", "", "", `R$ ${total.toLocaleString("pt-BR")},00`], ["Página 1 de 1 — dados fictícios para teste"]);
const ws = XLSX.utils.aoa_to_sheet(rows);
ws["!cols"] = [10, 14, 24, 20, 20, 14, 18, 18, 14].map(w => ({ wch: w }));
const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Ordens de Serviço");
require("fs").writeFileSync(path.join(__dirname, "..", "exemplos", "planilha-teste.xlsx"), XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
console.log("exemplos/planilha-teste.xlsx:", rows.length, "linhas (com título, total e rodapé)");
