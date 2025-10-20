# 🚀 Quick Start Guide

Get the K18 Hair Analysis AI up and running in 5 minutes!

## Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** installed
- **Git** (optional, for cloning)

## Quick Start (Automated)

### Option 1: One-Command Start

```bash
cd K18
./start.sh
```

This script will:
1. Create Python virtual environment
2. Install all dependencies
3. Start backend API (port 8000)
4. Start frontend dev server (port 5173)

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd K18/backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd K18
npm install
npm run dev
```

## Access the Application

Once both services are running:

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## First Time Usage

1. **Open** http://localhost:5173 in your browser
2. **Click** "Chat with K18" button
3. **Allow** location access (for weather data)
4. **Upload or Capture** a hair photo
5. **View** your hair analysis and product recommendations!

## Testing the System

### Test with Sample Image

1. Find a photo of hair (any hair image will work)
2. Upload it through the UI
3. System will analyze and provide recommendations

### Test API Directly

```bash
# Health check
curl http://localhost:8000/health

# Get products
curl http://localhost:8000/products

# Test analysis (using sample image)
curl -X POST http://localhost:8000/analyze \
  -F "image=@your_hair_photo.jpg" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060"
```

## Troubleshooting

### Backend won't start?

**Missing dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**Port 8000 already in use:**
- Kill the process using port 8000
- Or change port in `backend/main.py`

### Frontend won't start?

**Missing dependencies:**
```bash
npm install
```

**Port 5173 already in use:**
- Vite will automatically try another port
- Or specify port: `npm run dev -- --port 3000`

### Can't import LLM_hair modules?

The backend will work with fallback heuristics even if LLM_hair models aren't available. To use the full ML models:

1. Ensure `LLM_hair` folder is in the parent directory
2. Train or download pre-trained models
3. Update path in `hair_analyzer.py`

### Camera not working?

- Must use HTTPS in production (localhost is fine)
- Grant camera permissions when prompted
- Try "Upload Photo" instead

### Location not working?

- Must grant location permissions
- Works on localhost and HTTPS
- System works without location (won't have weather data)

## Next Steps

- ✅ System is running
- 📸 Try uploading different hair photos
- 🌦️ Test with different locations
- 🛍️ View product recommendations
- 📚 Read full documentation in `AI_SYSTEM_README.md`

## Development

### Make Changes

**Backend changes:**
- Edit files in `backend/`
- Restart backend server to see changes

**Frontend changes:**
- Edit files in `src/`
- Hot reload is automatic!

### Add Products

Edit `backend/product_recommender.py` and add to `PRODUCTS` list.

### Customize UI

Edit `src/pages/ChatNew.tsx` and other components.

## Production Deployment

See `AI_SYSTEM_README.md` for detailed deployment instructions.

Quick checklist:
- [ ] Update API URL in frontend
- [ ] Build frontend: `npm run build`
- [ ] Deploy backend to cloud service
- [ ] Deploy frontend dist/ to static hosting
- [ ] Configure CORS for production domain

## Need Help?

1. Check `AI_SYSTEM_README.md` for detailed documentation
2. View API docs at http://localhost:8000/docs
3. Check console logs for errors

## Architecture Overview

```
┌─────────────────┐
│  User Interface │  ← localhost:5173
│   (React App)   │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│   FastAPI API   │  ← localhost:8000
│    (Python)     │
└────────┬────────┘
         │
    ┌────┴────┬──────────────┐
    ↓         ↓              ↓
┌─────────┐ ┌──────┐ ┌───────────┐
│  Hair   │ │Weather│ │  Product  │
│ Analysis│ │ API   │ │Recommender│
└─────────┘ └──────┘ └───────────┘
```

Happy analyzing! 💇‍♀️✨
