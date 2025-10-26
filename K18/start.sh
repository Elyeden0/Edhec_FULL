#!/bin/bash

# K18 Hair Analysis AI - Startup Script
# Uses Google Gemini (FREE) or Ollama (local) for hair analysis
# This script starts both the backend API and frontend development server

echo "🚀 Starting K18 Hair Analysis AI System..."
echo ""

# Check if we're in the K18 directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the K18 directory"
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

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
echo "🐍 Starting Backend API (Port 8000)..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "⚛️  Starting Frontend (Port 5173)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Backend API:  http://localhost:8000"
echo "📍 API Docs:     http://localhost:8000/docs"
echo "📍 Frontend:     http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for processes
wait
