# Assistente de Gestão (protótipo)

Assistente virtual para gestão com planilhas editáveis, painéis (dashboards) interativos e lista de tarefas, controlado por comandos em português. Interface em tema escuro.

## Como abrir

Abra o arquivo `index.html` no navegador. Não precisa instalar nada; os gráficos (Chart.js) e a exportação para Excel (SheetJS) são carregados de CDN.

## Onde ficam os dados

- O assistente começa **vazio**; os dados de exemplo só aparecem se você pedir (`ver dados de exemplo`).
- As planilhas ficam salvas no navegador **e**, quando aberto pelo link do Claude, numa cópia na nuvem do próprio assistente (o banco do artifact, que só o dono lê e grava). Ao abrir em qualquer aparelho (iPad, computador), ele carrega a versão mais recente. Isso resolve o iPad apagar os dados da página.
- Tokens de API não vão para a nuvem; ficam só no aparelho.
- **Minhas planilhas**: abas no topo do painel e da planilha para trocar com um toque; **Nova** importa outra.
- **Fazer backup** continua disponível para guardar um arquivo. A barra lateral mostra quando foi o último backup, e o assistente lembra no chat quando passa de 7 dias (no máximo um aviso por dia).

## Versão reserva (sem Claude e sem internet)

`assistente-offline.html` é o mesmo assistente num arquivo só, com as bibliotecas (gráficos, Excel e PDF) dentro dele. Abre com dois cliques no navegador do computador, sem internet e sem o Claude.

- Para baixar pelo assistente: `baixar versão reserva`.
- Para levar os dados: `fazer backup` no link do Claude e **Restaurar** na versão reserva.
- Fora do Claude ficam de fora só os pedidos livres (IA) e a cópia na nuvem. A conexão com API funciona (fora do Claude a página pode acessar o sistema direto).
- Depois de mudar o `index.html`, gere de novo com `node tools/build-offline.js` (usa as bibliotecas da pasta `vendor/`).

## Demonstração para portfólio

A pasta `docs/` tem a versão pública, com dados fictícios:

- `docs/index.html`: página de apresentação (fonte em `site/landing.html`).
- `docs/app.html`: o assistente abrindo com 4 áreas de exemplo (Vendas, Manutenção, Estoque, Financeiro). Não usa a nuvem; o que o visitante muda fica só no navegador dele. `reiniciar demonstração` volta ao início.
- `docs/img/`: telas usadas na apresentação.

Para gerar de novo depois de mudar o `index.html` ou a página: `node tools/build-demo.js`. Os dados são inventados pelo script, sempre os mesmos (semente fixa).

Para publicar no GitHub Pages: Settings → Pages → "Deploy from a branch", escolha o branch e a pasta `/docs`. Em repositório privado, o Pages exige plano pago do GitHub.

## Kit de teste

`exemplos/kit-de-teste/` (ou `exemplos/kit-de-teste.zip`) tem arquivos fictícios para testar o assistente: ordens de serviço, estoque de peças, plano de preventivas, contratos (CSV), orçamento x realizado (duas abas), consumo de energia (CSV), chamados (JSON), uma exportação "bagunçada" e um relatório em PDF. O arquivo `00-COMO-TESTAR.txt` lista pedidos para cada um. Para gerar de novo: `node tools/build-kit-teste.js`.

## O que já funciona

- **Importar e organizar dados**: cole dados (do Excel, Google Sheets, CSV, e-mail) ou arraste um arquivo `.xlsx`, `.xls`, `.csv`, `.txt` ou `.pdf`. O assistente:
  - em **PDF**, remonta a tabela pela posição do texto: agrupa as linhas, acha as colunas pelo cabeçalho, junta células e cabeçalhos quebrados em duas linhas e ignora linhas de traços. Funciona com PDF gerado pelo sistema (com tabela desenhada ou em texto corrido); PDF digitalizado (imagem) não tem texto e é recusado com aviso. Excel/CSV continuam sendo os formatos mais confiáveis;
  - encontra o cabeçalho mesmo quando o relatório tem título, filtros e data de emissão antes da tabela (como as exportações de sistemas de gestão e ERPs);
  - ignora linhas de total, rodapé ("Página 1 de 3"), cabeçalhos repetidos a cada página e títulos de grupo;
  - reconhece se há cabeçalho e, se não houver, dá nomes às colunas pelo conteúdo;
  - trata códigos (Nº OS, TAG, patrimônio, série) como texto, mesmo quando só têm números;
  - lê datas com hora (`01/07/2026 08:15`) e durações (`03:25`, `2h30`), que viram horas com média no painel;
  - identifica o tipo de cada coluna: data, moeda, número, percentual, categoria, e-mail, telefone ou texto;
  - padroniza datas (dd/mm/aaaa), converte valores como `R$ 1.200,50` em número, formata telefones, unifica categorias escritas de jeitos diferentes (`sao paulo`, `SÃO PAULO` → `São Paulo`) e corrige maiúsculas em nomes;
  - remove linhas duplicadas e linhas/colunas vazias, ordena por data e cria a coluna `Mês`;
  - mostra uma prévia em que você pode ajustar nomes e tipos antes de confirmar;
  - cria a planilha e monta os gráficos do painel automaticamente.

