# ⚡ K18 - Quick Start Reference

## 🚀 Start the System (Choose One Method)

### Method 1: Automated (One Command)
```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18
./start.sh
```

### Method 2: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18/backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd /home/alex/Documents/Ecole42/Edhec_2025/K18
npm run dev
```

---

## 🌐 Access URLs

- **App**: http://localhost:5173
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs

---

## ⚠️ Fix: "Module fastapi not found"

Always activate venv first:
```bash
source venv/bin/activate
```

---

## 🛑 Stop Services

Press `Ctrl+C` in each terminal window.

---

## 📖 Full Guide

See `HOW_TO_USE.md` for complete instructions and troubleshooting.
