@echo off
echo ===================================================
echo   Igniting the Tartarus Engine Development Servers...
echo ===================================================

:: 1. Launch the Python/FastAPI Backend
:: This opens a new window, goes to the backend folder, activates the venv, and runs Uvicorn with hot-reload.
:: Note: We set the port to 5000 to match your frontend's .env.local configuration.
start "Backend Window" cmd /c "backend\start_backend.bat"

:: 2. Launch the Vite/React Frontend
:: This opens a second window, goes to the frontend folder, and runs the dev server.
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo - Backend will be available at: http://localhost:5000
echo - Frontend will be available at your standard localhost port.
echo.
echo You can close this main window, the servers will keep running in their own windows.
pause