- **Assistente por comandos**: campo de comando com autocompletar (`Tab`), histórico (`↑`) e atalhos `/` ou `Ctrl+K`.
- **Planilhas**: células editáveis, renomear colunas, adicionar linhas e colunas, fórmulas (`=C2-D2`, `=SOMA(C2:C10)`, `=MEDIA()`, `=MAX()`, `=MIN()`, `=CONT()`), totais automáticos e exportação para `.csv` e `.xlsx`.
- **Painel**: indicadores com variação e minigráficos, filtros por categoria e gráficos de barras, linhas ou rosca que se atualizam quando a planilha muda.
- **Tarefas**: prazos, atrasadas em destaque e contagem de pendentes.

## Pedidos livres

No link do Claude, o assistente entende pedidos em linguagem natural. Os comandos conhecidos continuam funcionando na hora; perguntas (com "?", "qual", "quantas", "me diga", "poderia"...) e tudo o que as regras não reconhecem vão para o Claude, que:

- consulta os dados de verdade antes de responder (nunca inventa números): "quantas O.S. corretivas o CTI teve em agosto?", "qual equipamento deu mais custo?";
- monta gráficos e cartões com filtro e meses próprios: "faça um gráfico das corretivas por setor de julho a agosto";
- filtra o painel e executa comandos do assistente (exportar, criar tarefa, ordenar...);
- lembra das últimas perguntas, então dá para continuar: "e em setembro?".

Comandos que apagam ou restauram dados nunca são executados pela IA; ela diz qual comando digitar. O primeiro pedido livre pede sua permissão e usa o seu limite de uso do Claude. Fora do Claude (arquivo aberto no computador), valem só os comandos.

Gráficos comparativos e com filtro (funcionam também sem a IA):

- `gráfico de O.S. abertas x fechadas` → barras comparando os valores Aberta e Fechada da coluna Situação;
- `O.S. abertas x fechadas por mês` → uma série para cada valor, mês a mês;
- `gráfico de O.S. corretivas por setor em agosto` → filtro por valor e por mês;
- `gráfico de custo por setor de julho a agosto` → intervalo de meses.

O assistente reconhece valores das colunas (aberta, fechada, corretiva, Produção...) pelo radical, sem ligar para plural ou gênero. Quando um pedido de gráfico ou cartão tem palavras que ele não conhece, ou várias partes ("um gráfico por setor e outro por mês"), ele passa o pedido para a IA.

## Conectar à API do seu sistema

Em **Importar dados → Conectar a uma API** (ou o comando `conectar api`), informe:

- **Endereço (URL)** da API, por exemplo `https://seusistema.com.br/api/ordens-servico`. Se os resultados vêm em páginas, coloque `{pagina}` no endereço (`...?page={pagina}`) e o assistente busca todas (até 50).
- **Cabeçalhos** com o token ou a chave, um por linha: `Authorization: Bearer SEU_TOKEN`.
- **Onde está a lista** (opcional): o assistente acha sozinho a lista de registros dentro do JSON (ex.: `dados.itens`). Campos aninhados viram colunas (`Equipamento › setor`), datas ISO viram dd/mm/aaaa e respostas em CSV também são aceitas.
- **Atualizar sozinho**: a cada 15 min, 1 h ou 4 h enquanto a página estiver aberta.

Depois, o botão **Atualizar** no painel (ou `atualizar`) traz os dados novos e mantém os tipos de coluna, cartões e gráficos. `editar conexão` muda endereço/token, `desconectar api` para de buscar. O token fica só no navegador e não vai no arquivo de backup.

Requisitos: o sistema precisa permitir acesso pelo navegador (CORS) e usar `https://`. Dentro do Claude a página não acessa sistemas externos; para usar a API, abra o `index.html` no navegador do computador.


### API de teste

Para experimentar sem um sistema real: em **Conectar a uma API**, toque em **Usar a API de teste (dados fictícios)** e depois em **Conectar e buscar dados**. São 90 ordens de serviço inventadas, em 3 páginas JSON (`api-teste/ordens-{pagina}.json`), com campos aninhados como numa API de verdade. Os arquivos são gerados por `node tools/build-api-teste.js` e publicados junto com o assistente, por isso funcionam também dentro do Claude.

## Apagar dados

- Botão **Apagar dados** no painel e na planilha: apagar a planilha atual, esvaziar as linhas (mantendo as colunas), apagar só os exemplos ou apagar tudo.
- Ícone de lixeira ao lado de cada planilha na barra lateral.
- Comandos: `apagar dados`, `apagar exemplos`, `apagar planilha Nome`, `apagar tudo`.
- `desfazer` recupera a última exclusão. `ver dados de exemplo` traz os exemplos de volta sem apagar suas planilhas.

## Gráficos do seu jeito

Peça com suas palavras no assistente, usando os nomes das colunas da sua planilha:

