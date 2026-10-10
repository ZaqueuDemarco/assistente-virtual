// Monta publico/: o que vai para o repositório público (GitHub Pages).
//   index.html        = o assistente, com link próprio (fora do Claude: acessa APIs como a brapi)
//   api-teste/        = API de teste fictícia
//   assistente-offline.html = versão reserva (comando "baixar versão reserva")
//   portfolio/        = página de apresentação + demonstração com dados fictícios
// Uso: node tools/build-offline.js && node tools/build-demo.js && node tools/build-site.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), out = path.join(root, "publico");
const cp = (from, to) => { fs.mkdirSync(path.dirname(path.join(out, to)), { recursive: true }); fs.copyFileSync(path.join(root, from), path.join(out, to)); };
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
// O site usa a versão com as bibliotecas embutidas: depois da primeira visita, abre mesmo sem internet (sw.js).
let app = fs.readFileSync(path.join(root, "assistente-offline.html"), "utf8").replace(/^<!doctype html>\n<html lang="pt-BR">\n/i, "");
// Ícone e título para "Adicionar à Tela de Início" no iPad/iPhone e no Android.
const head = `<!doctype html>\n<html lang="pt-BR">\n<link rel="apple-touch-icon" href="icone-180.png">\n<link rel="icon" href="icone-180.png">\n<link rel="manifest" href="manifest.webmanifest">\n<meta name="apple-mobile-web-app-title" content="Assistente">\n<meta name="theme-color" content="#0d1117">\n<script>window.ASSISTENTE_SITE = true;</script>\n`;
fs.writeFileSync(path.join(out, "index.html"), head + app);
// Guarda o site no aparelho: busca a versão nova quando há internet; sem internet, usa a cópia guardada.
// Pedidos para outros sites (APIs, IA) passam direto, sem cache.
const build = Date.now().toString(36);
fs.writeFileSync(path.join(out, "sw.js"), `const C = "assistente-${build}";
const FILES = ["./", "index.html", "manifest.webmanifest", "icone-180.png", "icone-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
});
`);
fs.writeFileSync(path.join(out, "manifest.webmanifest"), JSON.stringify({ name: "Assistente de Gestão", short_name: "Assistente", start_url: "./", display: "standalone", background_color: "#0d1117", theme_color: "#0d1117", icons: [{ src: "icone-180.png", sizes: "180x180", type: "image/png" }, { src: "icone-512.png", sizes: "512x512", type: "image/png" }] }, null, 2));
cp("site/icone-180.png", "icone-180.png"); cp("site/icone-512.png", "icone-512.png");
cp("assistente-offline.html", "assistente-offline.html");
for (const f of fs.readdirSync(path.join(root, "api-teste"))) cp(`api-teste/${f}`, `api-teste/${f}`);
for (const f of ["index.html", "app.html"]) cp(`docs/${f}`, `portfolio/${f}`);
for (const f of fs.readdirSync(path.join(root, "docs", "img"))) cp(`docs/img/${f}`, `portfolio/img/${f}`);
for (const f of fs.readdirSync(path.join(root, "docs", "api-teste"))) cp(`docs/api-teste/${f}`, `portfolio/api-teste/${f}`);
fs.writeFileSync(path.join(out, ".nojekyll"), "");
fs.writeFileSync(path.join(out, "README.md"), `# Assistente de Gestão

Assistente de gestão que transforma planilhas e dados de APIs em painéis, cartões e gráficos, a partir de pedidos escritos em português. Projeto pessoal, desenvolvido com o Claude (Anthropic).

- **Assistente:** \`index.html\` (abre no navegador; os dados ficam no próprio aparelho)
- **Portfólio e demonstração com dados fictícios:** \`portfolio/\`
- **API de teste (fictícia):** \`api-teste/\`

Tudo roda no navegador, sem servidor. Bibliotecas: Chart.js, SheetJS e pdf.js.
`);
const list = []; (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : list.push(path.relative(out, p)); } })(out);
console.log(list.length, "arquivos em publico/:", list.join(", "));
