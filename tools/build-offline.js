// Gera assistente-offline.html: o mesmo index.html com as bibliotecas dentro do arquivo,
// para abrir sem internet e sem o Claude. Uso: node tools/build-offline.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), vendor = f => fs.readFileSync(path.join(root, "vendor", f));
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
// Caracteres de controle crus (ex.: ESC no SheetJS) só aparecem dentro de textos do JS: troca pela forma escapada, equivalente.
// O mesmo para U+FFFD (tabelas de codificação do SheetJS), que o publicador recusa em forma crua.
const ctrl = t => t.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, c => "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0")).replace(/\ufffd/g, "\\ufffd");
const inline = f => `<script>${ctrl(vendor(f).toString("utf8")).replace(/<\/script/gi, "<\\/script")}</script>`;
const swap = (from, to) => { if (!html.includes(from)) throw new Error("não achei: " + from); html = html.replace(from, () => to); };
swap('<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>', inline("chart.umd.min.js"));
swap('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>', inline("xlsx.full.min.js"));
// Aberto direto do disco não passa pelo "esqueleto" do Claude: precisa do doctype para não cair no modo quirks.
if (!/^<!doctype/i.test(html)) html = `<!doctype html>\n<html lang="pt-BR">\n` + html;
// Fontes do Google: sem internet o navegador usa as fontes do sistema.
html = html.replace(/<link rel="(preconnect|stylesheet)" href="https:\/\/fonts\.(googleapis|gstatic)\.com[^>]*>\n?/g, "");
// pdf.js só é carregado quando um PDF é importado; fica guardado em base64 até lá.
const b64 = (id, f) => `<script type="text/plain" id="${id}">${vendor(f).toString("base64")}</script>\n`;
html = html.trimEnd() + "\n" + b64("lib-pdf", "pdf.min.js") + b64("lib-pdf-worker", "pdf.worker.min.js");
fs.writeFileSync(path.join(root, "assistente-offline.html"), html);
console.log("assistente-offline.html:", (Buffer.byteLength(html) / 1e6).toFixed(2), "MB");
