# Assistente de Gestão (protótipo)

Assistente virtual para gestão com planilhas editáveis, painéis (dashboards) interativos e lista de tarefas, controlado por comandos em português. Interface em tema escuro.

## Como abrir

Abra o arquivo `index.html` no navegador. Não precisa instalar nada; os gráficos (Chart.js) e a exportação para Excel (SheetJS) são carregados de CDN. Os dados ficam salvos no próprio navegador (`localStorage`).

## O que já funciona

- **Assistente por comandos**: campo de comando com autocompletar (`Tab`), histórico (`↑`) e atalhos `/` ou `Ctrl+K`.
- **Planilhas**: células editáveis, renomear colunas, adicionar linhas e colunas, fórmulas (`=C2-D2`, `=SOMA(C2:C10)`, `=MEDIA()`, `=MAX()`, `=MIN()`, `=CONT()`), totais automáticos e exportação para `.csv` e `.xlsx`.
- **Painel**: indicadores com variação e minigráficos, filtros por categoria e gráficos de barras, linhas ou rosca que se atualizam quando a planilha muda.
- **Tarefas**: prazos, atrasadas em destaque e contagem de pendentes.

## Exemplos de comandos

| Comando | O que faz |
|---|---|
| `ajuda` | Lista os comandos |
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
| `restaurar exemplo` | Volta aos dados de exemplo |

Os dados iniciais (Vendas 2026 e Estoque) são fictícios, só para demonstração.

## Próximos passos possíveis

- Conectar a um modelo de linguagem para entender pedidos livres, além dos comandos.
- Importar planilhas `.xlsx`/`.csv` existentes.
- Salvar os dados em um servidor para acesso em vários dispositivos.
