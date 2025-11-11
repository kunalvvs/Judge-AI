@echo off
REM AI Judge - Quick Setup Script for Windows
REM This script helps you set up the AI Judge project quickly

echo ========================================
echo    AI Judge - Quick Setup (Windows)
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "delims=" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% detected
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

for /f "delims=" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% detected
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
echo This may take a few minutes...
echo.

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install root dependencies
    exit /b 1
)

cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    exit /b 1
)
cd ..

cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    exit /b 1
)
cd ..

echo.
echo [OK] All dependencies installed successfully!
echo.

REM Setup environment files
if not exist .env (
    echo [INFO] Creating .env file from template...
    copy .env.example .env >nul
    echo [WARNING] Please edit .env and add your API keys!
) else (
    echo [OK] .env file already exists
)

if not exist frontend\.env (
    echo [INFO] Creating frontend\.env file...
    copy frontend\.env.example frontend\.env >nul
) else (
    echo [OK] frontend\.env file already exists
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env and add your API keys:
echo    - GEMINI_API_KEY (required)
echo    - SUPABASE_URL and SUPABASE_ANON_KEY (or Pinecone credentials)
echo.
echo 2. Run the development servers:
echo    npm run dev
echo.
echo 3. Open your browser:
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:5000
echo.
echo For more information, see README.md
echo.
pause
