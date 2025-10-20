# 🚀 How to Use the K18 AI Hair Analysis System

## Quick Start Guide

### Prerequisites Fixed ✅
- ✅ Python dependencies installed in venv
- ✅ File watcher limit increased (fix applied)
- ✅ FastAPI and all packages ready

---

## 🎯 Option 1: Automated Start (Recommended)

Open a terminal and run:

```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18
./start.sh
```

This will start both backend and frontend together.

---

## 🎯 Option 2: Manual Start (Two Terminals)

### Terminal 1 - Backend API

```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18/backend
source venv/bin/activate
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2 - Frontend

```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18
npm run dev
```

You should see:
```
  VITE v5.4.19  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

---

## 🌐 Access the Application

Once both services are running:

1. **Frontend UI**: http://localhost:5173
2. **Backend API**: http://localhost:8000
3. **API Documentation**: http://localhost:8000/docs

---

## 📱 Using the App

1. **Grant location permission** when prompted
2. Click **"Chat with K18"** button
3. **Upload a hair photo** or take one with your camera
4. Get instant AI analysis:
   - Hair type detection (dry/normal/oily)
   - Current weather conditions
   - 3 personalized K18 product recommendations

---

## ❌ Common Issues & Solutions

### Issue: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: You forgot to activate the venv!

```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18/backend
source venv/bin/activate
python main.py
```

**OR** use the venv Python directly:

```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18/backend
./venv/bin/python main.py
```

---

### Issue: `ENOSPC: System limit for number of file watchers reached`

**Solution**: Already fixed! The file watcher limit has been increased.

If you still see this error, restart your terminal or run:
```bash
sudo sysctl -p
```

---

### Issue: Port already in use

**Solution**: Kill the process using the port:

For Backend (Port 8000):
```bash
lsof -ti:8000 | xargs kill -9
```

For Frontend (Port 5173):
```bash
lsof -ti:5173 | xargs kill -9
```

---

## 🧪 Testing the System

Run the test suite:

```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18/backend
source venv/bin/activate
python test_system.py
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (React + Vite)                │
│  Port: 5173                             │
│  - Location detection                   │
│  - Photo upload/capture                 │
│  - Results display                      │
└───────────────┬─────────────────────────┘
                │ HTTP REST API
                ▼
┌─────────────────────────────────────────┐
│  Backend (FastAPI)                      │
│  Port: 8000                             │
│  - Hair Analysis (ViT model)            │
│  - Weather Service (OpenWeather API)    │
│  - Product Recommender                  │
└─────────────────────────────────────────┘
```

---

## 🔧 Advanced

### Check Python Environment

```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18/backend
source venv/bin/activate
which python  # Should show: .../backend/venv/bin/python
pip list      # Show all installed packages
```

### View Backend Logs

The backend prints logs directly to the terminal. Look for:
- `INFO:     Started server process`
- Request logs when you use the app
- Error messages if something fails

### View Frontend Logs

The frontend also prints to terminal:
- Build information
- Hot reload messages
- Network errors if backend is down

---

## 📚 Documentation

- **Quick Setup**: `QUICKSTART.md`
- **Complete Guide**: `AI_SYSTEM_README.md`
- **Architecture**: `ARCHITECTURE.md`
- **Deployment**: `DEPLOYMENT.md`
- **Index**: `INDEX.md`

---

## 🆘 Still Having Issues?

1. Make sure you're in the correct directory
2. Check that both services are running (2 terminal windows)
3. Verify ports 8000 and 5173 are not in use
4. Check the terminal output for specific error messages
5. Try restarting both services

---

## ✨ Pro Tips

- **Use tmux or screen** to run both services in one terminal
- **Check API docs** at http://localhost:8000/docs to test endpoints
- **Monitor terminal** for real-time logs and errors
- **Grant location** permission for full functionality
