"""
Test script for baldness detection
Tests the hair analyzer's ability to detect bald scalps
"""
from hair_analyzer import HairAnalyzer
from product_recommender import ProductRecommender
from PIL import Image
import numpy as np

def create_test_bald_image():
    """Create a synthetic image that looks like a bald scalp"""
    # Create a 512x512 image with skin-like color
    img_array = np.zeros((512, 512, 3), dtype=np.uint8)
    
    # Skin tones: R > G > B, typically around (220, 180, 150)
    img_array[:, :, 0] = 220  # Red channel
    img_array[:, :, 1] = 180  # Green channel
    img_array[:, :, 2] = 150  # Blue channel
    
    # Add some variation to make it look more natural
    noise = np.random.randint(-15, 15, (512, 512, 3))
    img_array = np.clip(img_array + noise, 0, 255).astype(np.uint8)
    
    return Image.fromarray(img_array)

def create_test_hair_image():
    """Create a synthetic image that looks like hair"""
    # Create a 512x512 image with hair-like color (darker and more textured)
    img_array = np.zeros((512, 512, 3), dtype=np.uint8)
    
    # Dark brown hair
    img_array[:, :, 0] = 80   # Red channel
    img_array[:, :, 1] = 60   # Green channel
    img_array[:, :, 2] = 40   # Blue channel
    
    # Add lots of variation to simulate hair texture
    noise = np.random.randint(-40, 40, (512, 512, 3))
    img_array = np.clip(img_array + noise, 0, 255).astype(np.uint8)
    
    return Image.fromarray(img_array)

def test_bald_detection():
    """Test the baldness detection system"""
    print("=" * 60)
    print("TESTING BALDNESS DETECTION SYSTEM")
    print("=" * 60)
    
    analyzer = HairAnalyzer()
    recommender = ProductRecommender()
    
    # Test 1: Bald scalp image
    print("\n[TEST 1] Analyzing synthetic bald scalp image...")
    print("-" * 60)
    bald_image = create_test_bald_image()
    
    weather_data = {
        "temperature": 25,
        "humidity": 50,
        "condition": "sunny",
        "city": "Paris",
        "is_humid": False,
        "is_dry": False,
        "is_rainy": False
    }
    
    result = analyzer.analyze_hair(bald_image, weather_data)
    
    print(f"✓ Hair Type: {result.get('hair_type')}")
    print(f"✓ Is Bald: {result.get('is_bald', False)}")
    print(f"✓ Baldness Level: {result.get('baldness_level', 'N/A')}")
    print(f"✓ Confidence: {result.get('confidence', 0):.1%}")
    print(f"✓ Reasoning: {result.get('reasoning', 'N/A')}")
    print(f"✓ Characteristics: {', '.join(result.get('characteristics', []))}")
    
    # Get product recommendations for bald scalp
    print("\n[PRODUCT RECOMMENDATIONS FOR BALD SCALP]")
    print("-" * 60)
    recommendations = recommender.recommend(result['hair_type'], weather_data, top_n=3)
    
    for idx, product in enumerate(recommendations, 1):
        print(f"\n{idx}. {product['name']}")
        print(f"   Price: {product['price']} | Size: {product['size']}")
        print(f"   Match: {product['score']:.1%}")
        print(f"   Why: {product['reasoning']}")
    
    # Test 2: Regular hair image
    print("\n" + "=" * 60)
    print("[TEST 2] Analyzing synthetic hair image...")
    print("-" * 60)
    hair_image = create_test_hair_image()
    
    result2 = analyzer.analyze_hair(hair_image, weather_data)
    
    print(f"✓ Hair Type: {result2.get('hair_type')}")
    print(f"✓ Is Bald: {result2.get('is_bald', False)}")
    print(f"✓ Baldness Level: {result2.get('baldness_level', 'N/A')}")
    print(f"✓ Confidence: {result2.get('confidence', 0):.1%}")
    print(f"✓ Reasoning: {result2.get('reasoning', 'N/A')}")
    
    # Get product recommendations for hair
    print("\n[PRODUCT RECOMMENDATIONS FOR HAIR]")
    print("-" * 60)
    recommendations2 = recommender.recommend(result2['hair_type'], weather_data, top_n=3)
    
    for idx, product in enumerate(recommendations2, 1):
        print(f"\n{idx}. {product['name']}")
        print(f"   Price: {product['price']}")
        print(f"   Match: {product['score']:.1%}")
        print(f"   Why: {product['reasoning']}")
    
    print("\n" + "=" * 60)
    print("✓ ALL TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_bald_detection()
