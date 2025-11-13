@echo off
REM AI Judge - Quick Deployment Setup Script for Windows
REM This script helps prepare your project for deployment

echo ==========================================
echo AI Judge - Deployment Setup
echo ==========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo [INFO] Initializing Git repository...
    git init
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo [WARN] .env file not found!
    echo [INFO] Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo [ACTION REQUIRED] Please edit .env file with your actual API keys
    echo.
    pause
)

REM Check if remote is set
git remote -v | find "origin" >nul 2>&1
if errorlevel 1 (
    echo [INFO] No Git remote found
    echo.
    set /p REPO_URL="Enter your GitHub repository URL: "
    git remote add origin %REPO_URL%
    echo [INFO] Remote 'origin' added
    echo.
)

REM Stage all files
echo [INFO] Staging files for commit...
git add .
echo.

REM Check if there are changes to commit
git diff-index --quiet HEAD -- 2>nul
if errorlevel 1 (
    echo [INFO] Committing changes...
    git commit -m "Prepare for deployment on Vercel and Render"
    echo.
) else (
    echo [INFO] No changes to commit
    echo.
)

REM Push to GitHub
echo [INFO] Pushing to GitHub...
set /p PUSH="Push to GitHub now? (y/n): "
if /i "%PUSH%"=="y" (
    git push -u origin main
    echo.
    echo [SUCCESS] Pushed to GitHub!
) else (
    echo [INFO] Skipped pushing to GitHub
)
echo.

echo ==========================================
echo Next Steps:
echo ==========================================
echo.
echo 1. Backend Deployment (Render):
echo    - Go to https://dashboard.render.com
echo    - Create new Web Service
echo    - Connect your GitHub repository
echo    - Follow DEPLOYMENT_GUIDE.md
echo.
echo 2. Frontend Deployment (Vercel):
echo    - Go to https://vercel.com/dashboard
echo    - Import your GitHub repository
echo    - Set root directory to 'frontend'
echo    - Follow DEPLOYMENT_GUIDE.md
echo.
echo 3. Configuration:
echo    - Set environment variables on both platforms
echo    - Update CORS_ORIGIN on Render
echo    - Update VITE_API_URL on Vercel
echo.
echo ==========================================
echo Documentation:
echo ==========================================
echo.
echo Complete Guide: DEPLOYMENT_GUIDE.md
echo Quick Checklist: DEPLOYMENT_CHECKLIST.md
echo Summary: DEPLOYMENT_SUMMARY.md
echo.
echo ==========================================

pause
