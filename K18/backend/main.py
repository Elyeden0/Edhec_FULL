"""FastAPI Backend for K18 Hair Analysis
Main API endpoint for the hair analysis and product recommendation system
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from typing import Optional
import json

from weather_service import WeatherService
from hair_analyzer import HairAnalyzer
from product_recommender import ProductRecommender

app = FastAPI(title="K18 Hair Analysis API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],
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
    return {
        "message": "K18 Hair Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "/analyze": "POST - Analyze hair and get product recommendations",
            "/health": "GET - Health check"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_hair(
    image: UploadFile = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None)
):
    """
    Main endpoint: Analyze hair from image and provide product recommendations
    
    Parameters:
    - image: Hair image file
    - latitude: User's latitude (optional, for weather data)
    - longitude: User's longitude (optional, for weather data)
    
    Returns:
    - hair_analysis: Hair type, confidence, scores
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
        
        # Analyze hair condition
        hair_analysis = hair_analyzer.analyze_hair(img)
        
        # Get weather data if location provided
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
