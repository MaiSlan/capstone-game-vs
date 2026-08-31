@echo off
cd /d "%~dp0"

echo [Frontend] Launching Vite...
call npm run dev
pause