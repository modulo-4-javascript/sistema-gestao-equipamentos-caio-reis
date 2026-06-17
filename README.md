# Sistema de Gestão de Equipamentos (Template)

Template base do projeto do **Módulo 4 - JavaScript**.

## Objetivo

Cada aluno vai evoluir este projeto ao longo do módulo, usando **branches**, **commits**, **Pull Requests** e **Issues**.

## Nome do seu repositório

Padronize assim:

- `sistema-gestao-equipamentos-seu-nome`

Exemplos:

- `sistema-gestao-equipamentos-ana`
- `sistema-gestao-equipamentos-joao`

## Fluxo que vamos usar

1. Crie **seu** repositório a partir deste template.
2. Crie a branch da aula, por exemplo: `aula-01-configuracao`.
3. Faça commits pequenos e descritivos.
4. Abra um **Pull Request** da branch da aula para a `main`.
5. Espere a revisão/feedback e faça o merge.

## Ambiente de desenvolvimento

Este projeto pode ser usado de três formas:

1. Editando rápido pelo navegador com o atalho `.`
2. Rodando o projeto na nuvem com **GitHub Codespaces**
3. Rodando o projeto no próprio computador

---

## 1. Editar rápido pelo navegador com `.`

Abra o repositório no GitHub e pressione:

```text
.
```

Isso abre o editor web do GitHub.

Use esse modo para:

- editar arquivos;
- revisar código;
- fazer commits simples;
- consultar o projeto pelo navegador.

Atenção: o editor aberto pelo atalho `.` é ótimo para edição rápida, mas não é o ambiente ideal para rodar o projeto com Node.js e npm.

Para executar o projeto, use o **Codespaces** ou o **VS Code instalado no seu computador**.

---

## 2. Rodar o projeto com Codespaces

O Codespaces permite rodar o projeto direto na nuvem, sem instalar Node.js no computador.

Para abrir:

1. Entre no seu repositório.
2. Clique em **Code**.
3. Abra a aba **Codespaces**.
4. Clique em **Create codespace on main**.
5. Aguarde o ambiente carregar.

Quando o terminal abrir, confira se Node.js e npm estão disponíveis:

```bash
node -v
npm -v
```

Se o projeto já tiver um `package.json`, instale as dependências:

```bash
npm install
```

Para rodar o projeto, use o comando indicado pelo professor ou pelo `package.json`.

Exemplo comum:

```bash
npm run dev
```

Este template já possui configuração de Dev Container em:

```text
.devcontainer/devcontainer.json
```

Essa configuração prepara o Codespaces com:

- Node.js;
- npm;
- extensões recomendadas do VS Code;
- configurações padrão do editor;
- portas comuns para projetos front-end, como `3000` e `5173`.

Se o Codespace já estava aberto antes dessas configurações serem adicionadas, talvez seja necessário reconstruir o container.

Para isso, pressione:

```text
Ctrl + Shift + P
```

Depois procure por:

```text
Codespaces: Rebuild Container
```

---

## 3. Rodar no próprio computador

Se preferir desenvolver no seu computador, instale antes:

- VS Code;
- Git;
- Node.js LTS;
- npm.

Depois, clone o seu repositório:

```bash
git clone URL_DO_SEU_REPOSITORIO
cd sistema-gestao-equipamentos-seu-nome
```

Instale as dependências do projeto:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

---

## 4. Instaladores de extensões

Este template possui dois instaladores de extensões:

```text
instalador_extensoes.bat
instalador_extensoes.sh
```

Use o `.bat` se estiver no Windows:

```bat
instalador_extensoes.bat
```

Use o `.sh` se estiver no Linux, macOS ou Codespaces:

```bash
./instalador_extensoes.sh
```

Se o arquivo `.sh` não executar, rode antes:

```bash
chmod +x instalador_extensoes.sh
./instalador_extensoes.sh
```

No Codespaces, as principais extensões também são instaladas automaticamente pelo arquivo:

```text
.devcontainer/devcontainer.json
```

---

## Extensões recomendadas

O projeto recomenda extensões para ajudar durante o curso, incluindo:

- **Path Intellisense**: ajuda a completar caminhos como `../components/...`;
- **npm Intellisense**: ajuda em imports de pacotes instalados;
- **ESLint**: ajuda a encontrar problemas no código;
- **Prettier**: formata o código automaticamente;
- **Material Icon Theme**: melhora os ícones dos arquivos e pastas;
- **Markdown All in One**: facilita escrever arquivos Markdown;
- **Markdown Preview GitHub Styles**: melhora a visualização de Markdown;
- **Error Lens**: mostra erros diretamente na linha do código;
- **Auto Rename Tag**: renomeia tags HTML/JSX em par;
- **ES7 React Snippets**: adiciona atalhos úteis para React;
- **REST Client**: permite testar requisições HTTP pelo VS Code;
- **Color Highlight**: destaca cores no código;
- **GitLens**: melhora a visualização do histórico Git;
- **GitHub Pull Requests**: ajuda a trabalhar com Pull Requests pelo VS Code.

Para visualizar Markdown no VS Code ou Codespaces, abra um arquivo `.md` e pressione:

```text
Ctrl + Shift + V
```

No macOS:

```text
Cmd + Shift + V
```

Para abrir a prévia ao lado do editor, use:

```text
Ctrl + K, depois V
```

No macOS:

```text
Cmd + K, depois V
```

---

## Branches padrão do módulo

- `aula-01-configuracao`
- `aula-02-componentes-typescript`
- `aula-03-layout-interface`
- `aula-04-rotas-e-parametros`
- `aula-05-figma-e-interface`
- `aula-06-consumo-api`
- `aula-07-crud-e-hooks`
- `aula-08-finalizacao`

> Se alguma branch não existir ainda no seu repo, você cria na hora. Sem drama.

## Issues

Use issues para:

- dúvidas;
- entregas por aula;
- problemas/bugs.

O repositório terá templates de issue para cada aula.

## Regras de commit

- Inglês ou português OK, mas seja **consistente**.
- Comece com verbo: `Add`, `Update`, `Refactor`, `Corrige`, `Adiciona`, etc.
- Faça **um commit** por etapa relevante.

## Entrega e avaliação

A entrega é acompanhada por:

- conteúdo dos Pull Requests;
- qualidade dos commits;
- resolução das issues;
- evolução do projeto ao longo do módulo.

## Dica

Se você travar, abra uma issue `duvida` e descreva:

- o que você tentou;
- qual erro apareceu;
- prints ou links úteis;
- em qual branch você está trabalhando.
