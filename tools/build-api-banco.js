// Gera uma API de banco FICTÍCIA no formato do Open Finance Brasil (transações de conta):
//   api-teste/banco/transacoes-1.json … (a última vem vazia, marcando o fim)
// Campos como na especificação: transactionName, creditDebitType (CREDITO/DEBITO), type (PIX, BOLETO...),
// transactionAmount.amount em texto com ponto, transactionDateTime em ISO. Nomes e valores inventados.
// Uso: node tools/build-api-banco.js
const fs = require("fs"), path = require("path");
let seed = 31; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = a => a[Math.floor(rnd() * a.length)];
const pad2 = n => String(n).padStart(2, "0");
const saidas = [["MERCADO EXEMPLO", "CARTAO", 80, 450], ["PADARIA EXEMPLO", "CARTAO", 15, 60], ["POSTO EXEMPLO", "CARTAO", 100, 250], ["APP DE TRANSPORTE", "CARTAO", 15, 45], ["FARMACIA EXEMPLO", "CARTAO", 20, 120], ["RESTAURANTE EXEMPLO", "PIX", 40, 150], ["PIX ENVIADO FULANO DE TAL", "PIX", 50, 300], ["STREAMING EXEMPLO", "CARTAO", 40, 40], ["ACADEMIA EXEMPLO", "BOLETO", 100, 100]];
const fixas = [["ALUGUEL", "BOLETO", 1500, 5], ["CONTA DE LUZ", "BOLETO", 180, 10], ["CONTA DE AGUA", "BOLETO", 90, 12], ["INTERNET E TELEFONE", "BOLETO", 120, 15]];
const all = []; let id = 1;
const tx = (m, d, name, type, amount, cd) => all.push({
  transactionId: `TX${String(id++).padStart(6, "0")}`,
  completedAuthorisedPaymentType: "TRANSACAO_EFETIVADA",
  creditDebitType: cd, transactionName: name, type,
  transactionAmount: { amount: amount.toFixed(2), currency: "BRL" },
  transactionDateTime: `2026-${pad2(m)}-${pad2(d)}T${pad2(8 + Math.floor(rnd() * 12))}:${pad2(Math.floor(rnd() * 60))}:00.000Z`,
});
for (const m of [7, 8, 9]) {
  tx(m, 5, "SALARIO EMPRESA ALFA", "TED", 5000, "CREDITO");
  if (m === 8) tx(m, 20, "PIX RECEBIDO CICLANO DA SILVA", "PIX", 250, "CREDITO");
  for (const [n, t, v, d] of fixas) tx(m, d, n, t, Math.round(v * (.95 + rnd() * .1) / 5) * 5, "DEBITO");
  const count = 22 + Math.floor(rnd() * 8);
  for (let i = 0; i < count; i++) { const [n, t, a, b] = pick(saidas); tx(m, 1 + Math.floor(rnd() * 28), n, t, Math.round((a + rnd() * (b - a)) / 5) * 5, "DEBITO"); }
}
all.sort((a, b) => a.transactionDateTime.localeCompare(b.transactionDateTime));
const PER = 40, pages = Math.ceil(all.length / PER);
for (const dir of [path.join("api-teste", "banco"), path.join("docs", "api-teste", "banco")]) {
  fs.mkdirSync(path.join(__dirname, "..", dir), { recursive: true });
  for (let p = 1; p <= pages + 1; p++) {
    const body = { data: all.slice((p - 1) * PER, p * PER), links: { self: `transacoes-${p}.json`, ...(p < pages ? { next: `transacoes-${p + 1}.json` } : {}) }, meta: { totalRecords: all.length, totalPages: pages, requestDateTime: "2026-10-01T12:00:00Z" } };
    fs.writeFileSync(path.join(__dirname, "..", dir, `transacoes-${p}.json`), JSON.stringify(body, null, 2));
  }
}
console.log(`api-teste/banco: ${all.length} transações em ${pages} páginas (+1 vazia)`);
