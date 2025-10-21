#!/bin/bash

# K18 Hair Analysis System - Startup Script
# Starts both frontend and backend services

echo "🚀 Starting K18 Hair Analysis System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "K18" ]; then
    echo "❌ Error: K18 directory not found. Please run this script from the Edhec_FULL directory."
    exit 1
fi

cd K18

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Check if backend is already running
if check_port 8000; then
    echo -e "${YELLOW}⚠️  Backend already running on port 8000${NC}"
else
    echo -e "${BLUE}📦 Starting Backend (FastAPI)...${NC}"
    cd backend
    # Start backend in background
    python3 main.py > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    cd ..
fi

# Check if frontend is already running
if check_port 8080; then
    echo -e "${YELLOW}⚠️  Frontend already running on port 8080${NC}"
elif check_port 8081; then
    echo -e "${YELLOW}⚠️  Frontend already running on port 8081${NC}"
else
    echo -e "${BLUE}🎨 Starting Frontend (Vite)...${NC}"
    # Start frontend in background
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
fi

echo ""
echo -e "${GREEN}✨ K18 Hair Analysis System is starting up!${NC}"
echo ""
echo "📍 Services:"
echo "   - Backend API: http://localhost:8000"
echo "   - Frontend UI: http://localhost:8080 (or 8081, 5173)"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "📋 Logs:"
echo "   - Backend: K18/backend.log"
echo "   - Frontend: K18/frontend.log"
echo ""
echo "⏹️  To stop services, run: pkill -f 'python3 main.py' && pkill -f 'vite'"
echo ""
echo "Press Ctrl+C to exit this script (services will continue running in background)"
echo ""

# Keep script running
wait
