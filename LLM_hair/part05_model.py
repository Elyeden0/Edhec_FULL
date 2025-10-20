"""Part 05 — Model definition
Defines classifier that wraps a backbone and adds MLP head.
"""
import torch
import torch.nn as nn
from part02_backbone import load_vit_backbone

class HairConditionClassifier(nn.Module):
    def __init__(self, backbone_name="google/vit-base-patch16-224-in21k", num_classes=3, device=None, freeze_backbone=False):
        super().__init__()
        self.processor, self.backbone = load_vit_backbone(backbone_name, device=device)
        self.feature_dim = self.backbone.config.hidden_size
        self.classifier = nn.Sequential(
            nn.Linear(self.feature_dim, self.feature_dim // 2),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(self.feature_dim // 2, num_classes)
        )
        if freeze_backbone:
            for p in self.backbone.parameters():
                p.requires_grad = False

    def forward(self, pixel_values):
        # pixel_values: tensor shaped (B, C, H, W) and already normalized to model's expected inputs
        out = self.backbone(pixel_values=pixel_values)
        cls = out.last_hidden_state[:, 0, :]
        logits = self.classifier(cls)
        return {"logits": logits}
