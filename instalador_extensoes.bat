@echo off
setlocal enabledelayedexpansion

echo =====================================
echo Instalador do ambiente local Windows
echo =====================================

where code >nul 2>nul
if errorlevel 1 (
  echo O comando "code" nao foi encontrado.
  echo Abra o VS Code, pressione Ctrl+Shift+P e procure por:
  echo Shell Command: Install 'code' command in PATH
  echo Depois execute este arquivo novamente.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado.
  where winget >nul 2>nul
  if errorlevel 1 (
    echo winget nao encontrado. Instale o Node.js manualmente.
  ) else (
    echo Instalando Node.js LTS via winget...
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  )
) else (
  echo Node encontrado:
  node -v
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm nao encontrado. Reabra o terminal depois de instalar o Node.js.
) else (
  echo npm encontrado:
  npm -v
)

echo.
echo Instalando extensoes recomendadas do VS Code...

for %%E in (
  infeng.vscode-react-typescript
  dbaeumer.vscode-eslint
  styled-components.vscode-styled-components
  pkief.material-icon-theme
  christian-kohler.path-intellisense
  christian-kohler.npm-intellisense
  yzhang.markdown-all-in-one
  bierner.markdown-preview-github-styles
  esbenp.prettier-vscode
  usernamehw.errorlens
  formulahendry.auto-rename-tag
  dsznajder.es7-react-js-snippets
  humao.rest-client
  naumovs.color-highlight
  eamodio.gitlens
  GitHub.vscode-pull-request-github
) do (
  echo Instalando: %%E
  code --install-extension %%E --force
)

echo.
echo Ambiente local configurado.
pause
