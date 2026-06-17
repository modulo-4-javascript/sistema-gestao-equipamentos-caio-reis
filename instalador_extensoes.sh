#!/usr/bin/env bash
set -euo pipefail

echo "====================================="
echo "Instalador de extensoes do VS Code"
echo "Linux / macOS / Codespaces"
echo "====================================="
echo

EXTENSIONS=(
  "infeng.vscode-react-typescript"
  "dbaeumer.vscode-eslint"
  "styled-components.vscode-styled-components"
  "pkief.material-icon-theme"

  "christian-kohler.path-intellisense"
  "christian-kohler.npm-intellisense"
  "yzhang.markdown-all-in-one"
  "bierner.markdown-preview-github-styles"
  "esbenp.prettier-vscode"
  "usernamehw.errorlens"
  "formulahendry.auto-rename-tag"
  "dsznajder.es7-react-js-snippets"
  "humao.rest-client"
  "naumovs.color-highlight"
  "eamodio.gitlens"
  "GitHub.vscode-pull-request-github"
)

if ! command -v code >/dev/null 2>&1; then
  echo 'O comando "code" nao foi encontrado.'
  echo
  echo "No VS Code local:"
  echo "1. Pressione Ctrl+Shift+P ou Cmd+Shift+P"
  echo "2. Procure por: Shell Command: Install 'code' command in PATH"
  echo "3. Execute este script novamente"
  echo
  echo "No Codespaces, as extensoes principais tambem sao instaladas pelo .devcontainer/devcontainer.json."
  exit 1
fi

echo "Verificando Node.js e npm..."

if command -v node >/dev/null 2>&1; then
  echo "Node: $(node -v)"
else
  echo "Node.js nao encontrado neste ambiente."
fi

if command -v npm >/dev/null 2>&1; then
  echo "npm:  $(npm -v)"
else
  echo "npm nao encontrado neste ambiente."
fi

echo
echo "Instalando extensoes recomendadas..."

for extension in "${EXTENSIONS[@]}"; do
  echo "Instalando: $extension"
  code --install-extension "$extension" --force
done

echo
echo "====================================="
echo "Extensoes instaladas com sucesso."
echo "====================================="
