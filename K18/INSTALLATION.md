# 📦 K18 AI Hair Analysis - Installation Guide

This guide will help you set up the K18 AI Hair Analysis system from a fresh clone.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18+ and npm
- **Python** 3.10+ (Python 3.12 recommended)
- **Git**
- At least **2GB free disk space** (for dependencies)
- Internet connection (to download packages and ML models)

---

## 🚀 Quick Installation (Automated)

### Option 1: Using the start script (Easiest)

```bash
git clone https://github.com/Elyeden0/k18-style-guide.git
cd k18-style-guide/K18
./start.sh
```

The script will automatically:
- Create Python virtual environment
- Install all backend dependencies
- Install all frontend dependencies
- Start both services

---

## 🔧 Manual Installation (Step by Step)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Elyeden0/k18-style-guide.git
cd k18-style-guide/K18
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Return to root directory
cd ..
```

**Note**: The first time you run the backend, it will automatically download the ViT (Vision Transformer) model from HuggingFace (~500MB). This is normal and only happens once.

### Step 3: Frontend Setup

```bash
# Install Node.js dependencies
npm install

# Or if you prefer yarn:
# yarn install

# Or if you prefer pnpm:
# pnpm install
```

### Step 4: Environment Variables (Optional)

If you want to use a custom weather API key:

```bash
# Create .env file in backend directory
cd backend
cp .env.example .env

# Edit .env and add your OpenWeatherMap API key
# OPENWEATHER_API_KEY=your_api_key_here
```

---

## ▶️ Running the Application

### Method 1: Using the start script

```bash
./start.sh
```

### Method 2: Manual start (two terminals)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🌐 Access the Application

Once both services are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 📦 What Gets Installed

### Backend Dependencies (~2GB)

- **FastAPI** - Web framework
- **PyTorch** - Deep learning framework (~1GB)
- **Transformers** - HuggingFace models library
- **Pillow** - Image processing
- **OpenCV** - Computer vision
- **Uvicorn** - ASGI server

### Frontend Dependencies (~500MB)

- **React** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **TypeScript** - Type safety

### ML Models (Downloaded on first run)

- **google/vit-base-patch16-224** - Vision Transformer model (~500MB)
  - Automatically downloaded from HuggingFace Hub
  - Cached in `~/.cache/huggingface/`

---

## 🐛 Troubleshooting

### Issue: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: Make sure you activated the virtual environment:
```bash
cd backend
source venv/bin/activate
python main.py
```

### Issue: `ENOSPC: System limit for number of file watchers reached`

**Solution**: Increase the file watcher limit:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Issue: Port already in use

**Solution**: Kill the process using the port:
```bash
# For backend (port 8000)
lsof -ti:8000 | xargs kill -9

# For frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Issue: Python version mismatch

**Solution**: Make sure you're using Python 3.10+:
```bash
python3 --version
# If needed, install Python 3.12
```

### Issue: Model download fails

**Solution**: The model will auto-download on first run. If it fails:
1. Check your internet connection
2. Try running the backend again (it will resume download)
3. Manually download from: https://huggingface.co/google/vit-base-patch16-224

---

## 🧪 Verify Installation

Test the backend:

```bash
cd backend
source venv/bin/activate
python test_system.py
```

Test the API directly:

```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

---

## 🔄 Updating

To update the project:

```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt --upgrade
cd ..

# Update frontend dependencies
npm install

# Restart the application
./start.sh
```

---

## 📂 Repository Structure

```
K18/
├── backend/           # Python backend
│   ├── venv/         # Virtual environment (not in git)
│   ├── requirements.txt
│   ├── main.py
│   └── ...
├── src/              # React frontend
├── public/           # Static assets
├── node_modules/     # Node dependencies (not in git)
├── package.json      # Frontend dependencies
├── start.sh          # Automated startup script
└── README.md         # Project documentation
```

---

## 💾 Size Information

### Repository Size (what you clone)
- **~50MB** - Source code, configs, documentation

### After Installation
- **~2.5GB total**
  - Backend dependencies: ~1.5GB
  - Frontend dependencies: ~500MB
  - ML models: ~500MB

### Excluded from Git (.gitignore)
- `node_modules/` - Frontend dependencies
- `venv/` - Python virtual environment
- ML model cache - Downloaded on demand
- Build artifacts
- Log files

---

## 🆘 Need Help?

1. Check `HOW_TO_USE.md` for usage instructions
2. Check `QUICKSTART.md` for quick reference
3. Check `AI_SYSTEM_README.md` for technical details
4. Open an issue on GitHub

---

## ✅ Installation Checklist

- [ ] Node.js v18+ installed
- [ ] Python 3.10+ installed
- [ ] Repository cloned
- [ ] Backend venv created
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Both services start without errors
- [ ] Can access frontend at http://localhost:5173
- [ ] Can access backend at http://localhost:8000

**Once all boxes are checked, you're ready to use K18! 🎉**
