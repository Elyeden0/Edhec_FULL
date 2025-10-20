# K18 AI Hair Analysis System - Visual Architecture

## 🎨 System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    👤 USER (Web Browser)                            │
│                                                                     │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 │ 1. Visits Homepage
                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  🏠 Index.tsx (Landing Page)                                        │
│  - Captures user location (latitude, longitude)                     │
│  - Stores in localStorage                                           │
│  - Redirects to Chat page                                           │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 │ 2. Clicks "Chat with K18"
                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  📸 ChatNew.tsx (Analysis Page)                                     │
│  - Camera capture OR file upload                                    │
│  - Shows image preview                                              │
│  - Sends to backend for analysis                                    │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 │ 3. POST /analyze
                 │    - image file
                 │    - latitude
                 │    - longitude
                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│  🚀 FastAPI Backend (main.py)                                       │
│  - Receives image and location                                      │
│  - Orchestrates analysis pipeline                                   │
│  - Returns comprehensive results                                    │
└──────┬──────────────────┬──────────────────┬───────────────────────┘
       │                  │                  │
       │ 4a. Analyze     │ 4b. Get         │ 4c. Get
       │     Hair        │     Weather      │     Products
       ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│ 🧠 Hair      │  │ 🌦️ Weather   │  │ 🛍️ Product           │
│  Analyzer    │  │  Service     │  │  Recommender        │
└──────┬───────┘  └──────┬───────┘  └──────┬───────────────┘
       │                  │                  │
       │ Uses             │ Calls            │ Matches
       ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│ 📚 LLM_hair  │  │ 🌐 Open-Meteo│  │ 📦 Product Database  │
│   Models     │  │    API       │  │   (7 K18 products)   │
│              │  │              │  │                      │
│ - Segment    │  │ - Temp       │  │ - Descriptions       │
│ - Classify   │  │ - Humidity   │  │ - Prices             │
│              │  │ - Conditions │  │ - Suitability        │
└──────────────┘  └──────────────┘  └──────────────────────┘
       │                  │                  │
       │ Returns          │ Returns          │ Returns
       ↓                  ↓                  ↓
    Hair Type        Weather Data      Top 3 Products
    Confidence       Temperature       + Reasoning
    Scores           Humidity
```

## 📊 Data Flow Diagram

```
┌─────────┐
│  User   │
│ Uploads │
│  Image  │
└────┬────┘
     │
     │ JPEG/PNG Image
     │
     ↓
┌─────────────────┐
│  Hair Analyzer  │
│                 │
│  1. Segment     │───→ Hair Region Mask
│  2. Preprocess  │───→ 224x224 Tensor
│  3. Classify    │───→ [dry, normal, oily]
│  4. Softmax     │───→ Probabilities
└────┬────────────┘
     │
     │ hair_type: "dry"
     │ confidence: 0.87
     │ scores: {dry: 0.87, normal: 0.10, oily: 0.03}
     │
     ↓
┌─────────────────┐      ┌──────────────┐
│     Weather     │←─────│   Location   │
│    Service      │      │ (lat, long)  │
│                 │      └──────────────┘
│  1. API Call    │
│  2. Parse Data  │
│  3. Analyze     │───→ is_humid: true
│                 │───→ is_dry: false
└────┬────────────┘───→ temp: 72°F
     │
     │ weather_data: {...}
     │
     ↓
┌─────────────────────────────────────┐
│        Product Recommender          │
│                                     │
│  Input: hair_type + weather_data   │
│                                     │
│  For each product:                 │
│    score = 0                       │
│    if hair_type matches:           │
│      score += 10                   │
│    for each weather factor:        │
│      if matches:                   │
│        score += 3                  │
│                                     │
│  Sort by score                     │
│  Return top 3                      │
└────┬────────────────────────────────┘
     │
     │ recommendations: [
     │   {name: "K18 Mask", score: 15, reasoning: "..."},
     │   {name: "K18 Oil", score: 13, reasoning: "..."},
     │   {name: "K18 Conditioner", score: 10, reasoning: "..."}
     │ ]
     │
     ↓
