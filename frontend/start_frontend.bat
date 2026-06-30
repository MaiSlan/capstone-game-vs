@echo off
:: Move into the frontend directory first
cd /d "%~dp0"

echo [Frontend] Launching Vite...
call npm run dev
pause