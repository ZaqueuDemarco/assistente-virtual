# Assistente de Gestão (protótipo)

Assistente virtual para gestão com planilhas editáveis, painéis (dashboards) interativos e lista de tarefas, controlado por comandos em português. Interface em tema escuro.

## Como abrir

Abra o arquivo `index.html` no navegador. Não precisa instalar nada; os gráficos (Chart.js) e a exportação para Excel (SheetJS) são carregados de CDN.

## Onde ficam os dados

Os dados ficam **só neste navegador**, no IndexedDB (armazenamento de maior capacidade, normalmente centenas de MB ou mais, conforme o disco). Nada vai para a internet. A barra lateral mostra quanto está sendo usado.

- Versões anteriores usavam `localStorage` (limite de ~5 MB); esse conteúdo é migrado automaticamente na primeira abertura.
- Se o navegador não liberar o IndexedDB, o app volta para o `localStorage` e avisa.
- **Backup:** `backup` (ou o botão **Fazer backup** na barra lateral) baixa um arquivo `.json` com todas as planilhas, gráficos e tarefas. **Restaurar** (ou arrastar o arquivo para a página) carrega de volta, substituindo ou juntando com os dados atuais. Use para levar os dados a outro computador ou se proteger contra limpeza do navegador.

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

Os cartões do topo (Total de O.S., tempo médio, custo...) são editáveis:

- **Lápis** em cada cartão: escolher o que mostrar (quantidade, soma, média, maior ou menor valor de uma coluna), um filtro ("considerar só quando Situação = Aberta"), o título, a variação em relação ao período anterior e a posição.
- **×** remove o cartão (dá para `desfazer`); **+ Novo cartão** cria um.
- Por texto: `cartão de O.S. abertas`, `cartão de média de tempo`, `cartão de maior custo em corretiva`, `remover cartão de O.S. abertas`, `restaurar cartões` (volta à escolha automática).
- **Meses de cada cartão**: no lápis, escolha o valor de *todo o período*, do *último mês* (atualiza sozinho com dados novos), de *um mês* ou de um *intervalo* (ex.: Jul/26 a Set/26), e com o que comparar: *período anterior* de mesmo tamanho, *um mês escolhido* ou *não comparar*.
- Por texto: `cartão de O.S. abertas em setembro`, `cartão de custo do último mês`, `cartões de julho a setembro` (muda todos; os que têm mês no título ficam como estão), `cartões de todo o período`.
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
