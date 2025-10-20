# 💇 K18 AI Hair Analysis System

An intelligent hair analysis application powered by AI that provides personalized K18 product recommendations based on your hair type and local weather conditions.

![K18 Banner](https://img.shields.io/badge/K18-Hair_Analysis-blue)
![Python](https://img.shields.io/badge/Python-3.10+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal)

## ✨ Features

- 📸 **AI-Powered Hair Analysis** - Upload a photo and get instant hair type detection (dry, normal, oily)
- 🌤️ **Weather-Aware Recommendations** - Adapts product suggestions based on your local weather
- 🎯 **Personalized K18 Products** - Get 3 tailored product recommendations with detailed reasoning
- 🚀 **Real-time Processing** - Fast analysis using Vision Transformer (ViT) models
- 📱 **Mobile-Friendly** - Works on desktop, tablet, and mobile devices
- 🔒 **Privacy-First** - Images processed locally, not stored

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.10+ (Python 3.12 recommended)
- At least 2GB free disk space

### Installation

```bash
# Clone the repository
git clone https://github.com/Elyeden0/k18-style-guide.git
cd k18-style-guide/K18

# Run the automated setup script
./start.sh
```

That's it! The script will:
1. Create Python virtual environment
2. Install all dependencies
3. Start backend API (port 8000)
4. Start frontend (port 5173)

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📖 Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - Detailed installation guide
- **[HOW_TO_USE.md](HOW_TO_USE.md)** - Complete usage instructions
- **[QUICK_START.md](QUICK_START.md)** - One-page quick reference
- **[AI_SYSTEM_README.md](AI_SYSTEM_README.md)** - Technical architecture
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library

### Backend
- **FastAPI** - Python web framework
- **PyTorch** - Deep learning
- **Transformers** - HuggingFace models
- **Pillow & OpenCV** - Image processing
- **Uvicorn** - ASGI server

### AI/ML
- **Vision Transformer (ViT)** - Hair type classification
- **google/vit-base-patch16-224** - Pre-trained model

---

## 📦 What's Excluded from Git

To keep the repository lightweight (~50MB), these are excluded:

- `node_modules/` - Reinstalled via `npm install`
- `venv/` - Recreated via `python -m venv venv`
- ML model cache - Auto-downloaded on first run
- Build artifacts and logs

**After installation, total size is ~2.5GB** (backend ~1.5GB, frontend ~500MB, models ~500MB)

---

## 🔧 Manual Setup

If you prefer manual setup:

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
npm install
npm run dev
```

---

## 🧪 Testing

```bash
cd backend
source venv/bin/activate
python test_system.py
```

---

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'fastapi'"

Activate the virtual environment first:
```bash
cd backend
source venv/bin/activate
python main.py
```

### "ENOSPC: System limit for number of file watchers reached"

Increase file watcher limit:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Port Already in Use

Kill the process:
```bash
lsof -ti:8000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

See [HOW_TO_USE.md](HOW_TO_USE.md) for more troubleshooting.

---

## 📂 Project Structure

```
K18/
├── backend/              # Python FastAPI backend
│   ├── main.py          # API server
│   ├── hair_analyzer.py # AI hair analysis
│   ├── weather_service.py
│   ├── product_recommender.py
│   └── requirements.txt
├── src/                 # React frontend
│   ├── components/      # UI components
│   ├── pages/           # App pages
│   └── lib/             # Utilities
├── public/              # Static assets
├── start.sh             # Automated startup
├── package.json         # Frontend dependencies
└── README.md
```

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guides:
- Docker deployment
- AWS/GCP/Azure
- Vercel (frontend)
- Railway/Render (backend)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of the K18 hair care product line.

---

## 🆘 Support

- 📖 Check the [documentation](INDEX.md)
- 🐛 [Open an issue](https://github.com/Elyeden0/k18-style-guide/issues)
- 💬 Contact the development team

---

## 🙏 Acknowledgments

- HuggingFace for the Vision Transformer models
- OpenWeather for weather data
- K18 for product data and inspiration

---

**Built with ❤️ for K18**
