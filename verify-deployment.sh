#!/bin/bash

# AI Judge - Deployment Verification Script
# This script helps verify your deployment setup

echo "=========================================="
echo "AI Judge - Deployment Verification"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check URL
check_url() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    if curl -s --head --request GET "$url" | grep "200 OK" > /dev/null; then 
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Function to check JSON response
check_json_endpoint() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    
    response=$(curl -s "$url")
    if [ -n "$response" ]; then
        echo -e "${GREEN}✓ OK${NC}"
        echo "  Response: $response"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
}

# Get backend URL
echo -e "${YELLOW}Enter your Render backend URL:${NC}"
read -p "(e.g., https://your-app.onrender.com): " BACKEND_URL

# Get frontend URL
echo -e "${YELLOW}Enter your Vercel frontend URL:${NC}"
read -p "(e.g., https://your-app.vercel.app): " FRONTEND_URL

echo ""
echo "=========================================="
echo "Testing Backend (Render)"
echo "=========================================="

# Test backend health
check_json_endpoint "$BACKEND_URL/health" "Backend Health Check"

# Test backend root
check_json_endpoint "$BACKEND_URL/" "Backend Root Endpoint"

echo ""
echo "=========================================="
echo "Testing Frontend (Vercel)"
echo "=========================================="

# Test frontend
check_url "$FRONTEND_URL" "Frontend Homepage"

echo ""
echo "=========================================="
echo "Deployment Summary"
echo "=========================================="
echo ""
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "Next Steps:"
echo "1. Update CORS_ORIGIN on Render to: $FRONTEND_URL"
echo "2. Update VITE_API_URL on Vercel to: $BACKEND_URL"
echo "3. Test the application end-to-end"
echo ""
echo "=========================================="
echo "Done!"
echo "=========================================="
