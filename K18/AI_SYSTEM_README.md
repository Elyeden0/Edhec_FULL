# K18 Hair Analysis AI System

Complete AI-powered hair analysis and product recommendation system that combines computer vision, weather data, and intelligent product matching.

## 🌟 Features

### 1. **Hair Condition Analysis**
- Upload or capture a photo of your hair
- AI analyzes hair type: Dry, Normal, or Oily
- Uses ML models from the LLM_hair project
- Provides confidence scores for each classification

### 2. **Weather Integration**
- Automatically captures user location
- Fetches real-time weather data (temperature, humidity, conditions)
- Considers weather factors in product recommendations

### 3. **Smart Product Recommendations**
- Recommends top 3 K18 products based on:
  - Hair type (dry/normal/oily)
  - Current weather conditions
  - Climate factors (humid, dry, cold, hot)
- Provides detailed reasoning for each recommendation

### 4. **User-Friendly Interface**
- Clean, modern React UI with Tailwind CSS
- Camera integration for instant photo capture
- Real-time analysis feedback
- Product cards with detailed information

## 📁 Project Structure

```
K18/
├── backend/                    # Python FastAPI backend
│   ├── main.py                # Main API server
│   ├── hair_analyzer.py       # Hair analysis using LLM_hair models
│   ├── weather_service.py     # Weather data fetching
│   ├── product_recommender.py # Product recommendation engine
│   ├── requirements.txt       # Python dependencies
│   └── README.md             # Backend documentation
│
├── src/                       # React frontend
│   ├── pages/
│   │   ├── Index.tsx         # Landing page with location capture
│   │   ├── ChatNew.tsx       # Hair analysis & recommendations
│   │   └── Products.tsx      # All products listing
│   └── components/           # UI components
│
└── LLM_hair/                 # ML models (in parent directory)
    ├── part01_segmentation.py  # Hair segmentation
    ├── part05_model.py         # Hair classifier model
    └── ...                     # Other model components
```

## 🚀 Setup & Installation

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd K18/backend
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Start the FastAPI server:**
```bash
python main.py
```

The API will be available at `http://localhost:8000`

You can view the interactive API docs at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to K18 directory:**
```bash
cd K18
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 How It Works

### User Flow

1. **Landing Page** (`Index.tsx`)
   - User clicks "Chat with K18"
   - System requests location permission
   - Location is saved for weather analysis

2. **Hair Analysis** (`ChatNew.tsx`)
   - User uploads or captures a hair photo
   - Image is sent to backend API

3. **Backend Processing** (`main.py`)
   ```
   Image → Hair Analyzer → Hair Type (dry/normal/oily)
                ↓
   Location → Weather Service → Weather Data
                ↓
   Hair Type + Weather → Product Recommender → Top 3 Products
   ```

4. **Results Display**
   - Hair type with confidence score
   - Current weather conditions
   - 3 recommended products with reasoning

### Technical Flow

```
┌─────────────┐
│   React UI  │
│  (Frontend) │
└──────┬──────┘
       │ POST /analyze
       │ (image + location)
       ↓
┌──────────────────┐
│   FastAPI Server │
│    (Backend)     │
└────────┬─────────┘
         │
    ┌────┴────┬─────────────┬────────────────┐
    ↓         ↓             ↓                ↓
┌─────────┐ ┌──────────┐ ┌─────────────┐ ┌────────────┐
│  Hair   │ │ Weather  │ │   Product   │ │  LLM_hair  │
│Analyzer │ │ Service  │ │ Recommender │ │   Models   │
└─────────┘ └──────────┘ └─────────────┘ └────────────┘
```

## 🧪 API Endpoints

### POST `/analyze`
Analyze hair image and get recommendations.

**Request:**
- `image`: Image file (multipart/form-data)
- `latitude`: Float (optional)
- `longitude`: Float (optional)

**Response:**
```json
{
  "success": true,
  "hair_analysis": {
    "hair_type": "dry",
    "confidence": 0.87,
    "scores": {
      "dry": 0.87,
      "normal": 0.10,
      "oily": 0.03
    }
  },
  "weather_data": {
    "temperature": 72,
    "humidity": 65,
    "condition": "partly_cloudy",
    "is_humid": true,
    "is_dry": false
  },
  "recommendations": [
    {
      "id": 1,
      "name": "K18 Leave-In Molecular Repair Hair Mask",
      "price": "$75.00",
      "size": "50ml",
      "description": "...",
      "reasoning": "Ideal for your dry hair..."
    }
  ]
}
```

### GET `/products`
Get all K18 products.

### GET `/health`
Health check endpoint.

## 🔧 Configuration

### Backend Configuration
- **Port**: 8000 (configurable in `main.py`)
- **CORS**: Enabled for `localhost:5173` and `localhost:3000`
- **Weather API**: Open-Meteo (free, no API key needed)

### Frontend Configuration
- **API URL**: `http://localhost:8000` (hardcoded in `ChatNew.tsx`)
- **Port**: 5173 (Vite default)

