# K18 AI Hair Analysis System

AI-powered hair analysis platform using **ChatGPT-4 Vision** for intelligent hair type detection and personalized K18 product recommendations.

## 🌟 Features

- **🤖 ChatGPT-4 Vision**: Advanced AI analyzes hair condition with natural language explanations
- **📸 Hair Analysis**: Upload or capture photos for instant hair type detection (dry/normal/oily)
- **🌦️ Weather Integration**: Real-time weather data for climate-aware recommendations
- **🛍️ Smart Recommendations**: Personalized K18 product suggestions based on hair + weather
- **💡 AI Reasoning**: Detailed explanations for each analysis and recommendation
- **📱 Mobile Responsive**: Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.8+** (for backend)
- **OpenAI API Key** ([Get it here](https://platform.openai.com/api-keys))

### Setup

1. **Get OpenAI API Key**
   ```bash
   # Visit: https://platform.openai.com/api-keys
   # Create new key and copy it
   ```

2. **Configure Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add: OPENAI_API_KEY=sk-your-key-here
   ```

3. **Install & Run**
   ```bash
   # Option 1: One-command start (from K18 directory)
   ./start.sh

   # Option 2: Manual start
   # Terminal 1 - Backend:
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python main.py

   # Terminal 2 - Frontend:
   npm install
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:8080 (or port shown in terminal)
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📖 Documentation

- **[backend/README.md](backend/README.md)** - ChatGPT-4 Vision API setup & usage
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed installation guide
- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[AI_SYSTEM_README.md](AI_SYSTEM_README.md)** - Technical documentation

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↓
Backend API (FastAPI + Python)
    ↓
┌─────────────┬──────────────┬──────────────┐
│ Hair        │ Weather      │ Product      │
│ Analyzer    │ Service      │ Recommender  │
│             │              │              │
│ (LLM_hair   │ (Open-Meteo  │ (7 K18       │
│  models)    │  API)        │  products)   │
└─────────────┴──────────────┴──────────────┘
```

## 🛠️ Technologies

### Backend
- FastAPI - Modern Python web framework
- PyTorch - Deep learning inference
- Transformers - Pre-trained models
- Pillow - Image processing

### Frontend
- React + TypeScript
- Vite - Build tool
- Tailwind CSS - Styling
- shadcn-ui - Component library

### Integration
- LLM_hair models for hair analysis
- Open-Meteo API for weather data
- Geolocation API for user location

## 📦 Project Structure

```
K18/
├── backend/              # Python FastAPI backend
│   ├── main.py          # API server
│   ├── hair_analyzer.py # Hair analysis
│   ├── weather_service.py
│   └── product_recommender.py
├── src/                 # React frontend
│   ├── pages/
│   │   ├── Index.tsx    # Landing page
│   │   ├── ChatNew.tsx  # Analysis UI
│   │   └── Products.tsx
│   └── components/
├── start.sh            # Startup script
└── docs/              # Documentation
```

## 🧪 Testing

Run the test suite:

```bash
cd backend
python test_system.py
```

## 📝 How to Use

1. **Visit** http://localhost:5173
2. **Click** "Chat with K18"
3. **Allow** location access
4. **Upload or capture** a hair photo
5. **View** your personalized recommendations!

## 🎯 Key Features

### Hair Analysis
- Uses ML models from LLM_hair project
- Detects hair type: dry, normal, or oily
- Provides confidence scores

### Weather-Aware
- Fetches real-time weather data
- Considers temperature, humidity, precipitation
- Adapts recommendations to climate

### Smart Matching
- 7 K18 products in database
- Matches hair type + weather conditions
- Provides detailed reasoning

## 🔧 Configuration

### Backend
- Port: 8000 (configurable in `main.py`)
- CORS: Enabled for localhost
- API docs: http://localhost:8000/docs

### Frontend
- Port: 5173 (Vite default)
- API URL: Update in `ChatNew.tsx` if needed

## 🚀 Deployment

See [AI_SYSTEM_README.md](AI_SYSTEM_README.md) for deployment instructions.

## 📄 Original Project Info

This project was originally created with [Lovable](https://lovable.dev/projects/b208fb45-d9ba-4c15-9a79-79ec44e5fd65).

## 🤝 Contributing

To extend this system:
1. Add new products in `backend/product_recommender.py`
2. Customize UI in `src/pages/ChatNew.tsx`
3. Train better models in `../LLM_hair/`

## 📚 Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PyTorch Documentation](https://pytorch.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ using K18 biomimetic haircare science
