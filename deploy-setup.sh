#!/bin/bash

# AI Judge - Quick Deployment Setup Script for Linux/Mac
# This script helps prepare your project for deployment

echo "=========================================="
echo "AI Judge - Deployment Setup"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}[INFO]${NC} Initializing Git repository..."
    git init
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}[WARN]${NC} .env file not found!"
    echo -e "${YELLOW}[INFO]${NC} Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo -e "${YELLOW}[ACTION REQUIRED]${NC} Please edit .env file with your actual API keys"
    echo ""
    read -p "Press enter to continue after updating .env..."
fi

# Check if remote is set
if ! git remote -v | grep -q "origin"; then
    echo -e "${YELLOW}[INFO]${NC} No Git remote found"
    echo ""
    read -p "Enter your GitHub repository URL: " REPO_URL
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}[INFO]${NC} Remote 'origin' added"
    echo ""
fi

# Stage all files
echo -e "${YELLOW}[INFO]${NC} Staging files for commit..."
git add .
echo ""

# Check if there are changes to commit
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}[INFO]${NC} Committing changes..."
    git commit -m "Prepare for deployment on Vercel and Render"
    echo ""
else
    echo -e "${GREEN}[INFO]${NC} No changes to commit"
    echo ""
fi

# Push to GitHub
echo -e "${YELLOW}[INFO]${NC} Pushing to GitHub..."
read -p "Push to GitHub now? (y/n): " PUSH
if [ "$PUSH" = "y" ] || [ "$PUSH" = "Y" ]; then
    git push -u origin main
    echo ""
    echo -e "${GREEN}[SUCCESS]${NC} Pushed to GitHub!"
else
    echo -e "${YELLOW}[INFO]${NC} Skipped pushing to GitHub"
fi
echo ""

echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Backend Deployment (Render):"
echo "   - Go to https://dashboard.render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Follow DEPLOYMENT_GUIDE.md"
echo ""
echo "2. Frontend Deployment (Vercel):"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'frontend'"
echo "   - Follow DEPLOYMENT_GUIDE.md"
echo ""
echo "3. Configuration:"
echo "   - Set environment variables on both platforms"
echo "   - Update CORS_ORIGIN on Render"
echo "   - Update VITE_API_URL on Vercel"
echo ""
echo "=========================================="
echo "Documentation:"
echo "=========================================="
echo ""
echo "Complete Guide: DEPLOYMENT_GUIDE.md"
echo "Quick Checklist: DEPLOYMENT_CHECKLIST.md"
echo "Summary: DEPLOYMENT_SUMMARY.md"
echo ""
echo "=========================================="
echo ""
echo -e "${GREEN}Setup complete!${NC} Follow the deployment guides to continue."
echo ""
