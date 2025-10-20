"""Part 02 — Backbone loader
Provides helpers to load vision backbones (ViT, ResNet via timm or transformers).
Requires: transformers, timm (optional)
"""
from transformers import AutoModel, AutoImageProcessor
import torch

def load_vit_backbone(name="google/vit-base-patch16-224-in21k", device=None):
    proc = AutoImageProcessor.from_pretrained(name)
    model = AutoModel.from_pretrained(name)
    if device:
        model.to(device)
    return proc, model
