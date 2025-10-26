#!/bin/bash

# K18 Hair Analysis AI - Stop Script
# This script stops both the backend API and frontend development server

echo "🛑 Stopping K18 Hair Analysis AI System..."
echo ""

# Function to kill process by PID file
kill_by_pidfile() {
    local pidfile=$1
    local name=$2
    
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping $name (PID: $pid)..."
            kill $pid 2>/dev/null
            sleep 2
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                kill -9 $pid 2>/dev/null
            fi
            rm "$pidfile"
            echo "✓ $name stopped"
        else
            echo "⚠️  $name is not running (stale PID file)"
            rm "$pidfile"
        fi
    else
        echo "⚠️  No PID file for $name"
    fi
}

# Function to kill processes on port
kill_by_port() {
    local port=$1
    local name=$2
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        echo "Stopping $name on port $port..."
        kill $pids 2>/dev/null
        sleep 2
        # Force kill if still running
        pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            kill -9 $pids 2>/dev/null
        fi
        echo "✓ $name stopped"
    else
        echo "⚠️  No process running on port $port"
    fi
}

# Try to stop using PID files first
kill_by_pidfile "/tmp/k18-backend.pid" "Backend"
kill_by_pidfile "/tmp/k18-frontend.pid" "Frontend"

# Fallback: stop using ports
echo ""
echo "Checking ports..."
kill_by_port 8000 "Backend"
kill_by_port 8080 "Frontend"

echo ""
echo "✅ All services stopped"
