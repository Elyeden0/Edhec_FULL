"""FastAPI Backend for K18 Hair Analysis
Main API endpoint using Google Gemini AI for hair analysis
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from typing import Optional
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from weather_service import WeatherService
from hair_analyzer import HairAnalyzer
from product_recommender import ProductRecommender

app = FastAPI(
    title="K18 Hair Analysis API",
    version="2.0.0",
    description="AI-powered hair analysis using Google Gemini AI"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8081"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
weather_service = WeatherService()
hair_analyzer = HairAnalyzer()
product_recommender = ProductRecommender()

@app.get("/")
async def root():
    """API information endpoint"""
    return {
        "name": "K18 Hair Analysis API",
        "version": "2.0.0",
        "ai_engine": "Google Gemini AI",
        "status": "operational",
        "endpoints": {
            "POST /analyze": "Analyze hair image and get K18 product recommendations",
            "GET /products": "List all K18 products",
            "GET /health": "Health check"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    api_key_set = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "api_configured": api_key_set,
        "message": "API is operational" if api_key_set else "Warning: GEMINI_API_KEY not set"
    }

@app.post("/analyze")
async def analyze_hair(
    image: UploadFile = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    city: Optional[str] = Form(None)
):
    """
    Main endpoint: Analyze hair from image and provide product recommendations
    
    Parameters:
    - image: Hair image file
    - latitude: User's latitude (optional, for weather data)
    - longitude: User's longitude (optional, for weather data)
    - city: User's city name (optional, for location context)
    
    Returns:
    - hair_analysis: Hair type, confidence, scores with weather-aware reasoning
    - weather_data: Current weather conditions
    - recommendations: Top 3 product recommendations with reasoning
    """
    try:
        # Read and validate image
        contents = await image.read()
        try:
            img = Image.open(io.BytesIO(contents))
            img = img.convert("RGB")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")
        
        # Get weather data FIRST if location provided
        weather_data = {}
        if latitude is not None and longitude is not None:
            weather_data = weather_service.get_weather(latitude, longitude)
        else:
            # Default weather data if location not provided
            weather_data = {
                "temperature": None,
                "humidity": None,
                "condition": "unknown",
                "is_humid": False,
                "is_dry": False,
                "is_rainy": False,
                "message": "Location not provided"
            }
        
        # Add city to weather data if provided
        if city:
            weather_data["city"] = city
        
        # Analyze hair condition WITH weather context
        hair_analysis = hair_analyzer.analyze_hair(img, weather_data=weather_data)
        
        # Get product recommendations
        recommendations = product_recommender.recommend(
            hair_type=hair_analysis["hair_type"],
            weather_data=weather_data,
            top_n=3
        )
        
        return {
            "success": True,
            "hair_analysis": hair_analysis,
            "weather_data": weather_data,
            "recommendations": recommendations,
            "message": "Analysis complete"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/products")
async def get_all_products():
    """Get all available K18 products"""
    from product_recommender import PRODUCTS
    return {
        "success": True,
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "size": p.size,
                "description": p.description,
                "image_url": p.image_url,
                "suitable_for": p.suitable_for
            }
            for p in PRODUCTS
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