┌─────────────────┐
│   JSON Response │
│                 │
│  - hair_analysis│
│  - weather_data │
│  - recommendations
└────┬────────────┘
     │
     │ HTTP Response
     │
     ↓
┌─────────────────┐
│  ChatNew.tsx    │
│  Display Results│
│                 │
│  - Hair Type    │
│  - Weather Info │
│  - 3 Products   │
│  - Reasoning    │
└─────────────────┘
```

## 🎯 Component Interaction

```
Frontend Components:
┌──────────────┐
│  Index.tsx   │ ← Landing page, location capture
└──────┬───────┘
       │ navigate("/chat")
       ↓
┌──────────────┐
│ ChatNew.tsx  │ ← Main analysis interface
└──────┬───────┘
       │
       ├─→ Camera capture
       ├─→ File upload
       ├─→ Image preview
       └─→ Results display

Backend Services:
┌───────────────┐
│   main.py     │ ← FastAPI server
└───────┬───────┘
        │
        ├─→ /analyze endpoint
        ├─→ /products endpoint
        └─→ /health endpoint

Analysis Pipeline:
┌──────────────────┐
│  hair_analyzer   │ ← ML model inference
└──────────────────┘
┌──────────────────┐
│ weather_service  │ ← API calls
└──────────────────┘
┌──────────────────┐
│product_recommender│ ← Matching logic
└──────────────────┘
```

## 🔄 Request/Response Flow

```
1. User Action
   ↓
   [User uploads/captures image]
   ↓
2. Frontend Processing
   ↓
   ChatNew.tsx
   - Creates FormData
   - Adds image file
   - Adds latitude/longitude
   - fetch("http://localhost:8000/analyze")
   ↓
3. Network
   ↓
   HTTP POST → Backend
   ↓
4. Backend Receives
   ↓
   main.py: @app.post("/analyze")
   - Validates image
   - Extracts location
   ↓
5. Parallel Processing
   ↓
   ┌─────────────┬──────────────┐
   │             │              │
   ↓             ↓              ↓
Hair Analysis  Weather Fetch  (Wait)
   ↓             ↓              
[5-10 sec]    [1-2 sec]        
   │             │              
   └─────────────┴──────────────┘
                 ↓
6. Product Matching
   ↓
   [< 1 sec]
   ↓
7. Response Assembly
   ↓
   {
     success: true,
     hair_analysis: {...},
     weather_data: {...},
     recommendations: [...]
   }
   ↓
8. Network
   ↓
   HTTP Response → Frontend
   ↓
9. Frontend Display
   ↓
   ChatNew.tsx
   - Updates state
   - Renders results
   - Shows products
```

## 🏗️ Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         USER INTERFACE LAYER            │
│                                         │
│  React + TypeScript + Tailwind          │
│  - ChatNew.tsx (Analysis UI)            │
│  - Index.tsx (Location)                 │
│  - shadcn/ui components                 │
└─────────────────┬───────────────────────┘
                  │ HTTP/JSON
┌─────────────────┴───────────────────────┐
│         API GATEWAY LAYER               │
│                                         │
│  FastAPI + Uvicorn                      │
│  - REST endpoints                       │
│  - CORS middleware                      │
│  - Request validation                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────┴───────────────────────┐
│       BUSINESS LOGIC LAYER              │
│                                         │
│  Python Services                        │
│  - hair_analyzer.py                     │
│  - weather_service.py                   │
│  - product_recommender.py               │
└────┬──────────┬──────────┬──────────────┘
     │          │          │
┌────┴────┐ ┌──┴──────┐ ┌─┴──────────────┐
│   ML    │ │ Weather │ │    Product     │
│ Models  │ │   API   │ │   Database     │
│         │ │         │ │                │
│ PyTorch │ │Open-    │ │  In-memory     │
│Transform│ │ Meteo   │ │  Python list   │
└─────────┘ └─────────┘ └────────────────┘
```

## 🎨 UI Flow

