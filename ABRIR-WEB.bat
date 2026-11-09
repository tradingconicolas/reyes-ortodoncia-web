@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias la primera vez...
  call npm install
)
start "" http://localhost:4321
call npm run dev -- --port 4321