To change the API URL, update the fetch call in `ChatNew.tsx`:
```typescript
const response = await fetch("YOUR_API_URL/analyze", {
```

## 🧠 ML Models

The system uses models from the `LLM_hair` project:

1. **Hair Segmentation** (`part01_segmentation.py`)
   - Isolates hair region from background
   - Uses face-parsing model from HuggingFace

2. **Hair Classification** (`part05_model.py`)
   - Classifies hair as dry, normal, or oily
   - Based on ResNet backbone
   - Can be trained on custom datasets

### Training Your Own Model

If you want to train a custom hair classifier:

1. Prepare dataset of hair images with labels
2. Use the LLM_hair training scripts
3. Save the model weights
4. Update `hair_analyzer.py` to load your model:

```python
hair_analyzer = HairAnalyzer(model_path="path/to/your/model.pth")
```

## 📊 Product Database

Products are defined in `product_recommender.py`:

```python
Product(
    id=1,
    name="Product Name",
    price="$XX.XX",
    suitable_for=["dry", "normal"],  # Hair types
    weather_boost=["humid", "cold"]  # Weather conditions
)
```

To add new products, edit the `PRODUCTS` list in `product_recommender.py`.

## 🎨 Customization

### Add New Hair Types

1. Update classifier in `LLM_hair`
2. Update `classes` in `hair_analyzer.py`
3. Add to `suitable_for` in products

### Add Weather Factors

1. Update `_analyze_weather()` in `product_recommender.py`
2. Add factors to product `weather_boost`

### Modify UI

React components are in `src/pages/` and use shadcn/ui components from `src/components/ui/`.

## 🐛 Troubleshooting

### Backend Issues

**Import errors from LLM_hair:**
- Ensure `LLM_hair` folder is in the parent directory
- Check that all required dependencies are installed

**Model not loading:**
- The system will fall back to heuristic-based analysis
- To use ML model, provide path: `HairAnalyzer(model_path="...")`

### Frontend Issues

**CORS errors:**
- Ensure backend is running on port 8000
- Check CORS settings in `main.py`

**Camera not working:**
- Browser must support MediaDevices API
- User must grant camera permissions
- HTTPS required in production

**Location not captured:**
- User must grant location permissions
- Only works on HTTPS or localhost

## 📝 Development

### Running in Development

Terminal 1 (Backend):
```bash
cd backend
python main.py
```

Terminal 2 (Frontend):
```bash
cd ..
npm run dev
```

### Testing the API

```bash
# Health check
curl http://localhost:8000/health

# Get all products
curl http://localhost:8000/products

# Analyze image (with httpie)
http -f POST localhost:8000/analyze image@test.jpg latitude=40.7128 longitude=-74.0060
```

## 🚀 Deployment

### Backend Deployment

1. **Using Docker:**
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Using Cloud Providers:**
- Deploy to Heroku, AWS, Google Cloud, etc.
- Update frontend API URL

### Frontend Deployment

```bash
npm run build
```

Deploy `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

## 📚 Technologies Used

### Backend
- **FastAPI** - Modern web framework
- **PyTorch** - Deep learning
- **Transformers** - Pre-trained models
- **Pillow** - Image processing
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Vite** - Build tool

## 🤝 Contributing

To extend this system:

1. Add new features to backend (`backend/`)
2. Update UI components (`src/pages/`)
3. Train better models (`LLM_hair/`)
4. Add more products (`product_recommender.py`)

## 📄 License

This project uses K18 product data for demonstration purposes.

## 🙏 Acknowledgments

- K18 for product inspiration
- Open-Meteo for weather API
- HuggingFace for ML models
- LLM_hair project for hair analysis models