- `quantidade de O.S. por setor` — conta registros por grupo
- `O.S. por mês` — evolução no tempo (agrupa qualquer coluna de data por mês; também `por ano`, `por dia`)
- `top 10 equipamentos` — ranking dos maiores
- `tempo médio por técnico` — média por grupo
- `custo por tipo de manutenção` — soma em R$, só quando você pede
- `pizza por situação`, `... em ranking`, `... em barras`
- `limpar gráficos`, `esconder custo` / `mostrar custo`

Ou clique em **Novo gráfico** para escolher o que medir, como agrupar, o tipo (barras, ranking, linhas, rosca) e quantos mostrar. O lápis em cada gráfico abre a edição. Ao importar, os gráficos automáticos contam registros; custo só aparece se você pedir.

## Cartões do painel

Os cartões do topo são simples: título, valor e a variação em relação ao período anterior (▲/▼ vs mês anterior).

- **Lápis** em cada cartão abre o editor. Todos os campos são **texto livre**, com sugestões enquanto digita, e embaixo de cada um aparece o que o assistente entendeu:
  - *O que mostrar*: "quantidade de O.S.", "custo total", "tempo médio", "maior custo";
  - *Considerar só*: "abertas", "corretivas da Produção", "abertas e em andamento" (valores da mesma coluna = um OU outro; de colunas diferentes = todos juntos);
  - *Período*: deixe **vazio** (ou "nenhum") para não usar período nem comparação; ou escreva "todo o período", "último mês", "agosto", "julho a setembro", "01/08 a 15/09", "desde 01/09", "até 31/07", "últimos 30 dias", "últimos 3 meses", "esta semana", "este ano", "2026";
  - *Comparar com*: "período anterior", "julho", "não comparar";
  - *Título* (opcional) e posição.
- Se algo não for reconhecido, o aviso diz o que existe nos dados (colunas de número, meses disponíveis).
- **×** remove o cartão (dá para `desfazer`); **+ Novo cartão** cria um.
- Por texto: `cartão de O.S. abertas`, `cartão de custo do último mês`, `cartões de julho a setembro`, `cartões de todo o período`, `remover cartão de O.S. abertas`, `restaurar cartões`.
- Os cartões respeitam o filtro escolhido no painel.

## Custo ou número?

Uma coluna só é tratada como dinheiro (R$) quando os valores têm "R$" ou o nome indica claramente dinheiro (custo, preço, valor, receita, despesa...). Quantidades, horas, contagens e códigos (O.S., TAG, patrimônio) nunca viram dinheiro nem entram em somas. Cada gráfico diz a unidade ("soma em R$", "soma (número, não é dinheiro)", "quantidade de registros").

Também ficam fora das somas as colunas que só parecem número: códigos de equipamento (mesmo repetidos), datas que o Excel grava como número (`46290,6`) e datas no formato `20260925`, que são convertidas para dd/mm/aaaa. Se um cartão mostrar um valor absurdo (centenas de milhões ou bilhões), ele exibe o botão **Marcar como código**. O comando `verificar` mostra como cada coluna está sendo calculada.

Para corrigir: troque o tipo no cabeçalho da coluna, na tela da planilha, ou diga `total não é custo` / `valor é custo`.

## Exemplos de comandos

| Comando | O que faz |
|---|---|
| `ajuda` | Lista os comandos |
| `importar dados` | Abre a importação (ou simplesmente cole os dados na página) |
| `organizar` | Identifica e arruma a planilha atual |
| `resumo` | Totais e médias da planilha atual |
| `nova planilha Clientes com colunas Nome, Cidade, Valor` | Cria uma planilha |
| `abrir planilha Estoque` | Troca de planilha |
| `adicionar linha Out; Serviços; 52000; 29000` | Insere uma linha |
| `adicionar coluna Meta` | Insere uma coluna |
| `somar receita` · `média de custo` · `maior lucro` | Cálculos rápidos |
| `ordenar por receita desc` | Ordena as linhas |
| `filtrar categoria = Serviços` · `limpar filtro` | Filtra o painel |
| `criar gráfico de receita e custo por mês` | Adiciona gráfico ao painel |
| `gráfico de pizza de lucro por categoria` | Gráfico de rosca |
| `nova tarefa Ligar para fornecedor até 30/09` | Cria tarefa com prazo |
| `concluir tarefa 2` | Conclui uma tarefa |
| `exportar excel` · `exportar csv` | Baixa a planilha |
| `apagar exemplos` | Remove planilhas e tarefas de exemplo |
| `apagar planilha Nome` · `apagar tudo` | Exclui uma planilha ou tudo |
| `desfazer` | Recupera a última exclusão |
| `backup` · `restaurar backup` | Salva / carrega um arquivo com todos os dados |
| `armazenamento` | Mostra quanto espaço os dados ocupam |
| `ver dados de exemplo` | Adiciona os exemplos de volta |

Os dados iniciais (Vendas 2026 e Estoque) são fictícios, só para demonstração.

## Próximos passos possíveis

- Conectar a um modelo de linguagem para entender pedidos livres, além dos comandos.
- Sincronizar os dados entre dispositivos (hoje isso é feito com o arquivo de backup).
