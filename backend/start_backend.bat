@echo off
cd /d "%~dp0"
echo [Backend] Booting via run_server.py...
call venv\Scripts\activate
python run_server.py
pause