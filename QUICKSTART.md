# K18 Hair Analysis - Quick Start

## 🚀 Starting the Application

From the `Edhec_FULL` directory, simply run:
```bash
./start.sh
```

Or from the `K18` subdirectory:
```bash
cd K18
./start.sh
```

Both work the same way! The script will:
- ✅ Automatically navigate to the K18 directory
- ✅ Check and install dependencies
- ✅ Start backend (Python/FastAPI) on port 8000
- ✅ Start frontend (React/Vite) on port 8080
- ✅ Run services in background (survives terminal close)

## 🛑 Stopping the Application

From either directory:
```bash
./stop.sh
```

This safely stops both backend and frontend services.

## 📍 Access URLs

Once started, access the application at:
- **Main App:** http://localhost:8080
- **API Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🔄 After Reboot

Just run the start script again:
```bash
cd /home/alex/Documents/Ecole42/Edhec_FULL
./start.sh
```

Everything else is handled automatically!

## 📝 View Logs

```bash
# Backend logs
tail -f /tmp/k18-backend.log

# Frontend logs
tail -f /tmp/k18-frontend.log
```

## 💡 Features

The application includes:
- 🧬 AI-powered hair analysis (Google Gemini)
- 📍 Location-based weather recommendations
- 📸 Photo analysis (camera or upload)
- 🛍️ Personalized K18 product recommendations
- 🔒 GDPR compliant

## 🐛 Troubleshooting

If services fail to start:
1. Check logs: `tail -f /tmp/k18-*.log`
2. Stop and restart: `./stop.sh && ./start.sh`
3. Ensure ports 8000 and 8080 are free

The scripts automatically handle:
- Port conflicts (kills existing processes)
- Missing dependencies (installs them)
- Environment setup (Python venv, npm modules)
