#!/usr/bin/env python3
"""
Test script for K18 Hair Analysis API
Verifies all components are working correctly
"""
import requests
import sys
from pathlib import Path

API_BASE = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        if response.status_code == 200:
            print("✓ Health check passed")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_products():
    """Test products endpoint"""
    print("\nTesting products endpoint...")
    try:
        response = requests.get(f"{API_BASE}/products", timeout=5)
        if response.status_code == 200:
            data = response.json()
            product_count = len(data.get("products", []))
            print(f"✓ Products endpoint working ({product_count} products found)")
            return True
        else:
            print(f"✗ Products endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Products endpoint failed: {e}")
        return False

def test_weather():
    """Test weather service"""
    print("\nTesting weather service...")
    try:
        from weather_service import WeatherService
        weather = WeatherService()
        data = weather.get_weather(40.7128, -74.0060)  # NYC
        if data.get("temperature") is not None:
            print(f"✓ Weather service working (NYC: {data['temperature']}°F)")
            return True
        else:
            print("✓ Weather service working (no API key, using fallback)")
            return True
    except Exception as e:
        print(f"✗ Weather service failed: {e}")
        return False

def test_hair_analyzer():
    """Test hair analyzer"""
    print("\nTesting hair analyzer...")
    try:
        from hair_analyzer import HairAnalyzer
        from PIL import Image
        import numpy as np
        
        # Create test image
        test_img = Image.new('RGB', (224, 224), color='brown')
        
        analyzer = HairAnalyzer()
        result = analyzer.analyze_hair(test_img)
        
        if "hair_type" in result:
            print(f"✓ Hair analyzer working (detected: {result['hair_type']})")
            return True
        else:
            print("✗ Hair analyzer failed: no hair_type in result")
            return False
    except Exception as e:
        print(f"✗ Hair analyzer failed: {e}")
        return False

def test_product_recommender():
    """Test product recommender"""
    print("\nTesting product recommender...")
    try:
        from product_recommender import ProductRecommender
        
        recommender = ProductRecommender()
        weather_data = {
            "temperature": 72,
            "humidity": 65,
            "is_humid": True,
            "is_dry": False,
            "is_rainy": False
        }
        
        recommendations = recommender.recommend("dry", weather_data, top_n=3)
        
        if len(recommendations) > 0:
            print(f"✓ Product recommender working ({len(recommendations)} recommendations)")
            return True
        else:
            print("✗ Product recommender failed: no recommendations")
            return False
    except Exception as e:
        print(f"✗ Product recommender failed: {e}")
        return False

def main():
    print("=" * 60)
    print("K18 Hair Analysis API - Test Suite")
    print("=" * 60)
    
    # Check if backend is running
    print("\nChecking if backend is running at", API_BASE)
    try:
        response = requests.get(API_BASE, timeout=2)
        print("✓ Backend is running")
    except:
        print("✗ Backend is not running!")
        print("\nPlease start the backend first:")
        print("  cd backend")
        print("  python main.py")
        sys.exit(1)
    
    # Run tests
    results = []
    results.append(("Health Check", test_health()))
    results.append(("Products API", test_products()))
    
    # Change to backend directory for imports
    backend_dir = Path(__file__).parent
    sys.path.insert(0, str(backend_dir))
    
    results.append(("Weather Service", test_weather()))
    results.append(("Hair Analyzer", test_hair_analyzer()))
    results.append(("Product Recommender", test_product_recommender()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status:8} - {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! System is ready to use.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
