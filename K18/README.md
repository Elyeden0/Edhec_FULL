# K18 AI Hair Analysis System

AI-powered hair analysis platform using **Google Gemini 2.0 Flash** (FREE, 1500 requests/day) for intelligent hair analysis and personalized K18 product recommendations.

🌐 **Live App**: http://localhost:8080

## ✨ Features

- **🤖 AI-Powered Analysis**: Google Gemini 2.0 Flash vision model analyzes hair moisture (dry/normal/oily) and texture (straight/wavy/curly/coily)
- **📸 Smart Photo Capture**: Camera or file upload with real-time preview
- **📍 Location-Aware**: Weather-based recommendations using current climate conditions
- **🛍️ Personalized Products**: Top 3 K18 product matches with compatibility scores
- **� GDPR Compliant**: Privacy-first design with local data storage
- **📱 Responsive Design**: Seamless experience on all devices
- **💯 100% FREE**: No API costs with Gemini's generous free tier

## 🚀 Quick Start

### One-Command Startup

```bash
cd /home/alex/Documents/Ecole42/Edhec_FULL/K18
./start.sh
```

That's it! Services will start in the background and keep running.

### Stop Services

```bash
./stop.sh
```

### After Reboot

Just run `./start.sh` again - it handles everything automatically.

## 🎯 User Flow

1. **Welcome** → Introduction & GDPR notice
2. **Step 1: Location** → Share location for weather context (optional)
3. **Step 2: Photo** → Capture or upload hair photo
4. **Results** → View AI analysis (hair type & confidence)
5. **Products** → Browse top 3 recommended products with match scores

## 📋 Prerequisites

- **Node.js 18+** (frontend)
- **Python 3.8+** (backend)
- **Google Gemini API Key** ([Get FREE key here](https://aistudio.google.com/apikey))

## ⚙️ Manual Setup (Optional)

If you prefer manual setup instead of using `start.sh`:

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add: GEMINI_API_KEY=your-key-here

python main.py
```

### 2. Frontend Setup

```bash
# In K18 root directory
npm install
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **GDPR Policy**: http://localhost:8080/rgpd-policy

## 📁 Project Structure

```
K18/
├── backend/
│   ├── main.py                    # FastAPI server
│   ├── hair_analyzer.py           # AI analysis engine (Gemini/Ollama/Fallback)
│   ├── weather_service.py         # Open-Meteo weather API
│   ├── product_recommender.py     # K18 product matching
│   ├── requirements.txt
│   └── venv/
├── src/
│   ├── pages/
│   │   ├── Welcome.tsx            # Landing page
│   │   ├── Step1Location.tsx     # Location capture
│   │   ├── Step2Photo.tsx        # Photo capture/upload
│   │   ├── Results.tsx           # Analysis results
│   │   ├── Products.tsx          # Product recommendations
│   │   └── RgpdPolicy.tsx        # Privacy policy
│   └── components/ui/            # shadcn/ui components
├── start.sh                      # Start services script
├── stop.sh                       # Stop services script
└── README.md
```

## 🧠 AI System

### Primary: Google Gemini 2.0 Flash (FREE)
- **Rate Limit**: 1500 requests/day
- **Cost**: $0
- **Speed**: ~2-3 seconds
- **Accuracy**: Excellent vision analysis
- **Setup**: Get API key from https://aistudio.google.com/apikey

### Fallback: Ollama (Local)
- **Model**: LLaVA vision model
- **Cost**: $0 (runs locally)
- **Speed**: Depends on hardware
- **Setup**: Install Ollama + pull llava model

### Last Resort: Simple Rules
- Basic texture analysis based on image statistics
- Used only if both Gemini and Ollama fail

## 🛠️ Technologies

### Backend
- **FastAPI** - Modern Python API framework
- **Google Gemini API** - Vision AI for hair analysis
- **Open-Meteo API** - Free weather data
- **Pillow** - Image processing

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation

## 📖 Documentation Files

- **[QUICKSTART.md](QUICKSTART.md)** - Fast start guide
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed setup
- **[GEMINI_SETUP.md](GEMINI_SETUP.md)** - Gemini API configuration
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment
- **[AI_COMPARISON.md](AI_COMPARISON.md)** - AI provider comparison
- **[HOW_TO_USE.md](HOW_TO_USE.md)** - User guide
- **[backend/README.md](backend/README.md)** - Backend details

## 📝 View Logs

```bash
# Backend logs
tail -f /tmp/k18-backend.log

# Frontend logs
tail -f /tmp/k18-frontend.log
```

## 🔧 Troubleshooting

**Services won't start?**
```bash
./stop.sh && ./start.sh
```

**Ports already in use?**
- The script automatically kills processes on ports 8000 and 8080

**API errors?**
- Check backend logs: `tail -f /tmp/k18-backend.log`
- Verify Gemini API key in `backend/.env`

## � Customization

### Add New Products
Edit `backend/product_recommender.py` to add more K18 products.

### Modify UI
Update pages in `src/pages/` directory.

### Change Ports
- Backend: Edit `backend/main.py` (default 8000)
- Frontend: Edit `vite.config.ts` (default 8080)

## 🔒 Privacy & GDPR

- All photos stored temporarily in browser session storage
- Location data stored locally in browser
- No server-side permanent storage
- Full GDPR compliance
- Privacy policy: http://localhost:8080/rgpd-policy

## 🚀 Development Notes

Custom LLM in development - using Gemini as temporary solution until our proprietary hair analysis model is complete.

## 🤝 Contributing

This is an educational project. Feel free to extend:
1. Add new hair analysis features
2. Improve product recommendations
3. Enhance UI/UX
4. Add more K18 products

## � License

Educational project - K18 is a registered trademark of K18 Biomimetic Hairscience Inc.

---

**Built with**: Google Gemini 2.0 Flash • React • FastAPI • TypeScript