```
┌─────────────────────────────────────────────────┐
│              Homepage (Index.tsx)               │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │         K18 AI Hair Analyser              │ │
│  │   Biomimetic haircare powered by AI       │ │
│  │                                           │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │   [Chat with K18] → Capture Location│ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                        │
                        │ Click
                        ↓
┌─────────────────────────────────────────────────┐
│           Analysis Page (ChatNew.tsx)           │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │         Upload or Take Photo              │ │
│  │                                           │ │
│  │  ┌──────────┐         ┌──────────┐       │ │
│  │  │ 📤 Upload│         │ 📷 Camera │       │ │
│  │  └──────────┘         └──────────┘       │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                        │
                        │ Upload/Capture
                        ↓
┌─────────────────────────────────────────────────┐
│              Image Preview                      │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │        [Hair Image Preview]               │ │
│  │                                           │ │
│  │   ⏳ Analyzing your hair...               │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                        │
                        │ Analysis Complete
                        ↓
┌─────────────────────────────────────────────────┐
│                Results Display                  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 🧠 Hair Analysis Results                  │ │
│  │                                           │ │
│  │  Hair Type: DRY (87% confidence)          │ │
│  │  Weather: 72°F, 65% humidity              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 🛍️ Recommended Products                   │ │
│  │                                           │ │
│  │  1. K18 Mask - $75                        │ │
│  │     → Ideal for dry hair...               │ │
│  │     [View Product]                        │ │
│  │                                           │ │
│  │  2. K18 Oil - $68                         │ │
│  │     → Perfect for dry hair...             │ │
│  │     [View Product]                        │ │
│  │                                           │ │
│  │  3. K18 Conditioner - $40                 │ │
│  │     → Locks in moisture...                │ │
│  │     [View Product]                        │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## 📁 File Organization

```
Project Root: /home/alex/Documents/Ecole42/Edhec_2025/

LLM_hair/                    ← Existing ML models
├── part01_segmentation.py   ← Hair segmentation
├── part05_model.py          ← Classifier
└── ...                      ← Other model files

K18/                         ← Main application
│
├── Documentation Files (7)
│   ├── INDEX.md            ← Start here!
│   ├── COMPLETE.md         ← What was built
│   ├── QUICKSTART.md       ← 5-min setup
│   ├── AI_SYSTEM_README.md ← Full docs
│   ├── PROJECT_SUMMARY.md  ← Architecture
│   ├── DEPLOYMENT.md       ← Deploy guide
│   └── README_NEW.md       ← Main README
│
├── Scripts (1)
│   └── start.sh            ← One-command start
│
├── backend/                ← Python API (8 files)
│   ├── main.py            ← FastAPI server ⭐
│   ├── hair_analyzer.py   ← ML inference ⭐
│   ├── weather_service.py ← Weather API ⭐
│   ├── product_recommender.py ← Matching ⭐
│   ├── requirements.txt   ← Dependencies
│   ├── test_system.py     ← Test suite
│   ├── README.md          ← Backend docs
│   └── .gitignore         ← Git rules
│
└── src/                    ← React frontend
    ├── pages/
    │   ├── ChatNew.tsx     ← Analysis UI ⭐
    │   ├── Index.tsx       ← Location capture
    │   └── Products.tsx    ← Product list
    ├── components/         ← UI components
    └── App.tsx            ← Routing

⭐ = Core files you'll work with most
```

## 🔄 Development Workflow

```
1. Start Development
   ↓
   ./start.sh
   ↓
   ┌─────────────┐    ┌─────────────┐
   │  Backend    │    │  Frontend   │
   │  Port 8000  │    │  Port 5173  │
   └─────────────┘    └─────────────┘
   ↓
2. Make Changes
   ↓
   Edit Files:
   - backend/*.py → Restart backend
   - src/**/*.tsx → Auto hot reload
   ↓
3. Test Locally
   ↓
   - Upload test images
   - Check console logs
   - Verify recommendations
   ↓
4. Run Tests
   ↓
   cd backend && python test_system.py
   ↓
5. Commit & Deploy
   ↓
   git add .
   git commit -m "Your changes"
   git push
```

---

This visual guide provides a comprehensive overview of the K18 AI Hair Analysis System architecture. Refer to other documentation for detailed implementation information.
