#!/bin/bash

# K18 Hair Analysis AI - Startup Script
# Uses Google Gemini (FREE) or Ollama (local) for hair analysis
# This script starts both the backend API and frontend development server

echo "🚀 Starting K18 Hair Analysis AI System..."
echo ""

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Navigate to K18 directory
if [ -d "K18" ]; then
    cd K18
else
    echo "❌ Error: K18 directory not found"
    exit 1
fi

# Check if we're in the K18 directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: K18 directory is missing package.json"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    lsof -ti:$1 &> /dev/null
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "🛑 Stopping existing service on port $port..."
        kill $pids 2>/dev/null
        sleep 2
    fi
}

# Check and stop existing services
if check_port 8000; then
    echo "⚠️  Port 8000 is already in use"
    kill_port 8000
fi

if check_port 8080; then
    echo "⚠️  Port 8080 is already in use"
    kill_port 8080
fi

# Install Python dependencies if needed
echo "📦 Checking backend dependencies..."
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
else
    echo "✓ Virtual environment exists"
fi

# Install Node dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✓ Node modules installed"
fi

echo ""
echo "✨ Starting services..."
echo ""
echo "💡 AI Provider: Google Gemini (FREE) → Ollama → Fallback"
echo "   Get Gemini key: https://aistudio.google.com/apikey"
echo ""

# Start backend in background
echo "🐍 Starting Backend API (Port 8000)..."
cd backend
nohup "$(pwd)/venv/bin/python" main.py > /tmp/k18-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/k18-backend.pid
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
for i in {1..15}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✓ Backend started successfully (PID: $BACKEND_PID)"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Backend failed to start. Check logs: tail -f /tmp/k18-backend.log"
        exit 1
    fi
    sleep 1
done

# Start frontend in background
echo "⚛️  Starting Frontend (Port 8080)..."
nohup npm run dev > /tmp/k18-frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/k18-frontend.pid

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
for i in {1..15}; do
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo "✓ Frontend started successfully (PID: $FRONTEND_PID)"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Frontend failed to start. Check logs: tail -f /tmp/k18-frontend.log"
        exit 1
    fi
    sleep 1
done

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Backend API:  http://localhost:8000"
echo "📍 API Docs:     http://localhost:8000/docs"
echo "📍 Frontend:     http://localhost:8080"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/k18-backend.log"
echo "   Frontend: tail -f /tmp/k18-frontend.log"
echo ""
echo "💡 To stop services, run: ./stop.sh"
echo ""
