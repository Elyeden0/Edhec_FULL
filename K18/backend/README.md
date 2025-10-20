# K18 Hair Analysis Backend

AI-powered hair analysis system that combines computer vision, weather data, and product recommendation engine.

## Features

- **Hair Condition Analysis**: Analyzes uploaded images to detect hair type (dry, normal, oily)
- **Weather Integration**: Fetches real-time weather data based on user location
- **Smart Recommendations**: Recommends K18 products based on hair type and weather conditions
- **Fast & Accurate**: Uses ML models from LLM_hair for precise analysis

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /analyze

Analyze hair image and get product recommendations.

**Parameters:**
- `image` (file): Hair image
- `latitude` (float, optional): User's latitude
- `longitude` (float, optional): User's longitude

**Response:**
```json
{
  "success": true,
  "hair_analysis": {
    "hair_type": "dry",
    "confidence": 0.87,
    "scores": {"dry": 0.87, "normal": 0.10, "oily": 0.03}
  },
  "weather_data": {
    "temperature": 72,
    "humidity": 65,
    "condition": "partly_cloudy",
    "is_humid": true
  },
  "recommendations": [
    {
      "id": 1,
      "name": "K18 Leave-In Molecular Repair Hair Mask",
      "price": "$75.00",
      "reasoning": "Ideal for your dry hair - provides deep hydration and repair"
    }
  ]
}
```

### GET /products

Get all available K18 products.

### GET /health

Health check endpoint.

## Architecture

- `main.py` - FastAPI application and endpoints
- `hair_analyzer.py` - Hair condition analysis using LLM_hair models
- `weather_service.py` - Weather data fetching (Open-Meteo API)
- `product_recommender.py` - Product recommendation engine

## Integration with LLM_hair

The backend uses models from the `LLM_hair` folder:
- `part01_segmentation.py` - Hair segmentation
- `part05_model.py` - Hair condition classifier

Make sure the LLM_hair folder is in the parent directory.

## Development

```bash
# Run with auto-reload
uvicorn main:app --reload

# Run tests (if available)
pytest

# Check API documentation
# Visit http://localhost:8000/docs
```
