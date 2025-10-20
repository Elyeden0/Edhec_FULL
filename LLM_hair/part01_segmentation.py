"""Part 01 — Segmentation utilities
Loads a segmentation model and provides functions to compute hair masks.
Requires: transformers
"""
from transformers import AutoImageProcessor, AutoModelForSemanticSegmentation
import torch
import numpy as np
from PIL import Image

SEG_MODEL = "jonathandinu/face-parsing"  # replace if you prefer a hair-specific model

_seg_processor = None
_seg_model = None

def load_segmentation_model(model_name=SEG_MODEL, device=None):
    global _seg_processor, _seg_model
    if _seg_processor is None or _seg_model is None:
        _seg_processor = AutoImageProcessor.from_pretrained(model_name)
        _seg_model = AutoModelForSemanticSegmentation.from_pretrained(model_name)
        if device is not None:
            _seg_model.to(device)
    return _seg_processor, _seg_model

def get_hair_mask_pil(pil_image, model_name=SEG_MODEL, device=None, threshold=0.5):
    """Return binary mask (H,W) as numpy uint8 (0/1) for hair region.
    Heuristic: chooses the channel with hair-like activation when label mapping unknown.
    """
    proc, model = load_segmentation_model(model_name, device)
    inputs = proc(images=pil_image, return_tensors="pt")
    if device:
        inputs = {k: v.to(device) for k,v in inputs.items()}
        model.to(device)
    model.eval()
    with torch.no_grad():
        out = model(**inputs)
    logits = out.logits[0]  # (num_labels, H_out, W_out)
    probs = torch.softmax(logits, dim=0)
    mean_scores = probs.mean(dim=(1,2))
    hair_idx = int(mean_scores.argmax().cpu().item())
    hair_prob = probs[hair_idx].unsqueeze(0).unsqueeze(0)
    hair_mask_resized = torch.nn.functional.interpolate(hair_prob, size=pil_image.size[::-1], mode='bilinear', align_corners=False)
    mask_np = (hair_mask_resized.squeeze().cpu().numpy() >= threshold).astype('uint8')
    return mask_np
