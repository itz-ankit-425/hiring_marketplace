@echo off
REM This script starts both backend and frontend servers

echo Starting Hiring Marketplace...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if PostgreSQL is running (optional - just informational)
echo.
echo Make sure PostgreSQL is running with database "hiring_marketplace"
echo.

REM Start backend
echo Starting backend server on http://localhost:5000...
echo.
start cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo Starting frontend server on http://localhost:5173...
echo.
start cmd /k "cd FRONTEND && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop the servers
echo.
pause
