"""Part 16 — FastAPI server example
Run with: uvicorn part16_fastapi:app --reload
"""
from fastapi import FastAPI, UploadFile, File
from io import BytesIO
from PIL import Image
import numpy as np

app = FastAPI(title="Hair Condition Classifier API")

# Placeholder: user should load a model instance named 'MODEL' at module import or startup.
MODEL = None  # set this in your deployment script

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    data = await file.read()
    img = Image.open(BytesIO(data)).convert('RGB')
    if MODEL is None:
        return {"error": "MODEL not loaded. Load your model into part16_fastapi.MODEL before serving."}
    label, probs = MODEL_infer(img)
    return {"prediction": label, "probabilities": probs.tolist()}

def MODEL_infer(pil_img):
    # simple wrapper to call model inference; replace with your model's infer function
    from part08_inference import infer_image
    return infer_image(MODEL, pil_img, device='cpu', use_mask=False)
