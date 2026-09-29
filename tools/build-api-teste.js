// Gera uma "API de teste" com ordens de serviço fictícias, em páginas JSON estáticas:
//   api-teste/ordens-1.json … ordens-4.json (a 4ª vem vazia, marcando o fim)
// Formato parecido com APIs reais: lista dentro de "dados.ordens", campos aninhados, datas ISO e números com ponto.
// Publicada junto com o assistente, é usada pelo botão "Usar a API de teste". Uso: node tools/build-api-teste.js
const fs = require("fs"), path = require("path");
let seed = 23; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = a => a[Math.floor(rnd() * a.length)];
const pad2 = n => String(n).padStart(2, "0");
const equip = [["Compressor de ar", "Produção"], ["Caldeira", "Produção"], ["Empilhadeira", "Expedição"], ["Esteira transportadora", "Expedição"], ["Bomba d'água", "Utilidades"], ["Ar-condicionado", "Administrativo"], ["Nobreak", "TI"], ["Gerador", "Utilidades"]];
const tecnicos = ["Técnico A", "Técnico B", "Técnico C", "Técnico D"];
const all = [];
for (let i = 0; i < 90; i++) {
  const m = 7 + Math.floor(i / 30), d = 1 + Math.floor(rnd() * 28), h = 7 + Math.floor(rnd() * 11);
  const [nome, setor] = pick(equip), tipo = rnd() < .6 ? "Corretiva" : rnd() < .8 ? "Preventiva" : "Calibração";
  const situacao = m === 9 && rnd() < .45 ? pick(["Aberta", "Em andamento"]) : "Fechada";
  all.push({
    numero: `OS-${String(i + 1).padStart(4, "0")}`,
    abertura: `2026-${pad2(m)}-${pad2(d)}T${pad2(h)}:${pick(["00", "15", "30", "45"])}:00`,
    equipamento: { nome, patrimonio: `PAT-${String(100 + Math.floor(rnd() * 900))}`, setor },
    tipo, situacao, prioridade: tipo === "Corretiva" ? pick(["Alta", "Média", "Baixa"]) : "Baixa",
    tecnico: pick(tecnicos),
    horas: Math.round((tipo === "Corretiva" ? 1 + rnd() * 7 : .5 + rnd() * 2) * 4) / 4,
    custo: Math.round((tipo === "Corretiva" ? 200 + rnd() * 1800 : 100 + rnd() * 300) / 10) * 10,
    urgente: tipo === "Corretiva" && rnd() < .2,
  });
}
const PER = 30, pages = Math.ceil(all.length / PER);
for (const dir of ["api-teste", path.join("docs", "api-teste")]) {
  fs.mkdirSync(path.join(__dirname, "..", dir), { recursive: true });
  for (let p = 1; p <= pages + 1; p++) {
    const body = { pagina: p, por_pagina: PER, total_registros: all.length, total_paginas: pages, dados: { ordens: all.slice((p - 1) * PER, p * PER) } };
    fs.writeFileSync(path.join(__dirname, "..", dir, `ordens-${p}.json`), JSON.stringify(body, null, 2));
  }
}
console.log(`api-teste: ${all.length} ordens em ${pages} páginas (+1 vazia)`);
