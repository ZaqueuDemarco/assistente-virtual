# Assistente de Gestão (protótipo)

Assistente virtual para gestão com planilhas editáveis, painéis (dashboards) interativos e lista de tarefas, controlado por comandos em português. Interface em tema escuro.

## Como abrir

Abra o arquivo `index.html` no navegador. Não precisa instalar nada; os gráficos (Chart.js) e a exportação para Excel (SheetJS) são carregados de CDN. Os dados ficam salvos no próprio navegador (`localStorage`).

## O que já funciona

- **Importar e organizar dados**: cole dados (do Excel, Google Sheets, CSV, e-mail) ou arraste um arquivo `.xlsx`, `.xls`, `.csv` ou `.txt`. O assistente:
  - encontra o cabeçalho mesmo quando o relatório tem título, filtros e data de emissão antes da tabela (como as exportações do Neovero e de ERPs);
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

## Apagar os dados de exemplo

- No painel, clique em **Apagar exemplos** (no aviso amarelo), ou digite `apagar exemplos`.
- Para excluir uma planilha: botão **Excluir planilha** na tela da planilha, ou `apagar planilha Nome`.
- `desfazer` recupera a última exclusão. `ver dados de exemplo` traz os exemplos de volta sem apagar suas planilhas.

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
| `ver dados de exemplo` | Adiciona os exemplos de volta |

Os dados iniciais (Vendas 2026 e Estoque) são fictícios, só para demonstração.

## Próximos passos possíveis

- Conectar a um modelo de linguagem para entender pedidos livres, além dos comandos.
- Salvar os dados em um servidor para acesso em vários dispositivos.
