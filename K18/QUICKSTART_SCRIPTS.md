# K18 Hair Analysis - Quick Start Scripts

## 🚀 Starting the Application

Simply run:
```bash
./start.sh
```

This will:
- ✅ Check and install dependencies automatically
- ✅ Start the backend API (Python/FastAPI) on port 8000
- ✅ Start the frontend (React/Vite) on port 8080
- ✅ Run both services in the background (survives terminal close)
- ✅ Save process IDs for easy management

The services will continue running even after the script exits or you close the terminal.

## 🛑 Stopping the Application

To stop both services:
```bash
./stop.sh
```

This will safely shutdown both the backend and frontend.

## 📍 Access URLs

- **Frontend (Main App):** http://localhost:8080
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📝 Viewing Logs

If you need to check what's happening:

```bash
# Backend logs
tail -f /tmp/k18-backend.log

# Frontend logs
tail -f /tmp/k18-frontend.log
```

## 🔄 After Reboot

After rebooting your computer, just run:
```bash
cd /home/alex/Documents/Ecole42/Edhec_FULL/K18
./start.sh
```

That's it! The script handles everything automatically.

## 🐛 Troubleshooting

If services don't start:
1. Check the logs (see above)
2. Stop and restart:
   ```bash
   ./stop.sh
   ./start.sh
   ```

If ports are already in use:
- The `start.sh` script automatically detects and kills existing processes on ports 8000 and 8080

## 💡 Tips

- The services run in the background, so you can close the terminal
- Use `./stop.sh` before system shutdown for a clean exit
- Check logs if you encounter any issues
