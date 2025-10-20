"""Part 11 — Multi-task learning utilities (hair type auxiliary)"""
from transformers import AutoModelForImageClassification, AutoImageProcessor
import torch

TEACHER = "dima806/hair_type_image_detection"
_teacher_model = None
_teacher_proc = None

def load_teacher(device=None):
    global _teacher_model, _teacher_proc
    if _teacher_model is None:
        _teacher_proc = AutoImageProcessor.from_pretrained(TEACHER)
        _teacher_model = AutoModelForImageClassification.from_pretrained(TEACHER)
        if device:
            _teacher_model.to(device)
    return _teacher_proc, _teacher_model

def teacher_predict_logits(pil_img, device=None):
    proc, model = load_teacher(device=device)
    inputs = proc(images=pil_img, return_tensors='pt')
    if device:
        inputs = {k:v.to(device) for k,v in inputs.items()}
    with torch.no_grad():
        out = model(**inputs)
    return out.logits
