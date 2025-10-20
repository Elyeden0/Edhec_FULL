"""Hair Analysis Service
Analyzes hair condition from images using the LLM_hair models
"""
import sys
import os
from pathlib import Path
from PIL import Image
import numpy as np
import torch
from typing import Dict, Tuple

# Add LLM_hair to path
llm_hair_path = Path(__file__).parent.parent.parent / "LLM_hair"
sys.path.insert(0, str(llm_hair_path))

try:
    from part01_segmentation import get_hair_mask_pil
    from part05_model import HairConditionClassifier
except ImportError as e:
    print(f"Warning: Could not import LLM_hair modules: {e}")

class HairAnalyzer:
    def __init__(self, model_path: str = None):
        """
        Initialize hair analyzer with trained model
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.classes = ["dry", "normal", "oily"]
        
        # Try to load model if path provided
        if model_path and os.path.exists(model_path):
            try:
                self.model = HairConditionClassifier(num_classes=len(self.classes))
                self.model.load_state_dict(torch.load(model_path, map_location=self.device))
                self.model.to(self.device)
                self.model.eval()
            except Exception as e:
                print(f"Could not load model: {e}")
    
    def analyze_hair(self, image: Image.Image) -> Dict:
        """
        Analyze hair condition from image
        Returns hair type (dry/normal/oily) and confidence scores
        """
        try:
            # Get hair mask for better analysis
            try:
                hair_mask = get_hair_mask_pil(image, device=self.device)
                has_hair = np.sum(hair_mask) > 100  # Check if hair is detected
            except:
                has_hair = True  # Assume hair is present if segmentation fails
                hair_mask = None
            
            if not has_hair:
                return {
                    "hair_type": "unknown",
                    "confidence": 0.0,
                    "scores": {"dry": 0.0, "normal": 0.0, "oily": 0.0},
                    "message": "No hair detected in image"
                }
            
            # If model is loaded, use it for classification
            if self.model:
                # Preprocess image
                from torchvision import transforms
                transform = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                                       std=[0.229, 0.224, 0.225])
                ])
                
                img_tensor = transform(image).unsqueeze(0).to(self.device)
                
                with torch.no_grad():
                    outputs = self.model(img_tensor)
                    probabilities = torch.softmax(outputs, dim=1)[0]
                    predicted_idx = torch.argmax(probabilities).item()
                    confidence = probabilities[predicted_idx].item()
                
                scores = {
                    cls: float(probabilities[i].item()) 
                    for i, cls in enumerate(self.classes)
                }
                
                return {
                    "hair_type": self.classes[predicted_idx],
                    "confidence": confidence,
                    "scores": scores,
                    "message": "Analysis complete"
                }
            else:
                # Fallback: simple heuristic based on image statistics
                return self._analyze_with_heuristics(image, hair_mask)
                
        except Exception as e:
            print(f"Error analyzing hair: {e}")
            return {
                "hair_type": "normal",
                "confidence": 0.5,
                "scores": {"dry": 0.33, "normal": 0.34, "oily": 0.33},
                "message": f"Using fallback analysis: {str(e)}"
            }
    
    def _analyze_with_heuristics(self, image: Image.Image, hair_mask=None) -> Dict:
        """
        Fallback heuristic-based analysis when model is not available
        Analyzes shine/brightness and texture
        """
        img_array = np.array(image)
        
        # Apply mask if available
        if hair_mask is not None and hair_mask.shape[:2] == img_array.shape[:2]:
            hair_region = img_array[hair_mask > 0]
        else:
            # Use center region as approximation
            h, w = img_array.shape[:2]
            hair_region = img_array[h//4:3*h//4, w//4:3*w//4]
        
        if len(hair_region) == 0:
            hair_region = img_array.reshape(-1, 3)
        
        # Calculate metrics
        brightness = np.mean(hair_region)
        std_dev = np.std(hair_region)
        
        # Heuristic: 
        # - High brightness + low std = oily (shiny, smooth)
        # - Low brightness + high std = dry (dull, rough texture)
        # - Middle values = normal
        
        if brightness > 140 and std_dev < 40:
            scores = {"dry": 0.2, "normal": 0.3, "oily": 0.5}
            hair_type = "oily"
        elif brightness < 80 or std_dev > 60:
            scores = {"dry": 0.5, "normal": 0.3, "oily": 0.2}
            hair_type = "dry"
        else:
            scores = {"dry": 0.3, "normal": 0.5, "oily": 0.2}
            hair_type = "normal"
        
        return {
            "hair_type": hair_type,
            "confidence": scores[hair_type],
            "scores": scores,
            "message": "Analysis using heuristics (model not loaded)"
        }
