#!/usr/bin/env bash
set -euo pipefail

echo "====================================="
echo "Ambiente Node.js configurado"
echo "Node: $(node -v)"
echo "npm:  $(npm -v)"
echo "====================================="

if ! command -v git-lfs >/dev/null 2>&1; then
  echo "Instalando Git LFS..."
  sudo apt-get update && sudo apt-get install -y git-lfs || echo "Aviso: nao foi possivel instalar Git LFS automaticamente."
fi

if command -v git-lfs >/dev/null 2>&1; then
  git lfs install --local
fi

if [ -f package-lock.json ]; then
  echo "package-lock.json encontrado: executando npm ci..."
  npm ci
elif [ -f package.json ]; then
  echo "package.json encontrado: executando npm install..."
  npm install
else
  echo "Nenhum package.json encontrado; pulando instalacao de dependencias."
fi
