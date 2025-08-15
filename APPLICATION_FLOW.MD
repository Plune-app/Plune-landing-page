# Este documento explica como funciona o fluxo na aplicação Plune.app.br

-- Basicamente esta aplicação se trata da versão web que não vai conter conexão ipc com servidor interno do electron
-- Sempre que uma nova versao for lançada, o web vai obviamente recarregar sempre para latest
 
## Dentro do aplicativo
-- A página home é a landing page que detalha sobre o aplicativo, a necessidade e o problema que resolve.
-- No header é possivel visualizar o botao de login que vai permitir o usuário ser redirecionado para (de acordo com a sua role na organização) para a tela de administração de forms, templates, approvals... se apenas Viewer, ele vai ser redirecionado para a página em subdomínio da aplicação exemplo nomeOrganizacao.plune.app.br 

### Validação que não pode deixar brechas
-- É de extrema importância que quando o usuário selecionar outra organização a qual ele faça parte que exista uma validação com base em sua role e o redirecionamento para a página em subdomínio em caso de "Viewer" e impossibilitar dele acessar a seção de administração

## Dentro da seção->organização do usuário VIEWER
-- somente é possivel visualizar registros feitos dentro de forms criados anteriormente dentro da aplicação, onde as tabelas vão possuir o header as colunas com base nos campos do formulário --> futuramente reconhecer campos multi values como checkbox para criar um dropdown nas rows destas tabelas

