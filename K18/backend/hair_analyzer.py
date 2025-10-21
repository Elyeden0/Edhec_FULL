"""Hair Analysis Service - Ollama Integration
Analyzes hair condition from images using Ollama vision models
100% free, runs locally, no API costs
"""
from PIL import Image
from typing import Dict
import numpy as np
import base64
from io import BytesIO
import json

class HairAnalyzer:
    def __init__(self):
        """Initialize analyzer with Ollama support"""
        self.classes = ["dry", "normal", "oily"]
        self.use_ollama = True  # Set to True to use Ollama
        self.ollama_url = "http://localhost:11434/api/generate"
        self.model = "llava"  # or any vision model you pulled
    
    def analyze_hair(self, image: Image.Image, weather_data: Dict = None) -> Dict:
        """
        Analyze hair condition using Ollama or fallback to simple analysis
        Returns hair type (dry/normal/oily) with reasoning
        
        Args:
            image: PIL Image of hair
            weather_data: Optional weather context (temperature, humidity, condition)
        """
        # Try Ollama first if enabled
        if self.use_ollama:
            result = self._analyze_with_ollama(image, weather_data)
            if result:
                return result
        
        # Fallback to simple analysis
        return self._analyze_simple(image, weather_data)
    
    def _analyze_with_ollama(self, image: Image.Image, weather_data: Dict = None) -> Dict:
        """Analyze using Ollama vision model with weather context"""
        try:
            import requests
            
            # Check if Ollama is running
            try:
                requests.get("http://localhost:11434/api/tags", timeout=2)
            except:
                print("Ollama not running, using fallback")
                return None
            
            # Convert image to base64
            buffered = BytesIO()
            # Resize to speed up processing
            max_size = 512
            if max(image.size) > max_size:
                ratio = max_size / max(image.size)
                new_size = tuple(int(dim * ratio) for dim in image.size)
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            image.save(buffered, format="JPEG", quality=85)
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            
            # Build weather context for prompt
            weather_context = ""
            if weather_data and weather_data.get("temperature") is not None:
                temp = weather_data.get("temperature")
                humidity = weather_data.get("humidity")
                condition = weather_data.get("condition", "unknown")
                
                weather_context = f"""
WEATHER CONTEXT:
- Temperature: {temp}°C
- Humidity: {humidity}%
- Condition: {condition}

Consider how this weather affects hair:
- High humidity (>70%) can make hair frizzy and affect oily hair
- Low humidity (<30%) can dry out hair
- Rain/moisture can reveal hair's natural texture
- Hot weather can increase oil production
"""
            
            # Prompt for Ollama
            prompt = f"""Analyze this hair image and determine if the hair is dry, normal, or oily.

DRY hair: Dull appearance, rough texture, frizzy, lacks shine, brittle
NORMAL hair: Balanced moisture, healthy shine, smooth texture, manageable
OILY hair: Very shiny/greasy, flat/limp, stringy, lacks volume

{weather_context}

Respond ONLY with valid JSON in this format:
{{
  "hair_type": "dry" or "normal" or "oily",
  "confidence": 0.7,
  "reasoning": "Brief 1-2 sentence explanation INCLUDING weather impact if relevant",
  "characteristics": ["trait1", "trait2", "trait3"]
}}"""
            
            payload = {
                "model": self.model,
                "prompt": prompt,
                "images": [img_base64],
                "stream": False,
                "format": "json"
            }
            
            response = requests.post(
                self.ollama_url,
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                print(f"Ollama error: {response.status_code}")
                return None
            
            result_text = response.json().get("response", "")
            
            # Parse JSON response
            try:
                # Clean up response
                if "```json" in result_text:
                    result_text = result_text.split("```json")[1].split("```")[0].strip()
                elif "```" in result_text:
                    result_text = result_text.split("```")[1].split("```")[0].strip()
                
                # Find JSON object
                start = result_text.find("{")
                end = result_text.rfind("}") + 1
                if start >= 0 and end > start:
                    result_text = result_text[start:end]
                
                result = json.loads(result_text)
            except Exception as e:
                print(f"JSON parse error: {e}")
                # Try to extract info from text
                return self._parse_text_response(result_text)
            
            # Validate response
            hair_type = str(result.get("hair_type", "normal")).lower()
            if hair_type not in self.classes:
                hair_type = "normal"
            
            confidence = float(result.get("confidence", 0.7))
            confidence = max(0.0, min(1.0, confidence))
            
            # Create scores
            scores = {}
            remaining_prob = (1.0 - confidence) / (len(self.classes) - 1)
            for cls in self.classes:
                scores[cls] = confidence if cls == hair_type else remaining_prob
            
            return {
                "hair_type": hair_type,
                "confidence": confidence,
                "scores": scores,
                "reasoning": result.get("reasoning", "Hair analysis complete"),
                "characteristics": result.get("characteristics", []),
                "message": f"Analysis complete using Ollama ({self.model})"
            }
            
        except Exception as e:
            print(f"Ollama analysis error: {e}")
            return None
    
    def _parse_text_response(self, text: str) -> Dict:
        """Parse non-JSON text response"""
        text_lower = text.lower()
        
        # Determine hair type
        if "dry" in text_lower:
            hair_type = "dry"
            confidence = 0.7
        elif "oily" in text_lower or "greasy" in text_lower:
            hair_type = "oily"
            confidence = 0.7
        else:
            hair_type = "normal"
            confidence = 0.65
        
        # Extract characteristics
        characteristics = []
        keywords = ["shiny", "dull", "frizzy", "smooth", "greasy", "dry", "healthy", "damaged", "rough", "soft"]
        for keyword in keywords:
            if keyword in text_lower:
                characteristics.append(keyword)
        
        scores = {}
        remaining_prob = (1.0 - confidence) / 2
        for cls in self.classes:
            scores[cls] = confidence if cls == hair_type else remaining_prob
        
        return {
            "hair_type": hair_type,
            "confidence": confidence,
            "scores": scores,
            "reasoning": text[:200] if len(text) < 200 else text[:197] + "...",
            "characteristics": characteristics[:5],
            "message": "Analysis complete using Ollama"
        }
    
    def _analyze_simple(self, image: Image.Image, weather_data: Dict = None) -> Dict:
        """
        Simple fallback analysis using image metrics with weather context
        """
        try:
            img_array = np.array(image)
            
            # Analyze different regions
            h, w = img_array.shape[:2]
            
            # Center region (likely hair)
            center_region = img_array[h//4:3*h//4, w//4:3*w//4]
            
            # Top region (often hair)
            top_region = img_array[h//6:h//3, w//4:3*w//4]
            
            # Calculate metrics
            center_brightness = np.mean(center_region)
            center_std = np.std(center_region)
            
            top_brightness = np.mean(top_region)
            top_std = np.std(top_region)
            
            # Average metrics
            brightness = (center_brightness + top_brightness) / 2
            texture_variance = (center_std + top_std) / 2
            
            # Analyze color channels for shine detection
            if len(img_array.shape) == 3:
                # Check if image has high highlights (indicates shine/oil)
                bright_pixels = np.sum(img_array > 200) / img_array.size
                dark_pixels = np.sum(img_array < 80) / img_array.size
            else:
                bright_pixels = 0.1
                dark_pixels = 0.1
            
            # Get weather context
            weather_impact = ""
            if weather_data and weather_data.get("temperature") is not None:
                humidity = weather_data.get("humidity", 50)
                temp = weather_data.get("temperature", 20)
                
                if humidity > 70:
                    weather_impact = f" The high humidity ({humidity}%) may be contributing to increased frizz or oil appearance."
                elif humidity < 30:
                    weather_impact = f" The dry air ({humidity}% humidity) may be exacerbating dryness."
                elif temp > 28:
                    weather_impact = f" The warm weather ({temp}°C) may increase natural oil production."
            
            # Classification logic with detailed reasoning
            characteristics = []
            
            # Calculate a composite score
            # Higher score = more oily, Lower score = more dry
            shine_score = (brightness / 255.0) * 100  # 0-100
            texture_score = (50 - min(texture_variance, 50)) * 2  # Smoother = higher score
            highlight_score = bright_pixels * 1000  # Scale up for visibility
            
            composite_score = (shine_score * 0.4) + (texture_score * 0.3) + (highlight_score * 0.3)
            
            # Debug output
            print(f"[SIMPLE ANALYSIS] Brightness: {brightness:.1f}, Texture Var: {texture_variance:.1f}, Bright Pixels: {bright_pixels:.3f}")
            print(f"[SIMPLE ANALYSIS] Shine: {shine_score:.1f}, Texture: {texture_score:.1f}, Highlight: {highlight_score:.1f}")
            print(f"[SIMPLE ANALYSIS] Composite Score: {composite_score:.1f}")
            
            # More balanced thresholds
            # OILY HAIR: High composite score (>60)
            if composite_score > 60:
                hair_type = "oily"
                confidence = min(0.65 + (composite_score - 60) / 200, 0.85)
                characteristics = ["shiny appearance", "smooth texture", "reflective surface"]
                reasoning = f"The hair shows high brightness with smooth, uniform texture and reflective highlights, characteristic of oily hair with excess sebum.{weather_impact}"
                
            # DRY HAIR: Low composite score (<40)
            elif composite_score < 40:
                hair_type = "dry"
                confidence = min(0.65 + (40 - composite_score) / 200, 0.85)
                characteristics = ["dull appearance", "rough texture", "low shine"]
                reasoning = f"The hair displays reduced brightness and increased texture variation, indicating lack of moisture typical of dry hair.{weather_impact}"
                
            # NORMAL HAIR: Mid-range (40-60)
            else:
                hair_type = "normal"
                confidence = 0.70
                characteristics = ["balanced shine", "smooth texture", "healthy appearance"]
                reasoning = f"The hair shows balanced brightness and texture, indicating good moisture balance typical of healthy, normal hair.{weather_impact}"
            
            # Create probability scores
            scores = {}
            remaining_prob = (1.0 - confidence) / (len(self.classes) - 1)
            for cls in self.classes:
                scores[cls] = confidence if cls == hair_type else remaining_prob
            
            return {
                "hair_type": hair_type,
                "confidence": confidence,
                "scores": scores,
                "reasoning": reasoning,
                "characteristics": characteristics,
                "message": "Analysis complete - Simple image analysis (Ollama not available)"
            }
            
        except Exception as e:
            print(f"Error analyzing hair: {e}")
            return {
                "hair_type": "normal",
                "confidence": 0.6,
                "scores": {"dry": 0.3, "normal": 0.4, "oily": 0.3},
                "reasoning": "Standard hair analysis applied based on typical hair characteristics.",
                "characteristics": ["balanced", "healthy"],
                "message": f"Using default analysis: {str(e)}"
            }
